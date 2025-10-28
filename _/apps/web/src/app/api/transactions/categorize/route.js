import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { merchant, description, amount } = body;

    if (!merchant && !description) {
      return Response.json(
        { error: "Merchant or description is required" },
        { status: 400 }
      );
    }

    // Get available categories
    const categories = await sql`
      SELECT id, name, type FROM categories 
      WHERE type = 'expense'
      ORDER BY name
    `;

    const categoryNames = categories.map(c => c.name).join(", ");

    // Use ChatGPT for categorization
    const categorizationResponse = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a financial AI assistant that categorizes expenses. Based on the merchant name, description, and amount, categorize the transaction into one of these categories: ${categoryNames}. 

Rules:
- Return only the category name exactly as provided
- If uncertain, choose the most likely category
- For unclear transactions, use "Other" (though this category should be added if not present)
- Consider common spending patterns and merchant types`
          },
          {
            role: "user",
            content: `Categorize this transaction:
Merchant: ${merchant}
Description: ${description || ""}
Amount: $${amount || "unknown"}

Category:`
          }
        ],
        json_schema: {
          name: "expense_categorization",
          schema: {
            type: "object",
            properties: {
              category: { type: "string" },
              confidence: { type: "number" },
              reasoning: { type: "string" }
            },
            required: ["category", "confidence", "reasoning"],
            additionalProperties: false
          }
        }
      })
    });

    if (!categorizationResponse.ok) {
      throw new Error("Failed to categorize transaction");
    }

    const result = await categorizationResponse.json();
    const categorization = JSON.parse(result.choices[0].message.content);

    // Find the matching category
    const matchedCategory = categories.find(
      c => c.name.toLowerCase() === categorization.category.toLowerCase()
    );

    if (!matchedCategory) {
      // Default to first category if no match found
      return Response.json({
        categoryId: categories[0]?.id,
        categoryName: categories[0]?.name,
        confidence: 0.5,
        reasoning: "No exact match found, using default category"
      });
    }

    // Store ML training data for future improvements
    if (session.user.id && matchedCategory) {
      await sql`
        INSERT INTO ml_training_data (user_id, merchant, description, actual_category_id, confidence_score)
        VALUES (${session.user.id}, ${merchant}, ${description}, ${matchedCategory.id}, ${categorization.confidence})
      `;
    }

    return Response.json({
      categoryId: matchedCategory.id,
      categoryName: matchedCategory.name,
      confidence: categorization.confidence,
      reasoning: categorization.reasoning
    });

  } catch (error) {
    console.error("POST /api/transactions/categorize error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}