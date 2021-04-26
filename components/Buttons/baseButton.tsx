import React from "react";

const BaseButton = ({ children, styles, className, ...rest }) => {
  return (
    <button
      className={`focus:outline-none w-full rounded-md bg-repod-tint text-repod-text-primary font-sans tracking-wider hover:opacity-50 transition${styles.classNames} ${className}`}
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
        classNames: `px-6 text-sm`,
      };
  }
};

export const Medium = (props) => (
  <BaseButton {...props} styles={getSize("Medium")} />
);

export const Tiny = (props) => (
  <BaseButton {...props} styles={getSize("Tiny")} />
);
