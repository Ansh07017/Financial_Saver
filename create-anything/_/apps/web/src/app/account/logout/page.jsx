import useAuth from "@/utils/useAuth";
import { Shield, LogOut } from "lucide-react";

function MainComponent() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] dark:bg-[#121212] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#262626] rounded-xl px-6 py-8 shadow-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-[#3562FF] dark:bg-[#4F7CFF] rounded-full flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-[#0F172A] dark:text-[#DEDEDE] text-center mb-2">
          Sign Out
        </h1>
        <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] text-center mb-8">
          Are you sure you want to sign out of your Financial Saver account?
        </p>

        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full bg-[#3562FF] dark:bg-[#4F7CFF] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#2952E8] dark:hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#3562FF] focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Sign Out
          </button>

          <a
            href="/"
            className="w-full block text-center bg-[#F3F4F6] dark:bg-[#262626] text-[#6B7280] dark:text-[#A1A1AA] px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#E5E7EB] dark:hover:bg-[#374151] transition-colors"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
