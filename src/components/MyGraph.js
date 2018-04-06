import React from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { max, extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';
import { timeHour } from 'd3-time';

const timeFormatter = timeFormat('%H:%M');
const dateFormatter = timeFormat('%d %m %Y');

class MyGraph extends React.Component {
    constructor(props){
        super(props);
        this.createBarChart = this.createBarChart.bind(this);
    }
    componentDidMount() {
        this.createBarChart();
    }
    
    componentDidUpdate() {
        this.createBarChart();
    }

    createBarChart() {
        const node = this.node;
        const timestamps = this.props.data.map(element => element[0]);
        const values = this.props.data.map(element => element[1]);
        const dataMax = max(values);
        const axisBorder = 25;
        const padding = 10;
        const graphHeight = this.props.size[1] - (axisBorder + padding);

        const xScale = scaleTime()
            .domain(extent(timestamps))
            .range([0, this.props.size[0] - (axisBorder + padding)]);

        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([graphHeight, 0]);

        const xTickFormatter = this.props.dateType === 'Today' ? timeFormatter : dateFormatter;
        const xTickInterval = this.props.dateType === 'Today' ? timeHour.every(4) : 4;

        const xAxis = axisBottom()
            .scale(xScale)
            .ticks(xTickInterval)
            .tickFormat(xTickFormatter);
        const yAxis = axisLeft()
            .scale(yScale)
            .ticks(5);

        select(node)
            .selectAll('rect')
            .data(this.props.data)
            .enter()
            .append('rect');
        select(node)
            .selectAll('rect')
            .data(this.props.data)
            .exit()
            .remove();
        select(node)
            .selectAll('rect')
            .data(this.props.data)
            .style('fill', 'blue')
            .attr('x', d => axisBorder + xScale(d[0]) )
            .attr('y', d => yScale(d[1]) + padding)
            .attr('height', d => graphHeight - yScale(d[1]) )
            .attr('width', 1);

        select(node)
            .selectAll('.xAxis, .yAxis')
            .remove();

        select(node)
            .append('g')
            .classed('xAxis', true)
            .attr('transform', 'translate(' + axisBorder + ', ' + (graphHeight + padding) + ')')
            .call(xAxis);

        select(node)
            .append('g')
            .classed('yAxis', true)
            .attr('transform', 'translate(' + axisBorder + ',' + padding + ')')
            .call(yAxis);
    }

    render() {
        return <svg ref={node => this.node = node}
            width={this.props.size[0]} height={this.props.size[1]}>
        </svg>
    }
}
export default MyGraph