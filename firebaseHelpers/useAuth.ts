import firebase from "./init";
import "firebase/auth";

const signInWithProvider = (provider) => {
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log("signInWithProvider", provider, result);
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;

      console.log("signInWithProvider token", token);
      // The signed-in user info.
      var user = result.user;
      console.log("signInWithProvider user", user);
      // ...
    })
    .catch(function (error) {
      console.log("signInWithProvider error", error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
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
            console.log("response.user", response.user);
            return response.user;
          })
          .catch((error) => {
            console.log("error", error);
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
    signUp: ({ email, password }) => {
      return auth
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          return { error };
        });
    },
  };
};

export const AUTH_PROVIDERS = {
  apple: "apple",
  facebook: "facebook",
  twitter: "twitter",
};
