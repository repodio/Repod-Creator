import React from "react";
import Table from "./table";
import { fromNow } from "utils/formats";
import EmptyTable from "./emptyTable";
import { ProfileAvatar } from "components/Images";
import { useMediaQuery } from "react-responsive";

const FollowersTable = ({ data }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const columns = React.useMemo(() => {
    if (isMobile) {
      return [
        {
          Header: "Name",
          accessor: "displayName",
        },
        {
          Header: () => <div style={{ textAlign: "right" }}>Followed On</div>,
          Cell: (row) => (
            <div style={{ textAlign: "right" }}>{fromNow(row.value)}</div>
          ),
          accessor: "createdOn",
          width: 80,
        },
      ];
    }

    return [
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
        Header: () => <div style={{ textAlign: "right" }}>Followed On</div>,
        Cell: (row) => (
          <div style={{ textAlign: "right" }}>{fromNow(row.value)}</div>
        ),
        accessor: "createdOn",
        width: 80,
      },
    ];
  }, [isMobile]);

  return data && data.length ? (
    <Table data={data} columns={columns} />
  ) : (
    <EmptyTable message="No follower data yet" />
  );
};

export default FollowersTable;
