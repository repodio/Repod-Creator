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

  return (
    <Provider store={store}>
      <PersistGate
        persistor={store.__persistor}
        // loading={null}
      >
        {router.pathname.startsWith("/console/") ? (
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

// export default MyApp;

export default wrapper.withRedux(MyApp);
