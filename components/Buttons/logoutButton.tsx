import React from "react";
import { useAuth } from "firebaseHelpers/useAuth";

const LogoutButton = () => {
  const { signOut } = useAuth();

  return (
    <button
      className="block bg-teal hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded"
      onClick={signOut}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
