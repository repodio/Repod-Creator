import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { fetchClaimedShowsAPI } from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import { ThunkDispatch } from "redux-thunk";
import { flow, pick, values } from "lodash/fp";
import { RootState } from "reduxConfig/store";

export type StateType = {
  byId: {
    [key: string]: ShowItem;
  };
  claimedShowIds: string[];
};

// Initial State
const INITIAL_STATE: StateType = {
  byId: {},
  claimedShowIds: [],
};

// Selectors
const baseSelector = (state: RootState) => state.shows;
const getShowsById = createSelector(baseSelector, (shows) => shows.byId);
const getClaimedShowIds = createSelector(
  baseSelector,
  (shows) => shows.claimedShowIds || []
);
const getShowById = (showId) =>
  createSelector(baseSelector, (shows) => shows.byId[showId]);

const getClaimedShows = createSelector(
  getClaimedShowIds,
  getShowsById,
  (claimedShowIds, allShowsById): ShowItem[] =>
    flow(pick(claimedShowIds), values)(allShowsById)
);

export const selectors = {
  getShowsById,
  getShowById,
  getClaimedShowIds,
  getClaimedShows,
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
    const claimedShows = await fetchClaimedShowsAPI(idToken);
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
