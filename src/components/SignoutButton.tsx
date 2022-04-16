import { LogoutIcon } from "@heroicons/react/outline";
import router from "next/router";
import toast from "react-hot-toast";

import { supabase } from "@/utils/supabaseClient";

const SignoutButton: React.FC = () => {
  return (
    <button
      onClick={async () => {
        const { error } = await supabase.auth.signOut();

        if (error) return toast.error("Unable to log out");

        router.push("/login");
      }}
      className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
    >
      <LogoutIcon className="flex-shrink-0 w-6 h-6 mr-4 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
      Sign Out
    </button>
  );
};

export default SignoutButton;
