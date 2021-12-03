import React, { useCallback, useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import {
  selectors as subscriptionsSelectors,
  fetchShowSubscriptionTiers,
  createNewSubscriptionTier,
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
import LoaderComponent, { LOADER_COLORS } from "components/Loading/loader";

const PAGE_COPY = {
  StripeConnectMessage:
    "To enable listeners to subscribe through Repod we must first connect to your Stripe Account. We use Stripe to safely and securely get you your money, setting up an account is quick and easy. Start by pressing the button below.",
  PlaceholderTitle:
    "Start by customizing the subscription tiers you want to offer",
  PlaceholderSubTitle:
    "We'll start you off with the following tier but you get to customize however you'd like",
  OverviewTitle: "Tiers",
  OverviewSubTitle: "Choose what to offer your members",
};

const TiersPlaceholder = ({ isMobile, onPress }) => (
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
        benefitTitleOne="Private Discussions"
        benefitTitleTwo="Bonus Episodes"
        artwork="/tier-placeholder1.png"
      />
    </div>
    <div className="flex flex-col items-center w-full">
      <Button.Medium
        className="bg-info text-repod-text-alternative"
        style={isMobile ? {} : { minWidth: 300, maxWidth: 300, width: 300 }}
        onClick={onPress}
      >
        Customize
      </Button.Medium>
    </div>
  </div>
);

const SubscriptionTiers = ({
  subscriptionTiers = [],
  createNewTier,
  isMobile,
}: {
  subscriptionTiers: SubscriptionTierItem[];
  createNewTier: () => void;
  isMobile: boolean;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center w-full mb-8">
        <p className="text-xl font-bold text-repod-text-primary text-center">
          {PAGE_COPY.OverviewTitle}
        </p>
        <p className="text-md font-semibold text-repod-text-secondary text-center">
          {PAGE_COPY.OverviewSubTitle}
        </p>
      </div>
      <div
        className={
          isMobile
            ? "flex flex-col items-center w-full pb-12"
            : "flex flex-col items-center w-full rounded border border-solid border-repod-border-light pt-8 pb-12"
        }
      >
        <div className="flex flex-wrap items-start justify-center w-full ">
          {subscriptionTiers.map((tier) => (
            <SubscriptionTierSnippit
              key={tier.subscriptionTierId}
              subscriptionTier={tier}
            />
          ))}
        </div>
        {subscriptionTiers && subscriptionTiers.length ? (
          <button onClick={createNewTier}>
            <div
              className="flex flex-col items-center justify-center w-full rounded bg-bg-info cursor-pointer hover:opacity-50 transition py-4"
              style={{ maxWidth: 260, minWidth: 260 }}
            >
              <p className="text-md font-semibold text-info">+ Add Tier</p>
            </div>
          </button>
        ) : (
          <LoaderComponent color={LOADER_COLORS.dark} />
        )}
      </div>
    </div>
  );
};

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
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }

      await dispatch(fetchShowSubscriptionTiers(showIdString));

      setTimeout(
        () => dispatch(fetchShowSubscriptionTiers(showIdString)),
        3000
      );

      setPageLoading(false);
    })();
  }, []);

  const configureTiers = useCallback(async () => {
    dispatch(createDefaultBenefitAndTier({ showId: showIdString }));
    setConfiguringTiers(true);
  }, []);

  const createNewTier = useCallback(async () => {
    setPageLoading(true);
    const subscriptionTierId = await dispatch(
      createNewSubscriptionTier({ showId: showIdString })
    );

    router.replace(`/${showId}/subscriptions/edit/${subscriptionTierId}`);
  }, []);

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  const stripeAccountId = show.claimedShow && show.claimedShow.stripeAccountId;

  return (
    <SubscriptionsLayout>
      {stripeAccountId ? (
        isConfiguringTiers ||
        (subscriptionTiers && subscriptionTiers.length) ? (
          <SubscriptionTiers
            isMobile={isMobile}
            subscriptionTiers={subscriptionTiers}
            createNewTier={createNewTier}
          />
        ) : (
          <TiersPlaceholder isMobile={isMobile} onPress={configureTiers} />
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
