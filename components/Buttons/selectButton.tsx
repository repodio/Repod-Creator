import React from "react";
import { CheckIcon } from "components/Icons";

const SelectButton = ({
  selected,
  onPress,
}: {
  selected: boolean;
  onPress: () => void;
}) => {
  return selected ? (
    <button
      style={{ width: 18, height: 18 }}
      className="flex rounded-full bg-repod-tint justify-center items-center focus:outline-none"
      onClick={onPress}
    >
      <CheckIcon />
    </button>
  ) : (
    <button
      style={{ width: 18, height: 18 }}
      className="flex rounded-full bg-canvas border border-repod-border-medium justify-center items-center focus:outline-none"
      onClick={onPress}
    >
      <div
        style={{ width: 12, height: 12 }}
        className="rounded-full bg-repod-border-light"
      />
    </button>
  );
};

export default SelectButton;
