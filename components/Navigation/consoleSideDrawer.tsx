import React from "react";
import Link from "next/link";
import { BarChart2, Settings, ChevronLeft } from "react-feather";
import { ProfileDropdown } from "components/Dropdown";
import { ShowSelector } from "components/Navigation";

const ConsoleSideDrawer = ({ show }: { show: ShowItem }) => {
  return (
    <div
      style={{ minWidth: 340 }}
      className="bg-repod-canvas-dark h-full flex flex-col"
    >
      <div className="my-4">
        <ShowSelector show={show} />
      </div>
      <div className="h-0 border border-solid border-t-0 border-repod-border-dark" />
      <div className="w-full flex flex-col mt-12 flex-1">
        <a
          href="#dashboard"
          className="rounded-md mx-4 my-2 bg-repod-canvas-dark hover:bg-white-100"
        >
          <div className="w-full p-4 flex flex-row">
            <BarChart2
              className="mr-2 stroke-current text-repod-text-alternative "
              size={24}
            />
            <p className="text-repod-text-alternative ">Dashboard</p>
          </div>
        </a>
        <a
          href="#settings"
          className="rounded-md mx-4 my-2  bg-repod-canvas-dark hover:bg-white-100"
        >
          <div className="w-full p-4 flex flex-row">
            <Settings
              className="mr-2 stroke-current text-repod-text-alternative "
              size={24}
            />
            <p className="text-repod-text-alternative ">Settings</p>
          </div>
        </a>
      </div>
      <div>
        <div className="py-4">
          <ProfileDropdown lightMode={false} />
        </div>
        <div className="h-0 border border-solid border-t-0 border-repod-border-dark" />

        <div className="flex flex-col justify-end items-end p-4">
          <ChevronLeft
            className="stroke-current text-repod-text-secondary"
            size={24}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsoleSideDrawer;
