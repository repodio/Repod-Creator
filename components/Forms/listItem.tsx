import React from "react";
import { Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { Button } from "components/Buttons";
import BenefitsList from "components/BenefitLists";

const ListItemTypes = {
  input: "input",
  currency: "currency",
  textarea: "textarea",
  benefits: "benefits",
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
  benefits,
  handleRemoveBenefit,
  handleEditBenefit,
  handleAddBenefit,
}: {
  label: string;
  subLabel: string;
  type: string;
  value: string;
  placeholder: string;
  error: boolean;
  name: string;
  control: any;
  inputType: string;
  registerInput: {};
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
        <p className="text-xs font-book text-repod-text-secondary">
          {subLabel}
        </p>
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
            {/* <div ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }}>
              {map((benefit: SubscriptionBenefitItem) => (
                <div
                  ref={drag}
                  className="flex flex-row items-center justify-center w-full py-4 px-4 rounded bg-repod-canvas-secondary"
                >
                  <div className="ml-4">
                    <Menu
                      className="stroke-current text-repod-text-primary"
                      size={24}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start px-4">
                    <p className="text-md font-semibold text-repod-text-primary">
                      {benefit.title}
                    </p>
                    <p className="text-sm font-book text-repod-text-secondary">
                      {benefit.rssFeed}
                    </p>
                  </div>
                  <div onClick={handleEditBenefit}>
                    <a className="cursor-pointer flex text-center no-underline text-xs font-bold text-info hover:opacity-50 transition px-2">
                      EDIT
                    </a>
                  </div>
                  <div className="mr-4">
                    <X
                      onClick={handleRemoveBenefit}
                      className="stroke-current text-repod-text-secondary"
                      size={24}
                    />
                  </div>
                </div>
              ))(benefits)}
            </div> */}
          </div>
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
