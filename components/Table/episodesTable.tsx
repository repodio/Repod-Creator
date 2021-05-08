import React from "react";
import Table from "./table";
import PaginationTable from "./paginationTable";
import EmptyTable from "./emptyTable";
import { fromNow } from "utils/formats";
import { useMediaQuery } from "react-responsive";

const EpisodesTable = ({
  data,
  loading,
  total,
  fetchData,
}: {
  data: EpisodeItem[];
  loading?: boolean;
  total?: number;
  fetchData?: (pageIndex: number) => void;
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const columns = React.useMemo(() => {
    if (isMobile) {
      return [
        {
          Header: "Title",
          accessor: "title",
        },
      ];
    }

    return [
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
        Header: () => <div style={{ textAlign: "right" }}>Streams</div>,
        accessor: "streams",
        width: 48,
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: () => <div style={{ textAlign: "right" }}>Likes</div>,
        accessor: "totalUpvoteCount",
        width: 48,
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: () => <div style={{ textAlign: "right" }}>Comments</div>,
        accessor: "numberOfComments",
        width: 48,
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: () => <div style={{ textAlign: "right" }}>First Added</div>,
        Cell: (row) => (
          <div style={{ textAlign: "right" }}>{fromNow(row.value)}</div>
        ),
        accessor: "date",
        width: 80,
      },
    ];
  }, [isMobile]);

  if (fetchData) {
    return data && data.length ? (
      <PaginationTable
        data={data}
        columns={columns}
        loading={loading}
        total={total}
        fetchData={fetchData}
      />
    ) : (
      <EmptyTable message="No episode data yet" />
    );
  }

  return data && data.length ? (
    <Table data={data} columns={columns} />
  ) : (
    <EmptyTable message="No episode data yet" />
  );
};

export default EpisodesTable;
