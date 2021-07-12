import React, { useEffect } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useDispatch } from "react-redux";
import { updateStripeAccountIdOnShow } from "modules/Shows";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { notifySuccessfulStripeAccountRedirect } from "utils/repodAPI";
// import {
//   selectors as profileSelectors,
//   fetchConnectedAccounts,
// } from "modules/Profile";

const StripeReturn = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();

  console.log("StripeReturn render");

  useEffect(() => {
    (async () => {
      console.log("StripeReturn useEffect 1", showIdString);

      const stripeAccountId = await notifySuccessfulStripeAccountRedirect({
        showId: showIdString,
      });
      console.log("StripeReturn useEffect 2", stripeAccountId);

      dispatch(
        updateStripeAccountIdOnShow({ showId: showIdString, stripeAccountId })
      );
      console.log("StripeReturn useEffect 3");

      router.replace(`/monetization/${showIdString}`);
    })();
  }, []);

  return <LoadingScreen />;
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(StripeReturn);
