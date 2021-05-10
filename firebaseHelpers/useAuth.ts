import firebase from "./init";
import "firebase/auth";
import { setUser } from "utils/repodAPI";
import { get } from "lodash/fp";
import { useDispatch } from "react-redux";
import { login, logout, updateUser } from "modules/Auth";

const signInWithProvider = async (provider, dispatch) => {
  try {
    const response = await firebase.auth().signInWithPopup(provider);
    const user = response.user;

    const providerEmail = get('providerData["0"].email')(user) || user.email;
    const providerTwitterId = get('providerData["0"].uid')(user) || null;
    const providerDisplayName =
      get('providerData["0"].displayName')(user) || user.displayName;

    await setUser({
      email: providerEmail,
      displayName: providerDisplayName,
      userId: user.uid,
      twitterId: providerTwitterId,
    });
    dispatch(updateUser({ userId: user.uid, email, displayName: name }));

    return;
  } catch (error) {
    console.log("signInWithProvider error", error);
    return { error };
  }
};

const AppleSignIn = (dispatch) => {
  var provider = new firebase.auth.OAuthProvider("apple.com");

  return signInWithProvider(provider, dispatch);
};

const FacebookSignIn = (dispatch) => {
  var provider = new firebase.auth.FacebookAuthProvider();

  return signInWithProvider(provider, dispatch);
};

const TwitterSignIn = (dispatch) => {
  var provider = new firebase.auth.TwitterAuthProvider();

  return signInWithProvider(provider, dispatch);
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = firebase.auth();

  return {
    signIn: async ({
      email,
      password,
      provider,
    }: {
      email?: string;
      password?: string;
      provider?: string;
    }): Promise<{
      error?: {
        code: "";
      };
    }> => {
      if (email && password) {
        try {
          const response = await auth.signInWithEmailAndPassword(
            email,
            password
          );
          const userId = response.user && response.user.uid;

          dispatch(login({ userId }));

          return;
        } catch (error) {
          return { error };
        }
      } else if (provider) {
        switch (provider) {
          case AUTH_PROVIDERS.apple:
            return AppleSignIn(dispatch);
          case AUTH_PROVIDERS.facebook:
            return FacebookSignIn(dispatch);
          case AUTH_PROVIDERS.twitter:
            return TwitterSignIn(dispatch);
          default:
            return;
        }
      }
    },
    signOut: () => {
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
    }): Promise<{
      error?: {
        code: "";
      };
    }> => {
      try {
        if (email && password) {
          const response = await auth.createUserWithEmailAndPassword(
            email,
            password
          );

          const user = auth.currentUser;

          await setUser({
            email,
            displayName: name,
            userId: user.uid,
          });
          dispatch(updateUser({ userId: user.uid, email, displayName: name }));

          return;
        } else if (provider) {
          switch (provider) {
            case AUTH_PROVIDERS.apple:
              return AppleSignIn(dispatch);
            case AUTH_PROVIDERS.facebook:
              return FacebookSignIn(dispatch);
            case AUTH_PROVIDERS.twitter:
              return TwitterSignIn(dispatch);
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
