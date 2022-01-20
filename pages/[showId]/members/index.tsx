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
import { MembersLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";
import { MembersTable } from "components/Table";
import { fetchMembers } from "utils/repodAPI";

const PAGE_COPY = {
  StripeConnectMessage:
    "To enable listeners to subscribe through Repod we must first connect to your Stripe Account. We use Stripe to safely and securely get you your money, setting up an account is quick and easy. Start by pressing the button below.",
  PlaceholderTitle:
    "Start by customizing the subscription tiers you want to offer",
  PlaceholderSubTitle:
    "We'll start you off with the following tier but you get to customize however you'd like",
  OverviewTitle: "Members",
  OverviewSubTitle:
    "View your members at a high level. Click a member to see more details!",
};

const Subscriptions = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }

      const newMembers = await fetchMembers({ showId: showIdString });

      setMembers(newMembers);

      setPageLoading(false);
    })();
  }, []);

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  return (
    <MembersLayout>
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
          <MembersTable data={members} />
        </div>
      </div>
    </MembersLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Subscriptions);
