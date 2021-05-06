import React from "react";

const EmptyTable = ({ message = "No data yet!" }: { message: string }) => {
  return (
    <div className="flex justify-center items-center h-32 rounded-lg w-full border-dashed bg-repod-canvas-secondary border-repod-text-secondary border-2 my-8">
      <p className="text-md font-bold text-repod-text-secondary">{message}</p>
    </div>
  );
};

export default EmptyTable;
