import React, { useEffect } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { login } from "modules/Auth";
import { fetchClaimedShows, selectors as showsSelectors } from "modules/Shows";
import { selectors as authSelectors } from "modules/Auth";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";

const Home = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const storedClaimedShowsIds = useSelector(showsSelectors.getClaimedShowIds);
  const storedProfile = useSelector(authSelectors.getAuthedProfile);

  useEffect(() => {
    (async () => {
      if (!storedProfile) {
        const profile = await dispatch(login({ userId: AuthUser.id }));
        if (!profile) {
          console.error("Home couldnt find user", AuthUser.id);
          router.replace(`/auth`);
        }
      }
      if (!storedClaimedShowsIds.length) {
        const claimedShows = await dispatch(fetchClaimedShows());
        console.error("Home claimedShows", claimedShows);

        if (!claimedShows.length) {
          router.replace(`/claim`);
        } else {
          router.replace(`/console/${claimedShows[0]}`);
        }
      } else {
        if (!storedClaimedShowsIds.length) {
          router.replace(`/claim`);
        } else {
          router.replace(`/console/${storedClaimedShowsIds[0]}`);
        }
      }
    })();
  }, []);

  return (
    <>
      <div className="w-full h-full bg-repod-canvas-dark flex flex-col justify-center items-center">
        <Loader type="Audio" color="#FFFFFF" height={48} width={48} />
      </div>
    </>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home);
