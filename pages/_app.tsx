import "../styles/globals.css";
import { initAuth } from "firebaseHelpers/init";
import { Provider, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper } from "reduxConfig/store";
import { ConsoleLayout } from "components/Layouts";
import { useRouter } from "next/router";

initAuth();

function MyApp({ Component, pageProps }) {
  const store: any = useStore();
  const router = useRouter();

  // store.__persistor && store.__persistor.purge();

  const consoleLayout =
    router.pathname.startsWith("/console") ||
    router.pathname.startsWith("/team") ||
    router.pathname.startsWith("/tips") ||
    router.pathname.startsWith("/subscriptions") ||
    router.pathname.startsWith("/settings");

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor}>
        {consoleLayout ? (
          <ConsoleLayout>
            <Component {...pageProps} />
          </ConsoleLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
