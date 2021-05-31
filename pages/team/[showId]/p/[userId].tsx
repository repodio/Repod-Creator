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
import Link from "next/link";
import { ArrowLeft } from "react-feather";
import { FormInput } from "components/Inputs";
import { useForm } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
};

const EditMember = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { showId, userId } = router.query;
  const showIdString = showId as string;
  const userIdString = userId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));
  const authProfile = useSelector(authSelectors.getAuthedProfile);
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const profile = useSelector(profileSelectors.getProfilesById)[userIdString];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit = async ({ email, name }) => {
    console.log("onSubmit", email, name);
  };

  useEffect(() => {
    (async () => {
      if (!profile) {
        router.replace(`/team/${showId}`);
      }
      setLoading(false);
    })();
  }, []);

  if (!profile) {
    return <LoadingScreen />;
  }

  const authProfileClaimedShow = show.claimedShow.users[authProfile.userId];
  console.log("profile", profile);

  const authProfileWithRoles = {
    ...authProfile,
    role: authProfileClaimedShow.role,
    type: authProfileClaimedShow.type,
  };

  return (
    <div className="p-8">
      <Link href={`/team/${showId}/`}>
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
      <div className="flex flex-col">
        <p className="text-2xl font-bold text-repod-text-primary">
          {profile.displayName}
        </p>

        <div className="flex flex-col my-4 max-w-lg">
          <FormInput
            label="Display Name"
            registerInput={register("name", { required: true })}
            name="name"
            type="name"
            defaultValue={profile.displayName}
            error={Boolean(errors.name)}
            placeholder="Stephen Dubner"
          />
          <FormInput
            label="Email"
            registerInput={register("email", { required: true })}
            name="email"
            type="email"
            defaultValue={profile.email}
            error={Boolean(errors.email)}
            placeholder="stephen@example.com"
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
})(EditMember);
