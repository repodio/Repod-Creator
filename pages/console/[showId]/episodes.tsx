import React, { useEffect } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { selectors as showsSelectors, fetchShowEpisodes } from "modules/Shows";
import { useRouter } from "next/router";
import { EpisodesTable } from "components/Table";
import { DashboardLayout } from "components/Layouts";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const Dashboard = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }
      if (!show.episodes) {
        await dispatch(fetchShowEpisodes(showId));
      }
    })();
  }, []);
  return (
    <DashboardLayout>
      <div className="flex flex-col justify-start items-start">
        <p className="text-lg font-semibold text-repod-text-primary">
          All Episodes
        </p>
        <EpisodesTable data={show.episodes} />
      </div>
    </DashboardLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Dashboard);
