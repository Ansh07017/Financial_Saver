import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { DollarSign, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-in. Please try again or use a different method.",
        OAuthCallback: "Sign-in failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-in method. Try another option.",
        EmailCreateAccount:
          "This email can't be used to create an account. It may already exist.",
        Callback: "Something went wrong during sign-in. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Incorrect email or password. Try again or reset your password.",
        AccessDenied: "You don't have permission to sign in.",
        Configuration:
          "Sign-in isn't working right now. Please try again later.",
        Verification: "Your sign-in link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel - Hero Section */}
          <div className="bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white p-12 flex flex-col justify-center">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <DollarSign className="w-7 h-7 text-[#4F46E5]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">MoneyFlow</h2>
                <p className="text-indigo-100 text-sm">Smart Finance Tracker</p>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Take Control of Your Finances 💸
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Track, analyze, and improve your spending habits with AI-powered
              insights.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#22D3EE] rounded-full"></div>
                <span className="text-indigo-100">
                  Automatic expense categorization
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#22D3EE] rounded-full"></div>
                <span className="text-indigo-100">
                  Smart spending anomaly detection
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#22D3EE] rounded-full"></div>
                <span className="text-indigo-100">
                  Real-time budget tracking
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel - Auth Form */}
          <div className="p-12 flex flex-col justify-center">
            {!otpStep ? (
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#1F2937] mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600">
                    Sign in to your account to continue
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-colors"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-colors"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <a
                      href={`/account/signup${
                        typeof window !== "undefined"
                          ? window.location.search
                          : ""
                      }`}
                      className="text-[#4F46E5] hover:text-[#4338CA] font-medium"
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-[#1F2937] mb-2">
                    Verify Your Identity
                  </h2>
                  <p className="text-gray-600">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="w-full text-center text-2xl font-mono py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-colors"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    /* Handle OTP verification */
                  }}
                  disabled={otp.length !== 6 || otpLoading}
                  className="w-full bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {otpLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setOtpStep(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Back to login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
