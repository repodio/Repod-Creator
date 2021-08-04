import React from "react";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import NavigationLink from "./partials/navigationLink";

const ROUTE = "tips";

const TipsLayout = ({ children }) => {
  const router = useRouter();
  const { showId } = router.query;

  const splitLink = router.asPath.split("/");
  const viewSubscriptions = splitLink[3] && splitLink[3] === "subscriptions";
  const viewMembers = !viewSubscriptions;
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <>
      <div className="">
        <h1
          className={`mt-4 mb-8 text-xl font-bold text-repod-text-primary font-bold truncate ${
            isMobile ? "ml-4" : "ml-8"
          }`}
        >
          Tips
        </h1>
        <div className={`flex flex-row ${isMobile ? "" : "ml-4"}`}>
          <NavigationLink
            label="Tipping"
            isSelected={viewMembers}
            destination={`/${ROUTE}/${showId}`}
          />
        </div>
        <div className="h-0 border border-solid border-t-0 border-repod-border-light" />
      </div>
      <div className={`pt-6 ${isMobile ? "px-4" : "px-8"}`}>{children}</div>
    </>
  );
};

export default TipsLayout;
