import React, { useEffect } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useDispatch } from "react-redux";
import { updateStripeAccountIdOnShow } from "modules/Shows";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { notifySuccessfulStripeAccountRedirect } from "utils/repodAPI";

const StripeReturn = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();

  useEffect(() => {
    (async () => {
      const stripeAccountId = await notifySuccessfulStripeAccountRedirect({
        showId: showIdString,
      });

      dispatch(
        updateStripeAccountIdOnShow({ showId: showIdString, stripeAccountId })
      );

      router.replace(`/settings/${showIdString}`);
    })();
  }, []);

  return <LoadingScreen />;
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(StripeReturn);
