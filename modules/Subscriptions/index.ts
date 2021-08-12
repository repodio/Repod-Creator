import { createSelector } from "reselect";
import switchcase from "utils/switchcase";
import { RootState } from "reduxConfig/store";
import { filter, flow, map, merge, sumBy, values } from "lodash/fp";
import { Action, ActionCreator } from "redux";
import { ThunkResult, AsyncDispatch } from "reduxConfig/redux";
import {
  createSubscriptionBenefit,
  createSubscriptionTier,
  getShowSubscriptionTiers,
  getTeamMembers,
  updateSubscriptionTier,
} from "utils/repodAPI";
import { convertArrayToObject } from "utils/normalizing";
import { selectors as authSelectors } from "modules/Auth";
import {
  selectors as showSelectors,
  updateClaimedShowOnShow,
} from "modules/Shows";
import generateUniqTitle from "utils/generateUniqTitle";
import SubscriptionBenefits from "constants/subscriptionBenefitTypes";

const DEFAULT_BENEFIT_TYPE = SubscriptionBenefits.adFreeEpisodes;

const DEFAULT_SUBSCRIPTION_BENEFIT = {
  [SubscriptionBenefits.custom]: {
    title: "Custom Benefit",
    type: SubscriptionBenefits.custom,
  },
  [SubscriptionBenefits.adFreeEpisodes]: {
    title: "Ad Free Episodes",
    type: SubscriptionBenefits.adFreeEpisodes,
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
};

// Initial State
const INITIAL_STATE: StateType = {
  subscriptionTiersById: {},
  benefitsById: {},
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
  createSelector(getBenefitsByIds, (benefitsByIds) => benefitsByIds[benefitId]);

const getSubscriptionTiers = (showId) =>
  createSelector(
    getSubscriptionTiersById,
    getBenefitsByIds,
    (subscriptionTiersById, benefitsById): SubscriptionTierItem[] =>
      flow(
        values,
        filter((tier) => tier.showId === showId),
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
    getBenefitsByIds,
    (subscriptionTiersById, benefitsById): SubscriptionTierItem => {
      const tier = subscriptionTiersById[subscriptionTierId];
      return tier
        ? {
            ...tier,
            benefits: map((benefitId: string) => benefitsById[benefitId])(
              tier.benefitIds
            ),
          }
        : null;
    }
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
      console.warn("[THUNK ERROR]: createDefaultSubscriptionTiers", error);
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
  }: {
    showId: string;
    subscriptionTierId: string;
    title?: string;
    description?: string;
    monthlyPrice?: number;
    benefitIds?: string[];
    enableShippingAddress?: boolean;
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
      });

      dispatch(
        upsertSubscriptionTier({
          subscriptionTiersById: {
            [subscriptionTierId]: {
              showId,
              title,
              description,
              monthlyPrice,
              benefitIds,
              enableShippingAddress,
              updatedOn: new Date(),
            },
          },
        })
      );
    } catch (error) {
      console.warn("[THUNK ERROR]: createDefaultSubscriptionTiers", error);
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
      console.warn("[THUNK ERROR]: createDefaultSubscriptionTiers", error);
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
      subscriptionTiersById: merge(state.subscriptionTiersById)(
        action.subscriptionTiersById
      ),
    }),
    [UPSERT_BENEFIT]: () => ({
      ...state,
      benefitsById: merge(state.benefitsById)(action.benefitsById),
    }),
    LOGOUT: () => ({
      ...INITIAL_STATE,
    }),
  })(state)(action.type);
