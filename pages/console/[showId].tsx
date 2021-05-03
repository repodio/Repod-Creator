import React, { useEffect } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors, fetchClaimedShows } from "modules/Shows";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import Link from "next/link";

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
  return (
    <>
      <div className="">
        <h1 className="my-4 ml-8 text-xl font-bold text-repod-text-primary font-bold truncate">
          Dashboard
        </h1>
        <div className="flex flex-row ml-4">
          <NavigationLink label="Overview" isSelected={true} destination={""} />
          <NavigationLink
            label="Followers"
            isSelected={false}
            destination={"#followers"}
          />
          <NavigationLink
            label="Episodes"
            isSelected={false}
            destination={"#episodes"}
          />
        </div>
        <div className="h-0 border border-solid border-t-0 border-repod-border-light" />
      </div>
      <p>showIdString {showIdString}.</p>
      <p>shows {JSON.stringify(show)}.</p>
    </>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Dashboard);
