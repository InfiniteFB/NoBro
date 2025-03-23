import * as d3 from "d3";

export let drawScatterPlot = (scatterLayer, data, xScale, yScale, tooltip, width, height) => {

    scatterLayer.selectAll('.dot').remove();

    scatterLayer.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', d => `dot ${d.station.replace(/[^a-zA-Z]/g, "")}`)
        .attr('cx', d => xScale(d.tripdurationS))
        .attr('cy', d => yScale(d.tripdurationE))
        .attr('r', 5)
        .style('fill', 'steelblue')
        .style('stroke', 'black')
        .on('mouseover', function(event, d) {
            // Highlight scatter bg
            scatterLayer.select('.highlight-bg')
                .attr('opacity', 0.3);

            // Highlight point
            d3.select(this)
                .attr('r', 10)
                .style('fill', 'red')
                .raise();

            // Tooltip
            tooltip.style("opacity", 1)
                .html(d.station)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");

            // Highlight bar
            d3.selectAll(`.bar.${d.station.replace(/[^a-zA-Z]/g, "")}`)
                .style('fill', 'red')
                .raise();
        })
        .on('mouseout', function(event, d) {
            scatterLayer.select('.highlight-bg')
                .attr('opacity', 0);

            d3.select(this)
                .attr('r', 5)
                .style('fill', 'steelblue');

            tooltip.style("opacity", 0);

            d3.selectAll(`.bar.${d.station.replace(/[^a-zA-Z]/g, "")}`)
                .style('fill', 'steelblue');
        });
};
