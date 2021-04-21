import firebase from "./init";
import "firebase/auth";
import { setUser } from "utils/repodAPI";
import { get } from "lodash/fp";

const signInWithProvider = async (provider) => {
  try {
    const response = await firebase.auth().signInWithPopup(provider);
    console.log("signInWithProvider", provider, response);
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    // var token = response.credential.accessToken;

    // console.log("signInWithProvider token", token);
    // The signed-in user info.
    var user = response.user;

    const providerEmail = get('providerData["0"].email')(user) || user.email;
    const providerTwitterId = get('providerData["0"].uid')(user) || null;
    const providerDisplayName =
      get('providerData["0"].displayName')(user) || user.displayName;
    console.log("provider data", {
      providerEmail,
      providerTwitterId,
      providerDisplayName,
    });

    const idToken = await (user && user.getIdToken && user.getIdToken());
    console.log("idToken", idToken);
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
      console.log("signIn", { email, password, provider });

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
    signUp: async ({ email, password, name, provider }) => {
      try {
        if (email && password) {
          const response = await auth.createUserWithEmailAndPassword(
            email,
            password
          );

          const user = auth.currentUser;

          const idToken = await (user && user.getIdToken && user.getIdToken());
          console.log("idToken", idToken);
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
