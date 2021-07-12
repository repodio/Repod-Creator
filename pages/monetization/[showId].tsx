import React, { useCallback, useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import {
  selectors as showsSelectors,
  updateStripeAccountIdOnShow,
} from "modules/Shows";
import { selectors as authSelectors } from "modules/Auth";
import { useRouter } from "next/router";
import { Loader, LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import * as Badge from "components/Badge";
import { Button } from "components/Buttons";
import { MonetizationLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";
import {
  fetchConnectedAccountOnboardingUrl,
  removeStripeAccountIdOnShow,
} from "utils/repodAPI";
import Link from "next/link";
import { ArrowUpRight } from "react-feather";

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

    if (window) {
      window.location.href = onboardingURL;
    }
    setConnectButtonLoading(false);
  }, [showIdString]);

  const removeConnectAccount = useCallback(async () => {
    await removeStripeAccountIdOnShow({
      showId: showIdString,
    });

    dispatch(
      updateStripeAccountIdOnShow({
        showId: showIdString,
        stripeAccountId: null,
      })
    );
  }, [showIdString]);

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  const stripeAccountId = show.claimedShow && show.claimedShow.stripeAccountId;
  console.log("stripeAccountId", stripeAccountId);

  return (
    <MonetizationLayout>
      {stripeAccountId ? (
        <div className="flex flex-col">
          <div className="flex flex-row items-center  mb-2">
            <p className="text-lg font-bold text-repod-text-primary mr-2">
              Connected Account
            </p>
            <Badge.Info label="Enabled" />
          </div>
          <p className="text-md font-book text-repod-text-secondary mb-8">
            Tipping is enabled for this show! You can change or remove this
            Stripe Account at anytime.
          </p>
          <div className="flex flex-row mb-8 items-center">
            <Link
              href={`https://dashboard.stripe.com/test/connect/accounts/${stripeAccountId}`}
            >
              <a className="flex flex-row items-center text-xl font-bold text-repod-text-primary mr-8 hover:opacity-50 transition underline">
                {stripeAccountId}

                <ArrowUpRight
                  className={`stroke-current text-repod-text-primary`}
                  size={24}
                />
              </a>
            </Link>
            <div className={`flex flex-col justify-center`}>
              <a
                className="cursor-pointer flex w-full text-center no-underline text-sm font-bold text-danger hover:opacity-50 transition mt-2"
                onClick={removeConnectAccount}
              >
                Remove
              </a>
            </div>
          </div>
        </div>
      ) : (
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
            get you your money, setting up an account is quick and easy. Start
            by pressing the button below.
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
      )}
    </MonetizationLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Monetization);
