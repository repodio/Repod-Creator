import React, { useCallback, useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import {
  selectors as subscriptionsSelectors,
  fetchShowSubscriptionTiers,
  saveSubscriptionTier,
} from "modules/Subscriptions";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { SubscriptionsLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";
import { ListItem } from "components/Forms";
import { useForm } from "react-hook-form";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Collapsible from "components/Collapsible";
import { Button } from "components/Buttons";
import { Trash } from "react-feather";
import toast from "react-hot-toast";
import { map } from "lodash/fp";
import { RemoveTierModal } from "components/Modals";

const PAGE_COPY = {
  EditTitle: "Tiers",
  EditSubTitle: "Choose what to offer your members",
  TitleLabel: "Tier Title",
  TitlePlaceholder: "My Tier Title",
  RequiredSubLabel: "Required",
  PriceLabel: "Monthly Price",
  PricePlaceholder: "$5.00",
  DescriptionLabel: "Description",
  DescriptionPlaceholder: "Describe in your own words what this tier offers",
  BenefitsLabel: "Benefits",
  BenefitsSubLabel: "Must have at least one benefit in each tier",
  AdvancedLabel: "Advanced",
  ShippingLabel: "Shipping Address",
  ShippingSubLabel: "Ask for shipping address during checkout",
};

type FormInputs = {
  title: string;
  monthlyPrice: number;
  description: string;
};

const EditSubscription = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [removeTierModalOpen, setRemoveTierModalOpen] = useState(false);

  const { showId, subscriptionTierId } = router.query;
  const showIdString = showId as string;
  const subscriptionTierIdString = subscriptionTierId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const subscriptionTier = useSelector(
    subscriptionsSelectors.getSubscriptionTier(subscriptionTierIdString)
  ) || {
    title: "",
    monthlyPrice: 0,
    description: "",
    enableShippingAddress: false,
    published: false,
    benefits: [],
    showId,
    subscriptionTierId,
  };

  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  const [enableShippingAddress, setShippingAddressEnabled] = useState(
    subscriptionTier.enableShippingAddress
  );

  const [benefits, setBenefits] = useState(subscriptionTier.benefits);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      title: subscriptionTier.title,
      monthlyPrice: subscriptionTier.monthlyPrice,
      description: subscriptionTier.description,
    },
  });

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
    if (errors && Object.keys(errors).length > 0) {
      if (errors.title) {
        toast.error("Valid title required");
      }
      if (errors.monthlyPrice) {
        toast.error("Valid price required");
      }
      return;
    }
  }, [Object.keys(errors)]);

  const onSave = useCallback(
    async ({ title, monthlyPrice, description }) => {
      try {
        await dispatch(
          saveSubscriptionTier({
            showId: showIdString,
            subscriptionTierId: subscriptionTierIdString,
            title,
            monthlyPrice,
            description,
            enableShippingAddress,
            benefitIds: map(
              (benefit: SubscriptionBenefitItem) => benefit.benefitId
            )(benefits),
            published: subscriptionTier.published,
          })
        );
        toast.success("Subscription Tier Saved");
      } catch (error) {
        console.log("onSave with error", error);
      }
    },
    [errors, benefits]
  );

  const handleCancel = () => {
    router.back();
  };

  const handleUnpublish = async () => {
    try {
      await dispatch(
        saveSubscriptionTier({
          showId: showIdString,
          subscriptionTierId: subscriptionTierIdString,
          published: false,
        })
      );
      toast.success("Subscription Tier Unpublished");
    } catch (error) {
      console.log("handleUnpublish with error", error);
    }
  };

  const handlePublish = async ({ title, monthlyPrice, description }) => {
    try {
      await dispatch(
        saveSubscriptionTier({
          showId: showIdString,
          subscriptionTierId: subscriptionTierIdString,
          title,
          monthlyPrice,
          description,
          enableShippingAddress,
          benefitIds: map(
            (benefit: SubscriptionBenefitItem) => benefit.benefitId
          )(benefits),
          published: true,
        })
      );
      toast.success("Subscription Tier Published");
    } catch (error) {
      console.log("saveSubscriptionTier with error", error);
    }
  };

  const openAddBenefitModal = () => {};

  const handleRemovePressed = () => {
    setRemoveTierModalOpen(true);
  };

  if (subscriptionTier && subscriptionTier.showId !== showIdString) {
    router.replace(`/${showIdString}/subscriptions`);
  }

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  return (
    <SubscriptionsLayout>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="flex flex-col items-center w-full mb-8">
            <p className="text-lg font-bold text-repod-text-primary">
              {PAGE_COPY.EditTitle}
            </p>
            <p className="text-md font-semibold text-repod-text-secondary">
              {PAGE_COPY.EditSubTitle}
            </p>
          </div>
          <div
            style={{ maxWidth: 800 }}
            className="flex flex-col items-center w-full rounded border border-solid border-repod-border-light pb-2 pt-6 px-8"
          >
            <ListItem.Input
              label={PAGE_COPY.TitleLabel}
              subLabel={PAGE_COPY.RequiredSubLabel}
              value={subscriptionTier.title}
              placeholder={PAGE_COPY.TitlePlaceholder}
              name="title"
              inputType="text"
              registerInput={register("title", { required: true })}
              error={errors.title}
            />
            <ListItem.Currency
              label={PAGE_COPY.PriceLabel}
              subLabel={PAGE_COPY.RequiredSubLabel}
              value={subscriptionTier.monthlyPrice}
              placeholder={PAGE_COPY.PricePlaceholder}
              name="monthlyPrice"
              inputType="number"
              control={control}
              registerInput={register("monthlyPrice", {
                required: true,
                valueAsNumber: true,
                validate: (value) => typeof value === "number" && !isNaN(value),
              })}
              error={errors.monthlyPrice}
            />
            <ListItem.TextArea
              label={PAGE_COPY.DescriptionLabel}
              subLabel=""
              value={subscriptionTier.description}
              placeholder={PAGE_COPY.DescriptionPlaceholder}
              name="description"
              inputType="text"
              registerInput={register("description", { required: false })}
              error={false}
            />
            <ListItem.BenefitsList
              label={PAGE_COPY.BenefitsLabel}
              subLabel={PAGE_COPY.BenefitsSubLabel}
              benefits={benefits}
              setBenefits={setBenefits}
              error={false}
              handleAddBenefit={openAddBenefitModal}
            />
            <div className="w-full h-0 my-2 border border-solid border-t-0 border-repod-border-light" />
            <Collapsible label="Advanced">
              <div className="w-full my-6">
                <ListItem.Toggle
                  label={PAGE_COPY.ShippingLabel}
                  subLabel={PAGE_COPY.ShippingSubLabel}
                  value={enableShippingAddress}
                  onChange={setShippingAddressEnabled}
                />
              </div>
            </Collapsible>
            <div className="w-full h-0 my-2 border border-solid border-t-0 border-repod-border-light mb-8" />
            <div className="w-full flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-start">
                <Button.Small
                  className="bg-info text-repod-text-alternative mb-6"
                  style={{ minWidth: 130, maxWidth: 130, width: 130 }}
                  onClick={handleSubmit(onSave)}
                >
                  Save Tier
                </Button.Small>

                <Button.Small
                  className="bg-repod-canvas text-repod-text-secondary mb-6"
                  style={{ minWidth: 100, maxWidth: 100, width: 100 }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button.Small>
              </div>

              <div className="flex flex-row items-center justify-end">
                {subscriptionTier.published ? (
                  <Button.Small
                    className="bg-repod-canvas text-repod-text-secondary mb-6"
                    style={{ minWidth: 100, maxWidth: 100, width: 100 }}
                    onClick={handleUnpublish}
                  >
                    Unpublish
                  </Button.Small>
                ) : (
                  <Button.Small
                    className="bg-repod-canvas text-info mb-6"
                    style={{ minWidth: 100, maxWidth: 100, width: 100 }}
                    onClick={handleSubmit(handlePublish)}
                  >
                    Publish
                  </Button.Small>
                )}
                <Button.Small
                  className="bg-repod-canvas text-repod-text-secondary mb-6"
                  style={{ minWidth: 50, maxWidth: 50, width: 50 }}
                  onClick={handleRemovePressed}
                >
                  <Trash
                    className="stroke-current text-repod-text-secondary"
                    size={24}
                  />
                </Button.Small>
              </div>
              <RemoveTierModal
                isModalOpen={removeTierModalOpen}
                setIsModalOpen={setRemoveTierModalOpen}
              />
            </div>
          </div>
        </div>
      </DndProvider>
    </SubscriptionsLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(EditSubscription);
