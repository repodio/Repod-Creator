import React, { useCallback, useEffect } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { selectors as showsSelectors, fetchShowEpisodes } from "modules/Shows";
import { useRouter } from "next/router";
import { EpisodesTable } from "components/Table";
import { DashboardLayout } from "components/Layouts";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { LoadingScreen } from "components/Loading";

const Dashboard = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const loadingEpisodes = useSelector(showsSelectors.getShowEpisodesLoading);

  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();

  const fetchData = useCallback(
    (pageIndex) =>
      dispatch(fetchShowEpisodes({ showId: showIdString, pageIndex })),
    [fetchShowEpisodes, showIdString]
  );

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }
      if (!show.episodes) {
        await fetchData(0);
      }
    })();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <DashboardLayout>
      <div className="flex flex-col justify-start items-start">
        <p className="text-lg font-semibold text-repod-text-primary">
          All Episodes
        </p>
        <EpisodesTable
          data={show.episodes}
          loading={loadingEpisodes}
          total={show.total}
          fetchData={fetchData}
        />
      </div>
    </DashboardLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Dashboard);
