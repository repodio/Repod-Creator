import React, { useCallback, useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import {
  selectors as showsSelectors,
  updateStripeAccountIdOnShow,
  fetchClaimShowMonetizeStats,
  createDefaultSubscriptionTiers,
} from "modules/Shows";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import * as Badge from "components/Badge";
import { SubscriptionsLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";
import {
  fetchConnectedAccountOnboardingUrl,
  removeStripeAccountIdOnShow,
} from "utils/repodAPI";
import Link from "next/link";
import { ArrowUpRight } from "react-feather";
import { formatCurrency } from "utils/formats";
import { TipsTable } from "components/Table";
import StripeConnect from "components/StripeConnect";
import { Button } from "components/Buttons";

const TierPlaceholder = ({
  title,
  sutitle,
  benefitTitle,
  artwork,
}: {
  title: string;
  sutitle: string;
  benefitTitle: string;
  artwork: string;
}) => (
  <div className="flex flex-col justify-start items-start rounded border border-solid border-repod-border-light p-4 pb-8 mx-4">
    <img
      style={{ width: 225, height: 71 }}
      className="mb-4"
      src={artwork}
      alt={title}
    />
    <p className="text-base font-semibold text-repod-text-primary">{title}</p>
    <p className="text-xs font-semibold text-repod-text-secondary uppercase mb-4">
      {sutitle}
    </p>
    <div className="py-1 px-2 rounded bg-repod-border-light w-full">
      <p className="text-sm font-semibold text-repod-text-primary">
        {benefitTitle}
      </p>
    </div>
  </div>
);

const TiersPlaceholder = ({ onPress }) => (
  <div className="flex flex-col">
    <div className="flex flex-col items-center w-full mb-12">
      <p className="text-xl font-bold text-repod-text-primary mb-2">
        Start by customizing the subscription tiers you want to offer
      </p>
      <p className="text-base font-semibold text-repod-text-primary">
        We’ll start you off with the following tiers but you get to customize
        everything how you like
      </p>
    </div>
    <div className="flex flex-row justify-center items-center w-full mb-12">
      <TierPlaceholder
        title="Member pays $5 per month"
        sutitle="Includes"
        benefitTitle="Private Discussions"
        artwork="/tier-placeholder1.png"
      />
      <TierPlaceholder
        title="Member pays $10 per month"
        sutitle="All Previous Tiers, Plus"
        benefitTitle="Early Access to Episodes"
        artwork="/tier-placeholder1.png"
      />
      <TierPlaceholder
        title="Member pays $20 per month"
        sutitle="All Previous Tiers, Plus"
        benefitTitle="Bonus Episodes"
        artwork="/tier-placeholder1.png"
      />
    </div>
    <div className="flex flex-col items-center w-full">
      <Button.Medium
        className="bg-info text-repod-text-alternative"
        style={{ minWidth: 300, maxWidth: 300, width: 300 }}
        onClick={onPress}
      >
        Customize
      </Button.Medium>
    </div>
  </div>
);

const SubscriptionTiers = () => (
  <div className="flex flex-col">
    <div className="flex flex-col items-center w-full mb-2">
      <p className="text-lg font-bold text-repod-text-primary">Tiers</p>
    </div>
  </div>
);

const Subscriptions = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [isConfiguringTiers, setConfiguringTiers] = useState(false);
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

  const configureTiers = useCallback(() => {
    dispatch(createDefaultSubscriptionTiers(showIdString));
    setConfiguringTiers(true);
  }, []);

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  const stripeAccountId = show.claimedShow && show.claimedShow.stripeAccountId;
  const subscriptionTierIds =
    show.claimedShow && show.claimedShow.subscriptionTierIds;

  return (
    <SubscriptionsLayout>
      {stripeAccountId ? (
        isConfiguringTiers ||
        (subscriptionTierIds && subscriptionTierIds.length) ? (
          <SubscriptionTiers />
        ) : (
          <TiersPlaceholder onPress={configureTiers} />
        )
      ) : (
        <StripeConnect
          message="To enable listeners to subscribe through Repod we must first
          connect to your Stripe Account. We use Stripe to safely and securely
          get you your money, setting up an account is quick and easy. Start
          by pressing the button below."
        />
      )}
    </SubscriptionsLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Subscriptions);
