import React, { Fragment } from "react";
import Table from "./table";
import { fromNow } from "utils/formats";
import EmptyTable from "./emptyTable";
import { ProfileAvatar } from "components/Images";
import { useMediaQuery } from "react-responsive";
import { Menu, Transition } from "@headlessui/react";
import { MoreHorizontal } from "react-feather";
import { useRouter } from "next/router";

const TeamMembersTable = ({
  data,
  onlyEdit = false,
}: {
  data: {}[];
  onlyEdit?: boolean;
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const router = useRouter();

  const columns = React.useMemo(() => {
    const options = [];
    if (isMobile) {
      options.push({
        Header: "Name",
        accessor: "displayName",
        Cell: (row) => (
          <p className="font-semibold text-md text-repod-text-primary">
            {row.cell.value}
          </p>
        ),
      });
      options.push({
        Header: "Access",
        accessor: "role",
        Cell: (row) => (
          <p className="font-semibold text-md text-repod-text-primary">
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
          <p className="font-semibold text-md text-repod-text-primary">
            {row.cell.value}
          </p>
        ),
      });
      options.push({
        Header: "Role",
        accessor: "type",
        Cell: (row) => (
          <p className="font-semibold text-md text-repod-text-primary">
            {row.cell.value}
          </p>
        ),
      });
      options.push({
        Header: "Access",
        accessor: "role",
        Cell: (row) => (
          <p className="font-semibold text-md text-repod-text-primary">
            {row.cell.value}
          </p>
        ),
      });
    }
    console.log("router.pathname", router.asPath);
    options.push({
      Header: "Manage",
      Cell: (row) => (
        <div>
          <Menu as="div" className="relative text-left">
            {({ open }) => (
              <>
                <div>
                  <Menu.Button className="flex justify-end items-end w-full px-2 py-2 text-lg text-repod-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <div className="flex flex-row justify-end items-center">
                      <MoreHorizontal
                        className="stroke-current text-repod-text-primary"
                        size={24}
                      />
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            key="Edit"
                            onClick={() => {
                              router.push(
                                `${router.asPath}/p/${row.cell.value}`
                              );
                            }}
                            className={`${
                              active ? "bg-repod-canvas-secondary" : ""
                            } group flex rounded-md items-center w-full px-2 py-2 text-md text-repod-text-primary z-10`}
                          >
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      {onlyEdit ? null : (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              key="Remove"
                              onClick={() => {
                                console.log("Remove Pressed");
                              }}
                              className={`${
                                active ? "bg-repod-canvas-secondary" : ""
                              } group flex rounded-md items-center w-full px-2 py-2 text-md text-repod-text-primary z-10`}
                            >
                              Remove
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      ),
      accessor: "userId",
      width: 30,
    });

    return options;
  }, [isMobile]);

  return data && data.length ? (
    <Table data={data} columns={columns} />
  ) : (
    <EmptyTable message="No team members yet" />
  );
};

export default TeamMembersTable;
