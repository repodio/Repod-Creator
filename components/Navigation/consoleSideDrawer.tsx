import React from "react";
import Link from "next/link";
import { BarChart2, Settings, ChevronLeft } from "react-feather";
import { ProfileDropdown } from "components/Dropdown";
import { ShowSelector } from "components/Navigation";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";

const ConsoleSideDrawer = () => {
  const router = useRouter();
  console.log("router", router.query);
  const { showId } = router.query;
  const show = useSelector(showsSelectors.getShowById(showId));

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
        <Link href={`/console/${router.query.showId}/`}>
          <a className="rounded-md mx-4 my-2 bg-repod-canvas-dark hover:bg-white-100">
            <div className="w-full p-4 flex flex-row">
              <BarChart2
                className="mr-2 stroke-current text-repod-text-alternative "
                size={24}
              />
              <p className="text-repod-text-alternative ">Dashboard</p>
            </div>
          </a>
        </Link>
        <Link href={`/console/${router.query.showId}/settings`}>
          <a className="rounded-md mx-4 my-2  bg-repod-canvas-dark hover:bg-white-100">
            <div className="w-full p-4 flex flex-row">
              <Settings
                className="mr-2 stroke-current text-repod-text-alternative "
                size={24}
              />
              <p className="text-repod-text-alternative ">Settings</p>
            </div>
          </a>
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
