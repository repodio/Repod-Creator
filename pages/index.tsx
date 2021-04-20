// ./pages/demo
import React from "react";
import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import styles from "../styles/Home.module.css";
import LogoutButton from "components/Buttons/logoutButton";
import { getUser } from "utils/repodAPI";
import ClaimButton from "components/Buttons/claimButton";

interface HomeProps {
  profile: UserItem;
  children: JSX.Element[] | JSX.Element;
  idToken: string;
}

const Home = ({ profile, idToken }: HomeProps) => {
  const AuthUser = useAuthUser();
  console.log("Home", profile);
  return (
    <>
      <div className={styles.logoContainer}>
        <img src="/repod-logo.svg" alt="Repod Logo" className={styles.logo} />
        <h1 className={styles.repodTitle}>Repod for Creators</h1>
      </div>

      <div>
        <p>Your email is {AuthUser.email ? AuthUser.email : "unknown"}.</p>
      </div>

      <LogoutButton />

      <ClaimButton idToken={idToken} />
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
})(async ({ AuthUser }) => {
  const { id: userId, getIdToken } = AuthUser;
  const idToken = await getIdToken();
  const profile = await getUser({ userId }, idToken);

  return {
    props: {
      profile,
      idToken,
    },
  };
});

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
