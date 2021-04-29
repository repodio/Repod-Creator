import firebase from "./init";
import "firebase/auth";
import { setUser } from "utils/repodAPI";
import { get } from "lodash/fp";
import { useDispatch } from "react-redux";
import { login, logout } from "modules/Auth";
import { getIdToken } from "firebaseHelpers/getIdToken";

const signInWithProvider = async (provider) => {
  try {
    const response = await firebase.auth().signInWithPopup(provider);
    const user = response.user;

    const providerEmail = get('providerData["0"].email')(user) || user.email;
    const providerTwitterId = get('providerData["0"].uid')(user) || null;
    const providerDisplayName =
      get('providerData["0"].displayName')(user) || user.displayName;

    const idToken = await (user && user.getIdToken && user.getIdToken());

    await setUser({
      email: providerEmail,
      displayName: providerDisplayName,
      userId: user.uid,
      twitterId: providerTwitterId,
    });
    console.log("signInWithProvider user", user);
    return response;
  } catch (error) {
    console.log("signInWithProvider error", error);
    return { error };
  }
};

const AppleSignIn = () => {
  var provider = new firebase.auth.OAuthProvider("apple.com");

  return signInWithProvider(provider);
};

const FacebookSignIn = () => {
  var provider = new firebase.auth.FacebookAuthProvider();

  return signInWithProvider(provider);
};

const TwitterSignIn = () => {
  var provider = new firebase.auth.TwitterAuthProvider();

  return signInWithProvider(provider);
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = firebase.auth();
  console.log("useAuth called");
  return {
    signIn: async ({
      email,
      password,
      provider,
    }: {
      email?: string;
      password?: string;
      provider?: string;
    }) => {
      console.log("signIn");
      if (email && password) {
        try {
          const response = await auth.signInWithEmailAndPassword(
            email,
            password
          );
          const userId = response.user && response.user.uid;

          dispatch(login({ userId }));

          return response.user;
        } catch (error) {
          return { error };
        }
      } else if (provider) {
        switch (provider) {
          case AUTH_PROVIDERS.apple:
            return AppleSignIn();
          case AUTH_PROVIDERS.facebook:
            return FacebookSignIn();
          case AUTH_PROVIDERS.twitter:
            return TwitterSignIn();
          default:
            return;
        }
      }
    },
    signOut: () => {
      console.log("signing out");
      dispatch(logout());
      auth.signOut();
    },
    signUp: async ({
      email,
      password,
      name,
      provider,
    }: {
      email?: string;
      password?: string;
      name?: string;
      provider?: string;
    }) => {
      try {
        if (email && password) {
          const response = await auth.createUserWithEmailAndPassword(
            email,
            password
          );

          const user = auth.currentUser;

          const idToken = await (user && user.getIdToken && user.getIdToken());
          await setUser(
            {
              email,
              displayName: name,
              userId: user.uid,
            },
            idToken
          );

          return response;
        } else if (provider) {
          switch (provider) {
            case AUTH_PROVIDERS.apple:
              return AppleSignIn();
            case AUTH_PROVIDERS.facebook:
              return FacebookSignIn();
            case AUTH_PROVIDERS.twitter:
              return TwitterSignIn();
            default:
              return;
          }
        }
      } catch (error) {
        console.log("error", error);
        return { error };
      }
    },
  };
};

export const AUTH_PROVIDERS = {
  apple: "apple",
  facebook: "facebook",
  twitter: "twitter",
};
