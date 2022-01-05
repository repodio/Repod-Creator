import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./baseModal";
import {
  createNewSubscriptionBenefit,
  saveSubscriptionBenefit,
  selectors as subscriptionsSelectors,
  upsertBenefitToSubscriptionTier,
} from "modules/Subscriptions";
import { map } from "lodash/fp";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ListItem } from "components/Forms";
import { ArrowRight } from "react-feather";
import SubscriptionBenefits, {
  TypesRequiringRSSFeed,
} from "constants/subscriptionBenefitTypes";
import { Button } from "components/Buttons";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SUBSCRIPTION_BENEFITS = {
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
  CreateDescription:
    "Choose from our list of top benefits for your tier. If you can’t find exactly what you’re looking for then you can make a custom one",
};

type TierBenefitsModalProps = {
  addedBenefits: SubscriptionBenefitItem[];
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
  initialScreen: string;
  initialBenefitId: string;
};

type FormInputs = {
  title: string;
};

const ListedTierBenefits = ({
  addedBenefits,
  setScreenMode,
  closeModal,
}: {
  addedBenefits: SubscriptionBenefitItem[];
  setScreenMode: (type: string) => void;
  closeModal: () => void;
}) => {
  const router = useRouter();
  const { showId, subscriptionTierId } = router.query;
  const subscriptionTierIdString = subscriptionTierId as string;
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();

  const allBenefits = useSelector(
    subscriptionsSelectors.getAllShowBenefits(showId)
  );
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

  const handleAddBenefit = (benefitId) => {
    dispatch(
      upsertBenefitToSubscriptionTier({
        benefitId,
        subscriptionTierId: subscriptionTierIdString,
      })
    );
    closeModal();
  };
  return (
    <>
      {map((benefit: SubscriptionBenefitItem) => (
        <div key={benefit.benefitId}>
          <div className="h-0 border border-solid border-t-0 border-repod-border-light my-2" />
          <div className="flex flex-row items-center justify-start w-full py-4">
            <div className="flex-1 flex-col items-start justify-start pr-4">
              <p className="text-md font-book text-repod-text-primary">
                {benefit.title}
              </p>
              <p className="text-xs font-book text-repod-text-secondary">
                {`Included in ${benefit.tiersCount || 0} other tiers`}
              </p>
            </div>
            <div className="flex-0 flex-col items-center justify-center relative">
              {addedBenefitIds.includes(benefit.benefitId) ? (
                <Button.Tiny
                  style={{ width: 180 }}
                  className={`py-1 bg-repod-disabled-bg rounded hover:opacity-100 cursor-default uppercase`}
                >
                  <p className="text-xs font-semibold text-repod-text-primary">
                    Added to this tier
                  </p>
                </Button.Tiny>
              ) : (
                <Button.Tiny
                  style={{ width: 90 }}
                  onClick={() => handleAddBenefit(benefit.benefitId)}
                  className={`py-1  bg-bg-info rounded border-1 border-info uppercase`}
                >
                  <p className="text-xs font-semibold text-info">+ Add</p>
                </Button.Tiny>
              )}
            </div>
          </div>
        </div>
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
  );
};

const EditBenefits = ({
  benefitId,
  closeModal,
}: {
  benefitId: string;
  closeModal: () => void;
}) => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();

  const edittedBenefit = useSelector(
    subscriptionsSelectors.getBenefit(benefitId)
  ) || { title: "", type: "" };

  const [edittedBenefitType, setEdittedBenefitType] = useState(
    edittedBenefit.type
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      title: edittedBenefit.title,
    },
  });

  const saveBenefit = useCallback(
    async ({ title }) => {
      try {
        dispatch(
          saveSubscriptionBenefit({
            showId: showIdString,
            benefitId,
            title,
            type: edittedBenefitType,
          })
        );

        toast.success("Benefit Saved");
        closeModal();
      } catch (error) {
        console.error("saveBenefit with error", error);
        toast.error("Something went wrong, try again later");
      }
    },
    [edittedBenefitType]
  );
  const selectOptions = useMemo(
    () =>
      map((key: string) => ({
        label: SUBSCRIPTION_BENEFITS[key].title,
        key,
      }))(Object.keys(SUBSCRIPTION_BENEFITS)),
    [SUBSCRIPTION_BENEFITS]
  );

  return (
    <>
      <ListItem.Input
        key="title"
        label={MODAL_COPY.EditLabel}
        subLabel={MODAL_COPY.RequiredSubLabel}
        value={edittedBenefit.title}
        placeholder={MODAL_COPY.EditTitlePlaceholder}
        name="title"
        inputType="text"
        registerInput={register("title", { required: true })}
        error={errors.title}
      />
      <ListItem.Select
        key="select"
        label={MODAL_COPY.CategoryLabel}
        subLabel={MODAL_COPY.RequiredSubLabel}
        options={selectOptions}
        onOptionChange={setEdittedBenefitType}
        initialOption={edittedBenefit.type}
      />
      <div className="w-full h-0 my-2 border border-solid border-t-0 border-repod-border-light mb-6" />
      <div className="w-full flex flex-row items-center justify-start">
        <Button.Small
          className="bg-info text-repod-text-alternative"
          style={{ minWidth: 100, maxWidth: 100, width: 100 }}
          onClick={handleSubmit(saveBenefit)}
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
  );
};

