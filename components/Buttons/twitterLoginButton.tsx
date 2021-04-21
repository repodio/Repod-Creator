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
      className={`w-full rounded-md bg-twitter text-repod-text-alternative font-sans tracking-wider flex flex-row px-4 py-2 text-lg justify-center items-center relative mb-2 hover:opacity-50 transition`}
      onClick={onClick}
    >
      <img
        className="w-6 absolute left-4"
        src="/icons/twitter-logo.png"
        alt="Continue with Twitter"
      />
      Continue with Twitter
    </button>
  );
};

export default TwitterLoginButton;
