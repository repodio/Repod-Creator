import { useMemo } from "react";
import {
  createStore,
  applyMiddleware,
  combineReducers,
  AnyAction,
} from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper, HYDRATE } from "next-redux-wrapper";

import rootReducer from "./rootReducer";

let store;

const reducers = combineReducers(rootReducer);

const middlewareCollection = [thunk];

middlewareCollection.push(logger);

// create your reducer
const hydratedReducer = (state: any, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      // Attention! This will overwrite client state! Real apps should use proper reconciliation.
      return { ...state, ...action.payload };
    default:
      return reducers(state, action);
  }
};

const makeConfiguredStore = (reducer) =>
  createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middlewareCollection))
  );

const makeStore = () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return makeConfiguredStore(hydratedReducer);
  } else {
    // we need it only on client side
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { persistStore, persistReducer } = require("redux-persist");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const storage = require("redux-persist/lib/storage").default;

    const persistConfig = {
      key: "nextjs",
      // whitelist: ["auth"], // make sure it does not clash with server keys
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, hydratedReducer);
    const store = makeConfiguredStore(persistedReducer);

    (store as any).__persistor = persistStore(store); // Nasty hack

    return store;
  }
};

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: false });

// function initStore(preloadedState) {
//   return createStore(
//     persistedReducer,
//     preloadedState,
//     composeWithDevTools(applyMiddleware(...middlewareCollection))
//   );
// }

// export const initializeStore = (preloadedState) => {
//   let _store = store ?? initStore(preloadedState);

//   // After navigating to a page with an initial Redux state, merge that state
//   // with the current state in the store, and create a new store
//   if (preloadedState && store) {
//     _store = initStore({
//       ...store.getState(),
//       ...preloadedState,
//     });
//     // Reset the current store
//     store = undefined;
//   }

//   // For SSG and SSR always create a new store
//   if (typeof window === "undefined") return _store;
//   // Create the store once in the client
//   if (!store) store = _store;

//   return _store;
// };

// export function useStore(initialState) {
//   const store = useMemo(() => initializeStore(initialState), [initialState]);
//   const persistor = persistStore(store);

//   return { store, persistor };
// }
