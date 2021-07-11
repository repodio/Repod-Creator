import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { fetchConnectedAccountOnboardingUrl } from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import { flow, pick, values, uniq } from "lodash/fp";
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

const getAllShowEpisodes = (showId) =>
  createSelector(getShowById(showId), (show) =>
    show ? flow(pick(show.allEpisodeIds), values)(show.episodesById) : []
  );

const getSearchShowEpisodes = (showId) =>
  createSelector(getShowById(showId), (show) =>
    show ? flow(pick(show.searchEpisodeIds), values)(show.episodesById) : []
  );

export const selectors = {
  getShowsById,
  getShowById,
  getClaimedShowIds,
  getClaimedShows,
  getShowEpisodesLoading,
  getAllShowEpisodes,
  getSearchShowEpisodes,
};

// Actions
const UPSERT_SHOWS = "repod/Shows/UPSERT_SHOWS";
const UPSERT_SHOW_STATS = "repod/Shows/UPSERT_SHOW_STATS";
const UPDATE_CLAIMED_SHOWS = "repod/Shows/UPDATE_CLAIMED_SHOWS";
const START_EPISODES = "repod/Shows/START_EPISODES";
const FINISH_EPISODES = "repod/Shows/FINISH_EPISODES";
const UPDATE_FEATURED_EPISODE_ID = "repod/Shows/UPDATE_FEATURED_EPISODE_ID";
const UPSERT_EPISODES = "repod/Shows/UPSERT_EPISODES";
const UPDATE_ALL_EPISODE_LIST = "repod/Shows/UPDATE_ALL_EPISODE_LIST";
const UPDATE_SEARCH_EPISODE_LIST = "repod/Shows/UPDATE_SEARCH_EPISODE_LIST";
const UPSERT_CLAIMED_SHOW_ID = "repod/Shows/UPSERT_CLAIMED_SHOW_ID";
const UPDATE_CLAIMED_SHOW_ON_SHOW = "repod/Shows/UPDATE_CLAIMED_SHOW_ON_SHOW";

// Action Creators
export const upsertShows: ActionCreator<Action> = (shows: {
  [key: string]: ShowItem;
}) => ({
  type: UPSERT_SHOWS,
  shows,
});

const updateClaimedShowsList: ActionCreator<Action> = (
  claimedShowIds: string[]
) => ({
  type: UPDATE_CLAIMED_SHOWS,
  claimedShowIds,
});

export const upsertClaimedShowId: ActionCreator<Action> = (
  claimedShowId: string
) => ({
  type: UPSERT_CLAIMED_SHOW_ID,
  claimedShowId,
});

export const updateClaimedShowOnShow: ActionCreator<Action> = ({
  claimedShow,
  showId,
}: {
  claimedShow: ClaimedShowItems;
  showId: string;
}) => ({
  type: UPDATE_CLAIMED_SHOW_ON_SHOW,
  claimedShow,
  showId,
});

// Thunks
export const connectStripeAccount =
  (claimedShowId: string): ThunkResult<Promise<string[]>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      const onboardingURL = await fetchConnectedAccountOnboardingUrl({
        showId: claimedShowId,
      });

      console.log("connectStripeAccount onboardingURL", onboardingURL);

      return onboardingURL;
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
    [UPSERT_CLAIMED_SHOW_ID]: () => ({
      ...state,
      claimedShowIds: uniq([...state.claimedShowIds, action.claimedShowId]),
    }),
    [UPSERT_EPISODES]: () => ({
      ...state,
      byId: {
        ...state.byId,
        [action.showId]: {
          ...(state.byId[action.showId] || {}),
          episodesById: {
            ...((state.byId[action.showId] || {}).episodesById || {}),
            ...action.episodesById,
          },
        },
      },
      loadingEpisodes: false,
    }),
    [UPDATE_ALL_EPISODE_LIST]: () => ({
      ...state,
      byId: {
        ...state.byId,
        [action.showId]: {
          ...(state.byId[action.showId] || {}),
          allEpisodeIds: action.allEpisodeIds,
        },
      },
    }),
    [UPDATE_SEARCH_EPISODE_LIST]: () => ({
      ...state,
      byId: {
        ...state.byId,
        [action.showId]: {
          ...(state.byId[action.showId] || {}),
          searchEpisodeIds: action.searchEpisodeIds,
        },
      },
      loadingEpisodes: false,
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
    }),
    [START_EPISODES]: () => ({
      ...state,
      loadingEpisodes: true,
    }),
    [FINISH_EPISODES]: () => ({
      ...state,
      loadingEpisodes: false,
    }),
    [UPDATE_CLAIMED_SHOW_ON_SHOW]: () => ({
      ...state,
      byId: {
        ...state.byId,
        [action.showId]: {
          ...(state.byId[action.showId] || {}),
          claimedShow: action.claimedShow,
        },
      },
    }),
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
