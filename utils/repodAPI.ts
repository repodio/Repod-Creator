import { pickBy } from "lodash/fp";
import { getIdToken } from "firebaseHelpers/getIdToken";

const API_DOMAIN = process.env.REPOD_API_URL;

const dev = process.env.NODE_ENV === "development";

const protocol = dev ? "http://" : "https://";

const ROUTES = {
  search: "search",
  user: "user",
  claimShow: "claim-show",
  claimShows: "claim-shows",
  subscriptions: "subscriptions",
  subscription: "subscription",
};

export const COUNTRY_CODES = {
  CA: {
    key: "CA",
    label: "Canada",
  },
  GB: {
    key: "GB",
    label: "United Kingdom",
  },
  US: {
    key: "US",
    label: "United States",
  },
};

const verifyToken = async (token, ctx) => {
  let host;

  if (ctx?.req) {
    host = ctx.req.headers.host;
  } else if (typeof location !== "undefined") {
    host = location.host;
  }

  return await fetch(`${protocol}${host}/api/validateAuth`, {
    headers: {
      "Context-Type": "application/json",
      Authorization: JSON.stringify({ token: token }),
    },
  }).then((res) => res.json());
};

const getHeaders = async (serverIdToken?: string) => {
  const idToken = serverIdToken || (await getIdToken());

  return {
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

const fetchClaimedShowsAPI = async (token?: string) => {
  const shows = await fetch(`${API_DOMAIN}/v1/${ROUTES.claimShows}`, {
    method: "GET",
    headers: await getHeaders(token),
  })
    .then((data) => data.json())
    .then(({ data }) => {
      return data;
    });

  if (!shows) {
    console.log("fetchClaimedShowsAPI: response data got nothing");
  }

  return shows;
};

const getTeamMembers = async (showId?: string) => {
  const data = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/team`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  )
    .then((data) => data.json())
    .then(({ data }) => {
      return data;
    });

  if (!data) {
    console.log("fetchClaimedShowsAPI: response data got nothing");
  }

  return data;
};

const fetchShowData = async (
  { showId }: { showId: string },
  token?: string
) => {
  const data = await fetch(`${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}`, {
    method: "GET",
    headers: await getHeaders(token),
  })
    .then((data) => data.json())
    .then(({ data }) => {
      return data;
    });

  if (!data) {
    console.log("fetchShowData: response data got nothing");
  }

  return data;
};

const getEpisodes = async ({ showId, cursor }) => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/episodes${
      cursor ? `?cursor=${cursor}` : ""
    }`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  ).then((data) => data.json());

  if (!response) {
    console.log("getEpisode: response data got nothing");
    return Promise.resolve();
  }

  return response;
};

const searchShows = async ({
  query,
  size = 5,
  includeRSS = false,
  cursor = 0,
}: {
  query: string;
  size?: number;
  includeRSS?: boolean;
  cursor?: number;
}) => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${
      ROUTES.search
    }?type=shows&size=${size}&cursor=${cursor}&queryString=${query}&includeRSS=${
      includeRSS ? 1 : 0
    }`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );
  return response.json();
};

const searchEpisodes = async ({
  query,
  size = 5,
  showId,
}: {
  query: string;
  size?: number;
  showId?: string;
}): Promise<{
  items: EpisodeItem[];
  cursor: number;
  total: number;
}> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.search}?type=episodes&size=${size}&queryString=${query}&showId=${showId}`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );
  return response.json();
};

