import { useMemo } from "react";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import rootReducer from "./rootReducer";

let store;

const reducers = combineReducers(rootReducer);

// const initialState = {
//   lastUpdate: 0,
//   light: false,
//   count: 0,
// };

// const reducers = (state = initialState, action) => {
//   switch (action.type) {
//     case "TICK":
//       return {
//         ...state,
//         lastUpdate: action.lastUpdate,
//         light: !!action.light,
//       };
//     case "INCREMENT":
//       return {
//         ...state,
//         count: state.count + 1,
//       };
//     case "DECREMENT":
//       return {
//         ...state,
//         count: state.count - 1,
//       };
//     case "RESET":
//       return {
//         ...state,
//         count: initialState.count,
//       };
//     default:
//       return state;
//   }
// };

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const middlewareCollection = [thunk];

// if (process.env.NODE_ENV === "dev") {
//   // middlewareCollection.push(logger);
// }

function initStore(preloadedState) {
  return createStore(
    persistedReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(...middlewareCollection))
  );
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  const persistor = persistStore(store);

  return { store, persistor };
}
