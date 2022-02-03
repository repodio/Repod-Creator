import React, { Fragment } from "react";
import SelectableTable from "./selectableTable";
import EmptyTable from "./emptyTable";
import { ProfileAvatar } from "components/Images";
import { useMediaQuery } from "react-responsive";
import { formatCurrency, formatDate } from "utils/formats";

const MembersTable = ({ data }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const columns = React.useMemo(() => {
    const options = [];

    options.push({
      Header: "",
      Cell: (row) => (
        <div style={{ minWidth: 42 }}>
          <ProfileAvatar url={row.cell.value} />
        </div>
      ),
      width: 42,
      accessor: "avatarUrl",
    });
    options.push({
      Header: "Name",
      accessor: "displayName",
      Cell: (row) => (
        <p className=" text-md text-repod-text-primary">{row.cell.value}</p>
      ),
    });
    options.push({
      Header: "Status",
      accessor: "status",
      Cell: (row) => (
        <p className=" text-md text-repod-text-primary">{row.cell.value}</p>
      ),
    });
    options.push({
      Header: "Tier",
      accessor: "tier",
      Cell: (row) => (
        <p className=" text-md text-repod-text-primary">{row.cell.value}</p>
      ),
    });
    options.push({
      Header: () => <div style={{ textAlign: "right" }}>Pledge</div>,
      accessor: "monthlyPrice",
      Cell: (row) => (
        <p className=" text-md text-repod-text-primary text-right">
          {formatCurrency(row.cell.value)}
        </p>
      ),
    });
    options.push({
      Header: () => <div style={{ textAlign: "right" }}>Member Since</div>,
      accessor: "createdOn",
      Cell: (row) => (
        <p className=" text-md text-repod-text-primary text-right">
          {formatDate(row.value)}
        </p>
      ),
    });

    return options;
  }, [isMobile]);

  return data && data.length ? (
    <SelectableTable data={data} columns={columns} />
  ) : (
    <EmptyTable message="No members yet" />
  );
};

export default MembersTable;
