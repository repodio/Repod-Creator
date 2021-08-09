import React, { useCallback, useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import {
  selectors as subscriptionsSelectors,
  fetchShowSubscriptionTiers,
} from "modules/Subscriptions";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { SubscriptionsLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";
import StripeConnect from "components/StripeConnect";
import { Button } from "components/Buttons";
import { createDefaultBenefitAndTier } from "modules/Subscriptions";
import {
  SubscriptionTierPlaceholder,
  SubscriptionTierSnippit,
} from "components/SubscriptionComponents";
import Link from "next/link";

const PAGE_COPY = {
  StripeConnectMessage:
    "To enable listeners to subscribe through Repod we must first connect to your Stripe Account. We use Stripe to safely and securely get you your money, setting up an account is quick and easy. Start by pressing the button below.",
  PlaceholderTitle:
    "Start by customizing the subscription tiers you want to offer",
  PlaceholderSubTitle:
    "We’ll start you off with the following tiers but you get to customize everything how you like",
  OverviewTitle: "Tiers",
  OverviewSubTitle: "Choose what to offer your members",
};

const TiersPlaceholder = ({ onPress }) => (
  <div className="flex flex-col">
    <div className="flex flex-col items-center w-full mb-8">
      <p className="text-xl font-bold text-repod-text-primary">
        {PAGE_COPY.PlaceholderTitle}
      </p>
      <p className="text-base font-semibold text-repod-text-primary">
        {PAGE_COPY.PlaceholderSubTitle}
      </p>
    </div>
    <div className="flex flex-row justify-center items-center w-full mb-12">
      <SubscriptionTierPlaceholder
        title="Member pays $5 per month"
        sutitle="Includes"
        benefitTitle="Private Discussions"
        artwork="/tier-placeholder1.png"
      />
      <SubscriptionTierPlaceholder
        title="Member pays $10 per month"
        sutitle="All Previous Tiers, Plus"
        benefitTitle="Early Access to Episodes"
        artwork="/tier-placeholder1.png"
      />
      <SubscriptionTierPlaceholder
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

const SubscriptionTiers = ({
  subscriptionTiers = [],
}: {
  subscriptionTiers: SubscriptionTierItem[];
}) => (
  <div className="flex flex-col">
    <div className="flex flex-col items-center w-full mb-8">
      <p className="text-lg font-bold text-repod-text-primary">
        {PAGE_COPY.OverviewTitle}
      </p>
      <p className="text-md font-semibold text-repod-text-secondary">
        {PAGE_COPY.OverviewSubTitle}
      </p>
    </div>
    <div className="flex flex-col items-center w-full rounded border border-solid border-repod-border-light pt-8 pb-12">
      {subscriptionTiers.map((tier) => (
        <SubscriptionTierSnippit
          key={tier.subscriptionTierId}
          subscriptionTier={tier}
        />
      ))}

      <div
        className="flex flex-col items-center justify-center w-full rounded bg-badge-info cursor-pointer hover:opacity-50 transition py-4"
        style={{ maxWidth: 260 }}
      >
        <Link href={`/subscriptions/new/edit`}>
          <a className="text-md font-semibold text-info">+ Add Tier</a>
        </Link>
      </div>
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
  const subscriptionTiers = useSelector(
    subscriptionsSelectors.getSubscriptionTiers(showIdString)
  );
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }

      await dispatch(fetchShowSubscriptionTiers(showIdString));

      setPageLoading(false);
    })();
  }, []);

  const configureTiers = useCallback(async () => {
    dispatch(createDefaultBenefitAndTier({ showId: showIdString }));
    setConfiguringTiers(true);
  }, []);

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  const stripeAccountId = show.claimedShow && show.claimedShow.stripeAccountId;

  console.log("subscriptionTiers", subscriptionTiers);

  return (
    <SubscriptionsLayout>
      {stripeAccountId ? (
        isConfiguringTiers ||
        (subscriptionTiers && subscriptionTiers.length) ? (
          <SubscriptionTiers subscriptionTiers={subscriptionTiers} />
        ) : (
          <TiersPlaceholder onPress={configureTiers} />
        )
      ) : (
        <StripeConnect message={PAGE_COPY.StripeConnectMessage} />
      )}
    </SubscriptionsLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Subscriptions);