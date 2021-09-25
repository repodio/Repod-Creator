import React, { useState } from "react";
import { Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { Button } from "components/Buttons";
import BenefitsListComponent from "components/BenefitLists";
import { Switch } from "@headlessui/react";
import { TierBenefitsModal } from "components/Modals";
import { map } from "lodash/fp";
import { ChevronDown } from "react-feather";
import { useMediaQuery } from "react-responsive";

const ListItemTypes = {
  input: "input",
  currency: "currency",
  textarea: "textarea",
  benefitsList: "benefitsList",
  toggle: "toggle",
  select: "select",
};

const CurrencyFormat = ({
  onChange,
  value,
  borderColor,
  registerInput,
  ...rest
}) => {
  const [currency, setCurrency] = React.useState(value / 100);

  return (
    <NumberFormat
      {...registerInput}
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
      prefix="$"
    />
  );
};

const ListItem = ({
  label,
  subLabel,
  type,
  value,
  boolValue,
  placeholder,
  error,
  name,
  control,
  inputType,
  registerInput,
  onChange,
  onOptionChange,
  initialOption,
  options,
  setBenefitIds,
  benefitIds,
}: {
  label: string;
  subLabel: string;
  type: string;
  value?: string;
  boolValue?: boolean;
  placeholder?: string;
  error?: boolean;
  name?: string;
  control?: any;
  inputType?: string;
  registerInput?: {};
  onChange?: () => void;
  onOptionChange?: (option: string) => void;
  initialOption?: string;
  options?: { label: string; key: string }[];
  setBenefitIds?: (benefitIds: string[]) => {};
  benefitIds?: string[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 815px)" });

  const borderColor = `focus:border-info ${
    error ? "border-danger" : "border-repod-border-light"
  }`;

  return (
    <div
      className={
        isMobile
          ? "flex flex-col items-start justify-start w-full py-4"
          : "flex flex-row items-start justify-start w-full py-4"
      }
    >
      <div
        style={isMobile ? {} : { maxWidth: 200, minWidth: 200 }}
        className={
          isMobile
            ? "flex flex-row items-center justify-start"
            : "flex flex-col items-start justify-start pr-4"
        }
      >
        <p className="text-md font-book text-repod-text-primary">{label}</p>
        {type !== ListItemTypes.toggle ? (
          <p
            className={`text-xs font-book ${
              error ? "text-danger" : "text-repod-text-secondary"
            } ${isMobile ? " ml-1" : ""}`}
          >
            {subLabel}
          </p>
        ) : null}
      </div>
      <div className="w-full flex-1 flex-col items-center justify-center relative">
        {type === ListItemTypes.input ? (
          <input
            className={`w-full text-md px-6 h-12 border-2 font-medium rounded-lg text-repod-text-primary bg-repod-canvas-secondary focus:outline-none 
            ${borderColor}`}
            type={inputType}
            name={name}
            id={name}
            defaultValue={value}
            placeholder={placeholder}
            {...registerInput}
          />
        ) : type === ListItemTypes.currency ? (
          <Controller
            name={name}
            control={control}
            render={({ field: { ref, name, onBlur, onChange, value } }) => {
              return (
                <CurrencyFormat
                  borderColor={borderColor}
                  placeholder={placeholder}
                  registerInput={registerInput}
                  innerRef={ref}
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
        ) : type === ListItemTypes.textarea ? (
          <textarea
            style={{ minHeight: 80, height: 80 }}
            className={`w-full text-md px-6 pt-4 border-2 font-medium rounded-lg text-repod-text-primary bg-repod-canvas-secondary focus:outline-none 
            ${borderColor}`}
            name={name}
            id={name}
            defaultValue={value}
            placeholder={placeholder}
            {...registerInput}
          />
        ) : type === ListItemTypes.benefitsList ? (
          <div className="flex flex-col items-start justify-start">
            {benefitIds && benefitIds.length ? (
              <>
                <Button.Small
                  className="bg-bg-info text-info mb-6"
                  style={{ minWidth: 130, maxWidth: 130, width: 130 }}
                  onClick={() => setIsModalOpen(true)}
                >
                  + Add Benefit
                </Button.Small>
                <BenefitsListComponent
                  setBenefitIds={setBenefitIds}
                  benefitIds={benefitIds}
                />
              </>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-8 rounded-lg  bg-bg-info flex flex-row justify-center items-center hover:opacity-50 transition focus:outline-none"
              >
                <p
                  className={
                    isMobile
                      ? "text-sm font-semibold text-info"
                      : "ml-4 text-lg font-semibold text-info"
                  }
                >
                  + Add some benefits for your members
                </p>
              </button>
            )}

            <TierBenefitsModal
              addedBenefits={benefitIds}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              initialScreen={TierBenefitsModal.Types.tierBenefits}
            />
          </div>
        ) : type === ListItemTypes.toggle ? (
          <div className="w-full flex flex-row justify-end items-center">
            <p className="text-sm font-book text-repod-text-primary mr-4">
              {subLabel}
            </p>
            <Switch
              style={{ minWidth: 44 }}
              checked={boolValue}
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
        ) : type === ListItemTypes.select ? (
          <div className="flex items-center justify-center w-full relative">
            <select
              defaultValue={initialOption}
              onChange={(event) => onOptionChange(event.target.value)}
              className={`appearance-none cursor-pointer  w-full text-md px-6 h-12 border-2 font-medium rounded-lg text-repod-text-primary bg-repod-canvas-secondary focus:outline-none 
          ${borderColor}`}
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

export const BenefitsList = (props) => (
  <ListItem {...props} type={ListItemTypes.benefitsList} />
);

export const Toggle = (props) => (
  <ListItem {...props} type={ListItemTypes.toggle} />
);

export const Select = (props) => (
  <ListItem {...props} type={ListItemTypes.select} />
);
