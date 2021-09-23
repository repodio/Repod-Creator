import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { RootState } from "reduxConfig/store";
import {
  filter,
  flow,
  isNil,
  omitBy,
  map,
  merge,
  reject,
  sumBy,
  uniq,
  values,
  omit,
} from "lodash/fp";
import { Action, ActionCreator } from "redux";
import { ThunkResult, AsyncDispatch } from "reduxConfig/redux";
import {
  createSubscriptionBenefit,
  createSubscriptionTier,
  getShowSubscriptionTiers,
  updateSubscriptionTier,
  updateSubscriptionBenefit,
  deleteSubscriptionTier,
  deleteSubscriptionBenefit,
} from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import generateUniqTitle from "utils/generateUniqTitle";
import SubscriptionBenefits from "constants/subscriptionBenefitTypes";

const DEFAULT_BENEFIT_TYPE = SubscriptionBenefits.bonusEpisodes;

const DEFAULT_SUBSCRIPTION_BENEFIT = {
  [SubscriptionBenefits.custom]: {
    title: "Custom Benefit",
    type: SubscriptionBenefits.custom,
  },
  [SubscriptionBenefits.bonusEpisodes]: {
    title: "Ad Free Episodes",
    type: SubscriptionBenefits.bonusEpisodes,
  },
  [SubscriptionBenefits.bonusEpisodes]: {
    title: "Bonus Episodes",
    type: SubscriptionBenefits.bonusEpisodes,
  },
  [SubscriptionBenefits.digitalDownloads]: {
    title: "Digital Downloads",
    type: SubscriptionBenefits.digitalDownloads,
  },
  [SubscriptionBenefits.earlyAccessEpisodes]: {
    title: "Early Access to Episodes",
    type: SubscriptionBenefits.earlyAccessEpisodes,
  },
  [SubscriptionBenefits.privateDiscussions]: {
    title: "Private Discussion Room",
    type: SubscriptionBenefits.privateDiscussions,
  },
};

const DEFAULT_SUBSCRIPTION_TIERS = {
  title: "Custom Subscription Tier",
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
  deletedSubscriptionTierIds: string[];
};

// Initial State
const INITIAL_STATE: StateType = {
  subscriptionTiersById: {},
  benefitsById: {},
  deletedSubscriptionTierIds: [],
};

// Selectors
const baseSelector = (state: RootState) => state.subscriptions;
const getSubscriptionTiersById = createSelector(
  baseSelector,
  (subscriptions) => subscriptions.subscriptionTiersById
);
const getBenefitsByIds = createSelector(
  baseSelector,
  (subscriptions) => subscriptions.benefitsById
);

const getBenefit = (benefitId) =>
  createSelector(getBenefitsByIds, (benefitsById) => benefitsById[benefitId]);

const getDeletedSubscriptionTierIds = createSelector(
  baseSelector,
  (subscriptions) => subscriptions.deletedSubscriptionTierIds || []
);

const getSubscriptionTiers = (showId) =>
  createSelector(
    getSubscriptionTiersById,
    getBenefitsByIds,
    getDeletedSubscriptionTierIds,
    (
      subscriptionTiersById,
      benefitsById,
      deletedSubscriptionTierIds
    ): SubscriptionTierItem[] =>
      flow(
        values,
        filter(
          (tier) =>
            tier.showId === showId &&
            !deletedSubscriptionTierIds.includes(tier.subscriptionTierId)
        ),
        map((tier) => ({
          ...tier,
          benefits: map((benefitId: string) => benefitsById[benefitId])(
            tier.benefitIds
          ),
        }))
      )(subscriptionTiersById)
  );

const getSubscriptionTier = (subscriptionTierId) =>
  createSelector(
    getSubscriptionTiersById,
    (subscriptionTiersById): SubscriptionTierItem =>
      subscriptionTiersById[subscriptionTierId]
  );

const getAllShowBenefits = (showId) =>
  createSelector(
    getBenefitsByIds,
    getSubscriptionTiersById,
    (benefitsById, tiersById): SubscriptionBenefitItem[] =>
      flow(
        values,
        filter((benefit) => benefit.showId === showId),
        map((benefit) => ({
          ...benefit,
          tiersCount: sumBy((id: string) =>
            (tiersById[id].benefitIds || []).includes(benefit.benefitId) ? 1 : 0
          )(Object.keys(tiersById)),
        }))
      )(benefitsById)
  );

const getAllSubscriptionTierTitles = (showId) =>
  createSelector(getSubscriptionTiersById, (subscriptionTiersById): string[] =>
    flow(
      values,
      filter((tier) => tier.showId === showId),
      map((tier) => tier.title)
    )(subscriptionTiersById)
  );

const getAllSubscriptionBenefitTitles = (showId) =>
  createSelector(getBenefitsByIds, (benefitsById): string[] =>
    flow(
      values,
      filter((tier) => tier.showId === showId),
      map((tier) => tier.title)
    )(benefitsById)
  );

export const selectors = {
  getSubscriptionTiers,
  getSubscriptionTier,
  getAllShowBenefits,
  getBenefit,
};

