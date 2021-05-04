import React from "react";
import { Info } from "react-feather";
import { formatIntegers } from "utils/formats";

const STAT_TYPES = {
  streams: "Streams",
  listeners: "Listeners",
  followers: "Followers",
};

const ShowStat = ({ type, value }: { type: string; value: number }) => (
  <div className="flex flex-col justify-start items-start mr-12">
    <p className="text-2xl font-bold text-repod-text-primary">
      {formatIntegers(value || 0)}
    </p>
    <div className="flex flex-row justify-center items-center">
      <p className="text-sm text-repod-text-secondary mr-1">{type}</p>
      <Info className="stroke-current text-repod-text-secondary" size={12} />
    </div>
  </div>
);

ShowStat.TYPES = STAT_TYPES;

export default ShowStat;
