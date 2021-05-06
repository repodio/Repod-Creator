import React from "react";
import Table from "./table";
import { fromNow } from "utils/formats";
import EmptyTable from "./emptyTable";

const FollowersTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "",
        Cell: (row) => (
          <>
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={row.cell.value}
              alt="Repod Logo"
            />
          </>
        ),
        width: 24,
        accessor: "avatarUrl", // accessor is the "key" in the data
      },
      {
        Header: "Name",
        accessor: "displayName", // accessor is the "key" in the data
      },
      {
        Header: "Email",
        accessor: "email", // accessor is the "key" in the data
      },
      // {
      //   Header: () => <div style={{ textAlign: "right" }}>Streams</div>,
      //   accessor: "streams",
      //   width: 48,
      //   Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      // },
      // {
      //   Header: () => <div style={{ textAlign: "right" }}>Comments</div>,
      //   accessor: "comments",
      //   width: 48,
      //   Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      // },
      {
        Header: () => <div style={{ textAlign: "right" }}>Followed On</div>,
        Cell: (row) => (
          <div style={{ textAlign: "right" }}>{fromNow(row.value)}</div>
        ),
        accessor: "createdOn",
        width: 80,
      },
    ],
    []
  );

  return data && data.length ? (
    <Table data={data} columns={columns} />
  ) : (
    <EmptyTable message="No follower data yet" />
  );
};

export default FollowersTable;
