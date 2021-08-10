import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "react-feather";

const Collapsible = ({ label, children }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="w-full">
          <Disclosure.Button className="flex flex-row justify-between w-full px-4 py-2 focus:outline-none">
            <p>{label}</p>
            {/*
              Use the `open` render prop to rotate the icon when the panel is open
            */}
            <ChevronDown className={`${open ? "transform rotate-180" : ""}`} />
          </Disclosure.Button>

          <Disclosure.Panel>{children}</Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default Collapsible;
