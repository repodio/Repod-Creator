import React, { useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";

import { useRouter } from "next/router";
import { Loader, LoadingScreen } from "components/Loading";
import { EpisodeLayout } from "components/Layouts";
import { ManageEpisodesTable } from "components/Table";
import {
  fetchSubscriptionRSSFeedAndEpisodes,
  updateSubscriptionTiersForEpisodes,
} from "utils/repodAPI";
import { Button } from "components/Buttons";
import toast from "react-hot-toast";
import { LOADER_COLORS } from "components/Loading/loader";

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
  RSSImportUnfetched:
    "Your RSS feed is being imported! You can leave this page while we import your episodes. You'll see your episodes in the table below once the import is complete.",
  RSSImportTitle: "Premium Episodes",
  RSSImportSubTitle: "View all your premium episodes at a high level",
  ConfigureRSSButtonLabel: "Configure RSS Feed",
};

const Episodes = () => {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [episodes, setEpisodes] = useState([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rssStatus, setRssStatus] = useState(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState(null);
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));

  const fetchData = async ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => {
    setTableLoading(true);

    const response = await fetchSubscriptionRSSFeedAndEpisodes({
      showId: showIdString,
      offset: page * pageSize,
      size: pageSize,
    });

    if (response && response.episodes) {
      setEpisodes(response.episodes);
    }

    if (response && response.total) {
      setTotalEpisodes(response.total);
    }

    if (response && response.rssStatus) {
      setRssStatus(response.rssStatus);
    }

    if (response && response.subscriptionTiers) {
      setSubscriptionTiers(response.subscriptionTiers);
    }
    setTableLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }

      await fetchData({ page, pageSize });
      setPageLoading(false);
    })();
  }, []);

  if (!show || pageLoading) {
    return <LoadingScreen />;
  }

  const navigateToImport = () => {
    router.replace(`/${showId}/episodes/import`);
  };

  const handleAssignTiers = async ({
    episodeIds = [],
    subscriptionTierIds = [],
  }) => {
    if (episodeIds.length) {
      await updateSubscriptionTiersForEpisodes({
        showId: showIdString,
        episodeIds,
        subscriptionTierIds,
      });
      toast.success("Updated subscription tiers!");
    }
  };

  const handleChangePageSize = (value: number) => {
    setPageSize(value);
    setPage(0);
    fetchData({
      page: 0,
      pageSize: value,
    });
  };

  const handlePrev = () => {
    if (page) {
      setPage(page - 1);
      fetchData({
        page: page - 1,
        pageSize,
      });
    }
  };

  const handleNext = () => {
    if ((page + 1) * pageSize <= totalEpisodes) {
      setPage(page + 1);
      fetchData({
        page: page + 1,
        pageSize,
      });
    }
  };

  return (
    <EpisodeLayout>
      {rssStatus ? (
        <div
          className={`flex flex-col relative pb-8 ${
            tableLoading ? "opacity-50" : ""
          }`}
        >
          <div className="flex flex-col items-start w-full mb-8">
            <p className="text-xl font-bold text-repod-text-primary text-left">
              {PAGE_COPY.RSSImportTitle}
            </p>
            <div className="flex flex-row items-center justify-between w-full">
              <p className="text-md font-semibold text-repod-text-secondary text-left">
                {PAGE_COPY.RSSImportSubTitle}
              </p>

              <Button.Tiny
                className={`bg-info text-repod-text-alternative uppercase`}
                onClick={navigateToImport}
                style={{ minWidth: 200, maxWidth: 200, width: 200 }}
              >
                {PAGE_COPY.ConfigureRSSButtonLabel}
              </Button.Tiny>
            </div>
          </div>
          {rssStatus === "unfetched" ? (
            <div className="border border-repod-tint bg-tint-08 rounded-lg p-5 text-lg font-semibold text-repod-tint mb-8">
              {PAGE_COPY.RSSImportUnfetched}
            </div>
          ) : null}

          {tableLoading ? (
            <div className="z-10 justify-center items-center flex absolute m-auto w-full mt-80">
              <Loader size={48} color={LOADER_COLORS.dark} />
            </div>
          ) : null}
          <ManageEpisodesTable
            data={episodes}
            total={totalEpisodes}
            subscriptionTiers={subscriptionTiers}
            handleAssignTiers={handleAssignTiers}
            page={page}
            pageSize={pageSize}
            handleChangePageSize={handleChangePageSize}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col items-start w-full mb-8">
            <p className="text-xl font-bold text-repod-text-primary text-center">
              {PAGE_COPY.OverviewTitle}
            </p>
            <p className="text-md font-semibold text-repod-text-secondary text-center">
              {PAGE_COPY.OverviewSubTitle}
            </p>
          </div>
          <div className="flex flex-row items-start w-full pb-12">
            <div className="rounded-lg border border-repod-border-medium flex-1 flex flex-col items-center justify-center p-8 mr-4">
              <img
                style={{ width: 178, height: 217 }}
                src="/icons/upload-hero-icon.svg"
                alt="upload icon"
              />
              <p className="text-lg font-bold text-repod-text-primary text-center">
                {PAGE_COPY.UploadTitle}
              </p>
              <p
                className=" text-repod-text-secondary text-center mb-4"
                style={{ maxWidth: 600 }}
              >
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
              <p
                className=" text-repod-text-secondary text-center mb-4"
                style={{ maxWidth: 600 }}
              >
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
