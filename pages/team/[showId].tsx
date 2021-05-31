import React, { useEffect, useState } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import { selectors as authSelectors } from "modules/Auth";
import { useRouter } from "next/router";
import { Loader, LoadingScreen } from "components/Loading";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { TeamMembersTable } from "components/Table";
import { TeamLayout } from "components/Layouts";
import { useMediaQuery } from "react-responsive";
import {
  selectors as profileSelectors,
  fetchTeamMembers,
} from "modules/Profile";

const Team = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const authProfile = useSelector(authSelectors.getAuthedProfile);
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const teamMembers = useSelector(
    profileSelectors.getTeamMemberProfiles(showId)
  );

  useEffect(() => {
    (async () => {
      if (!show) {
        router.replace(`/`);
      }
      await dispatch(fetchTeamMembers(showIdString));
      setLoading(false);
    })();
  }, []);

  if (!show) {
    return <LoadingScreen />;
  }

  const authProfileClaimedShow = show.claimedShow.users[authProfile.userId];
  console.log("show", show);
  console.log("teamMembers", teamMembers);

  const authProfileWithRoles = {
    ...authProfile,
    role: authProfileClaimedShow.role,
    type: authProfileClaimedShow.type,
  };

  return (
    <TeamLayout>
      <div className="flex flex-col">
        <p className="text-2xl font-bold text-repod-text-primary">You</p>
        <TeamMembersTable data={[authProfileWithRoles]} />

        {loading ? (
          <Loader />
        ) : teamMembers.length ? (
          <>
            <p className="text-2xl font-bold text-repod-text-primary mt-8">
              Members
            </p>
            <TeamMembersTable data={teamMembers} />
          </>
        ) : null}
      </div>
    </TeamLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Team);
