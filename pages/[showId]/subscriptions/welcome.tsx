import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import {
  handleWelcomeNotesSet,
  selectors as showsSelectors,
} from "modules/Shows";
import { selectors as subscriptionsSelectors } from "modules/Subscriptions";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { SubscriptionsLayout } from "components/Layouts";
import { map, forEach } from "lodash/fp";
import { Button, SelectButton } from "components/Buttons";
import { formatCurrency } from "utils/formats";
import toast from "react-hot-toast";
import { convertToMD, convertToHTML } from "utils/markdown";

const PAGE_COPY = {
  PageTitle: "Custom Welcome Notes",
  PageSubtitle:
    "Customize welcome notes for your tiers to let members know you appreciate them!",
  WelcomeNotesTitle: "How would you like to welcome your members?",
  WelcomeNotesSubtitle:
    "You can either re-use a single welcome note for all your subscription tiers, or create custom welcome notes for each subscription tier.",
  OptionsLabelSameMessage: "Use the same welcome note for each tier",
  OptionsLabelDifferentMessage: "Customize welcome notes for each tier",
  TierLabel: "Tier",
};

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

const WelcomeMessages = () => {
  const router = useRouter();
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();

  const mdParser = new MarkdownIt(/* Markdown-it options */);

  const { showId } = router.query;
  const showIdString = showId as string;
  const show = useSelector(showsSelectors.getShowById(showIdString));

  const claimedShow = show && show.claimedShow;

  const initialCustomWelcomeNotesPerTier =
    claimedShow && claimedShow.customWelcomeNotesPerTier === true;

  const [customWelcomeNotesPerTier, setCustomWelcomeNotesPerTier] = useState(
    initialCustomWelcomeNotesPerTier
  );

  const subscriptionTiers = useSelector(
    subscriptionsSelectors.getSubscriptionTiers(showIdString)
  );

  const [globalTextValue, setGlobalTextValue] = React.useState(
    claimedShow && claimedShow.globalWelcomeNote
      ? convertToMD(claimedShow.globalWelcomeNote || "")
      : "Thanks for supporting the podcast!"
  );

  const initialCustomTextValues = {};

  forEach((subscriptionTier: SubscriptionTierItem) => {
    initialCustomTextValues[subscriptionTier.subscriptionTierId] = convertToMD(
      subscriptionTier.customWelcomeNote || ""
    );
  })(subscriptionTiers);

  const [customTextValue, setCustomTextValue] = React.useState(
    initialCustomTextValues
  );

  const handleSaveChanges = async () => {
    try {
      const customWelcomeNotes = map((key: string) => {
        return {
          subscriptionTierId: key,
          customWelcomeNote: convertToHTML(customTextValue[key] || ""),
        };
      })(Object.keys(customTextValue));

      await dispatch(
        handleWelcomeNotesSet({
          showId: showIdString,
          customWelcomeNotesPerTier,
          globalWelcomeNote: convertToHTML(globalTextValue || ""),
          customWelcomeNotes,
        })
      );

      toast.success("Welcome Notes Saved!");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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
          <button
            onClick={() => setCustomWelcomeNotesPerTier(false)}
            className="focus:outline-none flex flex-row items-center justify-start w-full mb-2"
          >
            <SelectButton
              selected={!customWelcomeNotesPerTier}
              onPress={() => setCustomWelcomeNotesPerTier(false)}
            />
            <p className="text-base font-semibold text-repod-text-primary ml-2">
              {PAGE_COPY.OptionsLabelSameMessage}
            </p>
          </button>
          <button
            onClick={() => setCustomWelcomeNotesPerTier(true)}
            className="focus:outline-none flex flex-row items-center justify-start w-full mb-2"
          >
            <SelectButton
              selected={customWelcomeNotesPerTier}
              onPress={() => setCustomWelcomeNotesPerTier(true)}
            />
            <p className="text-base font-semibold text-repod-text-primary ml-2">
              {PAGE_COPY.OptionsLabelDifferentMessage}
            </p>
          </button>

          {!customWelcomeNotesPerTier ? (
            <div className="flex flex-row items-center justify-start w-full mb-16 mt-2">
              <MdEditor
                style={{ height: "250px", width: "100%" }}
                value={globalTextValue}
                renderHTML={(text) => mdParser.render(text)}
                onChange={({ text }) => {
                  setGlobalTextValue(text);
                }}
                plugins={["font-bold", "font-italic", "link", "mode-toggle"]}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-start w-full mt-2">
              {map((subscriptionTier: SubscriptionTierItem) => (
                <div
                  key={subscriptionTier.subscriptionTierId}
                  className="flex flex-row items-start justify-start w-full mb-16"
                >
                  <div
                    className="flex flex-col items-start justify-start mr-2"
                    style={{ width: 200 }}
                  >
                    <p className="text-sm font-semibold text-repod-text-secondary">
                      {PAGE_COPY.TierLabel}
                    </p>
                    <p className="text-base font-semibold text-repod-text-primary">
                      {subscriptionTier.title}
                    </p>
                    <p className="text-sm font-semibold text-repod-text-secondary uppercase">
                      {`${formatCurrency(
                        subscriptionTier.monthlyPrice
                      )} PER MONTH`}
                    </p>
                  </div>
                  <MdEditor
                    style={{ height: "250px", width: "100%" }}
                    value={customTextValue[subscriptionTier.subscriptionTierId]}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={({ text }) => {
                      setCustomTextValue({
                        ...customTextValue,
                        [subscriptionTier.subscriptionTierId]: text,
                      });
                    }}
                    plugins={[
                      "font-bold",
                      "font-italic",
                      "link",
                      "mode-toggle",
                    ]}
                  />
                </div>
              ))(subscriptionTiers)}
            </div>
          )}
          <div className="flex items-end justify-end w-full mt-4">
            <div>
              <Button.Medium
                type="submit"
                className="bg-repod-tint text-repod-text-alternative"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button.Medium>
            </div>
          </div>
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
