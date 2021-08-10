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
import { ListItem } from "components/Forms";
import { useForm } from "react-hook-form";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
};

type FormInputs = {
  title: string;
  price: number;
  description: string;
};

const EditSubscription = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  const { showId, subscriptionTierId } = router.query;
  const showIdString = showId as string;
  const subscriptionTierIdString = subscriptionTierId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const subscriptionTier = useSelector(
    subscriptionsSelectors.getSubscriptionTier(subscriptionTierIdString)
  );
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      title: subscriptionTier.title,
      price: subscriptionTier.monthlyPrice,
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

  const updateTier = useCallback(async () => {}, []);

  const openAddBenefitModal = () => {};

  if (subscriptionTier && subscriptionTier.showId !== showIdString) {
    router.replace(`/${showIdString}/subscriptions`);
  }

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  return (
    <SubscriptionsLayout>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col items-center justify-center">
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
            className="flex flex-col items-center w-full rounded border border-solid border-repod-border-light pt-8 pb-12 px-4"
          >
            <ListItem.Input
              label={PAGE_COPY.TitleLabel}
              subLabel={PAGE_COPY.RequiredSubLabel}
              value={subscriptionTier.title}
              placeholder={PAGE_COPY.TitlePlaceholder}
              name="title"
              inputType="text"
              registerInput={register("title", { required: true })}
              error={false}
            />
            <ListItem.Currency
              label={PAGE_COPY.PriceLabel}
              subLabel={PAGE_COPY.RequiredSubLabel}
              value={subscriptionTier.monthlyPrice}
              placeholder={PAGE_COPY.PricePlaceholder}
              name="price"
              inputType="text"
              control={control}
              registerInput={register("price", { required: true })}
              error={false}
            />
            <ListItem.TextArea
              label={PAGE_COPY.DescriptionLabel}
              subLabel=""
              value={subscriptionTier.description}
              placeholder={PAGE_COPY.DescriptionPlaceholder}
              name="description"
              inputType="text"
              registerInput={register("description", { required: true })}
              error={false}
            />
            <ListItem.Benefits
              label={PAGE_COPY.BenefitsLabel}
              subLabel={PAGE_COPY.BenefitsSubLabel}
              benefits={subscriptionTier.benefits}
              error={false}
              handleAddBenefit={openAddBenefitModal}
            />
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
