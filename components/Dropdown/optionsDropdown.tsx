import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown } from "react-feather";

const OptionsDropdown = ({
  selectedIndex,
  options,
  onPress,
}: {
  selectedIndex: number;
  options: { optionLabel: string }[];
  onPress: (index: number) => void;
}) => {
  if (!options || !options.length) {
    return null;
  }

  return (
    <div>
      <Menu as="div" className="relative text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="inline-flex justify-between items-center w-48 px-4 py-2 text-lg text-repod-text-primary rounded border-repod-border-light border ">
                <div className="flex flex-row justify-center items-center">
                  <p className={`text-md text-repod-text-secondary`}>
                    {options[selectedIndex].optionLabel}
                  </p>
                </div>
                <div>
                  <ChevronDown
                    className="stroke-current text-repod-text-secondary"
                    size={24}
                  />
                </div>
              </Menu.Button>
            </div>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute z-20 right-0 w-56 mt-2 origin-top-right bg-repod-canvas divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="px-1 py-1 ">
                  {options.map((option, index) => (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => onPress(index)}
                          className={`${
                            active ? "bg-repod-canvas-secondary" : ""
                          } group flex rounded-md items-center w-full px-2 py-2 text-md text-repod-text-primary`}
                        >
                          {option.optionLabel}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default OptionsDropdown;
