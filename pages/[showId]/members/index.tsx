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
import { MembersLayout } from "components/Layouts";
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
import { MembersTable } from "components/Table";

const PAGE_COPY = {
  StripeConnectMessage:
    "To enable listeners to subscribe through Repod we must first connect to your Stripe Account. We use Stripe to safely and securely get you your money, setting up an account is quick and easy. Start by pressing the button below.",
  PlaceholderTitle:
    "Start by customizing the subscription tiers you want to offer",
  PlaceholderSubTitle:
    "We'll start you off with the following tier but you get to customize however you'd like",
  OverviewTitle: "Members",
  OverviewSubTitle:
    "Customize welcome notes for your tiers to let members know you appreciate them!",
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
      <div className="flex flex-col items-start w-full mb-8">
        <p className="text-xl font-bold text-repod-text-primary text-left">
          {PAGE_COPY.OverviewTitle}
        </p>
        <p className="text-md font-semibold text-repod-text-secondary text-left">
          {PAGE_COPY.OverviewSubTitle}
        </p>
      </div>
      <div className={"flex flex-col items-center w-full pb-12"}>
        <MembersTable
          data={[
            {
              userId: "123",
              avatarUrl:
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
              displayName: "Greg Hori",
              status: "Active",
              tier: "Amazing Member",
              monthlyAmount: 500,
              createdOn: { _seconds: 1637477655 },
              email: "example@gmail.com",
              shippingAddress: {
                streetAddress: "938 Willow Glen Way",
                city: "San Jose",
                state: "CA",
                zipCode: "95125",
                appartmentNumber: "#409",
                shareShippingAddress: true,
              },
            },
            {
              userId: "234",
              avatarUrl:
                "https://images.unsplash.com/photo-1509335035496-c47fc836517f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1485&q=80",
              displayName: "Jen Naka",
              status: "Active",
              tier: "Excellent Member",
              monthlyAmount: 2500,
              createdOn: { _seconds: 1636477655 },
              email: "example@gmail.com",
              shippingAddress: {
                streetAddress: null,
                city: null,
                state: null,
                zipCode: null,
                appartmentNumber: null,
                shareShippingAddress: false,
              },
            },
            {
              userId: "345",
              avatarUrl:
                "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
              displayName: "Jess Banes",
              status: "Canceled",
              tier: "Awesome Member",
              monthlyAmount: 1000,
              createdOn: { _seconds: 1635477655 },
              email: "example@gmail.com",
              shippingAddress: null,
            },
            {
              userId: "456",
              avatarUrl:
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
              displayName: "Greg Hori",
              status: "Active",
              tier: "Amazing Member",
              monthlyAmount: 500,
              createdOn: { _seconds: 1637477655 },
              email: "example@gmail.com",
              shippingAddress: {
                streetAddress: "938 Willow Glen Way",
                city: "San Jose",
                state: "CA",
                zipCode: "95125",
                appartmentNumber: "#409",
                shareShippingAddress: true,
              },
            },
            {
              userId: "567",
              avatarUrl:
                "https://images.unsplash.com/photo-1509335035496-c47fc836517f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1485&q=80",
              displayName: "Jen Naka",
              status: "Active",
              tier: "Excellent Member",
              monthlyAmount: 2500,
              createdOn: { _seconds: 1636477655 },
              email: "example@gmail.com",
              shippingAddress: {
                streetAddress: "938 Willow Glen Way",
                city: "San Jose",
                state: "CA",
                zipCode: "95125",
                appartmentNumber: "#409",
                shareShippingAddress: true,
              },
            },
            {
              userId: "678",
              avatarUrl:
                "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
              displayName: "Jess Banes",
              status: "Canceled",
              tier: "Awesome Member",
              monthlyAmount: 1000,
              createdOn: { _seconds: 1635477655 },
              email: "example@gmail.com",
              shippingAddress: {
                streetAddress: "938 Willow Glen Way",
                city: "San Jose",
                state: "CA",
                zipCode: "95125",
                appartmentNumber: "#409",
                shareShippingAddress: true,
              },
            },
          ]}
        />
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
    <MembersLayout>
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
    </MembersLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Subscriptions);
