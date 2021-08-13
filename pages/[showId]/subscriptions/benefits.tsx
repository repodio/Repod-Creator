import React, { useEffect, useState } from "react";
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
import { map } from "lodash/fp";
import { RemoveBenefitModal, TierBenefitsModal } from "components/Modals";
import { AlertCircle, Trash2 } from "react-feather";
import { TypesRequiringRSSFeed } from "constants/subscriptionBenefitTypes";
import { Button } from "components/Buttons";

const PAGE_COPY = {
  NoRSSMessage: "No RSS Feed",
};

const Benefits = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [isBenefitModalOpen, setBenefitModalOpen] = useState(false);
  const [modalScreenMode, setModalScreenMode] = useState(
    TierBenefitsModal.Types.editBenefit
  );
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
  const isMobile = useMediaQuery({ query: "(max-width: 815px)" });

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
    if (!isBenefitModalOpen) {
      setSelectedBenefitId(null);
    }
  }, [isBenefitModalOpen]);

  const handleEditBenefit = (benefitId) => {
    setModalScreenMode(TierBenefitsModal.Types.editBenefit);
    setSelectedBenefitId(benefitId);
    setBenefitModalOpen(true);
  };

  const handleRemoveBenefit = (benefitId) => {
    setSelectedBenefitId(benefitId);
    setIsRemoveBenefitModalOpen(true);
  };

  const handleStartNewBenefit = () => {
    setModalScreenMode(TierBenefitsModal.Types.createBenefit);
    setBenefitModalOpen(true);
  };

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  console.log("isMobile", isMobile);

  return (
    <SubscriptionsLayout>
      <div className="w-full flex flex-col justify-start items-start pb-8">
        <h1>{benefits.length} Benefits</h1>
        <Button.Small
          className="bg-bg-info text-info my-2"
          style={{ minWidth: 130, maxWidth: 130, width: 130 }}
          onClick={() => handleStartNewBenefit()}
        >
          + New Benefit
        </Button.Small>
        {map((benefit: SubscriptionBenefitItem) => (
          <div
            key={benefit.benefitId}
            className={
              isMobile
                ? `flex flex-col items-start justify-center w-full my-2 py-4 rounded border border-solid  border-repod-border-light`
                : `flex flex-row items-center justify-start w-full my-2 py-4 rounded border border-solid  border-repod-border-light`
            }
          >
            <div className="flex-1 flex-col items-start justify-start mx-4">
              <p className="truncate text-xs font-book text-repod-text-secondary">
                {`Included in ${benefit.tiersCount || 0} other tiers`}
              </p>
              <p className="truncate text-md font-semibold text-repod-text-primary">
                {benefit.title}
              </p>
              {TypesRequiringRSSFeed.includes(benefit.type) ? (
                benefit.rssFeed ? (
                  !isMobile ? (
                    <p
                      style={{ width: 300 }}
                      className="w-full truncate text-sm font-book text-repod-text-secondary"
                    >
                      {benefit.rssFeed}
                    </p>
                  ) : null
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
            <div
              className={
                isMobile
                  ? "flex flex-row px-4 mt-2 w-full justify-between"
                  : "flex flex-row"
              }
            >
              <button
                className="mr-4 hover:opacity-50 transition focus:outline-none"
                onClick={() => handleEditBenefit(benefit.benefitId)}
              >
                <p className="uppercase cursor-pointer flex text-center no-underline text-xs font-bold text-info">
                  Edit
                </p>
              </button>
              <button
                onClick={() => handleRemoveBenefit(benefit.benefitId)}
                className="mr-4 hover:opacity-50 transition focus:outline-none"
              >
                <Trash2
                  className="stroke-current text-repod-text-secondary"
                  size={24}
                />
              </button>
            </div>
          </div>
        ))(benefits)}

        {isBenefitModalOpen ? (
          <TierBenefitsModal
            isModalOpen={isBenefitModalOpen}
            setIsModalOpen={setBenefitModalOpen}
            initialBenefitId={selectedBenefitId}
            initialScreen={modalScreenMode}
          />
        ) : null}

        {isRemoveBenefitModalOpen ? (
          <RemoveBenefitModal
            benefitId={selectedBenefitId}
            isModalOpen={isRemoveBenefitModalOpen}
            setIsModalOpen={setIsRemoveBenefitModalOpen}
          />
        ) : null}
      </div>
    </SubscriptionsLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Benefits);
