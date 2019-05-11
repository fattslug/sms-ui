import React from 'react';
import * as d3 from 'd3';
import { BarChartProps, LineChartProps } from './types';

export function D3blackbox(d3render: any) {
  return class Blackbox extends React.Component<BarChartProps | LineChartProps> {
    componentDidMount() {
      d3render.call(this);
    }
    componentDidUpdate() {
      d3render.call(this);
    }

    render() {
      const transform = this.props.transform || '';
      return <g transform={transform} ref='anchor' />;
    }
  };
}

export const XAxis = D3blackbox(function(this: any) {
  const axis = d3.axisBottom(this.props.xScale)
    .ticks(this.props.data.length)
  
    if (this.props.chartType !== 'contacts') {
      axis.tickFormat((d: any) => d3.timeFormat(this.props.timeFormat)(new Date(d)));
    }

  d3.select(this.refs.anchor)
    .classed('xAxis', true)
    .call(axis);
});

export const YAxis = D3blackbox(function(this: any) {
  const axis = d3.axisLeft(this.props.yScale)
    .tickFormat((d: any) => d)

  d3.select(this.refs.anchor)
    .classed('yAxis', true)
    .call(axis);
});

export const YGrid = D3blackbox(function(this: any) {
  const axis = d3.axisRight(this.props.yScale)
    .tickSizeOuter(0)
    .tickSizeInner(this.props.plotWidth);

  d3.select(this.refs.anchor)
    .classed('yGrid', true)
    .call(axis);
});

export const XGrid = D3blackbox(function(this: any) {
  const axis = d3.axisBottom(this.props.xScale)
    .ticks(this.props.data.length)
    .tickSizeOuter(0)
    .tickSizeInner(this.props.plotHeight);

  d3.select(this.refs.anchor)
    .classed('xGrid', true)
    .call(axis);
});