const createSubscriptionTier = async ({
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
}): Promise<string> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscriptions}/${showId}`,
    {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({
        title,
        monthlyPrice,
        description,
        enableShippingAddress,
        published,
        benefitIds,
      }),
    }
  );
  const json = await response.json();

  return json.data;
};

const updateSubscriptionTier = async ({
  showId,
  subscriptionTierId,
  title,
  monthlyPrice,
  description,
  enableShippingAddress,
  benefitIds,
  published,
}: {
  showId: string;
  subscriptionTierId: string;
  title?: string;
  monthlyPrice: number;
  description?: string;
  enableShippingAddress?: boolean;
  benefitIds?: string[];
  published?: boolean;
}): Promise<string> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscriptions}/${showId}/${subscriptionTierId}`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({
        title,
        monthlyPrice,
        description,
        enableShippingAddress,
        benefitIds,
        published,
      }),
    }
  );
  const json = await response.json();

  return json.data;
};

const deleteSubscriptionTier = async ({
  showId,
  subscriptionTierId,
}: {
  showId: string;
  subscriptionTierId: string;
}): Promise<void> => {
  await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscriptions}/${showId}/${subscriptionTierId}`,
    {
      method: "DELETE",
      headers: await getHeaders(),
    }
  );
};

const deleteSubscriptionBenefit = async ({
  showId,
  benefitId,
}: {
  showId: string;
  benefitId: string;
}): Promise<void> => {
  await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscriptions}/${showId}/benefits/${benefitId}`,
    {
      method: "DELETE",
      headers: await getHeaders(),
    }
  );
};

const updateSubscriptionBenefit = async ({
  showId,
  benefitId,
  title,
  type,
}: {
  showId: string;
  benefitId: string;
  title: string;
  type: string;
}): Promise<string> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscriptions}/${showId}/benefits/${benefitId}`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({
        title,
        type,
      }),
    }
  );
  const json = await response.json();

  return json.data;
};

const createSubscriptionBenefit = async ({
  showId,
  title,
  type,
}: {
  showId?: string;
  title: string;
  type: string;
}): Promise<string> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscriptions}/${showId}/benefits`,
    {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({
        title,
        type,
      }),
    }
  );
  const json = await response.json();

  return json.data;
};

const getShowSubscriptionTiers = async ({
  showId,
}: {
  showId?: string;
}): Promise<{
  subscriptionTiers: SubscriptionTierItem[];
  subscriptionBenefits: SubscriptionBenefitItem[];
}> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscriptions}/${showId}`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );
  const json = await response.json();

  return json.data;
};

const setUser = async ({
  userId,
  email,
  displayName,
  twitterId,
}: {
  userId: string;
  email: string;
  displayName: string;
  twitterId?: string;
}): Promise<void> => {
  const cleanUserObj = pickBy((item) => item !== undefined && item !== null)({
    userId,
    email,
    displayName,
    twitterId,
  });

  const response = await fetch(`${API_DOMAIN}/v1/${ROUTES.user}`, {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(cleanUserObj),
  }).then((data) => data.json());
};

const getUser = async ({ userId }, idToken?: string): Promise<UserItem> => {
  const user = await fetch(`${API_DOMAIN}/v1/${ROUTES.user}?userId=${userId}`, {
    headers: await getHeaders(idToken),
  })
    .then((data) => data.json())
    .then(({ data }) => {
      return data;
    });

  if (!user) {
    console.log("getUser: response data got nothing");
    return null;
  }

  return user;
};

const claimShow = async ({
  showId,
  type,
  verifyCode,
}: {
  showId: string;
  type: string;
  verifyCode: string;
}): Promise<{
  message?: string;
  code?: string;
  success: boolean;
}> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}`,
    {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ type, verifyCode }),
    }
  ).then((data) => data.json());

  return response;
};

const sendVerificationCodeEmail = async ({
  showId,
}: {
  showId: string;
}): Promise<{
  error?: {
    code: string;
  };
}> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/verify`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  ).then((data) => data.json());

  return response;
};

const setFeaturedEpisodeId = async ({
  showId,
  episodeId,
}: {
  showId: string;
  episodeId: string;
}): Promise<{
  success: boolean;
}> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/featuredepisode`,
    {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ episodeId }),
    }
  ).then((data) => data.json());

  return response;
};

