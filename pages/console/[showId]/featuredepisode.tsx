import React, { useEffect, useMemo, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import {
  fetchShowEpisodes,
  handleFeaturedEpisodeSet,
  handleSearchEpisodes,
  selectors as showsSelectors,
} from "modules/Shows";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, X } from "react-feather";
import { EpisodesTable, FeaturedEpisodesTable } from "components/Table";
import { Button } from "components/Buttons";
import Link from "next/link";
import find from "lodash/fp/find";
import { clipText } from "utils/textTransform";
import { formatDuration, formatDate } from "utils/formats";
import { LoadingScreen } from "components/Loading";
import { useMediaQuery } from "react-responsive";
import { SearchInput } from "components/Inputs";
import Copy from "constants/i18n";

const Dashboard = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;
  const dispatch = useDispatch();
  const show = useSelector(showsSelectors.getShowById(showIdString));
  const [featuredEpisodeId, setFeaturedEpisodeId] = useState(
    show ? show.featuredEpisodeId : null
  );
  const allEpisodes = useSelector(
    showsSelectors.getAllShowEpisodes(showIdString)
  );
  const searchEpisodes = useSelector(
    showsSelectors.getSearchShowEpisodes(showIdString)
  );
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const loadingEpisodes = useSelector(showsSelectors.getShowEpisodesLoading);
  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    (async () => {
      if (queryString) {
        await dispatch(
          handleSearchEpisodes({
            showId: showIdString,
            queryString,
          })
        );
      }
    })();
  }, [queryString]);

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
        return;
      }

      if (!allEpisodes || !allEpisodes.length) {
        console.log("fetchShowEpisodes");

        await dispatch(
          fetchShowEpisodes({ showId: showIdString, pageIndex: 0 })
        );
      }
    })();
  }, []);

  if (!show) {
    return null;
  }

  const handleEpisodeSave = () => {
    if (selectedEpisodeIsAlreadySaved) {
      dispatch(
        handleFeaturedEpisodeSet({
          showId: showIdString,
          episodeId: null,
        })
      );
      setFeaturedEpisodeId(null);
    } else {
      dispatch(
        handleFeaturedEpisodeSet({
          showId: showIdString,
          episodeId: featuredEpisodeId,
        })
      );
    }
  };

  const episodesById = show.episodesById;
  const featuredEpisode = episodesById
    ? episodesById[featuredEpisodeId] || episodesById[show.featuredEpisodeId]
    : null;

  const selectedEpisodeIsAlreadySaved =
    featuredEpisodeId === show.featuredEpisodeId;

  return (
    <div className="flex flex-row justify-center items-start">
      {!isMobile ? (
        <div className="mt-24">
          <div className="relative">
            <img
              style={{ maxWidth: 412 }}
              className=""
              src="/claim-mock-phone2.png"
              alt={`${show.title} app mock up`}
            />
            <div
              className="absolute"
              style={{
                top: 98,
                left: 84,
              }}
            >
              <div className="flex flex-row">
                <img
                  style={{ width: 84, height: 84 }}
                  className="w-12 mr-4 rounded"
                  src={show.artworkUrl}
                  alt={`${show.title} artwork`}
                />
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col">
                    <p
                      style={{ maxWidth: 150 }}
                      className="text-lg font-bold truncate"
                    >
                      {show.title}
                    </p>
                    <div className="flex flex-row justify-start items-center">
                      <img
                        style={{ width: 9, height: 8 }}
                        src="/icons/claimed-icon.svg"
                        alt="claim icon"
                      />
                      <p className="text-sm text-info ml-1">Claimed</p>
                    </div>
                  </div>

                  <Button.Tiny
                    className={`bg-repod-tint text-repod-text-alternative border-2 border-repod-tint hover:opacity-100 cursor-default`}
                  >
                    Follow
                  </Button.Tiny>
                </div>
              </div>
              {featuredEpisode ? (
                <div className="mt-2 rounded p-2 bg-repod-canvas-secondary border border-repod-border-light flex flex-row">
                  <img
                    style={{ width: 50, height: 50 }}
                    className="w-12 mr-2 rounded"
                    src={featuredEpisode.artworkUrl}
                    alt={`${featuredEpisode.title} artwork`}
                  />
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col">
                      <p
                        style={{ maxWidth: 170 }}
                        className="text-sm text-repod-text-primary truncate"
                      >
                        {featuredEpisode.title}
                      </p>
                      <p
                        style={{ maxWidth: 170 }}
                        className="text-xs text-repod-text-secondary truncate"
                      >
                        {formatDuration(featuredEpisode.calculatedDuration)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 rounded p-2 bg-repod-canvas-secondary border-dashed bg-repod-canvas-secondary border-repod-border-light border-2 flex flex-row justify-center items-center">
                  <p
                    style={{ maxWidth: 220 }}
                    className="text-me text-repod-text-secondary text-center"
                  >
                    {Copy.FeaturedEpisodes.featuredEpisodePlaceholder}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <div className="p-4 w-full">
        <Link href={`/console/${showId}/`}>
          <a
            className={`text-lg font-semibold text-repod-text-primary flex flex-row items-center py-4 hover:opacity-50 transition`}
          >
            <ArrowLeft
              className="mr-2 stroke-current text-repod-text-primary"
              size={24}
            />
            Go Back
          </a>
        </Link>
        <p
          className={`text-xl font-semibold text-repod-text-primary flex flex-row items-center my-4`}
        >
          {Copy.FeaturedEpisodes.featuredEpisodeTitle}
        </p>
        <p>{Copy.FeaturedEpisodes.featuredEpisodeSubtitle}</p>

        {featuredEpisode ? (
          <div className="w-full">
            <p
              className={`text-lg font-semibold text-repod-text-primary flex flex-row items-center my-4`}
            >
              Featured Episode
            </p>
            <div className="w-full flex flex-col rounded p-4 bg-repod-canvas-secondary">
              <div className="flex flex-col w-full">
                <div className="flex flex-row w-full justify-between items-start">
                  <p className="text-md text-repod-text-secondary">
                    {formatDate(featuredEpisode.date)}
                  </p>
                  {!selectedEpisodeIsAlreadySaved ? (
                    <X
                      onClick={() =>
                        setFeaturedEpisodeId(show.featuredEpisodeId)
                      }
                      size={24}
                      className="stroke-current text-repod-text-secondary ml-2 cursor-pointer"
                    />
                  ) : null}
                </div>

                <p className="text-lg text-repod-text-primary font-bold">
                  {clipText(featuredEpisode.title, 300)}
                </p>
                <p className="text-md text-repod-text-secondary">
                  {clipText(featuredEpisode.description, 300)}
                </p>
                <Button.Medium
                  onClick={handleEpisodeSave}
                  className={`mt-4 text-repod-text-alternative transition ${
                    selectedEpisodeIsAlreadySaved
                      ? "bg-danger"
                      : "bg-repod-tint"
                  }`}
                >
                  {selectedEpisodeIsAlreadySaved
                    ? "Remove this Episode"
                    : "Save this Episode"}
                </Button.Medium>
              </div>
            </div>
          </div>
        ) : null}

        <div className="w-full mt-8">
          <SearchInput
            placeholder="Search Episodes"
            handleSearch={setQueryString}
          />

          <FeaturedEpisodesTable
            data={!queryString ? allEpisodes : searchEpisodes}
            onClick={setFeaturedEpisodeId}
            loading={loadingEpisodes}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Dashboard);
