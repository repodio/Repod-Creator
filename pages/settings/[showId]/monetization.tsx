import React, { useCallback, useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import {
  selectors as showsSelectors,
  updateStripeAccountIdOnShow,
  fetchClaimShowMonetizeStats,
} from "modules/Shows";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import * as Badge from "components/Badge";
import { SettingsLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";
import { removeStripeAccountIdOnShow } from "utils/repodAPI";
import Link from "next/link";
import { ArrowUpRight } from "react-feather";
import StripeConnect from "components/StripeConnect";

const Settings = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }
      const updatedClaimedShow = await dispatch(
        fetchClaimShowMonetizeStats(showIdString)
      );

      const updatedStripeAccountId =
        updatedClaimedShow && updatedClaimedShow.stripeAccountId;

      if (!updatedStripeAccountId) {
        await new Promise((resolve) => {
          setTimeout(async () => {
            await dispatch(fetchClaimShowMonetizeStats(showIdString));
            resolve(0);
          }, 2000);
        });
      }
      setPageLoading(false);
    })();
  }, []);

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

  return (
    <SettingsLayout>
      {stripeAccountId ? (
        <div className="flex flex-col">
          <div className="flex flex-row items-center  mb-2">
            <p className="text-lg font-bold text-repod-text-primary mr-2">
              Connected Account
            </p>
            <Badge.Info label="Enabled" />
          </div>
          <p
            className={`font-book text-repod-text-secondary mb-8 ${
              isMobile ? "text-sm" : "text-md"
            }`}
          >
            Tipping and Subscribing are both now eligible to be enabled
          </p>
          <div
            className={`flex mb-8 ${
              isMobile ? "flex-col items-start" : "flex-row items-center"
            }`}
          >
            <Link
              href={`https://dashboard.stripe.com/test/connect/accounts/${stripeAccountId}`}
            >
              <a className="flex flex-row items-center text-xl font-bold text-repod-text-primary mr-4 hover:opacity-50 transition underline">
                {stripeAccountId}

                <ArrowUpRight
                  className={`stroke-current text-repod-text-primary`}
                  size={24}
                />
              </a>
            </Link>
            <div className={`flex flex-col justify-center mr-4`}>
              <Link
                href={`https://dashboard.stripe.com/test/connect/accounts/${stripeAccountId}`}
              >
                <a className="cursor-pointer flex w-full text-center no-underline text-sm font-bold text-repod-text-secondary hover:opacity-50 transition mt-2">
                  View on Stripe
                </a>
              </Link>
            </div>
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
        <StripeConnect />
      )}
    </SettingsLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Settings);
