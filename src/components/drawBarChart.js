import * as d3 from "d3";

export let drawBarChart = (barChartLayer, data, xScale, yScale, barChartWidth, barChartHeight) => {

    barChartLayer.selectAll('.bar').remove();

    barChartLayer.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', d => `bar ${d.station.replace(/[^a-zA-Z]/g, "")}`)
        .attr('x', d => xScale(d.station))
        .attr('y', d => yScale(d.start))  
        .attr('width', xScale.bandwidth())
        .attr('height', d => barChartHeight - yScale(d.start))
        .style('fill', 'steelblue')
        .style("stroke", "black")
        .on('mouseover', function(event, d) {
            // Highlight bar
            d3.select(this).style('fill', 'red');

            // Highlight scatter bg
            d3.select('.scatter-layer').select('.highlight-bg')
              .attr('opacity', 0.3);

            // Highlight point
            d3.selectAll(`.dot.${d.station.replace(/[^a-zA-Z]/g, "")}`)
              .attr('r', 10)
              .style('fill', 'red')
              .raise();
        })
        .on('mouseout', function(event, d) {
            d3.select(this).style('fill', 'steelblue');

            d3.select('.scatter-layer').select('.highlight-bg')
              .attr('opacity', 0);

            d3.selectAll(`.dot.${d.station.replace(/[^a-zA-Z]/g, "")}`)
              .attr('r', 5)
              .style('fill', 'steelblue');
        });
};
