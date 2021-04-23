import firebase from "./init";
import "firebase/auth";

export const getIdToken = async () => {
  const auth = firebase.auth();
  const user = auth.currentUser;

  const idToken = await (user && user.getIdToken && user.getIdToken());

  return idToken;
};