// Actions
const UPDATE_SUBSCRIPTION_TIER = "repod/Subscriptions/UPDATE_SUBSCRIPTION_TIER";
const UPSERT_SUBSCRIPTION_TIER = "repod/Subscriptions/UPSERT_SUBSCRIPTION_TIER";
const UPSERT_BENEFIT = "repod/Subscriptions/UPSERT_BENEFIT";
const UPSERT_BENEFIT_TO_SUBSCRIPTION_TIER =
  "repod/Subscriptions/UPSERT_BENEFIT_TO_SUBSCRIPTION_TIER";
const REMOVE_BENEFIT_SUBSCRIPTION_TIER =
  "repod/Subscriptions/REMOVE_BENEFIT_SUBSCRIPTION_TIER";
const REMOVE_SUBSCRIPTION_TIER = "repod/Subscriptions/REMOVE_SUBSCRIPTION_TIER";
const REMOVE_SUBSCRIPTION_BENEFIT =
  "repod/Subscriptions/REMOVE_SUBSCRIPTION_BENEFIT";

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

const updateSubscriptionTiers: ActionCreator<Action> = ({
  subscriptionTiersById,
}: {
  subscriptionTiersById: {
    [key: string]: SubscriptionTierItem;
  };
}) => ({
  type: UPDATE_SUBSCRIPTION_TIER,
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

export const upsertBenefitToSubscriptionTier: ActionCreator<Action> = ({
  benefitId,
  subscriptionTierId,
}: {
  benefitId: string;
  subscriptionTierId: string;
}) => ({
  type: UPSERT_BENEFIT_TO_SUBSCRIPTION_TIER,
  benefitId,
  subscriptionTierId,
});

export const removeBenefitFromSubscription: ActionCreator<Action> = ({
  benefitId,
  subscriptionTierId,
}: {
  benefitId: string;
  subscriptionTierId: string;
}) => ({
  type: REMOVE_BENEFIT_SUBSCRIPTION_TIER,
  benefitId,
  subscriptionTierId,
});

const clearSubscriptionTier: ActionCreator<Action> = ({
  subscriptionTierId,
}: {
  subscriptionTierId: string;
}) => ({
  type: REMOVE_SUBSCRIPTION_TIER,
  subscriptionTierId,
});

const clearSubscriptionBenefit: ActionCreator<Action> = ({
  benefitId,
}: {
  benefitId: string;
}) => ({
  type: REMOVE_SUBSCRIPTION_BENEFIT,
  benefitId,
});

// Thunk
export const createNewSubscriptionTier =
  ({ showId }: { showId?: string }): ThunkResult<Promise<string>> =>
  async (dispatch: AsyncDispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const existingSubscriptionTierTitles =
        getAllSubscriptionTierTitles(showId)(state);

      const uniqTitle = generateUniqTitle(
        DEFAULT_SUBSCRIPTION_TIERS.title,
        existingSubscriptionTierTitles
      );

      // return;
      const subscriptionTierId = await createSubscriptionTier({
        showId,
        title: uniqTitle,
        monthlyPrice: DEFAULT_SUBSCRIPTION_TIERS.monthlyPrice,
        published: DEFAULT_SUBSCRIPTION_TIERS.published,
        benefitIds: [],
      });

      if (!subscriptionTierId) {
        return;
      }

      dispatch(
        upsertSubscriptionTier({
          subscriptionTiersById: {
            [subscriptionTierId]: {
              showId,
              title: uniqTitle,
              monthlyPrice: DEFAULT_SUBSCRIPTION_TIERS.monthlyPrice,
              published: DEFAULT_SUBSCRIPTION_TIERS.published,
              benefitIds: [],
              createdOn: new Date(),
            },
          },
        })
      );

      return subscriptionTierId;
    } catch (error) {
      console.warn("[THUNK ERROR]: createNewSubscriptionTier", error);
    }
  };

export const saveSubscriptionTier =
  ({
    showId,
    subscriptionTierId,
    title,
    description,
    monthlyPrice,
    benefitIds,
    enableShippingAddress,
    published,
  }: {
    showId: string;
    subscriptionTierId: string;
    title?: string;
    description?: string;
    monthlyPrice?: number;
    benefitIds?: string[];
    enableShippingAddress?: boolean;
    published?: boolean;
  }): ThunkResult<Promise<void>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      await updateSubscriptionTier({
        showId,
        subscriptionTierId,
        title,
        description,
        monthlyPrice,
        benefitIds,
        enableShippingAddress,
        published,
      });

      dispatch(
        upsertSubscriptionTier({
          subscriptionTiersById: {
            [subscriptionTierId]: omitBy(isNil)({
              showId,
              title,
              description,
              monthlyPrice,
              benefitIds,
              enableShippingAddress,
              updatedOn: new Date(),
              published,
            }),
          },
        })
      );
    } catch (error) {
      console.warn("[THUNK ERROR]: saveSubscriptionTier", error);
    }
  };

