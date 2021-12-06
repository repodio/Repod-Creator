import React, { useMemo, useState } from "react";
import { useTable, useFlexLayout } from "react-table";
import { Loader } from "components/Loading";
import { find } from "lodash/fp";
import { ProfileAvatar } from "components/Images";
import { formatCurrency, formatMonthsFromToday } from "utils/formats";

const SelectableTableComponent = ({
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
  const [selectedId, setSelectedId] = useState(null);

  const userItem = useMemo(
    () => find((item: MemberData) => item.userId === selectedId)(data),
    [selectedId]
  );

  return (
    <div className="relative flex flex-col w-full">
      {loading ? (
        <div className="absolute inset-0 bg-repod-canvas bg-opacity-50 flex justify-center items-center">
          <Loader color="#222B45" />
        </div>
      ) : null}

      <div className="w-full flex flex-row">
        <div
          {...getTableProps()}
          className="table w-full  border-repod-border-light border rounded"
        >
          {!isMobile ? (
            <div className="p-3">
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
          ) : null}
          <div className="tbody" {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <div
                  className={`tr p-3 items-center border-solid border-t border-repod-border-light cursor-pointer ${
                    selectedId === (row.original && row.original.userId)
                      ? " bg-green-50"
                      : " hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedId(row.original && row.original.userId);
                  }}
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
        {userItem ? (
          <div
            className="flex flex-col ml-4"
            style={{ maxWidth: 275, minWidth: 275 }}
          >
            <div className="flex flex-col w-full border-repod-border-light border rounded mb-4">
              <div className="border-b border-repod-border-light px-4 py-2">
                <p className="text-lg font-semibold text-repod-text-primary">
                  Member
                </p>
              </div>
              <div className="flex flex-row w-full p-4 mb-4">
                <div className="flex-0 mr-2">
                  <ProfileAvatar url={userItem.avatarUrl} />
                </div>
                <div className="flex-1">
                  <p className="text-md font-book text-repod-text-primary">
                    {userItem.displayName}
                  </p>
                  <p className="text-xs font-book text-repod-text-secondary">
                    {formatMonthsFromToday(userItem.createdOn) <= 1
                      ? `Member for ${formatMonthsFromToday(
                          userItem.createdOn
                        )} month`
                      : `Member for ${formatMonthsFromToday(
                          userItem.createdOn
                        )} months`}
                  </p>
                  <p className="text-sm font-book text-repod-text-primary">
                    {formatCurrency(
                      userItem.monthlyPrice *
                        formatMonthsFromToday(userItem.createdOn)
                    )}{" "}
                    total contribution
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full border-repod-border-light border rounded ">
              <div className="border-b border-repod-border-light px-4 py-2">
                <p className="text-lg font-semibold text-repod-text-primary">
                  Contact Information
                </p>
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-repod-text-secondary uppercase">
                  Email Address
                </p>
                <p className="text-md font-book text-repod-text-primary">
                  {userItem.email}
                </p>
                <p className="text-sm font-bold text-repod-text-secondary uppercase mt-8">
                  Shipping Address
                </p>
                {userItem.shippingAddress &&
                userItem.shippingAddress.shareShippingAddress ? (
                  <>
                    <p className="text-md font-book text-repod-text-primary">
                      {userItem.shippingAddress.streetAddress}{" "}
                      {userItem.shippingAddress.appartmentNumber}
                    </p>
                    <p className="text-md font-book text-repod-text-primary">
                      {userItem.shippingAddress.city},{" "}
                      {userItem.shippingAddress.state}{" "}
                      {userItem.shippingAddress.zipCode}
                    </p>
                  </>
                ) : (
                  <p className="text-md font-book text-repod-text-primary">
                    Shipping Address Not Shared
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SelectableTableComponent;
