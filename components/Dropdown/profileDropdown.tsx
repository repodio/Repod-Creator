import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "firebaseHelpers/useAuth";
import { selectors as authSelectors } from "modules/Auth";

const ProfileDropdown = () => {
  const userId = useSelector((state) => authSelectors.getUserId(state));

  const { signOut } = useAuth();
  const dispatch = useDispatch();

  const increment = () =>
    dispatch({
      type: "INCREMENT",
    });
  return (
    <button className="" onClick={increment}>
      userId: {userId}
    </button>
  );
};

export default ProfileDropdown;
