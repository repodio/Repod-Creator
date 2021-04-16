import React from "react";
import { useAuth, AUTH_PROVIDERS } from "firebaseHelpers/useAuth";

const TwitterLoginButton = () => {
  const { signIn } = useAuth();

  const onClick = () => {
    signIn({
      provider: AUTH_PROVIDERS.twitter,
    });
  };

  return (
    <button
      className="block bg-teal hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded"
      onClick={onClick}
    >
      Continue with Twitter
    </button>
  );
};

export default TwitterLoginButton;
