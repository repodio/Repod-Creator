import firebase from "./init";
import "firebase/auth";

export const useAuth = () => {
  console.log("useAuth");
  const auth = firebase.auth();

  return {
    signIn: ({
      email,
      password,
      provider,
    }: {
      email: string;
      password: string;
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
