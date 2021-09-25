import "../styles/globals.css";
import { initAuth } from "firebaseHelpers/init";
import { Provider, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper } from "reduxConfig/store";
import { ConsoleLayout } from "components/Layouts";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

initAuth();

function MyApp({ Component, pageProps }) {
  const store: any = useStore();
  const router = useRouter();

  // store.__persistor && store.__persistor.purge();

  const consoleLayout =
    router.pathname.startsWith("/[showId]/console") ||
    router.pathname.startsWith("/[showId]/team") ||
    router.pathname.startsWith("/[showId]/tips") ||
    router.pathname.startsWith("/[showId]/subscriptions") ||
    router.pathname.startsWith("/[showId]/settings");

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

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#fff",
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
