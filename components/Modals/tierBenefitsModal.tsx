import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Modal from "./BaseModal";
import { selectors as subscriptionsSelectors } from "modules/Subscriptions";
import { map } from "lodash/fp";
import { useEffect, useMemo, useState } from "react";
import { ListItem } from "components/Forms";
import { ArrowRight } from "react-feather";
import SubscriptionBenefits from "constants/subscriptionBenefitTypes";
import { Button } from "components/Buttons";

const SubscriptionBenefitCopy = {
  [SubscriptionBenefits.custom]: {
    type: SubscriptionBenefits.custom,
    title: "Custom Benefit",
    description:
      "You can edit everything about this benefit to provice a unique reward for your members",
  },
  [SubscriptionBenefits.adFreeEpisodes]: {
    type: SubscriptionBenefits.adFreeEpisodes,
    title: "Ad-free Episodes",
    description: "Provide ad-free versions of your work",
  },
  [SubscriptionBenefits.bonusEpisodes]: {
    type: SubscriptionBenefits.bonusEpisodes,
    title: "Bonus Episodes",
    description:
      "Provide any extra episodes whether it’s behind the scenes, bloopers, or bonus content",
  },
  [SubscriptionBenefits.digitalDownloads]: {
    type: SubscriptionBenefits.digitalDownloads,
    title: "Digital Downloads",
    description: "Send your members something special",
  },
  [SubscriptionBenefits.earlyAccessEpisodes]: {
    type: SubscriptionBenefits.earlyAccessEpisodes,
    title: "Early Access Episodes",
    description: "Give your members early episodes of your content",
  },
  [SubscriptionBenefits.privateDiscussions]: {
    type: SubscriptionBenefits.privateDiscussions,
    title: "Private Discussion Room",
    description: "Enable a special feed on your show that is members only",
  },
};

const MODAL_COPY = {
  EditLabel: "Title",
  RequiredSubLabel: "Required",
  EditTitlePlaceholder: "Early Access to Episodes",
  CategoryLabel: "Category",
  RSSLabel: "RSS Feed",
  RSSPlaceholder: "https://feeds.com/myfeed",
  CreateDescription:
    "Choose from our list of top benefits for your tier. If you can’t find exactly what you’re looking for then you can make a custom one",
};

type TierBenefitsModalProps = {
  addedBenefits: SubscriptionBenefitItem[];
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
  initialScreen: string;
};

const TierBenefitsModal = ({
  addedBenefits,
  isModalOpen,
  setIsModalOpen,
  initialScreen = TierBenefitsModal.Types.tierBenefits,
}: TierBenefitsModalProps) => {
  const [screenMode, setScreenMode] = useState(initialScreen);
  const router = useRouter();
  const { showId } = router.query;
  const allBenefits = useSelector(
    subscriptionsSelectors.getAllShowBenefits(showId)
  );
  useEffect(() => {
    if (!isModalOpen) {
      setScreenMode(initialScreen);
    }
  }, [isModalOpen]);

  const addedBenefitIds = useMemo(
    () =>
      map((benefit: SubscriptionBenefitItem) => benefit.benefitId)(
        addedBenefits
      ),
    [addedBenefits]
  );

  const navigateToCreateNewBenefit = () => {
    setScreenMode(TierBenefitsModal.Types.createBenefit);
  };

  const navigateToEditBenefit = () => {
    setScreenMode(TierBenefitsModal.Types.editBenefit);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const selectOptions = useMemo(
    () =>
      map((key: string) => ({
        label: SubscriptionBenefitCopy[key].title,
        key,
      }))(Object.keys(SubscriptionBenefitCopy)),
    [SubscriptionBenefitCopy]
  );

  const modalTitle = ModalTitleCopy[screenMode];

  return (
    <Modal
      title={modalTitle}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    >
      {screenMode === TierBenefitsModal.Types.tierBenefits ? (
        <>
          {map((benefit: SubscriptionBenefitItem) => (
            <ListItem.AddBenefit
              label={benefit.title}
              subLabel={`Included in ${benefit.tiersCount || 0} other tiers`}
              value={addedBenefitIds.includes(benefit.benefitId)}
            />
          ))(allBenefits)}
          <div className="w-full h-0 my-2 border border-solid border-t-0 border-repod-border-light mb-8" />
          <button
            className="w-full flex flex-row justify-between items-center hover:opacity-50 focus:outline-none"
            onClick={navigateToCreateNewBenefit}
          >
            <p className="text-md font-book text-repod-text-primary">
              Create new Benefit
            </p>
            <ArrowRight
              className="stroke-current text-repod-text-primary"
              size={24}
            />
          </button>
        </>
      ) : screenMode === TierBenefitsModal.Types.editBenefit ? (
        <>
          <ListItem.Input
            label={MODAL_COPY.EditLabel}
            subLabel={MODAL_COPY.RequiredSubLabel}
            value={""}
            placeholder={MODAL_COPY.EditTitlePlaceholder}
          />
          <ListItem.Select
            label={MODAL_COPY.CategoryLabel}
            subLabel={MODAL_COPY.RequiredSubLabel}
            options={selectOptions}
          />
          <ListItem.Input
            label={MODAL_COPY.RSSLabel}
            subLabel={MODAL_COPY.RequiredSubLabel}
            value={""}
            placeholder={MODAL_COPY.RSSPlaceholder}
          />
          <div className="w-full h-0 my-2 border border-solid border-t-0 border-repod-border-light mb-6" />
          <div className="w-full flex flex-row items-center justify-start">
            <Button.Small
              className="bg-info text-repod-text-alternative"
              style={{ minWidth: 100, maxWidth: 100, width: 100 }}
              // onClick={handleAddBenefit}
            >
              Save
            </Button.Small>

            <Button.Small
              className="bg-repod-canvas text-repod-text-secondary"
              style={{ minWidth: 100, maxWidth: 100, width: 100 }}
              onClick={closeModal}
            >
              Cancel
            </Button.Small>
          </div>
        </>
      ) : screenMode === TierBenefitsModal.Types.createBenefit ? (
        <>
          <p className="text-sm font-book text-repod-text-primary mb-4">
            {MODAL_COPY.CreateDescription}
          </p>
          {map((type: string) => [
            <div className="h-0 border border-solid border-t-0 border-repod-border-light my-2" />,
            <div className="flex flex-row items-center justify-start w-full py-4">
              <div className="flex-1 flex-col items-start justify-start pr-4">
                <p className="text-md font-book text-repod-text-primary">
                  {SubscriptionBenefitCopy[type].title}
                </p>
                <p className="text-xs font-book text-repod-text-secondary">
                  {SubscriptionBenefitCopy[type].description}
                </p>
              </div>
              <div className="flex-0 flex-col items-center justify-center relative">
                <Button.Tiny
                  style={{ width: 90 }}
                  onClick={navigateToEditBenefit}
                  className={`py-1  bg-bg-info rounded border-1 border-info uppercase`}
                >
                  <p className="text-xs font-semibold text-info">Add</p>
                </Button.Tiny>
              </div>
            </div>,
          ])(Object.keys(SubscriptionBenefitCopy))}
        </>
      ) : null}
    </Modal>
  );
};

TierBenefitsModal.Types = {
  tierBenefits: "tierBenefits",
  editBenefit: "editBenefit",
  createBenefit: "createBenefit",
};

const ModalTitleCopy = {
  [TierBenefitsModal.Types.tierBenefits]: "Your Benefits",
  [TierBenefitsModal.Types.editBenefit]: "Edit Benefit",
  [TierBenefitsModal.Types.createBenefit]: "Add a Benefit",
};

export default TierBenefitsModal;
