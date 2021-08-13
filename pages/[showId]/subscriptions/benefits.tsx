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
import { map } from "lodash/fp";
import { RemoveBenefitModal, TierBenefitsModal } from "components/Modals";
import { Trash2 } from "react-feather";

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

const Subscriptions = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditBenefitModalOpen, setIsEditBenefitModalOpen] = useState(false);
  const [isRemoveBenefitModalOpen, setIsRemoveBenefitModalOpen] =
    useState(false);

  const [selectedBenefitId, setSelectedBenefitId] = useState(null);

  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const benefits = useSelector(
    subscriptionsSelectors.getAllShowBenefits(showIdString)
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

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  useEffect(() => {
    if (!isEditBenefitModalOpen) {
      setSelectedBenefitId(null);
    }
  }, [isEditBenefitModalOpen]);

  const handleEditBenefit = (benefitId) => {
    setSelectedBenefitId(benefitId);
    setIsEditBenefitModalOpen(true);
  };

  const handleRemoveBenefit = (benefitId) => {
    dispatch(
      removeBenefitFromSubscription({
        benefitId,
        subscriptionTierId: subscriptionTierIdString,
      })
    );
  };

  return (
    <SubscriptionsLayout>
      <div className="w-full flex flex-col justify-center items-center">
        <h1>{benefits.length} Benefits</h1>
        {map((benefit: SubscriptionBenefitItem) => (
          <div
            key={benefit.benefitId}
            className={`flex flex-row items-center justify-start w-full my-2 py-4 rounded bg-repod-canvas-secondary ${opacity}`}
          >
            <div className="flex-1 flex-col items-start justify-start mx-2">
              <p className="truncate text-md font-semibold text-repod-text-primary">
                {benefit.title}
              </p>
              <p
                style={{ width: 300 }}
                className="truncate text-sm font-book text-repod-text-secondary"
              >
                {"sublabel"}
              </p>
            </div>
            <button
              className="mr-4 hover:opacity-50 transition focus:outline-none"
              onClick={handleEditBenefit}
            >
              <p className="uppercase cursor-pointer flex text-center no-underline text-xs font-bold text-info">
                Edit
              </p>
            </button>
            <button className="mr-4 hover:opacity-50 transition focus:outline-none">
              <Trash2
                onClick={handleRemoveBenefit}
                className="stroke-current text-repod-text-secondary"
                size={24}
              />
            </button>
          </div>
        ))(benefits)}

        {selectedBenefitId
          ? [
              <TierBenefitsModal
                isModalOpen={isEditBenefitModalOpen}
                setIsModalOpen={setIsEditBenefitModalOpen}
                initialBenefitId={selectedBenefitId}
                initialScreen={TierBenefitsModal.Types.editBenefit}
              />,
              <RemoveBenefitModal
                isModalOpen={isRemoveBenefitModalOpen}
                setIsModalOpen={setIsRemoveBenefitModalOpen}
              />,
            ]
          : null}
      </div>
    </SubscriptionsLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Subscriptions);
