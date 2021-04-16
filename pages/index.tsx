// ./pages/demo
import React from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import styles from "../styles/Home.module.css";
import LogoutButton from "components/Buttons/logoutButton";

const Home = () => {
  const AuthUser = useAuthUser();
  console.log("Home", AuthUser);
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

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
