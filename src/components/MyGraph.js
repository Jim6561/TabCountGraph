import React from 'react';
import { scaleLinear } from 'd3-scale';
import { max, min } from 'd3-array';
import { select } from 'd3-selection';

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
        const timeStart = min(timestamps);
        const timeEnd = max(timestamps);
        const dataMax = max(values);

        const xScale = scaleLinear()
            .domain([timeStart, timeEnd])
            .range([0, this.props.size[0] - 1]);

        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([0, this.props.size[1] - 1]);

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
            .attr('x', d => xScale(d[0]) )
            .attr('y', d => this.props.size[1] - yScale(d[1]))
            .attr('height', d => yScale(d[1]) )
            .attr('width', 1);
    }

    render() {
        return <svg ref={node => this.node = node}
            width={this.props.size[0]} height={this.props.size[1]}>
        </svg>
    }
}
export default MyGraph