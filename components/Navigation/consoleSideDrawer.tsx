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
      <div className="my-8">
        <ShowSelector show={show} />
      </div>
      <div className="h-0 border border-solid border-t-0 border-repod-border-dark" />
      <div className="w-full flex flex-col mt-12 flex-1">
        <Link href="#dashboard">
          <div className="rounded-md p-2 w-full m-4 flex flex-row cursor hover:bg-white-200">
            <BarChart2
              className="mr-2 stroke-current text-repod-text-alternative "
              size={24}
            />
            <a className="text-repod-text-alternative ">Dashboard</a>
          </div>
        </Link>
        <Link href="#settings">
          <div className="rounded-md p-2 w-full m-4 flex flex-row cursor hover:bg-white-200">
            <Settings
              className="mr-2 stroke-current text-repod-text-alternative "
              size={24}
            />
            <a className="text-repod-text-alternative ">Settings</a>
          </div>
        </Link>
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
