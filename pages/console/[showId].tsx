import React from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { ConsoleSideDrawer } from "components/Navigation";
import { useStore } from "react-redux";

interface ConsoleProps {
  claimedShows: ClaimedShowItems[];
  children: JSX.Element[] | JSX.Element;
  showId: string;
}

const Console = ({ showId }: ConsoleProps) => {
  const AuthUser = useAuthUser();
  const store = useStore();
  console.log(
    "Console[showId] store.getState",
    JSON.stringify(store.getState())
  );

  return (
    <>
      <div className="flex flex-row w-full h-full">
        <ConsoleSideDrawer />
        <div className="flex flex-col flex-1 bg-blue-200">
          <p>Console {AuthUser.email ? AuthUser.email : "unknown"}.</p>
          <p>showId {showId}.</p>
        </div>
      </div>
    </>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Console);
