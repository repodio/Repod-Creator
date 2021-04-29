import { Action, ActionCreator } from "redux";
import { ThunkAction } from "redux-thunk";
import { ThunkDispatch } from "redux-thunk";

export type ThunkResult<R> = ThunkAction<R, {}, undefined, Action>;
export type AsyncDispatch = ThunkDispatch<{}, undefined, AuthActionTypes>;
