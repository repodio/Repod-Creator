import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { RootState } from "reduxConfig/store";
import { filter, flow, map, values } from "lodash/fp";
import { Action, ActionCreator } from "redux";
import { ThunkResult, AsyncDispatch } from "reduxConfig/redux";
import {
  createSubscriptionBenefit,
  createSubscriptionTier,
  getShowSubscriptionTiers,
  getTeamMembers,
} from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import { selectors as authSelectors } from "modules/Auth";
import {
  selectors as showSelectors,
  updateClaimedShowOnShow,
} from "modules/Shows";

const DEFAULT_SUBSCRIPTION_BENEFIT = {
  title: "Ad Free Episodes",
  type: "adFreeEpisodes",
};

const DEFAULT_SUBSCRIPTION_TIERS = {
  title: "Awesome Member",
  monthlyPrice: 500,
  published: false,
};

export type StateType = {
  subscriptionTiersById: {
    [key: string]: SubscriptionTierItem;
  };
  benefitsById: {
    [key: string]: SubscriptionBenefitItem;
  };
};

// Initial State
const INITIAL_STATE: StateType = {
  subscriptionTiersById: {},
  benefitsById: {},
};

// Selectors
const baseSelector = (state: RootState) => state.subscriptions;
const getBenefitsByIds = createSelector(
  baseSelector,
  (subscriptions) => subscriptions.benefitsById
);

const getSubscriptionTiers = (showId) =>
  createSelector(
    baseSelector,
    getBenefitsByIds,
    (subscriptions, benefitsById): SubscriptionTierItem[] =>
      flow(
        values,
        filter((tier) => tier.showId === showId),
        map((tier) => ({
          ...tier,
          benefits: map((benefitId: string) => benefitsById[benefitId])(
            tier.benefitIds
          ),
        }))
      )(subscriptions.subscriptionTiersById)
  );

export const selectors = {
  getSubscriptionTiers,
};

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

export const createDefaultBenefitAndTier =
  ({ showId }: { showId: string }): ThunkResult<Promise<void>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      const benefitData = {
        title: DEFAULT_SUBSCRIPTION_BENEFIT.title,
        type: DEFAULT_SUBSCRIPTION_BENEFIT.type,
      };
      console.log("createDefaultBenefitAndTier benefitData", benefitData);
      const benefitId = await createSubscriptionBenefit({
        showId,
        ...benefitData,
      });
      console.log("createDefaultBenefitAndTier benefitId", benefitId);

      dispatch(
        upsertSubscriptionBenefit({
          benefitsById: {
            [benefitId]: {
              showId,
              benefitId,
              createdOn: new Date(),
              ...benefitData,
            },
          },
        })
      );

      const subscriptionTierId = await createSubscriptionTier({
        showId,
        title: DEFAULT_SUBSCRIPTION_TIERS.title,
        monthlyPrice: DEFAULT_SUBSCRIPTION_TIERS.monthlyPrice,
        published: DEFAULT_SUBSCRIPTION_TIERS.published,
        benefitIds: [benefitId],
      });
      console.log(
        "createDefaultBenefitAndTier subscriptionTierId",
        subscriptionTierId
      );

      dispatch(
        upsertSubscriptionTier({
          subscriptionTiersById: {
            [subscriptionTierId]: {
              title: DEFAULT_SUBSCRIPTION_TIERS.title,
              monthlyPrice: DEFAULT_SUBSCRIPTION_TIERS.monthlyPrice,
              published: DEFAULT_SUBSCRIPTION_TIERS.published,
              benefitIds: [benefitId],
              showId,
              subscriptionTierId,
              createdOn: new Date(),
            },
          },
        })
      );

      return;
    } catch (error) {
      console.warn("[THUNK ERROR]: createDefaultSubscriptionTiers", error);
    }
  };

export const fetchShowSubscriptionTiers =
  (showId: string): ThunkResult<Promise<void>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      const { subscriptionTiers, subscriptionBenefits } =
        await getShowSubscriptionTiers({ showId });

      const normalizedBenefits = convertArrayToObject(
        subscriptionBenefits,
        "benefitId"
      );
      const normalizedTiers = convertArrayToObject(
        subscriptionTiers,
        "subscriptionTierId"
      );
      dispatch(
        upsertSubscriptionBenefit({
          benefitsById: normalizedBenefits,
        })
      );
      dispatch(
        upsertSubscriptionTier({
          subscriptionTiersById: normalizedTiers,
        })
      );
    } catch (error) {
      console.warn("[THUNK ERROR]: fetchShowSubscriptionTiers", error);
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
