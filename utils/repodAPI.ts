import { pickBy } from "lodash/fp";
import { getIdToken } from "firebaseHelpers/getIdToken";

const API_DOMAIN = process.env.REPOD_API_URL;

const dev = process.env.NODE_ENV === "development";

const protocol = dev ? "http://" : "https://";

const ROUTES = {
  search: "search",
  user: "user",
  claimShow: "claim-show",
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
  console.log("getHeaders getIdToken", serverIdToken, idToken, typeof window);
  return {
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

// const getShow = async ({ showId, type = "new" }, token) => {
//   const show = await fetch(`${API_DOMAIN}/v1/show/${showId}?type=${type}`, {
//     headers: getHeaders(token),
//   })
//     .then((data) => data.json())
//     .then(({ data }) => {
//       return data;
//     });

//   if (!show) {
//     console.log("getShow: response data got nothing");
//     return Promise.resolve();
//   }

//   return show;
// };

// const getEpisode = async ({ episodeId }, token) => {
//   const episode = await fetch(`${API_DOMAIN}/v1/episode/${episodeId}`, {
//     headers: getHeaders(token),
//   })
//     .then((data) => data.json())
//     .then(({ data }) => {
//       return data;
//     });

//   if (!episode) {
//     console.log("getEpisode: response data got nothing");
//     return Promise.resolve();
//   }

//   return episode;
// };

const search = async ({
  query,
  size = 5,
  type,
  includeRSS = false,
}: {
  query: string;
  size?: number;
  type: string;
  includeRSS?: boolean;
}) => {
  const response = await fetch(
    `${API_DOMAIN}/v1/${
      ROUTES.search
    }?type=${type}&size=${size}&queryString=${query}&includeRSS=${
      includeRSS ? 1 : 0
    }`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );
  return response.json();
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

  console.log("cleanUserObj", cleanUserObj);

  const response = await fetch(`${API_DOMAIN}/v1/${ROUTES.user}`, {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(cleanUserObj),
  }).then((data) => data.json());

  console.log("response", response);
};

const getUser = async ({ userId }, idToken?: string): Promise<UserItem> => {
  console.log("Url", `${API_DOMAIN}/v1/${ROUTES.user}?userId=${userId}`);

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
  console.log("what", `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}`);

  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}`,
    {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ type, verifyCode }),
    }
  ).then((data) => data.json());
  console.log("response", response);

  return response;
};

const sendVerificationCodeEmail = async ({
  showId,
}: {
  showId: string;
}): Promise<void> => {
  console.log("what", `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}`);

  const response = await fetch(
    `${API_DOMAIN}/v1/${ROUTES.claimShow}/${showId}/verify`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  ).then((data) => data.json());

  console.log("response", response);
};

export {
  // getEpisode,
  // getShow,
  getUser,
  setUser,
  search,
  claimShow,
  sendVerificationCodeEmail,
};
