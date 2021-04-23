import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "firebaseHelpers/useAuth";
import { selectors as authSelectors } from "modules/Auth";

const ProfileDropdown = () => {
  const profile = useSelector((state) => authSelectors.getAuthedUser(state));

  const { signOut } = useAuth();
  const dispatch = useDispatch();

  if (!profile) {
    return null;
  }

  return <button className="">{profile.displayName}</button>;
};

export default ProfileDropdown;
