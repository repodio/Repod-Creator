import React from "react";
import { useTable, useFlexLayout } from "react-table";

const TableComponent = ({ data, columns }: { data: {}[]; columns: {}[] }) => {
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