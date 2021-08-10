import React from "react";
import { Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { Button } from "components/Buttons";
import BenefitsList from "components/BenefitLists";
import { Switch } from "@headlessui/react";

const ListItemTypes = {
  input: "input",
  currency: "currency",
  textarea: "textarea",
  benefits: "benefits",
  select: "select",
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
  error,
  name,
  control,
  inputType,
  registerInput,
  onChange,
  benefits,
  handleRemoveBenefit,
  handleEditBenefit,
  handleAddBenefit,
}: {
  label: string;
  subLabel: string;
  type: string;
  value: string | boolean;
  placeholder: string;
  error: boolean;
  name: string;
  control: any;
  inputType: string;
  registerInput: {};
  onChange: () => void;
  benefits: SubscriptionBenefitItem[];
  handleAddBenefit: () => void;
  handleRemoveBenefit: () => void;
  handleEditBenefit: () => void;
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
        <p className="text-md font-book text-repod-text-primary">{label}</p>
        {type !== ListItemTypes.select ? (
          <p className="text-xs font-book text-repod-text-secondary">
            {subLabel}
          </p>
        ) : null}
      </div>
      <div className="flex-1 flex-col items-center justify-center relative">
        {type === ListItemTypes.input ? (
          <input
            className={`w-full text-md px-6 h-12 border-2 font-medium rounded-lg text-repod-text-primary bg-repod-canvas-secondary focus:outline-none 
            ${borderColor}`}
            type={inputType}
            name={name}
            id={name}
            defaultValue={value}
            // value=""
            placeholder={placeholder}
            {...registerInput}
          />
        ) : type === ListItemTypes.currency ? (
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
        ) : type === ListItemTypes.textarea ? (
          <textarea
            style={{ minHeight: 80, height: 80 }}
            className={`w-full text-md px-6 pt-4 border-2 font-medium rounded-lg text-repod-text-primary bg-repod-canvas-secondary focus:outline-none 
            ${borderColor}`}
            name={name}
            id={name}
            defaultValue={value}
            // value=""
            placeholder={placeholder}
            {...registerInput}
          />
        ) : type === ListItemTypes.benefits ? (
          <div className="flex flex-col items-start justify-start">
            <Button.Small
              className="bg-badge-info text-info mb-6"
              style={{ minWidth: 130, maxWidth: 130, width: 130 }}
              onClick={handleAddBenefit}
            >
              + Add Benefit
            </Button.Small>
            <BenefitsList benefits={benefits} />
          </div>
        ) : type === ListItemTypes.select ? (
          <div className="w-full flex flex-row justify-end items-center">
            <p className="text-sm font-book text-repod-text-primary mr-4">
              {subLabel}
            </p>
            <Switch
              checked={value}
              onChange={onChange}
              className={`${
                value ? "bg-info" : "bg-gray-300"
              } relative inline-flex items-center h-6 rounded-full w-11 transform all ease-in-out duration-200 focus:outline-none mx-4`}
            >
              <span
                /* Transition the Switch's knob on state change */
                className={`transform transition ease-in-out duration-200
              ${value ? "translate-x-9" : "translate-x-0"}
        `}
              />
              <span className="sr-only">Enable notifications</span>
              <span
                className={`${
                  value ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transform transition ease-in-out duration-200`}
              />
            </Switch>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const TextArea = (props) => (
  <ListItem {...props} type={ListItemTypes.textarea} />
);

export const Input = (props) => (
  <ListItem {...props} type={ListItemTypes.input} />
);

export const Currency = (props) => (
  <ListItem {...props} type={ListItemTypes.currency} />
);

export const Benefits = (props) => (
  <ListItem {...props} type={ListItemTypes.benefits} />
);

export const Select = (props) => (
  <ListItem {...props} type={ListItemTypes.select} />
);
