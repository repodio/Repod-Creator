// ./pages/demo
import React from "react";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";
import styles from "../styles/Home.module.css";

const Home = () => {
  const AuthUser = useAuthUser();
  console.log("AuthUser", AuthUser);
  return (
    <>
      <div className={styles.logoContainer}>
        <img src="/repod-logo.svg" alt="Repod Logo" className={styles.logo} />
        <h1 className={styles.repodTitle}>Repod for Creators</h1>
      </div>

      <div>
        <p>Your email is {AuthUser.email ? AuthUser.email : "unknown"}.</p>
      </div>
    </>
  );
};

// Note that this is a higher-order function.
export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
