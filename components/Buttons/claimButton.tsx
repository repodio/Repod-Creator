import React from "react";
import { useAuthUser } from "next-firebase-auth";
import { claimShow } from "utils/repodAPI";

const ClaimButton = ({ idToken }) => {
  const handleClaimShow = () => {
    claimShow({ showId: "00RuGljF1Xvz2Aod9l1l", type: "host" }, idToken);
  };
  return (
    <button
      className="block bg-teal hover:bg-teal-dark text-white uppercase text-lg mx-auto p-4 rounded"
      onClick={handleClaimShow}
    >
      Claim 00RuGljF1Xvz2Aod9l1l
    </button>
  );
};

export default ClaimButton;
