import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { RootState } from "reduxConfig/store";
import { filter, flow, get, pick, values } from "lodash/fp";
import { ThunkResult, AsyncDispatch } from "reduxConfig/redux";
import { getTeamMembers } from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import { selectors as authSelectors } from "modules/Auth";
import {
  selectors as showSelectors,
  updateClaimedShowOnShow,
} from "modules/Shows";

export type StateType = {
  byId: {
    [key: string]: UserItem;
  };
};

// Initial State
const INITIAL_STATE: StateType = {
  byId: {},
};

// Selectors
const baseSelector = (state: RootState) => state.profile;

const getProfilesById = createSelector(baseSelector, (profile) => profile.byId);

const getTeamMemberProfiles = (showId) =>
  createSelector(
    getProfilesById,
    showSelectors.getShowById(showId),
    authSelectors.getUserId,
    (allProfilesById, show, authedUserId) => {
      const userIds = Object.keys(get("claimedShow.users")(show) || {});
      return flow(
        pick(userIds),
        values,
        filter((user) => user.userId !== authedUserId)
      )(allProfilesById);
    }
  );

export const selectors = {
  getProfilesById,
  getTeamMemberProfiles,
};

// Actions
const UPSERT_PROFILES = "repod/Profile/UPSERT_PROFILES";

// Action Creators
export const upsertProfiles = (profilesById: {
  [key: string]: UserItem;
}): ActionCreator => ({
  type: UPSERT_PROFILES,
  profilesById,
});

// Thunk
export const fetchTeamMembers =
  (showId?: string): ThunkResult<Promise<string[]>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      const teamMembersResponse = await getTeamMembers(showId);

      dispatch(
        updateClaimedShowOnShow({
          showId,
          claimedShow: teamMembersResponse.claimedShow,
        })
      );

      const normalizedShows = convertArrayToObject(
        teamMembersResponse.profiles,
        "userId"
      );
      dispatch(upsertProfiles(normalizedShows));

      return Object.keys(normalizedShows);
    } catch (error) {
      console.warn("[THUNK ERROR]: login", error);
    }
  };

// Reducer
export default (state = INITIAL_STATE, action) =>
  switchcase({
    [UPSERT_PROFILES]: () => ({
      ...state,
      byId: {
        ...state.byId,
        ...action.profilesById,
      },
    }),
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
