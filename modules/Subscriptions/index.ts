import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { RootState } from "reduxConfig/store";
import { filter, flow, get, pick, values } from "lodash/fp";
import { Action, ActionCreator } from "redux";
import { ThunkResult, AsyncDispatch } from "reduxConfig/redux";
import {
  createSubscriptionBenefit,
  createSubscriptionTier,
  getTeamMembers,
} from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import { selectors as authSelectors } from "modules/Auth";
import {
  selectors as showSelectors,
  updateClaimedShowOnShow,
} from "modules/Shows";

export type StateType = {
  subscriptionTiersById: {
    [key: string]: UserItem;
  };
  benefitsById: {
    [key: string]: UserItem;
  };
};

// Initial State
const INITIAL_STATE: StateType = {
  subscriptionTiersById: {},
  benefitsById: {},
};

// Selectors
const baseSelector = (state: RootState) => state.subscriptions;

const getProfilesById = createSelector(
  baseSelector,
  (subscriptions) => subscriptions.subscriptionTiersById
);

// const getTeamMemberProfiles = (showId) =>
//   createSelector(
//     getProfilesById,
//     showSelectors.getShowById(showId),
//     authSelectors.getUserId,
//     (allProfilesById, show, authedUserId) => {
//       const userIds = Object.keys(get("claimedShow.users")(show) || {});
//       return flow(
//         pick(userIds),
//         values,
//         filter((user) => user.userId !== authedUserId)
//       )(allProfilesById);
//     }
//   );

// export const selectors = {
//   getProfilesById,
//   getTeamMemberProfiles,
// };

// Actions
const UPSERT_SUBSCRIPTION_TIER = "repod/Subscriptions/UPSERT_SUBSCRIPTION_TIER";
const UPSERT_BENEFIT = "repod/Subscriptions/UPSERT_BENEFIT";

// Action Creators
export const upsertSubscriptionTier: ActionCreator<Action> = ({
  subscriptionTiersById,
}: {
  subscriptionTiersById: {
    [key: string]: SubscriptionTierItem;
  };
}) => ({
  type: UPSERT_SUBSCRIPTION_TIER,
  subscriptionTiersById,
});

export const upsertSubscriptionBenefit: ActionCreator<Action> = ({
  benefitsById,
}: {
  benefitsById: {
    [key: string]: SubscriptionBenefitItem;
  };
}) => ({
  type: UPSERT_BENEFIT,
  benefitsById,
});

// Thunk
export const createNewSubscriptionTier =
  ({
    showId,
    title,
    monthlyPrice,
    description,
    enableShippingAddress,
    published,
    benefitIds,
  }: {
    showId?: string;
    title: string;
    monthlyPrice: number;
    description?: string;
    enableShippingAddress?: boolean;
    published: boolean;
    benefitIds?: string[];
  }): ThunkResult<Promise<void>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      const subscriptionTierId = await createSubscriptionTier({
        showId,
        title,
        monthlyPrice,
        description,
        enableShippingAddress,
        published,
        benefitIds,
      });

      dispatch(
        upsertSubscriptionTier({
          subscriptionTiersById: {
            [subscriptionTierId]: {
              title,
              monthlyPrice,
              description,
              enableShippingAddress,
              published,
              benefitIds,
              showId,
              subscriptionTierId,
            },
          },
        })
      );

      return;
    } catch (error) {
      console.warn("[THUNK ERROR]: createDefaultSubscriptionTiers", error);
    }
  };

export const createNewSubscriptionBenefit =
  ({
    showId,
    title,
    type,
    rssFeed,
  }: {
    showId: string;
    title: string;
    type: string;
    rssFeed?: string;
  }): ThunkResult<Promise<void>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      const benefitId = await createSubscriptionBenefit({
        showId,
        title,
        type,
        rssFeed,
      });

      dispatch(
        upsertSubscriptionBenefit({
          benefitsById: {
            [benefitId]: {
              showId,
              title,
              type,
              rssFeed,
              benefitId,
            },
          },
        })
      );

      return;
    } catch (error) {
      console.warn("[THUNK ERROR]: createDefaultSubscriptionTiers", error);
    }
  };

// Reducer
export default (state = INITIAL_STATE, action) =>
  switchcase({
    [UPSERT_SUBSCRIPTION_TIER]: () => ({
      ...state,
      subscriptionTiersById: {
        ...state.subscriptionTiersById,
        ...action.subscriptionTiersById,
      },
    }),
    [UPSERT_BENEFIT]: () => ({
      ...state,
      benefitsById: {
        ...state.benefitsById,
        ...action.benefitsById,
      },
    }),
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
