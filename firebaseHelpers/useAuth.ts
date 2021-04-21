import firebase from "./init";
import "firebase/auth";
import { setUser } from "utils/repodAPI";
import { get } from "lodash/fp";

const signInWithProvider = async (provider) => {
  try {
    const response = await firebase.auth().signInWithPopup(provider);
    const user = response.user;

    const providerEmail = get('providerData["0"].email')(user) || user.email;
    const providerTwitterId = get('providerData["0"].uid')(user) || null;
    const providerDisplayName =
      get('providerData["0"].displayName')(user) || user.displayName;

    const idToken = await (user && user.getIdToken && user.getIdToken());

    await setUser(
      {
        email: providerEmail,
        displayName: providerDisplayName,
        userId: user.uid,
        twitterId: providerTwitterId,
      },
      idToken
    );
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
  const auth = firebase.auth();

  return {
    signIn: ({
      email,
      password,
      provider,
    }: {
      email?: string;
      password?: string;
      provider?: string;
    }) => {
      if (email && password) {
        return auth
          .signInWithEmailAndPassword(email, password)
          .then((response) => {
            return response.user;
          })
          .catch((error) => {
            return { error };
          });
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
    signOut: () => auth.signOut(),
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
