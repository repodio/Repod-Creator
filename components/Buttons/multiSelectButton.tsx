import React from "react";
import { CheckIcon } from "components/Icons";

const MultiSelectButton = ({
  selected,
  onPress,
}: {
  selected: boolean;
  onPress: () => void;
}) => {
  return selected ? (
    <button
      style={{ width: 18, height: 18 }}
      className="flex rounded bg-repod-tint justify-center items-center focus:outline-none"
      onClick={onPress}
    >
      <CheckIcon />
    </button>
  ) : (
    <button
      style={{ width: 18, height: 18 }}
      className="flex rounded bg-canvas bg-repod-border-light border border-repod-border-medium justify-center items-center focus:outline-none"
      onClick={onPress}
    ></button>
  );
};

export default MultiSelectButton;
