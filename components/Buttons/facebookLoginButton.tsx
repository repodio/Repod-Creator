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
      className={`w-full rounded-md bg-facebook text-repod-text-alternative font-sans tracking-wider flex flex-row px-4 py-2 text-lg justify-center items-center relative mb-2`}
      onClick={onClick}
    >
      <img
        className="w-6 absolute left-4"
        src="/icons/facebook-logo.png"
        alt="Continue with Facebook"
      />
      Continue with Facebook
    </button>
  );
};

export default FacebookLoginButton;
