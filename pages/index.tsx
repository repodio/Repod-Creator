// ./pages/demo
import React from "react";
import {
  useAuthUser,
  withAuthUser,
  AuthAction,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import LogoutButton from "components/Buttons/logoutButton";
import { getUser } from "utils/repodAPI";
import ClaimButton from "components/Buttons/claimButton";
import { RepodLogo } from "components/Header";
import { ProfileDropdown } from "components/Dropdown";
import { wrapper } from "reduxConfig/store";
import { connect } from "react-redux";
import { getIdToken } from "firebaseHelpers/getIdToken";

interface HomeProps {
  profile: UserItem;
  children: JSX.Element[] | JSX.Element;
  idToken: string;
}

const Home = ({ profile, idToken }: HomeProps) => {
  const AuthUser = useAuthUser();
  console.log("Home", profile);

  return null;
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
})(async (ctx) => {
  // console.log("ctx", ctx);
  const { AuthUser } = ctx;
  const { id: userId, getIdToken } = AuthUser;

  const idToken = await getIdToken();
  const profile = await getUser({ userId }, idToken);

  console.log("Home getIdToken", idToken, profile);

  if (profile && profile.claimedShows && profile.claimedShows.length) {
    const { res } = ctx;
    res.setHeader("location", `/console/${profile.claimedShows[0]}`);
    res.statusCode = 302;
    res.end();
    return;
  } else {
    const { res } = ctx;
    res.setHeader("location", "/claim");
    res.statusCode = 302;
    res.end();
    return;
  }

  return {
    props: {
      profile,
    },
  };
});

// export const getServerSideProps = withAuthUserTokenSSR({
//   whenAuthed: AuthAction.RENDER,
// })(async ({ AuthUser }) =>
//   wrapper.getStaticProps((store) => ({ preview }) => {
//     const { id: userId, getIdToken } = AuthUser;
//     const idToken = await getIdToken();
//     console.log("Fetching profile");
//     const profile = await getUser({ userId }, idToken);

//     return {
//       props: {
//         profile,
//         idToken,
//       },
//     };
//   })
// );

// export const getServerSideProps = wrapper.getStaticProps(
//   (store) => ({ preview }) =>
//     withAuthUserTokenSSR({
//       whenAuthed: AuthAction.RENDER,
//     })(async ({ AuthUser }) => {
//       const { id: userId, getIdToken } = AuthUser;
//       const idToken = await getIdToken();
//       console.log("Fetching profile");
//       const profile = await getUser({ userId }, idToken);

//       return {
//         props: {
//           profile,
//           idToken,
//         },
//       };
//     })
// );

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);

// Home.getInitialProps = ({ store, pathname, query }) => {
//   console.log("GETINITIALPROPS");
//   console.log("Home.getInitialProps", store);
//   return { custom: "custom" }; // You can pass some custom props to the component from here
// };

// export default withAuthUser({
//   whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
//   whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
// })(connect((state) => state)(Home));
