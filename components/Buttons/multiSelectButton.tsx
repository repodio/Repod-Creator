import React from "react";
import { CheckIcon } from "components/Icons";

const MultiSelectButton = ({
  selected,
  onPress,
}: {
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <button
      style={{ width: 18, height: 18 }}
      className={`flex rounded justify-center items-center focus:outline-none ${
        selected
          ? "bg-repod-tint border border-repod-tint"
          : "bg-repod-border-light border border-repod-border-medium"
      }`}
      onClick={onPress}
    >
      {selected ? <CheckIcon /> : null}
    </button>
  );
};

export default MultiSelectButton;
