import { createSelector } from "reselect";
import switchcase from "utils/switchcase";

// Initial State
const INITIAL_STATE: {
  userId: string | null;
} = {
  /* user id for the logged in user */
  userId: null,
};

const baseSelector = (state) => state.auth;
const getUserId = createSelector(baseSelector, (s) => s.userId);

export const selectors = {
  getUserId,
};

// Actions
const LOG_IN_SUCCESS = "repod/Auth/LOG_IN_SUCCESS";
export const LOGOUT = "repod/Auth/LOGOUT";

// Action Creators
const loginSuccess = (userId: string): ActionCreator => ({
  type: LOG_IN_SUCCESS,
  userId,
});

export const logout = (): ActionCreator => ({
  type: LOGOUT,
});

// Thunk
export const login = (userId: string) => async (dispatch) => {
  try {
    console.log("thunk login", userId);

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
    [LOGOUT]: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
