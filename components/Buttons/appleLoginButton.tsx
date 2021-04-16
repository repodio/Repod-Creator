import React from "react";
import { useAuth, AUTH_PROVIDERS } from "firebaseHelpers/useAuth";

const AppleLoginButton = () => {
  const { signIn } = useAuth();

  const onClick = () => {
    signIn({
      provider: AUTH_PROVIDERS.apple,
    });
  };

  return (
    <button
      className="block bg-teal hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded"
      onClick={onClick}
    >
      Continue with Apple
    </button>
  );
};

export default AppleLoginButton;
