import "../styles/globals.css";
import { initAuth } from "firebaseHelpers/init";
import { Provider, useStore } from "react-redux";
// import { useStore } from "reduxConfig/store";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper } from "reduxConfig/store";
import { ConsoleLayout } from "components/Layouts";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";

initAuth();

function MyApp({ Component, pageProps }) {
  const store = useStore();
  const router = useRouter();
  console.log("_app router", router.pathname, router.query);
  return (
    <Provider store={store}>
      <PersistGate
        persistor={store.__persistor}
        // loading={null}
        loading={<LoadingScreen />}
      >
        <ConsoleLayout>
          <Component {...pageProps} />
        </ConsoleLayout>
      </PersistGate>
    </Provider>
  );
}

// export default MyApp;

export default wrapper.withRedux(MyApp);
