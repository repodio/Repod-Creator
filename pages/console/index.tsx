import React from "react";
import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { wrapper } from "reduxConfig/store";
import { upsertShows, fetchClaimedShows } from "modules/Shows";
import { useStore } from "react-redux";

interface ConsoleProps {
  profile: UserItem;
  children: JSX.Element[] | JSX.Element;
  showId: string;
}

const Console = ({ profile }: ConsoleProps) => {
  const store = useStore();
  const AuthUser = useAuthUser();

  return (
    <>
      <div>
        <p>Console {AuthUser.email ? AuthUser.email : "unknown"}.</p>
      </div>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
})(
  wrapper.getServerSideProps(async (ctx) => {
    const { AuthUser, store } = ctx;
    const { id: userId, getIdToken } = AuthUser;
    // console.log("getServerSideProps store", store);
    // console.log("getServerSideProps AuthUser", AuthUser);

    const idToken = await getIdToken();

    const claimedShows = await store.dispatch(fetchClaimedShows({ idToken }));

    console.log("claimedShows", claimedShows);
    if (claimedShows && claimedShows.length) {
      console.log(
        "re-routing to ",
        `/console/${claimedShows[0] && claimedShows[0].showId}`
      );
      const { res } = ctx;
      res.setHeader(
        "location",
        `/console/${claimedShows[0] && claimedShows[0].showId}`
      );
      res.statusCode = 302;
      res.end();
      return {
        props: {},
      };
    } else {
      console.log("re-routing to ", `/claim`);

      const { res } = ctx;
      res.setHeader("location", "/claim");
      res.statusCode = 302;
      res.end();
      return {
        props: {},
      };
    }
  })
);

// export const getServerSideProps = withAuthUserTokenSSR({
//   whenAuthed: AuthAction.RENDER,
// })(async (ctx) => {
//   const { AuthUser } = ctx;
//   const { id: userId, getIdToken } = AuthUser;

//   const idToken = await getIdToken();
//   const claimedShows = await getClaimedShows(idToken);
//   console.log("claimedShows", claimedShows.length);
//   if (claimedShows && claimedShows.length) {
//     console.log(
//       "re-routing to ",
//       `/console/${claimedShows[0] && claimedShows[0].showId}`
//     );
//     const { res } = ctx;
//     res.setHeader(
//       "location",
//       `/console/${claimedShows[0] && claimedShows[0].showId}`
//     );
//     res.statusCode = 302;
//     res.end();
//     return {
//       props: {
//         claimedShows,
//       },
//     };
//   } else {
//     console.log("re-routing to ", `/claim`);

//     const { res } = ctx;
//     res.setHeader("location", "/claim");
//     res.statusCode = 302;
//     res.end();
//     return {
//       props: {},
//     };
//   }
// });

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Console);
