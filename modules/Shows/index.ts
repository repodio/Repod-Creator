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
  claimedShowIds: string[];
} = {
  byId: {},
  claimedShowIds: [],
};

// Selectors
const baseSelector = (state) => state.shows;
const getShowsById = createSelector(baseSelector, (shows) => shows.byId);
const getClaimedShowIds = createSelector(
  baseSelector,
  (shows) => shows.claimedShowIds || []
);
const getShowById = (showId) =>
  createSelector(baseSelector, (shows) => shows.byId[showId]);

export const selectors = {
  getShowsById,
  getShowById,
  getClaimedShowIds,
};

// Actions
const UPSERT_SHOWS = "repod/Shows/UPSERT_SHOWS";
const UPDATE_CLAIMED_SHOWS = "repod/Shows/UPDATE_CLAIMED_SHOWS";

// Action Creators
export const upsertShows = (shows: {
  [key: string]: ShowItem;
}): ActionCreator => ({
  type: UPSERT_SHOWS,
  shows,
});

const updateClaimedShowsList = (claimedShowIds: string[]): ActionCreator => ({
  type: UPDATE_CLAIMED_SHOWS,
  claimedShowIds,
});

// Thunks
export const fetchClaimedShows = (idToken?: string) => async (
  dispatch
): Promise<ClaimedShowItems[]> => {
  try {
    const claimedShows = await getClaimedShows(idToken);
    const normalizedShows = convertArrayToObject(claimedShows, "showId");
    console.log("fetchClaimedShows normalizedShows", normalizedShows);
    dispatch(upsertShows(normalizedShows));
    console.log(
      "fetchClaimedShows Object.keys(normalizedShows)",
      JSON.stringify(Object.keys(normalizedShows))
    );

    dispatch(updateClaimedShowsList(Object.keys(normalizedShows)));

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
    [UPDATE_CLAIMED_SHOWS]: () => ({
      ...state,
      claimedShowIds: action.claimedShowIds,
    }),
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
