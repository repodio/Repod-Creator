import React from "react";
import Loader from "react-loader-spinner";

const LoaderComponent = ({ color = "#ffffff", size = 24 }) => {
  return (
    <>
      <Loader type="Audio" color={color} height={size} width={size} />
    </>
  );
};

export default LoaderComponent;
