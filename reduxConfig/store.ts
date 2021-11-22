import thunk from "redux-thunk";
import logger from "redux-logger";
import shows, { StateType as ShowsStateType } from "modules/Shows";
import auth, { StateType as AuthStateType } from "modules/Auth";
import profile, { StateType as ProfileStateType } from "modules/Profile";
import subscriptions, {
  StateType as SubscriptionsStateType,
} from "modules/Subscriptions";

import { createStore, applyMiddleware, combineReducers, Store } from "redux";
import { createWrapper } from "next-redux-wrapper";

const middlewareCollection = [thunk];

// middlewareCollection.push(logger);

export type RootState = {
  profile: ProfileStateType;
  auth: AuthStateType;
  shows: ShowsStateType;
  subscriptions: SubscriptionsStateType;
};

const combinedReducer = combineReducers({
  shows,
  auth,
  profile,
  subscriptions,
});

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");

    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const makeStore = () => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    //If it's on server side, create a store
    return createStore(combinedReducer, bindMiddleware(middlewareCollection));
  } else {
    //If it's on client side, create a store which will persist
    const { persistStore, persistReducer } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;

    const persistConfig = {
      key: "nextjs",
      whitelist: ["shows", "auth", "profile", "subscriptions"],
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, combinedReducer); // Create a new reducer with our existing reducer

    const store: Store & { __persistor: any } = createStore(
      persistedReducer,
      bindMiddleware(middlewareCollection)
    ); // Creating the store again

    store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature
    return store;
  }
};

// Export the wrapper & wrap the pages/_app.js with this wrapper only
export const wrapper = createWrapper(makeStore);
