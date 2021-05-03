import React, { useEffect } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { ConsoleSideDrawer } from "components/Navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors, fetchClaimedShows } from "modules/Shows";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { AsyncDispatch } from "reduxConfig/redux";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const Dashboard = () => {
  const router = useRouter();
  const { showId } = router.query;
  const show = useSelector(showsSelectors.getShowById(showId));
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();

  useEffect(() => {
    (async () => {
      const claimedShows = await dispatch(fetchClaimedShows());
      console.log("Dashboard claimedShows", claimedShows);

      if (!claimedShows.length || !claimedShows.includes(showId)) {
        router.replace(`/console`);
      }
    })();
  }, []);

  if (!show) {
    return <LoadingScreen />;
  }

  return (
    <>
      <p>settings</p>
    </>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Dashboard);
