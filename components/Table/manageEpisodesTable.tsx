import React, { Fragment, useEffect, useMemo, useState } from "react";
import Table from "./table";
import PaginationTable from "./paginationTable";
import EmptyTable from "./emptyTable";
import { formatDate, formatDuration } from "utils/formats";
import { useMediaQuery } from "react-responsive";
import { MultiSelectButton } from "components/Buttons";
import { filter, map } from "lodash/fp";
import { ChevronDown, ChevronLeft, ChevronRight } from "react-feather";
import { Menu, Transition } from "@headlessui/react";
import {
  ManageEpisodesModal,
  ManageEpisodesModalTypes,
} from "components/Modals";
import { convertArrayToObject } from "utils/normalizing";

const PAGE_SIZING = [
  {
    value: 10,
    label: "10",
  },
  {
    value: 25,
    label: "25",
  },
  {
    value: 50,
    label: "50",
  },
  {
    value: 100,
    label: "100",
  },
  {
    value: 250,
    label: "250",
  },
];

const ManageEpisodesTable = ({
  data,
  loading,
  subscriptionTiers,
  handleAssignTiers,
  handleRemoveEpisodes,
  total,
  pageSize = 10,
  page = 0,
  handleChangePageSize,
  handlePrev,
  handleNext,
}: {
  data: EpisodeItem[];
  loading?: boolean;
  subscriptionTiers?: SubscriptionTierItem[];
  handleAssignTiers: (props: {
    episodeIds: string[];
    subscriptionTierIds: string[];
  }) => void;
  handleRemoveEpisodes: (props: { episodeIds: string[] }) => void;
  total: number;
  pageSize: number;
  page: number;
  handleChangePageSize: (value: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [selectAll, setSelectAll] = useState(false);
  const [selectTotalEpisodes, setSelectTotalEpisodes] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRemoveEpisodesPressed = () => {
    setModalType(ManageEpisodesModalTypes.RemoveEpisodes);
    setModalOpen(true);
  };

  const handleAssignPressed = () => {
    setModalType(ManageEpisodesModalTypes.AssignTiers);
    setModalOpen(true);
  };

  const handleRemoveTiersPressed = () => {
    setModalType(ManageEpisodesModalTypes.RemoveTiers);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalType(null);
    setModalOpen(false);
  };

  const disabledActions = !selectedIds?.length;

  const subscriptionTiersMap = useMemo(
    () => convertArrayToObject(subscriptionTiers, "subscriptionTierId"),
    [subscriptionTiers]
  );

  const unselectAll = () => {
    setSelectAll(false);
    setSelectedIds([]);
  };

  const columns = useMemo(() => {
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectAll(false);
        setSelectedIds([]);
      } else {
        setSelectAll(true);
        const episodeIds = map((item: EpisodeItem) => item.episodeId)(data);
        setSelectedIds(episodeIds);
      }
    };

    const handleSelectSpecific = (id: string, add: boolean = false) => {
      if (add) {
        setSelectedIds([...selectedIds, id]);
      } else {
        const newSelectedIds = filter((selectedId) => selectedId !== id)(
          selectedIds
        );
        setSelectedIds(newSelectedIds);
        if (!newSelectedIds?.length) {
          setSelectAll(false);
        }
      }
    };

    if (isMobile) {
      return [
        {
          Header: () => (
            <div className="mt-1">
              <MultiSelectButton
                selected={selectAll}
                onPress={handleSelectAll}
              />
            </div>
          ),
          accessor: "episodeId",
          width: 12,
          Cell: (row) => {
            const selected = selectedIds.includes(row.value);
            return (
              <MultiSelectButton
                selected={selected}
                onPress={() => handleSelectSpecific(row.value, !selected)}
              />
            );
          },
        },
        {
          Header: "Episode",
          accessor: "title",
          Cell: (row) => {
            return (
              <div className="flex flex-col justify-start items-start truncate">
                <p>{row.value}</p>
                <div className="flex flex-wrap justify-start items-center">
                  {map((subscriptionTierId: string) => (
                    <div
                      className="bg-tint-08 text-repod-tint text-sm px-2 py-1 ml-1 my-0.5"
                      key={subscriptionTierId}
                    >
                      <p className="">
                        {(subscriptionTiersMap[subscriptionTierId] || {}).title}
                      </p>
                    </div>
                  ))(row.row.original.subscriptionTierIds || [])}
                </div>
              </div>
            );
          },
        },
      ];
    }

    return [
      {
        Header: () => (
          <div className="mt-1">
            <MultiSelectButton selected={selectAll} onPress={handleSelectAll} />
          </div>
        ),
        accessor: "episodeId",
        width: 12,
        Cell: (row) => {
          const selected = selectedIds.includes(row.value);
          return (
            <MultiSelectButton
              selected={selected}
              onPress={() => handleSelectSpecific(row.value, !selected)}
            />
          );
        },
      },
      {
        Header: "Episode",
        accessor: "title",
        Cell: (row) => {
          return (
            <div className="flex flex-row justify-start items-center truncate">
              <img
                className="w-10 h-10 object-cover rounded mr-2"
                src={row.row.original.artworkUrl}
                alt={`Show episode artwork`}
              />
              <p>{row.value}</p>
            </div>
          );
        },
      },
      {
        Header: () => <div style={{ textAlign: "left" }}>Tiers</div>,
        accessor: "subscriptionTierIds",
        Cell: (row) => (
          <div className="flex flex-wrap justify-start items-center">
            {map((subscriptionTierId: string) => (
              <div
                className="bg-tint-08 text-repod-tint text-sm px-2 py-1 ml-1 my-0.5"
                key={subscriptionTierId}
              >
                <p className="">
                  {(subscriptionTiersMap[subscriptionTierId] || {}).title}
                </p>
              </div>
            ))(row.value || [])}
          </div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "right" }}>Duration</div>,
        Cell: (row) => (
          <div style={{ textAlign: "right" }}>{formatDuration(row.value)}</div>
        ),
        accessor: "calculatedDuration",
        width: 40,
      },
      {
        Header: () => <div style={{ textAlign: "right" }}>Published Date</div>,
        Cell: (row) => (
          <div style={{ textAlign: "right" }}>{formatDate(row.value)}</div>
        ),
        accessor: "pubDate",
        width: 80,
      },
    ];
  }, [isMobile, selectAll, selectedIds]);

  return data && data.length ? (
    <>
      <div className="flex flex-row justify-between items-center w-full">
        <p className="text-lg font-semibold text-repod-text-primary">
          {total || 0} Episodes
        </p>
        <Menu as="div" className="relative text-left">
          {({ open }) => (
            <>
              <div>
                <Menu.Button className="rounded-md border border-text-repod-text-secondary px-2 flex flex-row justify-center items-center focus:outline-none">
                  <p className="text-md text-repod-text-secondary">Edit</p>
                  <ChevronDown
                    className="stroke-current text-repod-text-secondary ml-2"
                    size={16}
                  />
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
                  className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y z-10 divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          disabled={disabledActions}
                          key="Assign to Tier"
                          onClick={handleAssignPressed}
                          className={`${
                            active ? "bg-repod-canvas-secondary" : ""
                          } group flex rounded-md items-center w-full px-2 py-2 text-md z-10 ${
                            disabledActions
                              ? "text-repod-text-disabled cursor-default"
                              : "text-repod-text-primary"
                          }`}
                        >
                          Assign to Tier
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          disabled={disabledActions}
                          key="Remove Subscription Tiers"
                          onClick={handleRemoveTiersPressed}
                          className={`${
                            active ? "bg-repod-canvas-secondary" : ""
                          } group flex rounded-md items-center w-full px-2 py-2 text-md z-10 ${
                            disabledActions
                              ? "text-repod-text-disabled cursor-default"
                              : "text-repod-text-primary"
                          }`}
                        >
                          Remove Subscription Tiers
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          disabled={disabledActions}
                          key="Delete"
                          onClick={handleRemoveEpisodesPressed}
                          className={`${
                            active ? "bg-repod-canvas-secondary" : ""
                          } group flex rounded-md items-center w-full px-2 py-2 text-md z-10 ${
                            disabledActions
                              ? "text-repod-text-disabled cursor-default"
                              : "text-danger"
                          }`}
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
        <ManageEpisodesModal
          isModalOpen={modalOpen}
          closeModal={closeModal}
          modalType={modalType}
          subscriptionTiers={subscriptionTiers}
          episodeIds={selectedIds}
          handleAssignTiers={handleAssignTiers}
          handleRemoveEpisodes={handleRemoveEpisodes}
          unselectAll={unselectAll}
        />
      </div>
      <Table
        data={data}
        columns={columns}
        isMobile={isMobile}
        keepHeaderOnMobile
      />
      <div className="flex flex-row justify-between items-center w-full stroke-current text-repod-text-secondary">
        <div className="flex flex-row justify-end items-center">
          <label className="flex flex-row justify-start items-center">
            Rows per page:
            <select
              className="ml-2 cursor-pointer"
              value={pageSize}
              onChange={(event) => {
                handleChangePageSize(Number(event.target.value));
              }}
            >
              {map((page: { value: number; label: string }) => (
                <option key={page.value} value={page.value}>
                  {page.label}
                </option>
              ))(PAGE_SIZING)}
            </select>
          </label>
        </div>

        <div className="flex flex-row justify-end items-center">
          <p>
            {1 + page * pageSize} - {Math.min((page + 1) * pageSize, total)} of{" "}
            {total}
          </p>
          <button onClick={handlePrev}>
            <ChevronLeft size={20} className="mx-2" />
          </button>
          <button onClick={handleNext}>
            <ChevronRight size={20} className="mx-2" />
          </button>
        </div>
      </div>
    </>
  ) : (
    <EmptyTable loading={loading} message="No episodes yet" />
  );
};

export default ManageEpisodesTable;
