import React from "react";
import Loader from "react-loader-spinner";

const LoadingScreen = () => {
  return (
    <>
      <div className="w-full h-full bg-repod-canvas-dark flex flex-col justify-center items-center">
        <Loader type="Audio" color="#FFFFFF" height={48} width={48} />
      </div>
    </>
  );
};

export default LoadingScreen;
