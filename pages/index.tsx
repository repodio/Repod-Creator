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

interface HomeProps {
  profile: UserItem;
  children: JSX.Element[] | JSX.Element;
}

const Home = ({ profile }: HomeProps) => {
  const AuthUser = useAuthUser();
  console.log("Home", AuthUser, profile);
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
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
})(async ({ AuthUser }) => {
  const { id: userId, getIdToken } = AuthUser;
  const profile = await getUser({ userId }, getIdToken);

  return {
    props: {
      profile,
    },
  };
});

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
