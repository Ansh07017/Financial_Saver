import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Mail, Phone, Shield, User } from "lucide-react";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otpMethod: "email",
  });

  const { signUpWithCredentials } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Store additional data for onboarding
      localStorage.setItem("pendingPhone", formData.phone);
      localStorage.setItem("pendingOtpMethod", formData.otpMethod);

      await signUpWithCredentials({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-up. Please try again or use a different method.",
        OAuthCallback: "Sign-up failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-up option. Try another one.",
        EmailCreateAccount:
          "This email can't be used. It may already be registered.",
        Callback: "Something went wrong during sign-up. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Invalid email or password. If you already have an account, try signing in instead.",
        AccessDenied: "You don't have permission to sign up.",
        Configuration:
          "Sign-up isn't working right now. Please try again later.",
        Verification: "Your sign-up link has expired. Request a new one.",
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
          Create Account
        </h1>
        <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] text-center mb-8">
          Join Financial Saver to manage your money better
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE]">
              Full Name
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#A1A1AA]"
              />
              <input
                required
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:border-transparent bg-white dark:bg-[#1E1E1E] text-[#0F172A] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:border-transparent bg-white dark:bg-[#1E1E1E] text-[#0F172A] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE]">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#A1A1AA]"
              />
              <input
                required
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
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
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:border-transparent bg-white dark:bg-[#1E1E1E] text-[#0F172A] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
              placeholder="Create a password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE]">
              Confirm Password
            </label>
            <input
              required
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:border-transparent bg-white dark:bg-[#1E1E1E] text-[#0F172A] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
              placeholder="Confirm your password"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE]">
              Preferred OTP Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, otpMethod: "email" }))
                }
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.otpMethod === "email"
                    ? "bg-[#3562FF] dark:bg-[#4F7CFF] text-white"
                    : "bg-[#F3F4F6] dark:bg-[#262626] text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#374151]"
                }`}
              >
                <Mail size={14} />
                Email
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, otpMethod: "sms" }))
                }
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.otpMethod === "sms"
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-[#6B7280] dark:text-[#A1A1AA]">
            Already have an account?{" "}
            <a
              href={`/account/signin${
                typeof window !== "undefined" ? window.location.search : ""
              }`}
              className="text-[#3562FF] dark:text-[#4F7CFF] hover:underline font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;
