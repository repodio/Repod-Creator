import React from "react";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import NavigationLink from "./partials/navigationLink";

type TopTabsLayoutProps = {
  title: string;
  routes: {
    label: string;
    url: string;
  }[];
  children: JSX.Element;
};

const TopTabsLayout = ({
  title,
  routes = [],
  children,
}: TopTabsLayoutProps) => {
  const router = useRouter();
  const asPathMinusParams = router.asPath.split("?")[0];
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <>
      <div className="">
        <h1
          className={`mt-4 mb-8 text-xl font-bold text-repod-text-primary font-bold truncate ${
            isMobile ? "ml-4" : "ml-8"
          }`}
        >
          {title}
        </h1>
        <div className={`flex flex-row ${isMobile ? "" : "ml-4"}`}>
          {routes.map((route) => (
            <NavigationLink
              label={route.label}
              isSelected={asPathMinusParams === route.url}
              destination={route.url}
            />
          ))}
        </div>
        <div className="h-0 border border-solid border-t-0 border-repod-border-light" />
      </div>
      <div className={`pt-6 ${isMobile ? "px-4" : "px-8"}`}>{children}</div>
    </>
  );
};

export default TopTabsLayout;
