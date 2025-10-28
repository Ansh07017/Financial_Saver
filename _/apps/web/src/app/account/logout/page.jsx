import useAuth from "@/utils/useAuth";

function MainComponent() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* MoneyFlow Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700">
            <span className="text-2xl font-bold text-white">$</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Sign Out</h1>
          <p className="text-gray-600">
            Are you sure you want to sign out of MoneyFlow?
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Yes, Sign Out
          </button>

          <a
            href="/dashboard"
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-medium text-gray-700 text-center transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
