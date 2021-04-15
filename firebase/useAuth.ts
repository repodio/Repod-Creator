import firebase from "firebase/app";
import "firebase/auth";

export const useAuth = () => {
  const auth = firebase.auth();

  return {
    signIn: ({ email, password, provider }) => {
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
        return;
        // switch (provider) {
        //   case "apple":
        //     return AppleSignIn();
        //   case "facebook":
        //     return FacebookSignIn();
        //   case "twitter":
        //     return TwitterSignIn();
        //   default:
        //     return;
        // }
      }
    },
    signout: () => auth.signOut(),
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
