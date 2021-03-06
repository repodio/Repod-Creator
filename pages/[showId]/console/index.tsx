import React, { useEffect } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import {
  selectors as showsSelectors,
  fetchShowStats,
  fetchClaimedShows,
} from "modules/Shows";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import Link from "next/link";
import { ShowStat } from "components/Console";
import { Button } from "components/Buttons";
import { Chart } from "components/Chart";
import { FollowersTable, EpisodesTable } from "components/Table";
import { ArrowRight } from "react-feather";
import { DashboardLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";

const Dashboard = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }
      await dispatch(fetchShowStats(showId));
    })();
  }, []);

  if (!show) {
    return <LoadingScreen />;
  }

  const slicedFollowers = (show.followers || []).slice(0, 5);
  const slicedEpisodes = (show.topEpisodes || []).slice(0, 5);

  const artworkSize = isMobile ? 96 : 120;

  return (
    <DashboardLayout>
      <div className="flex flex-row">
        {!isMobile ? (
          <img
            style={{ width: artworkSize, height: artworkSize }}
            className="rounded "
            src={show.artworkUrl}
            alt="show artwork"
          />
        ) : null}
        <div
          className={`w-full flex flex-col justify-center items-start ${
            isMobile ? "" : "pl-8"
          }`}
        >
          <p className="text-xl font-bold text-repod-text-primary font-bold truncate">
            {show.title}
          </p>
          <p className="mb-4 text-sm text-repod-text-secondary font-bold truncate">
            by {show.author}
          </p>
          <Button.Tiny
            onClick={() => {
              router.replace(`/${showId}/console/featuredepisode`);
            }}
            style={{ minWidth: 200, maxWidth: 200, width: 200 }}
            className={`bg-info text-repod-text-alternative flex-0`}
          >
            Set Featured Episode
          </Button.Tiny>
        </div>
      </div>
      <div className="flex flex-row my-12">
        <ShowStat type={ShowStat.TYPES.streams} value={show.totalStreams} />
        <ShowStat
          type={ShowStat.TYPES.listeners}
          value={show.uniqueListeners}
        />
        <ShowStat
          type={ShowStat.TYPES.followers}
          value={show.totalSubscriptions}
        />
      </div>
      {show.monthlyListenData && show.monthlyListenData.length ? (
        <div className="flex flex-col my-12 h-96">
          <p className="text-lg font-semibold text-repod-text-primary">
            Daily Streams
          </p>
          <Chart
            data={[
              {
                id: "Streams",
                data: show.monthlyListenData,
              },
            ]}
          />
        </div>
      ) : null}
      <>
        <div className="flex flex-row justify-between items-center">
          <p className="text-lg font-semibold text-repod-text-primary">
            Top Episodes
          </p>
          {slicedEpisodes && slicedEpisodes.length ? (
            <Link href={`/${showId}/console/episodes`}>
              <a
                className={` text-md font-semibold text-repod-tint flex flex-row items-center`}
              >
                View All
                <ArrowRight
                  className="ml-2 stroke-current text-repod-text-secondary"
                  size={20}
                />
              </a>
            </Link>
          ) : null}
        </div>
        <EpisodesTable data={slicedEpisodes} />
      </>
      <>
        <div className="flex flex-row justify-between items-center">
          <p className="text-lg font-semibold text-repod-text-primary">
            Recent Followers
          </p>
          {slicedFollowers && slicedFollowers.length ? (
            <Link href={`/${showId}/console/followers`}>
              <a
                className={` text-md font-semibold text-repod-tint flex flex-row items-center`}
              >
                View All
                <ArrowRight
                  className="ml-2 stroke-current text-repod-text-secondary"
                  size={20}
                />
              </a>
            </Link>
          ) : null}
        </div>
        <FollowersTable data={slicedFollowers} />
      </>
    </DashboardLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Dashboard);
