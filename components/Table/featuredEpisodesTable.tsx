import React from "react";
import Table from "./table";
import EmptyTable from "./emptyTable";

import { fromNow } from "utils/formats";
import { Button } from "components/Buttons";

const FeaturedEpisodesTable = ({ data, onClick, loading }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "",
        Cell: (row) => (
          <>
            <img
              className="w-10 h-10 object-cover rounded"
              src={row.value}
              alt={`Show episode artwork`}
            />
          </>
        ),
        width: 24,
        accessor: "artworkUrl",
      },
      {
        Header: "Title",
        accessor: "title",
      },

      {
        Header: () => <div className="text-right">First Added</div>,
        Cell: (row) => <div className="text-right">{fromNow(row.value)}</div>,
        accessor: "date",
        width: 80,
      },
      {
        Header: "",
        accessor: "episodeId",
        width: 48,
        Cell: (row) => (
          <div className="text-right px-4">
            <Button.Tiny
              className={`bg-repod-tint text-repod-text-alternative border-2 border-repod-tint`}
              onClick={() => {
                onClick(row.value);
              }}
            >
              Select
            </Button.Tiny>
          </div>
        ),
      },
    ],
    []
  );

  return data && data.length ? (
    <Table data={data} columns={columns} loading={loading} />
  ) : (
    <EmptyTable message="No episode data yet" />
  );
};

export default FeaturedEpisodesTable;
