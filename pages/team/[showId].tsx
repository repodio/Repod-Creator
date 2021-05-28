import React, { useEffect } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import { selectors as authSelectors } from "modules/Auth";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { TeamMembersTable } from "components/Table";
import { TeamLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";

const Team = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const authProfile = useSelector(authSelectors.getAuthedProfile);
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  // useEffect(() => {
  //   (async () => {
  //     if (!show) {
  //       router.replace(`/`);
  //     }
  //     await dispatch(fetchShowStats(showId));
  //   })();
  // }, []);

  if (!show) {
    return <LoadingScreen />;
  }

  const authProfileClaimedShow = show.claimedShow.users[authProfile.userId];
  console.log("authProfileClaimedShow", authProfileClaimedShow);

  const authProfileWithRoles = {
    ...authProfile,
    role: authProfileClaimedShow.role,
    type: authProfileClaimedShow.type,
  };

  return (
    <TeamLayout>
      <div className="flex flex-col">
        <p className="text-2xl font-bold text-repod-text-primary">You</p>
        {/* <div className="flex flex-row my-8 border-red-500 border">
          <div className="flex-0 mr-2">
            <ProfileAvatar url={authProfile.avatarUrl} />
          </div>
          <div className="flex-1">
            <p className="text-md font-bold text-repod-text-primary">
              {authProfile.displayName}
            </p>
            <p className="text-sm text-repod-text-secondary">
              {authProfile.email || "-"}
            </p>
          </div>
          <p>{authProfileClaimedShow}</p>
          <p></p>
        </div> */}

        <TeamMembersTable
          data={[authProfileWithRoles]}
          // loading={loadingEpisodes}
        />
      </div>
    </TeamLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Team);
