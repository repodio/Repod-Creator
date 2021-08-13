import React, { useCallback, useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import {
  selectors as subscriptionsSelectors,
  fetchShowSubscriptionTiers,
  createNewSubscriptionTier,
  deleteBenefit,
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
import { AlertCircle, Trash2 } from "react-feather";
import { TypesRequiringRSSFeed } from "constants/subscriptionBenefitTypes";

const PAGE_COPY = {
  NoRSSMessage: "No RSS Feed",
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
    setSelectedBenefitId(benefitId);
    setIsRemoveBenefitModalOpen(true);
  };

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  return (
    <SubscriptionsLayout>
      <div className="w-full flex flex-col justify-start items-start">
        <h1>{benefits.length} Benefits</h1>
        {map((benefit: SubscriptionBenefitItem) => (
          <div
            key={benefit.benefitId}
            className={`flex flex-row items-center justify-start w-full my-2 py-4 rounded border border-solid  border-repod-border-light`}
          >
            <div className="flex-1 flex-col items-start justify-start mx-2">
              <p className="truncate text-xs font-book text-repod-text-secondary">
                {`Included in ${benefit.tiersCount || 0} other tiers`}
              </p>
              <p className="truncate text-md font-semibold text-repod-text-primary">
                {benefit.title}
              </p>
              {TypesRequiringRSSFeed.includes(benefit.type) ? (
                benefit.rssFeed ? (
                  <p
                    // style={{ width: 300 }}
                    className="w-full truncate text-sm font-book text-repod-text-secondary"
                  >
                    {benefit.rssFeed}
                  </p>
                ) : (
                  <div className="flex flex-row justify-start items-center">
                    <AlertCircle
                      className="stroke-current text-danger"
                      size={18}
                    />
                    <p className="truncate text-sm font-book text-danger ml-1">
                      {PAGE_COPY.NoRSSMessage}
                    </p>
                  </div>
                )
              ) : null}
            </div>
            <button
              className="mr-4 hover:opacity-50 transition focus:outline-none"
              onClick={handleEditBenefit}
            >
              <p className="uppercase cursor-pointer flex text-center no-underline text-xs font-bold text-info">
                Edit
              </p>
            </button>
            <button
              onClick={handleRemoveBenefit}
              className="mr-4 hover:opacity-50 transition focus:outline-none"
            >
              <Trash2
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
                benefitId={selectedBenefitId}
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
