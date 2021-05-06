import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import {
  fetchClaimedShowsAPI,
  fetchShowData,
  getEpisodes,
} from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import { flow, pick, values } from "lodash/fp";
import { RootState } from "reduxConfig/store";

import { Action, ActionCreator } from "redux";
import { ThunkResult, AsyncDispatch } from "reduxConfig/redux";

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
const UPSERT_SHOW_STATS = "repod/Shows/UPSERT_SHOW_STATS";
const UPDATE_CLAIMED_SHOWS = "repod/Shows/UPDATE_CLAIMED_SHOWS";
const UPDATE_EPISODES = "repod/Shows/UPDATE_EPISODES";

// Action Creators
export const upsertShows: ActionCreator<Action> = (shows: {
  [key: string]: ShowItem;
}) => ({
  type: UPSERT_SHOWS,
  shows,
});

const upsertShowStats: ActionCreator<Action> = ({
  showId,
  showStats,
}: {
  showId: string;
  showStats: {
    totalSubscriptions: number;
    uniqueListeners: number;
    totalStreams: number;
    monthlyListenData: { x: string; y: number }[];
  };
}) => ({
  type: UPSERT_SHOW_STATS,
  showId,
  showStats,
});

const updateClaimedShowsList: ActionCreator<Action> = (
  claimedShowIds: string[]
) => ({
  type: UPDATE_CLAIMED_SHOWS,
  claimedShowIds,
});

export const updateEpisodes: ActionCreator<Action> = ({
  showId,
  episodes,
  cursor,
  total,
}: {
  showId: string;
  episodes: {
    [key: string]: EpisodeItem;
  };
  cursor: number;
  total: number;
}) => ({
  type: UPDATE_EPISODES,
  showId,
  episodes,
  cursor,
  total,
});

// Thunks
export const fetchClaimedShows = (
  idToken?: string
): ThunkResult<Promise<string[]>> => async (dispatch: AsyncDispatch) => {
  try {
    const claimedShows = await fetchClaimedShowsAPI(idToken);
    const normalizedShows = convertArrayToObject(claimedShows, "showId");
    dispatch(upsertShows(normalizedShows));

    dispatch(updateClaimedShowsList(Object.keys(normalizedShows)));

    return Object.keys(normalizedShows);
  } catch (error) {
    console.warn("[THUNK ERROR]: login", error);
  }
};

export const fetchShowStats = (showId): ThunkResult<Promise<void>> => async (
  dispatch: AsyncDispatch
) => {
  try {
    const showStats = await fetchShowData({ showId });

    dispatch(
      upsertShowStats({
        showId,
        showStats,
      })
    );
  } catch (error) {
    console.warn("[THUNK ERROR]: login", error);
  }
};

export const fetchShowEpisodes = (showId): ThunkResult<Promise<void>> => async (
  dispatch: AsyncDispatch
) => {
  try {
    console.log("showId", showId);
    const episodesResponse = await getEpisodes({ showId });

    console.log("episodesResponse", episodesResponse);

    dispatch(
      updateEpisodes({
        episodes: episodesResponse.items,
        cursor: episodesResponse.cursor,
        total: episodesResponse.total,
        showId,
      })
    );

    return;
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
    [UPSERT_SHOW_STATS]: () => ({
      ...state,
      byId: {
        ...state.byId,
        [action.showId]: {
          ...(state.byId[action.showId] || {}),
          ...action.showStats,
        },
      },
    }),
    [UPDATE_CLAIMED_SHOWS]: () => ({
      ...state,
      claimedShowIds: action.claimedShowIds,
    }),
    [UPDATE_EPISODES]: () => ({
      ...state,
      byId: {
        ...state.byId,
        [action.showId]: {
          ...(state.byId[action.showId] || {}),
          episodes: action.episodes,
          cursor: action.cursor,
          total: action.total,
        },
      },
    }),
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