const CreateBenefit = ({
  setScreenMode,
  setBenefitId,
}: {
  setScreenMode: (type: string) => void;
  setBenefitId: (benefitId: string) => void;
}) => {
  const router = useRouter();
  const { showId, subscriptionTierId } = router.query;
  const subscriptionTierIdString = subscriptionTierId as string;
  const showIdString = showId as string;
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();

  const createNewBenefit = async (type) => {
    const newBenefitId = await dispatch(
      createNewSubscriptionBenefit({ showId: showIdString, type })
    );

    if (subscriptionTierId) {
      dispatch(
        upsertBenefitToSubscriptionTier({
          benefitId: newBenefitId,
          subscriptionTierId: subscriptionTierIdString,
        })
      );
    }
    toast.success("Benefit Created");
    setBenefitId(newBenefitId);
    setScreenMode(TierBenefitsModal.Types.editBenefit);
  };

  return (
    <>
      <p className="text-sm font-book text-repod-text-primary mb-4">
        {MODAL_COPY.CreateDescription}
      </p>
      {map((type: string) => (
        <div key={type}>
          <div className="h-0 border border-solid border-t-0 border-repod-border-light my-2" />
          <div className="flex flex-row items-center justify-start w-full py-4">
            <div className="flex-1 flex-col items-start justify-start pr-4">
              <p className="text-md font-book text-repod-text-primary">
                {SUBSCRIPTION_BENEFITS[type].title}
              </p>
              <p className="text-xs font-book text-repod-text-secondary">
                {SUBSCRIPTION_BENEFITS[type].description}
              </p>
            </div>
            <div className="flex-0 flex-col items-center justify-center relative">
              <Button.Tiny
                style={{ width: 90 }}
                onClick={() => createNewBenefit(type)}
                className={`py-1  bg-bg-info rounded border-1 border-info uppercase`}
              >
                <p className="text-xs font-semibold text-info">Add</p>
              </Button.Tiny>
            </div>
          </div>
        </div>
      ))(Object.keys(SUBSCRIPTION_BENEFITS))}
    </>
  );
};

const TierBenefitsModal = ({
  addedBenefits,
  isModalOpen,
  setIsModalOpen,
  initialBenefitId = null,
  initialScreen = TierBenefitsModal.Types.tierBenefits,
}: TierBenefitsModalProps) => {
  const [screenMode, setScreenMode] = useState(initialScreen);
  const [benefitId, setBenefitId] = useState(initialBenefitId);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setScreenMode(initialScreen);
    }
  }, [isModalOpen]);

  const modalTitle = ModalTitleCopy[screenMode];

  return (
    <Modal
      title={modalTitle}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    >
      {screenMode === TierBenefitsModal.Types.tierBenefits ? (
        <ListedTierBenefits
          key={TierBenefitsModal.Types.tierBenefits}
          addedBenefits={addedBenefits}
          setScreenMode={setScreenMode}
          closeModal={closeModal}
        />
      ) : screenMode === TierBenefitsModal.Types.editBenefit ? (
        <EditBenefits
          key={TierBenefitsModal.Types.editBenefit}
          benefitId={benefitId}
          closeModal={closeModal}
        />
      ) : screenMode === TierBenefitsModal.Types.createBenefit ? (
        <CreateBenefit
          key={TierBenefitsModal.Types.createBenefit}
          setScreenMode={setScreenMode}
          setBenefitId={setBenefitId}
        />
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
