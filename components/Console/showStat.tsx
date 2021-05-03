import React, { createRef, useState } from "react";
import { Info } from "react-feather";
import { createPopper } from "@popperjs/core";
import { selectors as showsSelectors } from "modules/Shows";
import { useSelector } from "react-redux";
import { map } from "lodash/fp";
import { Loader } from "components/Loading";

const STAT_TYPES = {
  starts: "Starts",
  streams: "Streams",
  listeners: "Listeners",
  followers: "Followers",
};

const ShowSelector = ({ type }: { type: string }) => {
  // const shows = useSelector(showsSelectors.getClaimedShows);

  // if (!show) {
  //   return (
  //     <div className="m-8 opacity-50">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col justify-start items-start mr-12">
      <p className="text-2xl font-bold text-repod-text-primary">
        {false || "n/a"}
      </p>
      <div className="flex flex-row justify-center items-center">
        <p className="text-sm text-repod-text-secondary mr-1">{type}</p>
        <Info className="stroke-current text-repod-text-secondary" size={12} />
      </div>
    </div>
  );
};

ShowSelector.TYPES = STAT_TYPES;

export default ShowSelector;
