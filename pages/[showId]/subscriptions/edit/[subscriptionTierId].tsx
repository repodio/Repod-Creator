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
  EditTitle: "Tiers",
  EditSubTitle: "Choose what to offer your members",
};

const EditSubscription = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [isConfiguringTiers, setConfiguringTiers] = useState(false);
  const { showId, subscriptionTierId } = router.query;
  const showIdString = showId as string;
  const subscriptionTierIdString = subscriptionTierId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const subscriptionTier = useSelector(
    subscriptionsSelectors.getSubscriptionTier(subscriptionTierIdString)
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

  const updateTier = useCallback(async () => {}, []);

  if (subscriptionTier && subscriptionTier.showId !== showIdString) {
    router.replace(`/${showIdString}/subscriptions`);
  }

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  return (
    <SubscriptionsLayout>
      <div className="flex flex-col">
        <div className="flex flex-col items-center w-full mb-2">
          <p className="text-lg font-bold text-repod-text-primary mb-2">
            {PAGE_COPY.EditTitle}
          </p>
          <p className="text-md font-semibold text-repod-text-secondary">
            {PAGE_COPY.EditSubTitle}
          </p>
        </div>
        <div className="flex flex-col items-center w-full rounded border border-solid border-repod-border-light pt-8 pb-12"></div>
      </div>
    </SubscriptionsLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(EditSubscription);
