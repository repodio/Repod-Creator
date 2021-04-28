import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { getUser } from "utils/repodAPI";
import { wrapper } from "reduxConfig/store";
import { loginSuccess } from "modules/Auth";
import { upsertProfiles } from "modules/Profile";

// export const getServerSideProps = withAuthUserTokenSSR({
//   whenAuthed: AuthAction.RENDER,
// })(async (ctx) => {
//   // console.log("ctx", ctx);
//   const { AuthUser } = ctx;
//   const { id: userId, getIdToken } = AuthUser;

//   const idToken = await getIdToken();
//   const profile = await getUser({ userId }, idToken);
//   console.log(
//     "profile && profile.claimedShows && profile.claimedShows.length",
//     profile && profile.claimedShows && profile.claimedShows.length
//   );
//   if (profile && profile.claimedShows && profile.claimedShows.length) {
//     const { res } = ctx;
//     // res.setHeader("location", `/console/${profile.claimedShows[0]}`);
//     res.setHeader("location", `/console`);
//     res.statusCode = 302;
//     res.end();
//     return {
//       props: {},
//     };
//   } else {
//     const { res } = ctx;
//     res.setHeader("location", "/claim");
//     res.statusCode = 302;
//     res.end();
//     return {
//       props: {},
//     };
//   }
// });

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
})(
  wrapper.getServerSideProps(async (ctx) => {
    // console.log("ctx", ctx);
    const { AuthUser, store } = ctx;
    const { id, getIdToken } = AuthUser;
    const userId: string = id;
    const idToken = await getIdToken();
    const profile = await getUser({ userId }, idToken);

    await store.dispatch(loginSuccess(userId));
    await store.dispatch(
      upsertProfiles({
        [userId]: profile,
      })
    );

    if (profile && profile.claimedShows && profile.claimedShows.length) {
      const { res } = ctx;
      // res.setHeader("location", `/console/${profile.claimedShows[0]}`);
      res.setHeader("location", `/console`);
      res.statusCode = 302;
      res.end();
      return {
        props: {},
      };
    } else {
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

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(null);
