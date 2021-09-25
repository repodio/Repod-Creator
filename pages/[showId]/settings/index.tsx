import React, { useEffect } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { login } from "modules/Auth";
import { fetchClaimedShows, selectors as showsSelectors } from "modules/Shows";
import { selectors as authSelectors } from "modules/Auth";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";

const Settings = () => {
  const router = useRouter();
  const { showId } = router.query;

  useEffect(() => {
    router.replace(`/${showId}/settings/monetization`);
  }, []);

  return <LoadingScreen />;
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Settings);
