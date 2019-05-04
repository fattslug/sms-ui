import React from 'react';
import * as d3 from 'd3';
import { XAxis, XGrid, YAxis, YGrid } from '../Shared'
import { DataProps, PlotData, BarChartProps } from '../types';
import  * as infobox from './InfoBox';
import './BarChart.scss';
import { Link } from 'react-router-dom';

/**
 * Generates the data bars
 */
export const Bars: React.FC<BarChartProps> = (props) => {
  const bars = ((props.plotData as PlotData[]).map((d: PlotData) => {
    const actionString = generateActionString(d.data.date, props.chartType);

    const barSize = {
      height: props.plotHeight - d.y,
      width: props.xScale.bandwidth() / 2.5
    }
    if (barSize.height < 0) {
      barSize.height = 0;
    }

    d.x = props.property === 'received' ? (d.x + props.xScale.bandwidth()/2.5) : d.x;
    return (
      <Link to={actionString} key={d.x}>
        <rect
          x={d.x}
          y={d.y}
          height={barSize.height}
          width={barSize.width}
          fill={props.color}
          onMouseOver={() => {
            infobox.add(d, props, barSize);
          }}
          onMouseOut={() => {
            infobox.remove(d);
          }}
          onClick={() => {
            infobox.remove(d);
          }}
        />
      </Link>
    );
  }));

  return <g>{bars}</g>;
};

function generateActionString(date: Date, chartType: string): string {
  const link = {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate()
  };
  let queryString = '';
  if (chartType === 'dod') {
    queryString = `/day?y=${link.year}&m=${link.month}&d=${link.day}`;
  } else if (chartType === 'mom') {
    queryString = `/month?y=${link.year}&m=${link.month}`;
  } else if (chartType === 'yoy') {
    queryString = `/year?y=${link.year}`;
  }

  return queryString;
}

/**
 * Renders the full chart
 * @param props Props relevant to chart data
 */
export const BarChart: React.FC<DataProps> = (props) => {
  const data = props;
  const margin = { top: 20, right: 40, bottom: 50, left: 40 };
  const chartWidth: number = (window.innerWidth/1.07) - margin.left - margin.right;
  const chartHeight: number = (window.innerHeight/1.3) - margin.top - margin.bottom;;

  const x = d3.scaleBand()
    .domain(data.sms.map((d) => d.date.toString()))
    .rangeRound([0, chartWidth]);

  const y = d3.scaleLinear()
    .domain([data.minY, data.maxY])
    .rangeRound([chartHeight, 0]).nice();

  const metadata = {
    xScale: x,
    yScale: y,
    plotWidth: chartWidth,
    plotHeight: chartHeight,
    data: data,
    chartType: props.chartType,
    timeFormat: props.timeFormat
  };

  const plotDataSent = {
    plotData: data.sms.map((d, i) => {
      return {
        id: i,
        data: d,
        x: x(d.date.toString()) as number,
        y: y(d.sent)
      };
    })
  };

  const plotDataReceived = {
    plotData: data.sms.map((d, i) => {
      return {
        id: i,
        data: d,
        x: x(d.date.toString()) as number,
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
          <Bars {...metadata} {...plotDataSent} color={colors[0]} property='sent' />
          <Bars {...metadata} {...plotDataReceived} color={colors[1]} property='received' />
        </g>
        <g id="infobox"></g>
      </svg>
    </div>
  );
}