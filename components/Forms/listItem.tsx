import React from "react";
import { formatCurrency } from "utils/formats";
import { Controller } from "react-hook-form";
import NumberFormat from "react-number-format";

const ListItemTypes = {
  input: "input",
};

const CurrencyFormat = ({ onChange, value, borderColor, ...rest }) => {
  const [currency, setCurrency] = React.useState(value / 100);
  return (
    <NumberFormat
      {...rest}
      className={`w-full text-lg px-6 h-12 border-2 font-medium rounded-lg text-repod-text-primary bg-repod-canvas-secondary focus:outline-none
      ${borderColor}`}
      value={currency}
      thousandSeparator={true}
      decimalScale={2}
      onValueChange={(target) => {
        setCurrency(target.floatValue);
        onChange(target.floatValue * 100);
      }}
      isNumericString
      prefix="$ "
    />
  );
};

const ListItem = ({
  label,
  subLabel,
  type,
  value,
  placeholder,
  isCurrencyInput,
  error,
  name,
  control,
  inputType,
  registerInput,
}: {
  label: string;
  subLabel: string;
  type: string;
  value: string;
  placeholder: string;
  isCurrencyInput: boolean;
  error: boolean;
  name: string;
  control: any;
  inputType: string;
  registerInput: {};
}) => {
  const borderColor = `focus:border-info ${
    error ? "border-danger" : "border-repod-border-light"
  }`;

  return (
    <div className="flex flex-row items-start justify-start w-full py-4">
      <div
        style={{ maxWidth: 200, minWidth: 200 }}
        className="flex flex-col items-start justify-start px-4"
      >
        <p className="text-md font-medium text-repod-text-primary">{label}</p>
        <p className="text-sm font-book text-repod-text-secondary">
          {subLabel}
        </p>
      </div>
      <div className="flex-1 flex-col items-center justify-center relative">
        {type === ListItemTypes.input ? (
          isCurrencyInput ? (
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <CurrencyFormat
                  borderColor={borderColor}
                  placeholder={placeholder}
                  {...field}
                />
              )}
            />
          ) : (
            <input
              className={`w-full text-lg px-6 h-12 border-2 font-medium rounded-lg text-repod-text-primary bg-repod-canvas-secondary focus:outline-none 
            ${isCurrencyInput ? " pl-8" : ""}
            ${borderColor}`}
              type={inputType}
              name={name}
              id={name}
              defaultValue={value}
              value=""
              placeholder={placeholder}
              {...registerInput}
            />
          )
        ) : null}
        {/* {isCurrencyInput ? (
          <div
            className={`absolute top-0 left-0 h-12 pl-4 flex justify-center items-center `}
          >
            <p className="font-medium text-repod-text-primary ">$</p>
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export const Input = (props) => (
  <ListItem {...props} type={ListItemTypes.input} />
);
