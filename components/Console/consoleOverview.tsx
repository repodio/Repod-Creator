import React, { createRef, useState } from "react";
import { selectors as showsSelectors } from "modules/Shows";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ShowStat } from ".";
import { Button } from "components/Buttons";
import { Chart } from "components/Chart";
import { Table } from "components/Table";
import Link from "next/link";
import { ArrowRight } from "react-feather";

const ConsoleOverview = () => {
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const show = useSelector(showsSelectors.getShowById(showIdString));

  if (!show) {
    return null;
  }

  return (
    <>
      <div className="flex flex-row">
        <img
          style={{ width: 120, height: 120 }}
          className="rounded "
          src={show.artworkUrl}
          alt="show artwork"
        />
        <div className="w-full flex flex-col pl-8 justify-center items-start">
          <p className="text-xl font-bold text-repod-text-primary font-bold truncate">
            {show.title}
          </p>
          <p className="mb-4 text-sm text-repod-text-secondary font-bold truncate">
            by {show.author}
          </p>
          <Button.Tiny
            style={{ minWidth: 170, maxWidth: 170 }}
            className={`bg-info text-repod-text-alternative flex-0`}
          >
            Set Featured Episode
          </Button.Tiny>
        </div>
      </div>
      <div className="flex flex-row my-12">
        <ShowStat type={ShowStat.TYPES.streams} value={show.totalStreams} />
        <ShowStat
          type={ShowStat.TYPES.listeners}
          value={show.uniqueListeners}
        />
        <ShowStat
          type={ShowStat.TYPES.followers}
          value={show.totalSubscriptions}
        />
      </div>
      {show.monthlyListenData && show.monthlyListenData.length ? (
        <div className="flex flex-col my-12 h-96">
          <p className="text-lg font-semibold text-repod-text-primary">
            Daily Streams
          </p>
          <Chart
            data={[
              {
                id: "streams",
                data: show.monthlyListenData,
              },
            ]}
          />
        </div>
      ) : null}
      <div className="flex flex-row justify-between items-center">
        <p className="text-lg font-semibold text-repod-text-primary">
          Recent Followers
        </p>
        <Link href={`/console/${showId}#followers`}>
          <a
            className={` text-md font-semibold text-repod-tint flex flex-row items-center`}
          >
            View All
            <ArrowRight
              className="ml-2 stroke-current text-repod-text-secondary"
              size={20}
            />
          </a>
        </Link>
      </div>
      <Table />
    </>
  );
};

export default ConsoleOverview;
