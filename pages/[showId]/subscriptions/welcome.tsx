import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
import { Button, SelectButton } from "components/Buttons";

const PAGE_COPY = {
  PageTitle: "Custom Welcome Notes",
  PageSubtitle:
    "Customize welcome notes for your tiers to let members know you appreciate them!",
  WelcomeNotesTitle: "How would you like to welcome your members?",
  WelcomeNotesSubtitle:
    "You can either re-use a single welcome note for all your subscription tiers, or create custom welcome notes for each subscription tier.",
  OptionsLabelSameMessage: "Use the same welcome note for each tier",
  OptionsLabelDifferentMessage: "Customize welcome notes for each tier",
};

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const WelcomeMessages = () => {
  const router = useRouter();
  const [sameNotesEnabled, setSameNotesEnabled] = useState(true);
  const [value, setValue] = React.useState(
    "**Thanks for supporting the podcast!**"
  );

  const { showId } = router.query;
  const showIdString = showId as string;

  // const show = useSelector(showsSelectors.getShowById(showIdString));
  // const benefits = useSelector(
  //   subscriptionsSelectors.getAllShowBenefits(showIdString)
  // );
  // const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  // const isMobile = useMediaQuery({ query: "(max-width: 815px)" });

  // useEffect(() => {
  //   (async () => {
  //     if (!show) {
  //       router.replace(`/`);
  //     }

  //     await dispatch(fetchShowSubscriptionTiers(showIdString));

  //     setPageLoading(false);
  //   })();
  // }, []);

  // useEffect(() => {
  //   if (!isBenefitModalOpen) {
  //     setSelectedBenefitId(null);
  //   }
  // }, [isBenefitModalOpen]);

  return (
    <SubscriptionsLayout>
      <div className="w-full flex flex-col justify-start items-start pb-8">
        <div className="flex flex-col items-center w-full mb-8">
          <p className="text-xl font-bold text-repod-text-primary">
            {PAGE_COPY.PageTitle}
          </p>
          <p className="text-base font-book text-repod-text-secondary">
            {PAGE_COPY.PageSubtitle}
          </p>
        </div>

        <div className="flex flex-col items-start w-full rounded border border-solid border-repod-border-light p-8">
          <p className="text-base font-semibold text-repod-text-primary">
            {PAGE_COPY.WelcomeNotesTitle}
          </p>
          <p className="text-sm font-book text-repod-text-secondary mb-2">
            {PAGE_COPY.WelcomeNotesSubtitle}
          </p>
          <div className="flex flex-row items-center justify-start w-full mb-2">
            <SelectButton
              selected={sameNotesEnabled}
              onPress={() => setSameNotesEnabled(true)}
            />
            <p className="text-base font-semibold text-repod-text-primary ml-2">
              {PAGE_COPY.OptionsLabelSameMessage}
            </p>
          </div>
          <div className="flex flex-row items-center justify-start w-full">
            <SelectButton
              selected={!sameNotesEnabled}
              onPress={() => setSameNotesEnabled(false)}
            />
            <p className="text-base font-semibold text-repod-text-primary ml-2">
              {PAGE_COPY.OptionsLabelDifferentMessage}
            </p>
          </div>

          {sameNotesEnabled ? (
            <div>
              <MDEditor value={value} onChange={setValue} />
              {/* <MDEditor.Markdown source={value} /> */}
            </div>
          ) : null}

          <Button.Medium />
        </div>
      </div>
    </SubscriptionsLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(WelcomeMessages);