const setWelcomeNotes = async ({
  showId,
  customWelcomeNotesPerTier,
  globalWelcomeNote,
  customWelcomeNotes,
}: {
  showId: string;
  customWelcomeNotesPerTier: boolean;
  globalWelcomeNote?: string;
  customWelcomeNotes?: {
    subscriptionTierId: string;
    customWelcomeNote: string;
  }[];
}): Promise<{
  success: boolean;
}> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/welcomenotes`,
    {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({
        customWelcomeNotesPerTier,
        globalWelcomeNote,
        customWelcomeNotes,
      }),
    }
  ).then((data) => data.json());

  return response;
};

const fetchMembers = async ({
  showId,
}: {
  showId: string;
}): Promise<MemberData[]> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/members`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  ).then((data) => data.json());

  console.log("fetchMembers response: ", response);
  return response.members;
};

const fetchConnectedAccountOnboardingUrl = async ({
  showId,
  countryCode = COUNTRY_CODES.US.key,
}: {
  showId: string;
  countryCode: string;
}): Promise<string> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/connect-account?country=${countryCode}`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  ).then((data) => data.json());

  return response.url;
};

const notifySuccessfulStripeAccountRedirect = async ({
  showId,
}: {
  showId: string;
}): Promise<string> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/successful-account`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  ).then((data) => data.json());

  return response.stripeAccountId;
};

const fetchClaimedShowMonetizesAPI = async ({
  showId,
}: {
  showId: string;
}): Promise<{
  tips;
  totalTipVolume;
  claimedShow;
}> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/monetization`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  ).then((data) => data.json());

  return response;
};

const removeStripeAccountIdOnShow = async ({
  showId,
}: {
  showId: string;
}): Promise<string> => {
  return fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/connect-account`,
    {
      method: "DELETE",
      headers: await getHeaders(),
    }
  ).then((data) => data.json());
};

const fetchSubscriptionRSSFeedAndEpisodes = async ({
  showId,
}: {
  showId: string;
}): Promise<{
  rssUrl: string;
  rssStatus: string;
  episodes: EpisodeItem[];
  subscriptionTiers: SubscriptionTierItem[];
  total: number;
}> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscription}/${showId}/rss`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  ).then((data) => data.json());

  return response && response.data;
};

const updateSubscriptionRSSFeed = async ({
  showId,
  rssUrl,
}: {
  showId: string;
  rssUrl: string;
}): Promise<boolean> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscription}/${showId}/rss`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify({
        rssUrl,
      }),
    }
  ).then((data) => data.json());

  return response && response.success;
};

const updateSubscriptionTiersForEpisodes = async ({
  showId,
  episodeIds,
  subscriptionTierIds,
}: {
  showId: string;
  episodeIds: string[];
  subscriptionTierIds: string[];
}): Promise<void> => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.subscription}/${showId}/episodes`,
    {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({
        episodeIds,
        subscriptionTierIds,
      }),
    }
  ).then((data) => data.json());

  return response && response.success;
};

export {
  getEpisodes,
  fetchClaimedShowsAPI,
  getTeamMembers,
  getUser,
  setUser,
  searchShows,
  searchEpisodes,
  claimShow,
  sendVerificationCodeEmail,
  fetchShowData,
  setFeaturedEpisodeId,
  setWelcomeNotes,
  fetchConnectedAccountOnboardingUrl,
  notifySuccessfulStripeAccountRedirect,
  removeStripeAccountIdOnShow,
  fetchClaimedShowMonetizesAPI,
  createSubscriptionTier,
  createSubscriptionBenefit,
  getShowSubscriptionTiers,
  updateSubscriptionTier,
  updateSubscriptionBenefit,
  deleteSubscriptionTier,
  deleteSubscriptionBenefit,
  fetchMembers,
  updateSubscriptionRSSFeed,
  fetchSubscriptionRSSFeedAndEpisodes,
  updateSubscriptionTiersForEpisodes,
};
