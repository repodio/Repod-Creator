// import { auth } from "../firebase/client";
// import nookies, { parseCookies } from "nookies";
import { useAuthUser } from "next-firebase-auth";

const API_DOMAIN = process.env.REPOD_API_URL;

const dev = process.env.NODE_ENV === "development";

const protocol = dev ? "http://" : "https://";

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

const getHeaders = async (idToken) => {
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

// const search = async ({ query, size = 5, type }) => {
//   return await fetch(
//     `${API_DOMAIN}/v1/search?type=${type}&size=${size}&queryString=${query}`
//   ).then((data) => data.json());
// };

const getUser = async ({ userId }, idToken): Promise<UserItem> => {
  console.log("what", `${API_DOMAIN}/v1/user?userId=${userId}`);
  const user = await fetch(`${API_DOMAIN}/v1/user?userId=${userId}`, {
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

const claimShow = async (
  { showId, type }: { showId: string; type: string },
  idToken
): Promise<void> => {
  console.log("what", `${API_DOMAIN}/v1/claim-show/${showId}`);

  const response = await fetch(`${API_DOMAIN}/v1/claim-show/${showId}`, {
    method: "POST",
    headers: await getHeaders(idToken),
    body: JSON.stringify({ type }),
  }).then((data) => data.json());

  console.log("response", response);
};

export {
  // getEpisode,
  // getShow,
  getUser,
  // search,
  claimShow,
};
