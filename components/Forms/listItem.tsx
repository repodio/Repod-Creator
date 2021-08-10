import React, { useState } from "react";
import { Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import { Button } from "components/Buttons";
import BenefitsListComponent from "components/BenefitLists";
import { Switch } from "@headlessui/react";
import { TierBenefitsModal } from "components/Modals";
import { map } from "lodash/fp";

const ListItemTypes = {
  input: "input",
  currency: "currency",
  textarea: "textarea",
  benefitsList: "benefitsList",
  toggle: "toggle",
  addBenefit: "addBenefit",
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
  value?: string | boolean;
  placeholder?: string;
  error?: boolean;
  name?: string;
  control?: any;
  inputType?: string;
  registerInput?: {};
  onChange?: () => void;
  options?: { label: string; key: string }[];
  benefits?: SubscriptionBenefitItem[];
  handleAddBenefit?: () => void;
  handleRemoveBenefit?: () => void;
  handleEditBenefit?: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const borderColor = `focus:border-info ${
    error ? "border-danger" : "border-repod-border-light"
  }`;

  return (
    <div className="flex flex-row items-start justify-start w-full py-4">
      <div
        style={{ maxWidth: 200, minWidth: 200 }}
        className="flex flex-col items-start justify-start pr-4"
      >
        <p className="text-md font-book text-repod-text-primary">{label}</p>
        {type !== ListItemTypes.toggle ? (
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
        ) : type === ListItemTypes.benefitsList ? (
          <div className="flex flex-col items-start justify-start">
            <Button.Small
              className="bg-badge-info text-info mb-6"
              style={{ minWidth: 130, maxWidth: 130, width: 130 }}
              // onClick={handleAddBenefit}
              onClick={() => setIsModalOpen(true)}
            >
              + Add Benefit
            </Button.Small>
            <TierBenefitsModal
              addedBenefits={benefits}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              initialScreen={TierBenefitsModal.Types.tierBenefits}
            />
            <BenefitsListComponent benefits={benefits} />
          </div>
        ) : type === ListItemTypes.toggle ? (
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
        ) : type === ListItemTypes.addBenefit ? (
          <div className="w-full flex flex-row justify-end items-center">
            {value ? (
              <Button.Tiny
                style={{ width: 180 }}
                className={`py-1 bg-repod-disabled-bg rounded hover:opacity-100 cursor-default uppercase`}
              >
                <p className="text-xs font-semibold text-repod-text-primary">
                  Added to this tier
                </p>
              </Button.Tiny>
            ) : (
              <Button.Tiny
                style={{ width: 90 }}
                onClick={() => {}}
                className={`py-1  bg-badge-info rounded border-1 border-info uppercase`}
              >
                <p className="text-xs font-semibold text-info">+ Add</p>
              </Button.Tiny>
            )}
          </div>
        ) : type === ListItemTypes.select ? (
          <select
            className={`w-full text-md px-6 h-12 border-2 font-medium rounded-lg text-repod-text-primary bg-repod-canvas-secondary focus:outline-none 
          ${borderColor}`}
          >
            {map((benefit: SubscriptionBenefitItem) => (
              <option key={benefit.type} value={benefit.type}>
                {benefit.title}
              </option>
            ))(benefits)}
          </select>
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

export const AddBenefit = (props) => (
  <ListItem {...props} type={ListItemTypes.addBenefit} />
);

export const Select = (props) => (
  <ListItem {...props} type={ListItemTypes.select} />
);
