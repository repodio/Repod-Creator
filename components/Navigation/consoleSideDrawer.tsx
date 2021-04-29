import React from "react";
import Link from "next/link";
import { BarChart2, Settings, ChevronLeft } from "react-feather";
import { ProfileDropdown } from "components/Dropdown";
import { ShowSelector } from "components/Navigation";

const ConsoleSideDrawer = ({ show }: { show: ShowItem }) => {
  return (
    <div style={{ minWidth: 340 }} className="bg-repod-canvas-dark h-full">
      <ShowSelector show={show} />
      <div className="w-full flex flex-col">
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
      <ProfileDropdown lightMode={false} />
      <div>
        <ChevronLeft
          className="stroke-current text-repod-text-alternative"
          size={24}
        />
      </div>
    </div>
  );
};

export default ConsoleSideDrawer;
