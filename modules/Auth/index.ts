import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { getUser } from "utils/repodAPI";
import { upsertProfiles, selectors as profileSelectors } from "modules/Profile";

// Initial State
const INITIAL_STATE: {
  userId: string | null;
} = {
  /* user id for the logged in user */
  userId: null,
};

const baseSelector = (state) => state.auth;
const getUserId = createSelector(baseSelector, (s) => s.userId);
const getAuthedUser = createSelector(
  getUserId,
  profileSelectors.getProfilesById,
  (userId, profilesById) => profilesById[userId]
);

export const selectors = {
  getUserId,
  getAuthedUser,
};

// Actions
const LOG_IN_SUCCESS = "repod/Auth/LOG_IN_SUCCESS";

// Action Creators
export const loginSuccess = (userId: string): ActionCreator => ({
  type: LOG_IN_SUCCESS,
  userId,
});

export const logout = (): ActionCreator => ({
  type: "LOGOUT",
});

// Thunk
export const login = (userId: string) => async (dispatch) => {
  try {
    const profile = await getUser({ userId });
    if (profile) {
      dispatch(
        upsertProfiles({
          [userId]: profile,
        })
      );
    }

    dispatch(loginSuccess(userId));
  } catch (error) {
    console.warn("[THUNK ERROR]: login", error);
  }
};

// Reducer
export default (state = INITIAL_STATE, action) =>
  switchcase({
    [LOG_IN_SUCCESS]: () => ({
      ...state,
      userId: action.userId,
    }),
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
