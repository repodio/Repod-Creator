import React from "react";
import Link from "next/link";
import { BarChart2, Settings, ChevronLeft } from "react-feather";
import { ProfileDropdown } from "components/Dropdown";
import { ShowSelector } from "components/Navigation";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";

const NavigationLink = ({
  destination = "",
  IconComponent,
  label = "",
  isSelected = false,
}) => (
  <Link href={destination}>
    <a
      className={`rounded-md mx-4 my-2 transition ${
        isSelected ? "bg-white-100" : "bg-repod-canvas-dark"
      }  hover:bg-white-100`}
    >
      <div className="w-full p-4 flex flex-row">
        <IconComponent
          className={`mr-2 stroke-current transition ${
            isSelected ? "text-repod-tint" : "text-repod-text-alternative"
          }`}
          size={24}
        />
        <p
          className={`transition ${
            isSelected ? "text-repod-tint" : "text-repod-text-alternative"
          }`}
        >
          {label}
        </p>
      </div>
    </a>
  </Link>
);

const ConsoleSideDrawer = () => {
  const router = useRouter();
  const { showId } = router.query;
  const show = useSelector(showsSelectors.getShowById(showId));

  const route = router.pathname.replace("/console/[showId]", "");

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
        <NavigationLink
          isSelected={route === ""}
          destination={`/console/${router.query.showId}/`}
          label="Dashboard"
          IconComponent={BarChart2}
        />
        <NavigationLink
          isSelected={route === "/settings"}
          destination={`/console/${router.query.showId}/settings`}
          label="Settings"
          IconComponent={Settings}
        />
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
