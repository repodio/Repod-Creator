import React, { Suspense } from "react";
import { useImage } from "react-image";

const ProfileAvatar = ({ url }) => {
  const { src, isLoading, error } = useImage({
    srcList: url,
    useSuspense: false,
  });

  if (isLoading || error) {
    return <div className="w-10 h-10 rounded-full bg-repod-canvas-secondary" />;
  }
  return (
    <img
      className="w-10 rounded-full object-cover"
      src={src}
      alt="Repod Logo"
    />
  );
};

export default ProfileAvatar;
