import React from "react";
import { map } from "lodash/fp";
import { ChevronDown } from "react-feather";

const Select = ({
  onOptionChange,
  initialOption,
  options,
}: {
  onOptionChange?: (option: string) => void;
  initialOption?: string;
  options?: { label: string; key: string }[];
}) => {
  return (
    <div className="flex items-center justify-center w-full relative">
      <select
        defaultValue={initialOption}
        onChange={(event) => onOptionChange(event.target.value)}
        className={`appearance-none cursor-pointer  w-full text-md px-6 h-12 border-2 font-medium rounded-lg text-repod-text-primary bg-repod-canvas-secondary focus:outline-none focus:border-info border-repod-border-light`}
      >
        {map((option: { key: string; label: string }) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))(options)}
      </select>
      <ChevronDown
        className="absolute right-4 stroke-current text-repod-text-secondary cursor-pointer pointer-events-none"
        size={20}
      />
    </div>
  );
};

export default Select;
