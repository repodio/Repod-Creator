import React from "react";
import Loader from "react-loader-spinner";

const LOADER_COLORS = {
  light: "#ffffff",
  dark: "#222B45",
};

const LoaderComponent = ({ color = LOADER_COLORS.light, size = 24 }) => {
  return (
    <>
      <Loader type="Audio" color={color} height={size} width={size} />
    </>
  );
};

export default LoaderComponent;
