import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import {
  fetchClaimedShowsAPI,
  fetchShowData,
  getEpisodes,
  setFeaturedEpisodeId,
} from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import { flow, pick, values, uniqBy } from "lodash/fp";
import { RootState } from "reduxConfig/store";

import { Action, ActionCreator } from "redux";
import { ThunkResult, AsyncDispatch } from "reduxConfig/redux";

export type StateType = {
  byId: {
    [key: string]: ReduxShowItem;
  };
  claimedShowIds: string[];
  loadingEpisodes: boolean;
};

// Initial State
const INITIAL_STATE: StateType = {
  byId: {},
  claimedShowIds: [],
  loadingEpisodes: false,
};

// Selectors
const baseSelector = (state: RootState) => state.shows;
const getShowsById = createSelector(baseSelector, (shows) => shows.byId);
const getShowEpisodesLoading = createSelector(
  baseSelector,
  (shows) => shows.loadingEpisodes || false
);
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

const getShowEpisodeCursors = (showId) =>
  createSelector(getShowById(showId), (show) => show && show.episodeCursors);

const getShowEpisodes = (showId) =>
  createSelector(getShowById(showId), (show) => (show && show.episodes) || []);

export const selectors = {
  getShowsById,
  getShowById,
  getClaimedShowIds,
  getClaimedShows,
  getShowEpisodesLoading,
};

// Actions
const UPSERT_SHOWS = "repod/Shows/UPSERT_SHOWS";
const UPSERT_SHOW_STATS = "repod/Shows/UPSERT_SHOW_STATS";
const UPDATE_CLAIMED_SHOWS = "repod/Shows/UPDATE_CLAIMED_SHOWS";
const UPDATE_EPISODES = "repod/Shows/UPDATE_EPISODES";
const START_EPISODES = "repod/Shows/START_EPISODES";
const FINISH_EPISODES = "repod/Shows/FINISH_EPISODES";
const UPDATE_FEATURED_EPISODE_ID = "repod/Shows/UPDATE_FEATURED_EPISODE_ID";

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

const updateFeaturedEpisodeId: ActionCreator<Action> = ({
  showId,
  episodeId,
}: {
  showId: string;
  episodeId: string;
}) => ({
  type: UPDATE_FEATURED_EPISODE_ID,
  showId,
  episodeId,
});

const updateEpisodes: ActionCreator<Action> = ({
  showId,
  episodes,
  episodeCursors,
  total,
}: {
  showId: string;
  episodes: {
    [key: string]: EpisodeItem;
  };
  episodeCursors: {
    [key: number]: number;
  };
  total: number;
}) => ({
  type: UPDATE_EPISODES,
  showId,
  episodes,
  episodeCursors,
  total,
});

const fetchEpisodesStart: ActionCreator<Action> = () => ({
  type: START_EPISODES,
});

const fetchEpisodesFinish: ActionCreator<Action> = () => ({
  type: FINISH_EPISODES,
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

export const fetchShowEpisodes = ({
  showId,
  pageIndex = 0,
}): ThunkResult<Promise<void>> => async (
  dispatch: AsyncDispatch,
  getState: () => RootState
) => {
  try {
    dispatch(fetchEpisodesStart());

    const state = getState();
    const episodeCursors = getShowEpisodeCursors(showId)(state);
    const episodes = getShowEpisodes(showId)(state);

    const cursor = pageIndex === 0 ? null : episodeCursors[pageIndex];
    const episodesResponse = await getEpisodes({ showId, cursor });

    dispatch(
      updateEpisodes({
        episodes: uniqBy((item: EpisodeItem) => item.episodeId)([
          ...episodes,
          ...episodesResponse.items,
        ]),
        episodeCursors: {
          [pageIndex + 1]: episodesResponse.cursor,
        },
        total: episodesResponse.total,
        showId,
      })
    );

    return;
  } catch (error) {
    dispatch(fetchEpisodesFinish());

    console.warn("[THUNK ERROR]: login", error);
  }
};

export const handleFeaturedEpisodeSet = ({
  showId,
  episodeId,
}: {
  showId: string;
  episodeId: string;
}): ThunkResult<Promise<void>> => async (dispatch: AsyncDispatch) => {
  try {
    await setFeaturedEpisodeId({ showId, episodeId });

    dispatch(updateFeaturedEpisodeId({ showId, episodeId }));

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
          episodeCursors: {
            ...(state.byId[action.showId] || {}).episodeCursors,
            ...action.episodeCursors,
          },
          total: action.total,
        },
      },
    }),
    [UPDATE_FEATURED_EPISODE_ID]: () => ({
      ...state,
      byId: {
        ...state.byId,
        [action.showId]: {
          ...(state.byId[action.showId] || {}),
          featuredEpisodeId: action.episodeId,
        },
      },
      loadingEpisodes: false,
    }),
    [START_EPISODES]: () => ({
      ...state,
      loadingEpisodes: true,
    }),
    [FINISH_EPISODES]: () => ({
      ...state,
      loadingEpisodes: false,
    }),
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
