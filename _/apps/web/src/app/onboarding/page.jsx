import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  DollarSign,
  CreditCard,
  Building,
  Wallet,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    primaryAccount: {
      name: "",
      accountType: "checking",
      initialBalance: "",
    },
    monthlyIncome: "",
    financialGoals: [],
  });

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  const accountTypes = [
    {
      id: "checking",
      name: "Checking Account",
      icon: CreditCard,
      description: "For daily transactions",
    },
    {
      id: "savings",
      name: "Savings Account",
      icon: Building,
      description: "For saving money",
    },
    {
      id: "credit",
      name: "Credit Card",
      icon: CreditCard,
      description: "For credit purchases",
    },
    {
      id: "cash",
      name: "Cash/Wallet",
      icon: Wallet,
      description: "Cash on hand",
    },
  ];

  const goalOptions = [
    { id: "emergency", name: "Emergency Fund", emoji: "🆘", target: 5000 },
    { id: "vacation", name: "Vacation", emoji: "🏖️", target: 3000 },
    { id: "car", name: "New Car", emoji: "🚗", target: 25000 },
    { id: "house", name: "House Down Payment", emoji: "🏠", target: 50000 },
    { id: "retirement", name: "Retirement", emoji: "🏖️", target: 100000 },
    { id: "education", name: "Education", emoji: "🎓", target: 15000 },
  ];

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.primaryAccount.name ||
      !formData.primaryAccount.initialBalance
    ) {
      return;
    }
    setStep(2);
  };

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    if (!formData.monthlyIncome) {
      return;
    }
    setStep(3);
  };

  const toggleGoal = (goalId) => {
    setFormData((prev) => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goalId)
        ? prev.financialGoals.filter((id) => id !== goalId)
        : [...prev.financialGoals, goalId],
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Create primary account
      const accountResponse = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.primaryAccount.name,
          accountType: formData.primaryAccount.accountType,
          balance: parseFloat(formData.primaryAccount.initialBalance),
        }),
      });

      if (!accountResponse.ok) throw new Error("Failed to create account");

      // Create financial goals
      for (const goalId of formData.financialGoals) {
        const goal = goalOptions.find((g) => g.id === goalId);
        if (goal) {
          await fetch("/api/goals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: goal.name,
              targetAmount: goal.target,
              emoji: goal.emoji,
              goalType: "savings",
            }),
          });
        }
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to MoneyFlow!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Let's set up your financial dashboard
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNum
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > stepNum ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    stepNum
                  )}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      step > stepNum ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-500">Account</span>
            <span className="text-sm text-gray-500">Income</span>
            <span className="text-sm text-gray-500">Goals</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 1 && (
            <form onSubmit={handleAccountSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Add Your Primary Account
                </h2>
                <p className="text-gray-600">
                  This will be your main account for tracking expenses.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.primaryAccount.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primaryAccount: {
                        ...prev.primaryAccount,
                        name: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Chase Checking"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {accountTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            primaryAccount: {
                              ...prev.primaryAccount,
                              accountType: type.id,
                            },
                          }))
                        }
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          formData.primaryAccount.accountType === type.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-blue-600 mb-2" />
                        <div className="font-medium text-sm">{type.name}</div>
                        <div className="text-xs text-gray-500">
                          {type.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.primaryAccount.initialBalance}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        primaryAccount: {
                          ...prev.primaryAccount,
                          initialBalance: e.target.value,
                        },
                      }))
                    }
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleIncomeSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Monthly Income
                </h2>
                <p className="text-gray-600">
                  Help us understand your income to provide better insights.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income (after taxes)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        monthlyIncome: e.target.value,
                      }))
                    }
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5000.00"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  This will help us suggest budgets and track your spending
                  patterns.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Financial Goals
                </h2>
                <p className="text-gray-600">
                  Select the goals you'd like to work towards. You can modify
                  these later.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      formData.financialGoals.includes(goal.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{goal.emoji}</div>
                    <div className="font-medium text-sm">{goal.name}</div>
                    <div className="text-xs text-gray-500">
                      ${goal.target.toLocaleString()} target
                    </div>
                    {formData.financialGoals.includes(goal.id) && (
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Complete Setup</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
