import React from "react";

export { XAxis, YAxis };

// Complete the YAxis
function YAxis(props) {
    const { yScale, height, offsetX } = props;
    return (
        <g>
            {/* Main y-axis line */}
            <line y2={height} stroke="black" />
            {/* Ticks */}
            {yScale.domain().map(tickValue => (
                <g key={tickValue} transform={`translate(0, ${yScale(tickValue) + yScale.bandwidth() / 2})`}>
                    {/* Small tick line */}
                    <line x1={-5} x2={0} y1={0} y2={0} stroke="black" />
                    {/* Tick label */}
                    <text
                        style={{ textAnchor: 'start', fontSize: '10px' }}
                        x={-offsetX + 10}
                        y={0}
                        dy="0.32em"
                    >
                        {tickValue}
                    </text>
                </g>
            ))}
        </g>
    );
}

function XAxis(props) {
    const { xScale, width, height } = props;

    return (
        <g transform={`translate(0, ${height})`}>
            {/* Main x-axis line */}
            <line x2={width} stroke="black" />
            {/* Ticks */}
            {xScale.ticks(5).map(tickValue => (
                <g key={tickValue} transform={`translate(${xScale(tickValue)}, 0)`}>
                    <line y2={10} stroke="black" />
                    <text style={{ textAnchor: 'middle', fontSize: '10px' }} y={20}>
                        {tickValue}
                    </text>
                </g>
            ))}
        </g>
    );
}
