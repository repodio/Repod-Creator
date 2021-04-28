import "../styles/globals.css";
import { initAuth } from "firebaseHelpers/init";
import { Provider, useStore } from "react-redux";
// import { useStore } from "reduxConfig/store";
import { PersistGate } from "redux-persist/integration/react";
import { wrapper } from "reduxConfig/store";

initAuth();

function MyApp({ Component, pageProps }) {
  const store = useStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.__persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

// export default MyApp;

export default wrapper.withRedux(MyApp);
