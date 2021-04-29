import { useMemo } from "react";
// import {
//   createStore,
//   applyMiddleware,
//   combineReducers,
//   AnyAction,
// } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
// import { createWrapper, Context, HYDRATE } from "next-redux-wrapper";

import shows from "modules/Shows";
import auth from "modules/Auth";
import profile from "modules/Profile";

// const reducers = combineReducers(rootReducer);

// const middlewareCollection = [thunk];

// middlewareCollection.push(logger);

// // create your reducer
// const hydratedReducer = (state: any, action: AnyAction) => {
//   switch (action.type) {
//     case HYDRATE:
//       // Attention! This will overwrite client state! Real apps should use proper reconciliation.

//       console.log("hydratedReducer state", state);
//       console.log("hydratedReducer action.payload", action);
//       return { ...state, ...action.payload };

//     // const nextState = {
//     //   ...state, // use previous state
//     //   ...action.payload, // apply delta from hydration
//     // };
//     // console.log("hydratedReducer 1", nextState);
//     // if (state.auth) {
//     //   nextState.auth = state.auth; // preserve counter value on client side navigation
//     // }
//     // if (state.shows) {
//     //   nextState.shows = state.shows; // preserve counter value on client side navigation
//     // }
//     // if (state.profile) {
//     //   nextState.profile = state.profile; // preserve counter value on client side navigation
//     // }
//     // console.log("hydratedReducer 2", nextState);

//     // return nextState;

//     default:
//       return reducers(state, action);
//   }
// };

// const makeStore = (context: Context) =>
//   createStore(
//     hydratedReducer,
//     composeWithDevTools(applyMiddleware(...middlewareCollection))
//   );

// export const wrapper = createWrapper(makeStore, { debug: false });

import { createStore, applyMiddleware, combineReducers } from "redux";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";
import counter from "./counter";

const middlewareCollection = [thunk];

middlewareCollection.push(logger);

//COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  counter,
  shows,
  auth,
  profile,
  // OTHER REDUCERS WILL BE ADDED HERE
});

// BINDING MIDDLEWARE
const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");

    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const makeStore = ({ isServer }) => {
  if (isServer) {
    //If it's on server side, create a store
    return createStore(combinedReducer, bindMiddleware(middlewareCollection));
  } else {
    //If it's on client side, create a store which will persist
    const { persistStore, persistReducer } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;

    const persistConfig = {
      key: "nextjs",
      whitelist: ["counter", "shows", "auth", "profile"], // only counter will be persisted, add other reducers if needed
      storage, // if needed, use a safer storage
    };

    const persistedReducer = persistReducer(persistConfig, combinedReducer); // Create a new reducer with our existing reducer

    const store = createStore(
      persistedReducer,
      bindMiddleware(middlewareCollection)
    ); // Creating the store again

    store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

    return store;
  }
};

// Export the wrapper & wrap the pages/_app.js with this wrapper only
export const wrapper = createWrapper(makeStore);
