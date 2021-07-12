import React, { useCallback, useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import { selectors as authSelectors } from "modules/Auth";
import { useRouter } from "next/router";
import { Loader, LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import * as Badge from "components/Badge";
import { Button } from "components/Buttons";
import { MonetizationLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";
import { fetchConnectedAccountOnboardingUrl } from "utils/repodAPI";

// import {
//   selectors as profileSelectors,
//   fetchConnectedAccounts,
// } from "modules/Profile";

const Monetization = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [connectButtonLoading, setConnectButtonLoading] = useState(false);
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const authProfile = useSelector(authSelectors.getAuthedProfile);
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }
      // await dispatch(fetchConnectedAccounts(showIdString));
      setPageLoading(false);
    })();
  }, []);

  const handleConnectAccount = useCallback(async () => {
    setConnectButtonLoading(true);
    const onboardingURL = await fetchConnectedAccountOnboardingUrl({
      showId: showIdString,
    });

    console.log("handleConnectAccount onboardingURL", onboardingURL);

    if (window) {
      window.location = onboardingURL;
    }
    setConnectButtonLoading(false);
  }, [showIdString]);

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  console.log("show.claimedShow", show.claimedShow);

  return (
    <MonetizationLayout>
      <div className="flex flex-col">
        <div className="flex flex-row items-center  mb-2">
          <p className="text-lg font-bold text-repod-text-primary mr-2">
            Connected Account
          </p>
          <Badge.Disabled label="Not Connected" />
        </div>
        <p className="text-md font-book text-repod-text-secondary mb-8">
          To enable listeners to send you tips through Repod we must first
          connect to your Stripe Account. We use Stripe to safely and securely
          get you your money, setting up an account is quick and easy. Start by
          pressing the button below.
        </p>
        <Button.Medium
          disabled={connectButtonLoading}
          className="bg-info text-repod-text-alternative"
          style={{ minWidth: 300, maxWidth: 300, width: 300 }}
          onClick={handleConnectAccount}
        >
          {connectButtonLoading ? "Loading..." : "Connect Stripe Account"}
        </Button.Medium>
      </div>
    </MonetizationLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Monetization);
