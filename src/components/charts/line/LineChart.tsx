import React from 'react';
import * as d3 from 'd3';
import { D3blackbox, XAxis, XGrid, YAxis, YGrid } from '../Shared'
import { DataProps, DataType, PlotData } from '../types';
import  * as infobox from './InfoBox';
import './LineChart.scss';

/**
 * Generates the data line
 */
export const Line = D3blackbox(function(this: any) {
  let path = d3.line<DataType>()
      .x((d,i) => this.props.plotData[i].x)
      .y((d,i) => this.props.plotData[i].y)
      .curve(d3.curveMonotoneX);
    
  d3.select(this.refs.anchor)
    .append('path')
    .datum(this.props.plotData)
    .attr('class', 'line')
    .attr('stroke', this.props.color)
    .attr('d', path);

  this.props.plotData.forEach((dataPoint: PlotData) => {
    d3.select(this.refs.anchor)
      .append('circle')
      .attr('class', 'dot')
      .attr('fill', this.props.color)
      .attr('cx', dataPoint.x)
      .attr('cy', dataPoint.y)
      .attr('r', 5)
      .on('mouseover', () => {
        infobox.add(dataPoint, this.props);
      }).on('mouseout', (point: any, index: any, element: any) => {
        infobox.remove(dataPoint);
      });
  })
});

/**
 * Renders the full chart
 * @param props Props relevant to chart data
 */
export const LineChart: React.FC<DataProps> = (props) => {
  d3.selectAll('path.line').remove();
  d3.selectAll('circle.dot').remove();

  const data = props;
  const margin = { top: 20, right: 40, bottom: 50, left: 40 };
  const chartWidth: number = (window.innerWidth/1.07) - margin.left - margin.right;
  const chartHeight: number = (window.innerHeight/1.3) - margin.top - margin.bottom;;

  const x = d3.scaleTime()
    .domain([data.minX, data.maxX])
    .rangeRound([0, chartWidth]).nice();

  const y = d3.scaleLinear()
    .domain([data.minY, data.maxY])
    .rangeRound([chartHeight, 0]).nice();

  const metadata = {
    xScale: x,
    yScale: y,
    plotWidth: chartWidth,
    plotHeight: chartHeight,
    data: data
  };

  const plotDataSent = {
    plotData: data.sms.map((d, i) => {
      return {
        id: i,
        data: d,
        x: x(d.date),
        y: y(d.sent)
      };
    })
  };

  const plotDataReceived = {
    plotData: data.sms.map((d, i) => {
      return {
        id: i,
        data: d,
        x: x(d.date),
        y: y(d.received)
      };
    })
  };

  const colors = d3.schemeCategory10;

  return(
    <div className="chart">
      <svg width={chartWidth + margin.left + margin.right}
        height={chartHeight + margin.top + margin.bottom}>
        <g className="axisLayer"
          transform={`translate(${margin.left}, ${margin.top})`}>
          <YGrid {...metadata} />
          <XGrid {...metadata} />

          <XAxis {...metadata} transform={`translate(0, ${chartHeight})`} />
          <YAxis {...metadata} />
        </g>
        <g
          className="plotLayer"
          width={chartWidth}
          height={chartHeight}
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <Line {...metadata} {...plotDataSent} color={colors[0]} property='sent' />
          <Line {...metadata} {...plotDataReceived} color={colors[1]} property='received' />
        </g>
        <g id="infobox"></g>
      </svg>
    </div>
  );
}