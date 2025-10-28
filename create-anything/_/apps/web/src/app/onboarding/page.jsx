import { useState, useCallback, useEffect } from "react";
import useUser from "@/utils/useUser";
import { Shield, Phone, Mail, CheckCircle } from "lucide-react";

export default function OnboardingPage() {
  const { data: user, loading: userLoading, refetch } = useUser();
  const [userData, setUserData] = useState({
    phone: "",
    preferred_otp_method: "email",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load pending profile data from localStorage
    if (typeof window !== "undefined") {
      const pendingPhone = localStorage.getItem("pendingPhone");
      const pendingOtpMethod = localStorage.getItem("pendingOtpMethod");

      if (pendingPhone && !userData.phone) {
        setUserData((prev) => ({ ...prev, phone: pendingPhone }));
      }
      if (pendingOtpMethod && userData.preferred_otp_method === "email") {
        setUserData((prev) => ({
          ...prev,
          preferred_otp_method: pendingOtpMethod,
        }));
      }
    }
  }, [user, userData.phone, userData.preferred_otp_method]);

  const saveProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      const result = await res.json();

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingPhone");
        localStorage.removeItem("pendingOtpMethod");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!userData.phone) {
        setError("Phone number is required");
        return;
      }

      await saveProfile();
    },
    [saveProfile, userData.phone],
  );

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

  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#121212] p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-6 py-8 shadow-sm text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-[#12B76A] rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-[#0F172A] dark:text-[#DEDEDE] mb-2">
            Welcome to Financial Saver!
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] mb-4">
            Your account is all set up. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#121212] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-6 py-8 shadow-sm"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-[#3562FF] dark:bg-[#4F7CFF] rounded-full flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-[#0F172A] dark:text-[#DEDEDE] text-center mb-2">
          Complete Your Profile
        </h1>
        <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] text-center mb-8">
          Just a few more details to secure your account
        </p>

        <div className="space-y-6">
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
                type="tel"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+91 9876543210"
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:border-transparent bg-white dark:bg-[#1E1E1E] text-[#0F172A] dark:text-[#DEDEDE] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#0F172A] dark:text-[#DEDEDE]">
              Preferred OTP Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setUserData((prev) => ({
                    ...prev,
                    preferred_otp_method: "email",
                  }))
                }
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  userData.preferred_otp_method === "email"
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
                  setUserData((prev) => ({
                    ...prev,
                    preferred_otp_method: "sms",
                  }))
                }
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  userData.preferred_otp_method === "sms"
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
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </div>
      </form>
    </div>
  );
}
