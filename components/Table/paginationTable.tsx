import React, { useEffect } from "react";
import { useTable, useFlexLayout, usePagination } from "react-table";
import { Loader } from "components/Loading";
import { ChevronLeft, ChevronRight } from "react-feather";

const PAGE_SIZE = 10;

const PaginationTableComponent = ({
  data,
  columns,
  loading,
  total,
  fetchData,
}: {
  data: {}[];
  columns: {}[];
  loading?: boolean;
  pageCount?: number;
  total?: number;
  fetchData?: (pageIndex) => void;
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page = [],
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: PAGE_SIZE },
      manualPagination: true,
      pageCount: Math.round(total / PAGE_SIZE),
    },
    usePagination,
    useFlexLayout
  );

  useEffect(() => {
    fetchData && fetchData(pageIndex);
  }, [fetchData, pageIndex]);

  const slicedPage = page.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  return (
    <div className="relative flex flex-col w-full">
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
          {slicedPage && slicedPage.length ? (
            slicedPage.map((row) => {
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
            })
          ) : (
            <div className="absolute inset-0 bg-repod-canvas bg-opacity-50 flex justify-center items-center">
              <Loader color="#222B45" />
            </div>
          )}
        </div>
      </div>
      <div className="pagination flex flex row">
        <div className="flex flex-col mr-4">
          <p className="text-mg text-repod-text-secondary">{`${
            pageIndex * pageSize + 1
          } - ${pageIndex * pageSize + pageSize} of ${total}`}</p>
        </div>

        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          <ChevronLeft
            className={`stroke-current  ${
              canNextPage
                ? "text-repod-text-primary"
                : "text-repod-text-secondary"
            }`}
            size={24}
          />
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          <ChevronRight
            className={`stroke-current  ${
              canNextPage
                ? "text-repod-text-primary"
                : "text-repod-text-secondary"
            }`}
            size={24}
          />
        </button>
      </div>
    </div>
  );
};

export default PaginationTableComponent;
