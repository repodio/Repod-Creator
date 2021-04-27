import React from "react";

const FormInput = ({
  label,
  registerInput,
  defaultValue,
  name,
  type,
  error,
  placeholder,
  maxLength = 0,
}: {
  label: string;
  registerInput: {};
  defaultValue?: string;
  name: string;
  type: string;
  error: boolean;
  placeholder: string;
  maxLength?: number;
}) => {
  return (
    <div className="w-full py-4 relative">
      <label
        className={`bg-repod-canvas px-2 absolute top-0.5 left-4 mb-2 text-base text-grey-darkest focus:text-info ${
          error ? "text-danger" : ""
        }`}
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className={`w-full text-lg px-6 h-12 border-2 rounded border-repod-text-primary text-repod-text-primary focus:border-info ${
          error ? "border-danger" : ""
        }`}
        type={type}
        name={name}
        id={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...registerInput}
        maxLength={maxLength}
      />
    </div>
  );
};

export default FormInput;
