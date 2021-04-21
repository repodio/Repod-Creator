import React from "react";

const RepodLogo = () => {
  return (
    <div className="flex flex-row items-center p-8 ">
      <img className="w-8" src="/repod-logo.svg" alt="Repod Logo" />
      <h1 className="flex text-xl text-md ml-2 text-repod-text-primary">
        Repod <h1 className="text-repod-tint2 ml-1"> Communities</h1>
      </h1>
    </div>
  );
};

export default RepodLogo;
