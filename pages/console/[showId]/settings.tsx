import React from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";

const Dashboard = () => {
  const router = useRouter();
  const { showId } = router.query;
  const show = useSelector(showsSelectors.getShowById(showId));

  if (!show) {
    return <LoadingScreen />;
  }

  return <></>;
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Dashboard);
