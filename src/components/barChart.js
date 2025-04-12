import React from "react";
import { max, scaleBand, scaleLinear } from "d3";
import { XAxis, YAxis } from "./axes";

export function BarChart(props) {
    const { offsetX, offsetY, data, height, width, selectedAirlineID, setSelectedAirlineID } = props;

    const margin = { top: 20, right: 20, bottom: 30, left: 140 };

    // Define inner drawing area
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 1. Find the maximum count
    const maxCount = max(data, d => d.Count);

    // 2. Define xScale and yScale based on innerWidth/innerHeight
    const xScale = scaleLinear()
        .domain([0, maxCount])
        .range([0, innerWidth]);

    const yScale = scaleBand()
        .domain(data.map(d => d.AirlineName))
        .range([0, innerHeight])
        .padding(0.2);

    // 3. Color function
    const getBarColor = (d) => {
        return d.AirlineID === selectedAirlineID ? "#992a5b" : "#2a5599";
    };

    // 4. Mouseover and mouseout handlers
    const handleMouseOver = (d) => {
        setSelectedAirlineID(d.AirlineID);
    };

    const handleMouseOut = () => {
        setSelectedAirlineID(null);
    };

    return (
        <g transform={`translate(${offsetX+50}, ${offsetY})`}>
            {data.map((d, i) => (
                <rect
                    key={i}
                    x={0}
                    y={yScale(d.AirlineName)}
                    width={xScale(d.Count)}
                    height={yScale.bandwidth()}
                    fill={getBarColor(d)}
                    stroke="black"
                    onMouseOver={() => handleMouseOver(d)}
                    onMouseOut={handleMouseOut}
                />
            ))}
            {/* Draw axes */}
            <XAxis xScale={xScale} width={innerWidth} height={innerHeight} />
            <YAxis yScale={yScale} height={innerHeight} offsetX={margin.left} />
        </g>
    );
}
