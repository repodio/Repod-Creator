import "../styles/globals.css";
import { initAuth } from "firebaseHelpers/init";
import { Provider } from "react-redux";
import { useStore } from "reduxConfig/store";
import { PersistGate } from "redux-persist/integration/react";

initAuth();

function MyApp({ Component, pageProps }) {
  const { store, persistor } = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
