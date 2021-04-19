import "../styles/globals.css";
import { initAuth } from "firebaseHelpers/init";

initAuth();

function MyApp({ Component, pageProps }) {
  console.log("app");
  return <Component {...pageProps} />;
}

export default MyApp;
