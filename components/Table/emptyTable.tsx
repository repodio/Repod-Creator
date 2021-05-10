import { Loader } from "components/Loading";
import React from "react";

const EmptyTable = ({
  message = "No data yet!",
  loading = false,
}: {
  message: string;
  loading?: boolean;
}) => {
  return !loading ? (
    <div className="flex justify-center items-center h-32 rounded-lg w-full border-dashed bg-repod-canvas-secondary border-repod-text-secondary border-2 my-8">
      <p className="text-md font-bold text-repod-text-secondary">{message}</p>
    </div>
  ) : (
    <div className="flex justify-center items-center h-32 rounded-lg w-full my-8">
      <Loader color="#222B45" />
    </div>
  );
};

export default EmptyTable;
