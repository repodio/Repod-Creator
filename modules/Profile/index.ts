import { createSelector } from "reselect";
import switchcase from "utils/switchcase";

// Initial State
const INITIAL_STATE: {
  byId: {
    [key: string]: UserItem;
  };
} = {
  byId: {},
};

// Selectors
const baseSelector = (state) => state.profile;

const getProfilesById = createSelector(baseSelector, (profile) => profile.byId);

export const selectors = {
  getProfilesById,
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
