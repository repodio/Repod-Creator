import React from "react";
import { useTable, useFlexLayout } from "react-table";
import { Loader } from "components/Loading";

const TableComponent = ({
  data,
  columns,
  loading = false,
  isMobile,
}: {
  data: {}[];
  columns: {}[];
  loading?: boolean;
  isMobile: boolean;
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useFlexLayout);

  return (
    <div className="relative flex flex-col w-full">
      {loading ? (
        <div className="absolute inset-0 bg-repod-canvas bg-opacity-50 flex justify-center items-center">
          <Loader color="#222B45" />
        </div>
      ) : null}

      <div {...getTableProps()} className="table w-full my-8">
        {!isMobile ? (
          <div className="pb-4 border-solid border-b border-repod-border-light">
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr ">
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
        ) : null}
        <div className="tbody" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <div
                className="tr py-3 items-center border-solid border-b border-repod-border-light"
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
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
    </div>
  );
};

export default TableComponent;
