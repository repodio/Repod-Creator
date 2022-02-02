import React, { useEffect } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { login } from "modules/Auth";
import { fetchClaimedShows, selectors as showsSelectors } from "modules/Shows";
import { selectors as authSelectors } from "modules/Auth";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { LoadingScreen } from "components/Loading";
import { identifyUser } from "utils/analytics";

const Home = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const storedProfile = useSelector(authSelectors.getAuthedProfile);

  useEffect(() => {
    (async () => {
      if (!storedProfile || !storedProfile.displayName) {
        const profile = await dispatch(login({ userId: AuthUser.id }));

        if (!profile) {
          console.error("Home couldnt find user", AuthUser.id);

          console.log("redirecting to /auth");

          router.replace(`/auth`);
        }
      }

      identifyUser(AuthUser.id);

      const claimedShows = await dispatch(fetchClaimedShows());

      if (!claimedShows || !claimedShows.length) {
        console.log("redirecting to /claim");

        router.replace(`/claim`);
      } else {
        router.replace(`/${claimedShows[0]}/console`);
      }
    })();
  }, []);

  return <LoadingScreen />;
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: LoadingScreen,
})(Home);
