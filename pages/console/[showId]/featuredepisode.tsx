import React, { useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import {
  handleFeaturedEpisodeSet,
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
import { formatDuration } from "utils/formats";

const Dashboard = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;
  const dispatch = useDispatch();
  const show = useSelector(showsSelectors.getShowById(showIdString));
  const [featuredEpisodeId, setFeaturedEpisodeId] = useState(
    show ? show.featuredEpisodeId : null
  );

  useEffect(() => {
    (async () => {
      if (!show) {
      }
    })();
  }, []);

  if (!show) {
    return null;
  }

  const featuredEpisode = find(
    (episode: EpisodeItem) => episode.episodeId === featuredEpisodeId
  )(show.episodes);

  const selectedEpisodeIsAlreadySaved =
    featuredEpisodeId === show.featuredEpisodeId;

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

  return (
    <div className="flex flex-row justify-center items-start">
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
                  className={`bg-repod-tint text-repod-text-alternative border-2 border-repod-tint transition`}
                >
                  Follow
                </Button.Tiny>
              </div>
            </div>
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
          </div>
        </div>
      </div>
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
          Pick an episode
        </p>
        <p>
          you should pick an episode, you should pick an episode, you should
          pick an episode, you should pick an episode, you should pick an
          episode, you should pick an episode, you should pick an episode, you
          should pick an episode, you should pick an episode, you should pick an
          episode, you should pick an episode
        </p>

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
                  <p className="text-lg text-repod-text-primary font-bold">
                    {clipText(featuredEpisode.title, 300)}
                  </p>
                  <X
                    onClick={() => setFeaturedEpisodeId(null)}
                    size={24}
                    className="stroke-current text-repod-text-secondary ml-2 cursor-pointer"
                  />
                </div>

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

        <FeaturedEpisodesTable
          data={show.episodes}
          onClick={setFeaturedEpisodeId}
        />
      </div>
    </div>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Dashboard);
