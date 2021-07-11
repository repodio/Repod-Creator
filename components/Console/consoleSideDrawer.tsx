import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Users,
  DollarSign,
} from "react-feather";
import { ProfileDropdown } from "components/Dropdown";
import { ShowSelector } from "components/Console";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import { useMediaQuery } from "react-responsive";

const NavigationLink = ({
  destination = "",
  IconComponent,
  label = "",
  isSelected = false,
  expanded,
}) => (
  <Link href={destination}>
    <a
      className={`rounded-md mx-4 my-2 transition ${
        isSelected && expanded ? "bg-white-100" : "bg-repod-canvas-dark"
      }  hover:bg-white-100`}
    >
      {expanded ? (
        <div className="w-full p-3 flex flex-row">
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
      ) : (
        <div className="w-full m-3 flex flex-row">
          <IconComponent
            className={`mr-2 stroke-current transition ${
              isSelected ? "text-repod-tint" : "text-repod-text-alternative"
            }`}
            size={24}
          />
        </div>
      )}
    </a>
  </Link>
);

const ConsoleSideDrawer = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [expanded, setExpanded] = useState(isMobile ? false : true);
  const router = useRouter();
  const { showId } = router.query;
  const show = useSelector(showsSelectors.getShowById(showId));

  const route = router.pathname.replace("/console/[showId]", "");

  const width = expanded ? 340 : 80;
  const openMenu = () => {
    setExpanded(true);
  };
  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      style={{ minWidth: width, width }}
      className="bg-repod-canvas-dark h-full flex flex-col"
    >
      <div className="my-4">
        <ShowSelector show={show} expanded={expanded} openMenu={openMenu} />
      </div>
      <div className="h-0 border border-solid border-t-0 border-repod-border-dark" />
      <div className="w-full flex flex-col mt-12 flex-1">
        <NavigationLink
          isSelected={router.pathname.startsWith("/console")}
          destination={`/console/${router.query.showId}/`}
          label="Dashboard"
          IconComponent={BarChart2}
          expanded={expanded}
        />
        <NavigationLink
          isSelected={router.pathname.startsWith("/monetization")}
          destination={`/monetization/${router.query.showId}/`}
          label="Monetization"
          IconComponent={DollarSign}
          expanded={expanded}
        />
        {/* <NavigationLink
          isSelected={router.pathname.startsWith("/team")}
          destination={`/team/${router.query.showId}`}
          label="Team"
          IconComponent={Users}
          expanded={expanded}
        /> */}
      </div>
      <div>
        <div className="py-4">
          <ProfileDropdown
            lightMode={false}
            expanded={expanded}
            openMenu={openMenu}
          />
        </div>
        <div className="h-0 border border-solid border-t-0 border-repod-border-dark" />

        <div
          onClick={toggleMenu}
          className="flex flex-col justify-end items-end p-4 cursor-pointer hover:opacity-50 transition"
        >
          {expanded ? (
            <ChevronLeft
              className={`stroke-current text-repod-text-secondary`}
              size={24}
            />
          ) : (
            <ChevronRight
              className={`stroke-current text-repod-text-secondary`}
              size={24}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsoleSideDrawer;
