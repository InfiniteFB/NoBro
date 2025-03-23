'use client';

import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { drawScatterPlot } from "./drawScatterPlot";

export default function ScatterPlot(props){
    const { svgWidth, svgHeight, marginLeft, marginTop, data, xScale, yScale } = props;
    
    const d3Selection = useRef();

    useEffect(() => {
        const svg = d3.select(d3Selection.current);
        let width = svgWidth - marginLeft;
        let height = svgHeight - marginTop - 80;

        // Check scatterLayer
        let scatterLayer = svg.select('g.scatter-layer');
        if (scatterLayer.empty()) {
            scatterLayer = svg.append("g")
                .attr('class', 'scatter-layer')
                .attr("transform", `translate(${marginLeft},${marginTop})`);
        } else {
            scatterLayer.selectAll('*').remove();
        }

        // Add yellow highlight rectangle
        scatterLayer.append("rect")
            .attr("class", "highlight-bg")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "yellow")
            .attr("opacity", 0);

        // Y-axis
        scatterLayer.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

        scatterLayer.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Trip duration end in");

        // X-axis
        scatterLayer.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        scatterLayer.append("text")
            .attr("transform", `translate(${width / 2}, ${height + 40})`)
            .style("text-anchor", "middle")
            .text("Trip duration start from");

        // Tooltip div → Simple div
        let tooltip = d3.select("#scatter-tooltip");
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div")
                .attr("id", "scatter-tooltip")
                .style("position", "absolute")
                .style("background-color", "white")
                .style("padding", "5px")
                .style("border", "1px solid black")
                .style("border-radius", "5px")
                .style("opacity", 0);
        }

        // Draw scatter points
        drawScatterPlot(scatterLayer, data, xScale, yScale, tooltip, width, height);

    }, [data, xScale, yScale]);

    return <svg width={svgWidth} height={svgHeight} ref={d3Selection}></svg>;
}
