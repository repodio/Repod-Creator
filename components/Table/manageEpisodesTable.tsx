import React, { useState } from "react";
import Table from "./table";
import PaginationTable from "./paginationTable";
import EmptyTable from "./emptyTable";
import { formatDate } from "utils/formats";
import { useMediaQuery } from "react-responsive";
import { MultiSelectButton } from "components/Buttons";
import { filter, map } from "lodash/fp";
import { ChevronDown } from "react-feather";

const ManageEpisodesTable = ({
  data,
  loading,
  total,
  fetchData,
}: {
  data: EpisodeItem[];
  loading?: boolean;
  total?: number;
  fetchData?: (pageIndex: number) => void;
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const columns = React.useMemo(() => {
    if (isMobile) {
      return [
        {
          Header: "Title",
          accessor: "title",
        },
      ];
    }

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
            <div className="flex flex-row justify-start items-center">
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
        Header: () => <div style={{ textAlign: "right" }}>Status</div>,
        accessor: "status",
        width: 48,
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
      },
      {
        Header: () => <div style={{ textAlign: "right" }}>Listens</div>,
        accessor: "listens",
        width: 48,
        Cell: (row) => <div style={{ textAlign: "right" }}>{row.value}</div>,
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

  if (fetchData) {
    return data && data.length ? (
      <PaginationTable
        data={data}
        columns={columns}
        loading={loading}
        total={total}
        fetchData={fetchData}
      />
    ) : (
      <EmptyTable loading={loading} message="No episode data yet" />
    );
  }

  return data && data.length ? (
    <>
      <div className="flex flex-row justify-between items-center w-full mt-8">
        <p className="text-lg font-semibold text-repod-text-primary">
          {data?.length || 0} Episodes
        </p>
        <button className="rounded-md border border-text-repod-text-secondary px-2 flex flex-row justify-center items-center">
          <p className="text-md text-repod-text-secondary">Edit</p>
          <ChevronDown
            className="stroke-current text-repod-text-secondary ml-2"
            size={16}
          />
        </button>
      </div>
      <Table data={data} columns={columns} isMobile={isMobile} />
    </>
  ) : (
    <EmptyTable loading={loading} message="No episodes yet" />
  );
};

export default ManageEpisodesTable;
