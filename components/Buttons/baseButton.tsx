import React from "react";
import { useAuth, AUTH_PROVIDERS } from "firebaseHelpers/useAuth";

const BaseButton = ({ children, styles, className, ...rest }) => {
  return (
    <button
      className={`w-full rounded-md bg-repod-tint text-repod-text-primary font-sans tracking-wider ${styles.classNames} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

const getSize = (size: string) => {
  switch (size) {
    case "Medium":
      return {
        classNames: `px-4 py-2 text-lg`,
      };
    case "Tiny":
      return {
        classNames: `px-6 py-2 text-sm`,
      };
  }
};

export const Medium = (props) => (
  <BaseButton {...props} styles={getSize("Medium")} />
);

export const Tiny = (props) => (
  <BaseButton {...props} styles={getSize("Tiny")} />
);
