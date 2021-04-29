import React from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { ConsoleSideDrawer } from "components/Navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectors as showsSelectors } from "modules/Shows";
import { useRouter } from "next/router";

interface ConsoleProps {
  claimedShows: ClaimedShowItems[];
  children: JSX.Element[] | JSX.Element;
  showId: string;
}

const Console = () => {
  const router = useRouter();
  const { showId } = router.query;

  const shows = useSelector((state) => state.shows.byId);
  const show = useSelector(showsSelectors.getShowById(showId));

  console.log("shows", shows);

  return (
    <>
      <div className="flex flex-row w-full h-full">
        <ConsoleSideDrawer />
        <div className="flex flex-col flex-1 bg-repod-canvas">
          <p>showId {showId}.</p>
          <p>shows {JSON.stringify(show)}.</p>
        </div>
      </div>
    </>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Console);
