import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { LOGOUT } from "modules/Auth";

// Initial State
const INITIAL_STATE: {
  byId: {
    [key: string]: ShowItem;
  };
} = {
  byId: {},
};

// Selectors
const baseSelector = (state) => state.shows;
const getShowsById = createSelector(baseSelector, (shows) => shows.byId);

export const selectors = {
  getShowsById,
};

// Actions
const UPSERT_SHOWS = "repod/Shows/UPSERT_SHOWS";

// Action Creators
export const upsertShows = (shows: {
  [key: string]: ShowItem;
}): ActionCreator => ({
  type: UPSERT_SHOWS,
  shows,
});

// Reducer
export default (state = INITIAL_STATE, action) =>
  switchcase({
    [UPSERT_SHOWS]: () => ({
      ...state,
      byId: {
        ...state.byId,
        ...action.shows,
      },
    }),
    [LOGOUT]: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
