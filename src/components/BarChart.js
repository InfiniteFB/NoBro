'use client';

import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { drawBarChart } from "./drawBarChart";

export default function BarChart(props){
    const { svgWidth, svgHeight, marginLeft, marginTop, data, xScale, yScale } = props;
    
    const d3Selection = useRef();

    useEffect(() => {
        const svg = d3.select(d3Selection.current);
        let width = svgWidth - marginLeft;
        let height = svgHeight - marginTop - 80;

        // Remove old g
        let barChartLayer = svg.select('g.bar-chart-layer');
        if (barChartLayer.empty()) {
            barChartLayer = svg.append("g")
                .attr('class', 'bar-chart-layer')
                .attr("transform", `translate(${marginLeft},${marginTop})`);
        } else {
            barChartLayer.selectAll('*').remove();
        }

        // Add title on top
        svg.selectAll('.chart-title').remove(); // clear previous
        svg.append("text")
            .attr('class', 'chart-title')
            .attr("x", svgWidth / 2)
            .attr("y", marginTop - 5) // top
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("Bikers start from");

        // X-axis
        barChartLayer.append('g')
            .attr("transform", `translate(0, ${height})`)
            .attr('class', 'x-axis')
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-0.8em')
            .attr('dy', '.015em')
            .attr('transform', 'rotate(-65)');

        // Y-axis
        barChartLayer.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

        // Draw bars
        drawBarChart(barChartLayer, data, xScale, yScale, width, height);

    }, [data, xScale, yScale]);

    return <svg width={svgWidth} height={svgHeight} ref={d3Selection}></svg>;
}
