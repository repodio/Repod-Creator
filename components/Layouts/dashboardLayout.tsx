import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

const NavigationLink = ({
  destination = "",
  label = "",
  isSelected = false,
}) => (
  <div className="flex flex-col pointer">
    <Link href={destination}>
      <a
        className={`mx-4 py-2 transition text-md font-semibold ${
          isSelected ? "text-repod-text-primary" : "text-repod-text-secondary"
        }`}
      >
        {label}
      </a>
    </Link>
    <div
      className={`h-0 border-solid border-b-2 mx-4 ${
        isSelected ? "border-repod-tint" : "border-repod-canvas"
      }`}
    />
  </div>
);

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const { showId } = router.query;

  const splitLink = router.asPath.split("/");
  const viewFollowers = splitLink[3] && splitLink[3] === "followers";
  const viewEpisodes = splitLink[3] && splitLink[3] === "episodes";
  const viewOverview = !viewFollowers && !viewEpisodes;
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <>
      <div className="">
        <h1
          className={`mt-4 mb-8 text-xl font-bold text-repod-text-primary font-bold truncate ${
            isMobile ? "ml-4" : "ml-8"
          }`}
        >
          Dashboard
        </h1>
        <div className={`flex flex-row ${isMobile ? "" : "ml-4"}`}>
          <NavigationLink
            label="Overview"
            isSelected={viewOverview}
            destination={`/console/${showId}`}
          />
          <NavigationLink
            label="Followers"
            isSelected={viewFollowers}
            destination={`/console/${showId}/followers`}
          />
          {/* <NavigationLink
            label="Episodes"
            isSelected={viewEpisodes}
            destination={`/console/${showId}/episodes`}
          /> */}
        </div>
        <div className="h-0 border border-solid border-t-0 border-repod-border-light" />
      </div>
      <div className={`pt-6 ${isMobile ? "px-4" : "px-8"}`}>{children}</div>
    </>
  );
};

export default DashboardLayout;
