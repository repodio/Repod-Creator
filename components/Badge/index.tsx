import React from "react";

const Styles = {
  info: "info",
  disabled: "disabled",
};

const BaseBadge = ({ label, styles }) => {
  return (
    <div
      className={`flex flex-col px-2 h-6 justify-center rounded ${styles.background}`}
    >
      <p className={`text-xs font-bold ${styles.label}`}>{label}</p>
    </div>
  );
};

const getSize = (size: string) => {
  switch (size) {
    case Styles.info:
      return {
        label: `text-info`,
        background: `bg-bg-info`,
      };
    case Styles.disabled:
      return {
        label: `text-repod-text-secondary`,
        background: `bg-badge-disabled`,
      };
  }
};

export const Info = (props) => (
  <BaseBadge {...props} styles={getSize(Styles.info)} />
);

export const Disabled = (props) => (
  <BaseBadge {...props} styles={getSize(Styles.disabled)} />
);
