import React from "react";

const FormInput = ({
  label,
  registerInput,
  defaultValue,
  name,
  type,
  error,
  placeholder,
}: {
  label: string;
  registerInput: string;
  defaultValue?: string;
  name: string;
  type: string;
  error: string;
  placeholder: string;
}) => {
  return (
    <div className="w-full py-4 relative">
      <label
        className="bg-repod-canvas px-2 absolute top-0.5 left-4 mb-2 text-base text-grey-darkest"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className="w-full text-lg px-6 h-12 border-2 rounded-md border-repod-text-primary text-repod-text-primary"
        type={type}
        name={name}
        id={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        {...registerInput}
      />
      {error && <span>error</span>}
    </div>
  );
};

export default FormInput;
