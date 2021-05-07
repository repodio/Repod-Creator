import React from "react";
import Table from "./table";
import { fromNow } from "utils/formats";
import EmptyTable from "./emptyTable";
import { ProfileAvatar } from "components/Images";

const FollowersTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "",
        Cell: (row) => (
          <>
            <ProfileAvatar url={row.cell.value} />
          </>
        ),
        width: 24,
        accessor: "avatarUrl",
      },
      {
        Header: "Name",
        accessor: "displayName",
      },
      {
        Header: "Email",
        accessor: "email",
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
