import React, { useEffect } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors, fetchClaimedShows } from "modules/Shows";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import Link from "next/link";
import {
  ConsoleOverview,
  ConsoleFollowers,
  ConsoleEpisodes,
} from "components/Console";

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

const Dashboard = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const route = router.pathname.replace("/console/[showId]", "");

  useEffect(() => {
    (async () => {
      const claimedShows = await dispatch(fetchClaimedShows());
      console.log("Dashboard claimedShows", claimedShows);

      if (!claimedShows.length || !claimedShows.includes(showIdString)) {
        router.replace(`/console`);
      }
    })();
  }, []);

  if (!show) {
    return <LoadingScreen />;
  }
  console.log("route", router);
  const splitLink = router.asPath.split("#");
  const viewFollowers = splitLink[1] && splitLink[1] === "followers";
  const viewEpisodes = splitLink[1] && splitLink[1] === "episodes";
  const viewOverview = !viewFollowers && !viewEpisodes;
  return (
    <>
      <div className="">
        <h1 className="mt-4 mb-8 ml-8 text-xl font-bold text-repod-text-primary font-bold truncate">
          Dashboard
        </h1>
        <div className="flex flex-row ml-4">
          <NavigationLink
            label="Overview"
            isSelected={viewOverview}
            destination={`/console/${showId}`}
          />
          <NavigationLink
            label="Followers"
            isSelected={viewFollowers}
            destination={`/console/${showId}#followers`}
          />
          <NavigationLink
            label="Episodes"
            isSelected={viewEpisodes}
            destination={`/console/${showId}#episodes`}
          />
        </div>
        <div className="h-0 border border-solid border-t-0 border-repod-border-light" />
      </div>
      <div className="pt-6 px-8">
        {viewOverview ? <ConsoleOverview /> : null}
        {viewFollowers ? <ConsoleFollowers /> : null}
        {viewEpisodes ? <ConsoleEpisodes /> : null}
      </div>
    </>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Dashboard);
