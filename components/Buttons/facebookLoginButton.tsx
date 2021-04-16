import React from "react";
import { useAuth, AUTH_PROVIDERS } from "firebaseHelpers/useAuth";

const FacebookLoginButton = () => {
  const { signIn } = useAuth();

  const onClick = () => {
    signIn({
      provider: AUTH_PROVIDERS.facebook,
    });
  };

  return (
    <button
      className="block bg-teal hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded"
      onClick={onClick}
    >
      Continue with Facebook
    </button>
  );
};

export default FacebookLoginButton;