export const removeSubscriptionTier =
  ({
    showId,
    subscriptionTierId,
  }: {
    showId: string;
    subscriptionTierId: string;
  }): ThunkResult<Promise<void>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      await deleteSubscriptionTier({
        showId,
        subscriptionTierId,
      });

      dispatch(clearSubscriptionTier({ subscriptionTierId }));
    } catch (error) {
      console.warn("[THUNK ERROR]: removeSubscriptionTier", error);
    }
  };

export const deleteBenefit =
  ({
    showId,
    benefitId,
  }: {
    showId: string;
    benefitId: string;
  }): ThunkResult<Promise<void>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      await deleteSubscriptionBenefit({
        showId,
        benefitId,
      });

      dispatch(clearSubscriptionBenefit({ benefitId }));
    } catch (error) {
      console.warn("[THUNK ERROR]: deleteBenefit", error);
    }
  };

export const createNewSubscriptionBenefit =
  ({
    showId,
    type,
  }: {
    showId: string;
    type: string;
  }): ThunkResult<Promise<string>> =>
  async (dispatch: AsyncDispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const existingSubscriptionBenefitTitles =
        getAllSubscriptionBenefitTitles(showId)(state);

      const title = generateUniqTitle(
        DEFAULT_SUBSCRIPTION_BENEFIT[type].title,
        existingSubscriptionBenefitTitles
      );

      const benefitId = await createSubscriptionBenefit({
        showId,
        title,
        type,
        rssFeed: "",
      });

      if (!benefitId) {
        return;
      }

      dispatch(
        upsertSubscriptionBenefit({
          benefitsById: {
            [benefitId]: {
              showId,
              title,
              type,
              rssFeed: "",
              benefitId,
              createdOn: new Date(),
            },
          },
        })
      );

      return benefitId;
    } catch (error) {
      console.warn("[THUNK ERROR]: createNewSubscriptionBenefit", error);
    }
  };

export const saveSubscriptionBenefit =
  ({
    showId,
    benefitId,
    title,
    type,
    rssFeed,
  }: {
    showId: string;
    benefitId: string;
    title?: string;
    type?: string;
    rssFeed?: string;
  }): ThunkResult<Promise<void>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      await updateSubscriptionBenefit({
        showId,
        benefitId,
        title,
        type,
        rssFeed,
      });

      dispatch(
        upsertSubscriptionBenefit({
          benefitsById: {
            [benefitId]: {
              title,
              type,
              rssFeed,
              updatedOn: new Date(),
            },
          },
        })
      );
    } catch (error) {
      console.warn("[THUNK ERROR]: saveSubscriptionBenefit", error);
    }
  };

export const createDefaultBenefitAndTier =
  ({ showId }: { showId: string }): ThunkResult<Promise<void>> =>
  async (dispatch: AsyncDispatch) => {
    try {
      const benefitData = {
        title: DEFAULT_SUBSCRIPTION_BENEFIT[DEFAULT_BENEFIT_TYPE].title,
        type: DEFAULT_BENEFIT_TYPE,
      };

      const benefitId = await createSubscriptionBenefit({
        showId,
        ...benefitData,
      });

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
        updateSubscriptionTiers({
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
    [UPDATE_SUBSCRIPTION_TIER]: () => ({
      ...state,
      subscriptionTiersById: action.subscriptionTiersById,
    }),
    [UPSERT_SUBSCRIPTION_TIER]: () => ({
      ...state,
      subscriptionTiersById: merge(state.subscriptionTiersById)(
        action.subscriptionTiersById
      ),
    }),
    [UPSERT_BENEFIT]: () => ({
      ...state,
      benefitsById: merge(state.benefitsById)(action.benefitsById),
    }),
    [UPSERT_BENEFIT_TO_SUBSCRIPTION_TIER]: () => {
      const subscriptionTier = state.subscriptionTiersById[
        action.subscriptionTierId
      ] || { benefitIds: [] };
      return {
        ...state,
        subscriptionTiersById: {
          ...state.subscriptionTiersById,
          [action.subscriptionTierId]: {
            ...subscriptionTier,
            benefitIds: uniq(
              (subscriptionTier.benefitIds || []).concat(action.benefitId)
            ),
          },
        },
      };
    },
    [REMOVE_BENEFIT_SUBSCRIPTION_TIER]: () => {
      const subscriptionTier = state.subscriptionTiersById[
        action.subscriptionTierId
      ] || { benefitIds: [] };

      return {
        ...state,
        subscriptionTiersById: {
          ...state.subscriptionTiersById,
          [action.subscriptionTierId]: {
            ...subscriptionTier,
            benefitIds: reject((id) => id === action.benefitId)(
              subscriptionTier.benefitIds || []
            ),
          },
        },
      };
    },
    [REMOVE_SUBSCRIPTION_TIER]: () => ({
      ...state,
      deletedSubscriptionTierIds: [
        ...(state.deletedSubscriptionTierIds || []),
        action.subscriptionTierId,
      ],
      subscriptionTiersById: omit([action.subscriptionTierId])(
        state.subscriptionTiersById
      ),
    }),
    [REMOVE_SUBSCRIPTION_BENEFIT]: () => ({
      ...state,
      benefitsById: omit([action.benefitId])(state.benefitsById),
    }),
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
