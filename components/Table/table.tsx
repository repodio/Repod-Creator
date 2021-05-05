import React from "react";
import { useTable, useFlexLayout } from "react-table";
import { fromNow } from "utils/formats";

const TableComponent = () => {
  const data = React.useMemo(
    () => [
      {
        name: "Greg Hori",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
        streams: 42,
        comments: 12,
        createdOn: 1620233233179,
      },
      {
        name: "Greg Hori",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
        streams: 42,
        comments: 12,
        createdOn: 1620211333179,
      },
      {
        name: "Greg Hori",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
        streams: 42,
        comments: 12,
        createdOn: 1620191333179,
      },
      {
        name: "Greg Hori",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
        streams: 42,
        comments: 12,
        createdOn: 1616001133179,
      },
      {
        name: "Greg Hori",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80",
        streams: 42,
        comments: 12,
        createdOn: 1605001133179,
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "",
        Cell: (row) => (
          <>
            <img
              className="w-10 rounded-full"
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
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: () => <div style={{ textAlign: "right" }}>Streams</div>,
        accessor: "streams",
        width: 48,
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: () => <div style={{ textAlign: "right" }}>Comments</div>,
        accessor: "comments",
        width: 48,
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useFlexLayout);

  return (
    <div {...getTableProps()} className="table w-full my-8">
      <div className="mb-4">
        {headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map((column) => (
              <div
                {...column.getHeaderProps()}
                className="th text-sm font-bold text-repod-text-secondary uppercase"
              >
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="tbody" {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <div
              className="tr py-3 items-center border-solid border-b border-repod-border-light"
              {...row.getRowProps()}
            >
              {row.cells.map((cell) => {
                console.log("cell.getCellProps()", cell.getCellProps());
                return (
                  <div
                    {...cell.getCellProps()}
                    className="td text-md text-repod-text-primary"
                  >
                    {cell.render("Cell")}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableComponent;
