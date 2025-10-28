import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { ArrowLeft, Plus, CreditCard, Wallet, Shield } from "lucide-react";

export default function WalletTopUpPage() {
  const { data: user, loading: userLoading } = useUser();
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletData, setWalletData] = useState(null);

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/wallet");
        if (response.ok) {
          const data = await response.json();
          setWalletData(data.wallet);
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    };

    fetchWallet();
  }, [user]);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseFloat(value) || 0);
    }
  };

  const handleTopUp = async () => {
    setLoading(true);
    setError(null);

    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      setLoading(false);
      return;
    }

    if (amount < 10) {
      setError("Minimum top-up amount is ₹10");
      setLoading(false);
      return;
    }

    if (amount > 100000) {
      setError("Maximum top-up amount is ₹1,00,000");
      setLoading(false);
      return;
    }

    try {
      // In a real implementation, this would redirect to the payment gateway
      // For now, we'll simulate a successful payment
      const paymentGatewayId = `pg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate payment gateway processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update wallet balance
      const response = await fetch("/api/wallet", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          transaction_type: "wallet_topup",
          payment_gateway_id: paymentGatewayId,
          description: `Wallet top-up of ₹${amount}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update wallet");
      }

      const result = await response.json();
      setWalletData(result.wallet);

      // Redirect to success page or show success message
      window.location.href = "/?success=topup";
    } catch (err) {
      console.error("Top-up error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#121212]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3562FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7280] dark:text-[#A1A1AA]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/account/signin";
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#121212]">
      {/* Header */}
      <header className="h-16 border-b border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#121212] px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E] rounded-md"
            >
              <ArrowLeft
                size={20}
                className="text-[#6B7280] dark:text-[#A1A1AA]"
              />
            </a>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3562FF] rounded-full flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="font-semibold text-[#0F172A] dark:text-[#DEDEDE]">
                Financial Saver
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#3562FF] dark:bg-[#4F7CFF] rounded-full flex items-center justify-center">
              <Wallet size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#0F172A] dark:text-[#DEDEDE]">
                Add Money to Wallet
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
                Current Balance: ₹{walletData?.balance?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE] mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      selectedAmount === amount && !customAmount
                        ? "bg-[#3562FF] dark:bg-[#4F7CFF] text-white"
                        : "bg-[#F3F4F6] dark:bg-[#262626] text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#374151]"
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE] mb-2">
                Or Enter Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#A1A1AA]">
                  ₹
                </span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount"
                  min="10"
                  max="100000"
                  className="w-full pl-8 pr-4 py-3 border border-[#E5E7EB] dark:border-[#262626] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:border-transparent bg-white dark:bg-[#1E1E1E] text-[#0F172A] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
                />
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1">
                Minimum: ₹10 | Maximum: ₹1,00,000
              </p>
            </div>

            {/* Payment Summary */}
            <div className="bg-[#F9FAFB] dark:bg-[#262626] rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280] dark:text-[#A1A1AA]">
                  Amount to Add:
                </span>
                <span className="font-medium text-[#0F172A] dark:text-[#DEDEDE]">
                  ₹
                  {(customAmount
                    ? parseFloat(customAmount) || 0
                    : selectedAmount
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280] dark:text-[#A1A1AA]">
                  Processing Fee:
                </span>
                <span className="font-medium text-[#0F172A] dark:text-[#DEDEDE]">
                  ₹0.00
                </span>
              </div>
              <hr className="border-[#E5E7EB] dark:border-[#374151]" />
              <div className="flex justify-between font-medium">
                <span className="text-[#0F172A] dark:text-[#DEDEDE]">
                  Total Amount:
                </span>
                <span className="text-[#0F172A] dark:text-[#DEDEDE]">
                  ₹
                  {(customAmount
                    ? parseFloat(customAmount) || 0
                    : selectedAmount
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-[#FEF2F2] dark:bg-[#2D1B1B] p-3 text-sm text-[#F04438] dark:text-[#FB7185]">
                {error}
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handleTopUp}
              disabled={loading || !selectedAmount || selectedAmount <= 0}
              className="w-full bg-[#3562FF] dark:bg-[#4F7CFF] text-white px-4 py-3 rounded-md text-sm font-medium hover:bg-[#2952E8] dark:hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Proceed to Payment Gateway
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">
                🔒 Your payment is secured with 256-bit SSL encryption
              </p>
              <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1">
                We do not store your card details
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
