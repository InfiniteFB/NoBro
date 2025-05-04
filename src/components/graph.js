import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getNodes } from '../utils/getNodes';
import { getLinks } from '../utils/getLinks';
import { drag } from '../utils/drag';

export function Graph(props) {
    const { margin, svg_width, svg_height, data } = props;

    const nodes = getNodes({ rawData: data });
    const links = getLinks({ rawData: data });

    const width = svg_width - margin.left - margin.right;
    const height = svg_height - margin.top - margin.bottom;

    const lineWidth = d3.scaleLinear().range([2, 6])
        .domain([d3.min(links, d => d.value), d3.max(links, d => d.value)]);
    const radius = d3.scaleLinear().range([10, 50])
        .domain([d3.min(nodes, d => d.value), d3.max(nodes, d => d.value)]);
    const color = d3.scaleOrdinal().range(d3.schemeCategory10)
        .domain(nodes.map(d => d.name));

    const d3Selection = useRef();

    useEffect(() => {
        d3.select("body").selectAll(".tooltip-health").remove();

        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip-health")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("color", "black")
            .style("padding", "6px 10px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", 1000)
            .style("box-shadow", "0 2px 8px rgba(0, 0, 0, 0.2)");

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.name).distance(d => 20 / d.value))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("y", d3.forceY([height / 2]).strength(0.02))
            .force("collide", d3.forceCollide().radius(d => radius(d.value) + 20))
            .tick(3000);

        const g = d3.select(d3Selection.current);
        g.selectAll("*").remove();

        const link = g.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => lineWidth(d.value));

        const node = g.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .enter();

        const point = node.append("circle")
            .attr("r", d => radius(d.value))
            .attr("fill", d => color(d.name))
            .on("mouseover", function(event, d) {
                tooltip
                    .text(d.name)
                    .style("visibility", "visible");
            })
            .on("mousemove", function(event) {
                tooltip
                    .style("top", (event.pageY + 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })            
            .on("mouseout", function() {
                tooltip.style("visibility", "hidden");
            })
            .call(drag(simulation));

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            point
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

        const legendData = nodes.map(d => ({ name: d.name, color: color(d.name) }));
        const legend = g.append("g")
            .attr("transform", `translate(-${margin.left - 10}, -${margin.top - 10})`);

        legend.selectAll("rect")
            .data(legendData)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => d.color);

        legend.selectAll("text")
            .data(legendData)
            .enter()
            .append("text")
            .attr("x", 15)
            .attr("y", (d, i) => i * 20 + 9)
            .text(d => d.name)
            .style("font-size", "12px")
            .attr("fill", "black");

    }, [width, height]);

    return (
        <svg
            viewBox={`0 0 ${svg_width} ${svg_height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%" }}
        >
            <g ref={d3Selection} transform={`translate(${margin.left}, ${margin.top})`} />
        </svg>
    );
}
