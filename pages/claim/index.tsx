import React from "react";
import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import LogoutButton from "components/Buttons/logoutButton";
import { getUser } from "utils/repodAPI";
import ClaimButton from "components/Buttons/claimButton";
import { RepodLogo } from "components/Header";
import { ProfileDropdown } from "components/Dropdown";
import { wrapper } from "reduxConfig/store";
import { connect } from "react-redux";

interface ClaimProps {
  profile: UserItem;
  children: JSX.Element[] | JSX.Element;
}

const Claim = ({ profile }: ClaimProps) => {
  const AuthUser = useAuthUser();
  console.log("Claim", profile);

  return (
    <>
      <div className="">
        <div className="flex justify-between align-center">
          <RepodLogo />
          <ProfileDropdown />
        </div>
        <div>
          <p>Claim {AuthUser.email ? AuthUser.email : "unknown"}.</p>
        </div>
        <LogoutButton />

        {/* <ClaimButton idToken={idToken} /> */}
      </div>
    </>
  );
};

// export default Claim;

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Claim);
