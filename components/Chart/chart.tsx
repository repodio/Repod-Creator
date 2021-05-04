import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";

const ChartComponent = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.0f"
    curve="basis"
    axisTop={null}
    axisRight={null}
    axisBottom={null}
    axisLeft={{
      orient: "left",
      tickSize: 4,
      tickPadding: 4,
      tickRotation: 0,
    }}
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
    useMesh={true}
    legends={[]}
  />
);

export default ChartComponent;
