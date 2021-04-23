// ./pages/demo
import React from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";

interface ConsoleProps {
  profile: UserItem;
  children: JSX.Element[] | JSX.Element;
  showId: string;
}

const Console = ({ profile, showId }: ConsoleProps) => {
  const AuthUser = useAuthUser();
  console.log("Console", profile);

  return (
    <>
      <div>
        <p>Console {AuthUser.email ? AuthUser.email : "unknown"}.</p>
        <p>showId {showId}.</p>
      </div>
    </>
  );
};

// export default Console;

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Console);
