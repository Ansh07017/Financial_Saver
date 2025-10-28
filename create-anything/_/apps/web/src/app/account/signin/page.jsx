import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Mail, Phone, Shield } from "lucide-react";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpMethod, setOtpMethod] = useState("email");

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
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#121212] p-4">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-6 py-8 shadow-sm"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-[#3562FF] dark:bg-[#4F7CFF] rounded-full flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-[#0F172A] dark:text-[#DEDEDE] text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] text-center mb-8">
          Sign in to your Financial Saver account
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE]">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#A1A1AA]"
              />
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:border-transparent bg-white dark:bg-[#1E1E1E] text-[#0F172A] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE]">
              Password
            </label>
            <input
              required
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:border-transparent bg-white dark:bg-[#1E1E1E] text-[#0F172A] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
              placeholder="Enter your password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE]">
              OTP Delivery Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOtpMethod("email")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  otpMethod === "email"
                    ? "bg-[#3562FF] dark:bg-[#4F7CFF] text-white"
                    : "bg-[#F3F4F6] dark:bg-[#262626] text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#374151]"
                }`}
              >
                <Mail size={14} />
                Email
              </button>
              <button
                type="button"
                onClick={() => setOtpMethod("sms")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  otpMethod === "sms"
                    ? "bg-[#3562FF] dark:bg-[#4F7CFF] text-white"
                    : "bg-[#F3F4F6] dark:bg-[#262626] text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#374151]"
                }`}
              >
                <Phone size={14} />
                SMS
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-[#FEF2F2] dark:bg-[#2D1B1B] p-3 text-sm text-[#F04438] dark:text-[#FB7185]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3562FF] dark:bg-[#4F7CFF] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#2952E8] dark:hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-[#6B7280] dark:text-[#A1A1AA]">
            Don't have an account?{" "}
            <a
              href={`/account/signup${
                typeof window !== "undefined" ? window.location.search : ""
              }`}
              className="text-[#3562FF] dark:text-[#4F7CFF] hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;
