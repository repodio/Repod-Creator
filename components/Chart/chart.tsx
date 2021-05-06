import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";

const ChartComponent = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 24, right: 24, bottom: 24, left: 24 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.0f"
    curve="monotoneX"
    axisTop={null}
    axisRight={null}
    axisLeft={{
      tickSize: 0,
      tickPadding: 8,
      tickRotation: 0,
      tickValues: 3,
    }}
    axisBottom={null}
    gridYValues={3}
    enableGridX={false}
    colors={{ scheme: "category10" }}
    defs={[
      linearGradientDef("gradientA", [
        { offset: 0, color: "inherit" },
        { offset: 100, color: "inherit", opacity: 0 },
      ]),
    ]}
    fill={[{ match: "*", id: "gradientA" }]}
    lineWidth={3}
    enablePoints={false}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    enableArea={true}
    areaOpacity={0.8}
    useMesh={false}
    legends={[]}
    enableSlices="x"
    crosshairType="bottom"
    sliceTooltip={({ slice }) => {
      const point = slice.points[0];
      const data = point && point.data;

      return (
        <div className="flex flex-col justify-start items-start bg-repod-canvas rounded-md shadow-md  p-4">
          <p className="text-md text-repod-text-primary">{data.xFormatted}</p>
          <p className="text-md font-bold text-repod-text-primary">
            {`${data.yFormatted} ${point.serieId}`}
          </p>
        </div>
      );
    }}
  />
);

export default ChartComponent;
