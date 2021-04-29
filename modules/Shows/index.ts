import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { getClaimedShows } from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import { ThunkDispatch } from "redux-thunk";

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
const getShowById = (showId) =>
  createSelector(baseSelector, (shows) => shows.byId[showId]);

export const selectors = {
  getShowsById,
  getShowById,
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

// Thunks
export const fetchClaimedShows = ({ idToken }) => async (
  dispatch
): Promise<ClaimedShowItems[]> => {
  try {
    const claimedShows = await getClaimedShows(idToken);
    const normalizedShows = convertArrayToObject(claimedShows, "showId");
    console.log("fetchClaimedShows normalizedShows", normalizedShows);
    dispatch(upsertShows(normalizedShows));

    return claimedShows;
  } catch (error) {
    console.warn("[THUNK ERROR]: login", error);
  }
};

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
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
