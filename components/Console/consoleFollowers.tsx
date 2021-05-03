import React, { createRef, useState } from "react";
import { Info } from "react-feather";
import { createPopper } from "@popperjs/core";
import { selectors as showsSelectors } from "modules/Shows";
import { useSelector } from "react-redux";
import { map } from "lodash/fp";
import { Loader } from "components/Loading";

const ConsoleFollowers = () => {
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
      <p className="text-2xl font-bold text-repod-text-primary">followers</p>
    </div>
  );
};

export default ConsoleFollowers;
