import React, { Fragment } from "react";
import Table from "./table";
import { formatCurrency, formatDate } from "utils/formats";
import EmptyTable from "./emptyTable";
import { ProfileAvatar } from "components/Images";
import { useMediaQuery } from "react-responsive";

const TipsTable = ({ data }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1040px)" });

  const columns = React.useMemo(() => {
    const options = [];

    if (isMobile) {
      options.push({
        Header: "Name",
        accessor: "displayName",
        Cell: (row) => (
          <p className="font-medium text-sm text-repod-text-primary">
            {row.cell.value}
          </p>
        ),
      });
    } else {
      options.push({
        Header: "",
        Cell: (row) => (
          <>
            <ProfileAvatar url={row.cell.value} />
          </>
        ),
        width: 28,
        accessor: "avatarUrl",
      });

      options.push({
        Header: "Name",
        accessor: "displayName",
        Cell: (row) => (
          <p className="font-medium text-sm text-repod-text-primary">
            {row.cell.value}
          </p>
        ),
        width: 75,
      });
      options.push({
        Header: "Message",
        accessor: "message",
        Cell: (row) => (
          <p className="font-medium text-sm text-repod-text-primary pr-2">
            {row.cell.value}
          </p>
        ),
      });
      options.push({
        Header: "Date",
        accessor: "createdOn",
        Cell: (row) => (
          <p className="font-medium text-sm text-repod-text-primary">
            {formatDate(row.value)}
          </p>
        ),
        width: 50,
      });
    }

    options.push({
      Header: "Amount",
      accessor: "tipAmount",
      Cell: (row) => (
        <p className="font-medium text-sm text-repod-text-primary">
          {formatCurrency(row.cell.value)}
        </p>
      ),
      width: 50,
    });

    return options;
  }, [isMobile]);

  console.log("isMobile", isMobile);

  return data && data.length ? (
    <Table data={data} columns={columns} isMobile={isMobile} />
  ) : (
    <EmptyTable message="No team members yet" />
  );
};

export default TipsTable;
