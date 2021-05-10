import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { getUser, setUser } from "utils/repodAPI";
import { upsertProfiles, selectors as profileSelectors } from "modules/Profile";
import { RootState } from "reduxConfig/store";

export type StateType = {
  userId: string | null;
};

// Initial State
const INITIAL_STATE: StateType = {
  /* user id for the logged in user */
  userId: null,
};

const baseSelector = (state: RootState) => state.auth;
const getUserId = createSelector(baseSelector, (s) => s.userId);
const getAuthedProfile = createSelector(
  getUserId,
  profileSelectors.getProfilesById,
  (userId, profilesById) => profilesById[userId]
);

export const selectors = {
  getUserId,
  getAuthedProfile,
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
export const login =
  (
    {
      userId,
    }: {
      userId: string;
    },
    idToken?: string
  ) =>
  async (dispatch) => {
    try {
      const profile = await getUser({ userId }, idToken);

      if (profile) {
        dispatch(
          upsertProfiles({
            [userId]: profile,
          })
        );
      }

      dispatch(loginSuccess(userId));

      return profile;
    } catch (error) {
      console.warn("[THUNK ERROR]: login", error);
    }
  };

export const updateUser =
  (
    {
      userId,
      email,
      displayName,
    }: {
      userId: string;
      email: string;
      displayName: string;
    },
    idToken?: string
  ) =>
  async (dispatch) => {
    try {
      dispatch(
        upsertProfiles({
          [userId]: {
            userId,
            email,
            displayName,
          },
        })
      );

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
