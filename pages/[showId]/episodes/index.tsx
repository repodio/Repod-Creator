import React, { useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";

import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { EpisodeLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";
import { MembersTable } from "components/Table";
import { fetchMembers } from "utils/repodAPI";
import { Button } from "components/Buttons";

const PAGE_COPY = {
  OverviewTitle: "Add new premium episodes",
  OverviewSubTitle: "Start off by choosing how to add your premium episodes",
  UploadTitle: "Add new episodes",
  UploadSubTitle:
    "Start a premium content feed for paid members by adding new episodes. Get setup in minutes",
  UploadButtonLabel: "Coming Soon",
  ImportTitle: "Import your premium RSS feed",
  ImportSubTitle:
    "Offer your fans premium content by moving your private RSS feed to Repod. Easily import from Patreon and other hosting platforms",
  ImportButtonLabel: "Import from RSS feed",
};

const Episodes = () => {
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

      console.log("newMembers: ", newMembers);

      setMembers(newMembers);

      setPageLoading(false);
    })();
  }, []);

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  const navigateToImport = () => {
    router.replace(`/${showId}/episodes/import`);
  };

  const subscriptionRSSFeed = null;

  return (
    <EpisodeLayout>
      {subscriptionRSSFeed ? null : (
        <div className="flex flex-col">
          <div className="flex flex-col items-start w-full mb-8">
            <p className="text-xl font-bold text-repod-text-primary text-center">
              {PAGE_COPY.OverviewTitle}
            </p>
            <p className="text-md font-semibold text-repod-text-secondary text-center">
              {PAGE_COPY.OverviewSubTitle}
            </p>
          </div>
          <div className="flex flex-row items-center w-full pb-12">
            <div className="rounded-lg border border-repod-border-medium flex-1 flex flex-col items-center justify-center p-8 mr-4">
              <img
                style={{ width: 178, height: 217 }}
                src="/icons/upload-hero-icon.svg"
                alt="upload icon"
              />
              <p className="text-lg font-bold text-repod-text-primary text-center">
                {PAGE_COPY.UploadTitle}
              </p>
              <p className=" text-repod-text-secondary text-center mb-4">
                {PAGE_COPY.UploadSubTitle}
              </p>
              <Button.Medium
                disabled
                className="text-repod-text-alternative uppercase text-sm tracking-wide"
                style={{ minWidth: 300, maxWidth: 300, width: 300 }}
                onClick={() => {}}
              >
                {PAGE_COPY.UploadButtonLabel}
              </Button.Medium>
            </div>
            <div className="rounded-lg border border-repod-border-medium flex-1 flex flex-col items-center justify-center p-8 ml-4">
              <img
                style={{ width: 178, height: 217 }}
                src="/icons/import-hero-icon.svg"
                alt="import icon"
              />
              <p className="text-lg font-bold text-repod-text-primary text-center">
                {PAGE_COPY.ImportTitle}
              </p>
              <p className=" text-repod-text-secondary text-center mb-4">
                {PAGE_COPY.ImportSubTitle}
              </p>
              <Button.Medium
                className="bg-info text-repod-text-alternative uppercase text-sm tracking-wide"
                style={{ minWidth: 300, maxWidth: 300, width: 300 }}
                onClick={navigateToImport}
              >
                {PAGE_COPY.ImportButtonLabel}
              </Button.Medium>
            </div>
          </div>
        </div>
      )}
    </EpisodeLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Episodes);