import { useState } from "react";
import useUser from "@/utils/useUser";
import { Mail, Shield, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function TestEmailPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const sendTestOTP = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp_type: "test",
          delivery_method: "email",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setResult(data);
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP code");
      return;
    }

    setVerifyLoading(true);
    setError(null);
    setVerifyResult(null);

    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp_code: otpCode,
          otp_type: "test",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      setVerifyResult(data);
      setOtpCode(""); // Clear the input
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(err.message);
    } finally {
      setVerifyLoading(false);
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
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#121212] p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-6 py-8 shadow-sm text-center">
          <p className="text-[#6B7280] dark:text-[#A1A1AA] mb-4">
            Please sign in to test email functionality
          </p>
          <a
            href="/account/signin"
            className="bg-[#3562FF] dark:bg-[#4F7CFF] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#2952E8] dark:hover:bg-[#4338CA] transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
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
              ←
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
              <Mail size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#0F172A] dark:text-[#DEDEDE]">
                Email Service Test
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
                Test the SendGrid email integration
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Send OTP Test */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#0F172A] dark:text-[#DEDEDE]">
                Step 1: Send Test OTP
              </h3>
              <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
                This will send an OTP code to your email:{" "}
                <strong>{user?.email}</strong>
              </p>

              <button
                onClick={sendTestOTP}
                disabled={loading}
                className="flex items-center gap-2 bg-[#3562FF] dark:bg-[#4F7CFF] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#2952E8] dark:hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Test OTP
                  </>
                )}
              </button>

              {result && (
                <div className="rounded-md bg-[#F0F9FF] dark:bg-[#1E3A8A] p-3 text-sm">
                  <div className="flex items-center gap-2 text-[#1E40AF] dark:text-[#93C5FD]">
                    <CheckCircle size={16} />
                    <strong>Success!</strong>
                  </div>
                  <p className="text-[#1E40AF] dark:text-[#93C5FD] mt-1">
                    {result.message}
                  </p>
                  <p className="text-[#1E40AF] dark:text-[#93C5FD] text-xs mt-1">
                    Delivery method: {result.delivery_method} | Expires in:{" "}
                    {result.expires_in_minutes} minutes
                  </p>
                </div>
              )}
            </div>

            {/* Verify OTP Test */}
            {result && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[#0F172A] dark:text-[#DEDEDE]">
                  Step 2: Verify OTP
                </h3>
                <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
                  Enter the 6-digit OTP code you received in your email
                </p>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 px-4 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:border-transparent bg-white dark:bg-[#1E1E1E] text-[#0F172A] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
                  />
                  <button
                    onClick={verifyOTP}
                    disabled={verifyLoading || otpCode.length !== 6}
                    className="bg-[#12B76A] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#0F9756] focus:outline-none focus:ring-2 focus:ring-[#12B76A] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {verifyLoading ? "Verifying..." : "Verify"}
                  </button>
                </div>

                {verifyResult && (
                  <div className="rounded-md bg-[#F0FDF4] dark:bg-[#14532D] p-3 text-sm">
                    <div className="flex items-center gap-2 text-[#15803D] dark:text-[#86EFAC]">
                      <CheckCircle size={16} />
                      <strong>OTP Verified Successfully!</strong>
                    </div>
                    <p className="text-[#15803D] dark:text-[#86EFAC] mt-1">
                      {verifyResult.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-md bg-[#FEF2F2] dark:bg-[#2D1B1B] p-3 text-sm">
                <div className="flex items-center gap-2 text-[#F04438] dark:text-[#FB7185]">
                  <AlertCircle size={16} />
                  <strong>Error</strong>
                </div>
                <p className="text-[#F04438] dark:text-[#FB7185] mt-1">
                  {error}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-[#F9FAFB] dark:bg-[#262626] rounded-lg p-4">
              <h4 className="font-medium text-[#0F172A] dark:text-[#DEDEDE] mb-2">
                📧 Email Service Status
              </h4>
              <div className="text-sm text-[#6B7280] dark:text-[#A1A1AA] space-y-1">
                <p>
                  • Make sure you've added your <code>SENDGRID_API_KEY</code> in
                  Project Settings → Secrets
                </p>
                <p>• Check your email inbox (including spam folder)</p>
                <p>• Verify your sender email in SendGrid dashboard</p>
                <p>• Check the browser console for any error messages</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
