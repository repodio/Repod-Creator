import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.root}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.signUpContainer}>
        <div className={styles.logoContainer}>
          <img src="/repod-logo.svg" alt="Repod Logo" className={styles.logo} />
          <h1 className={styles.repodTitle}>Repod for Creators</h1>
        </div>
      </div>

      <div className={styles.explainerContainer}>
        <p>Be where your listeners are</p>
        <p>
          Claim your podcast on the platform with an existing listener
          community.
        </p>
      </div>
    </div>
  );
}
