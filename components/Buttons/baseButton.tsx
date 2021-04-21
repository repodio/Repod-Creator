import React from "react";
import { useAuth, AUTH_PROVIDERS } from "firebaseHelpers/useAuth";

const AppleLoginButton = ({ onClick, children }) => {
  return (
    <button
      className="w-full text-lg px-6 h-12 border-2 rounded-md border-repod-text-primary text-repod-text-primary"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default AppleLoginButton;
