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
    const actionString = props.chartType !== 'contacts' ? generateActionString(d.data.date as Date, props.chartType) : '';
    const colors = d3.schemeCategory10;
    return (
      <Link to={actionString} key={d.x}>
        <g transform={`translate(${d.x}, 0)`}
          onMouseOver={() => {
            infobox.add(d, props);
          }}
          onMouseOut={() => {
            infobox.remove(d);
          }}
          onClick={() => {
            infobox.remove(d);
          }}
        >
        {d.data.values.map((val, index) => {
          return <rect
            key={index}
            x={d.gx(val.label)}
            y={d.y(val.value)}
            height={props.plotHeight - d.y(val.value) < 0 ? 0 : props.plotHeight - d.y(val.value)}
            width={props.xGroup.bandwidth()}
            fill={colors[index]}
          />
        })}          
        </g>
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
    queryString = `/day?y=${link.year}&m=${link.month+1}&d=${link.day}`;
  } else if (chartType === 'mom') {
    queryString = `/month?y=${link.year}&m=${link.month+1}`;
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
  const chartHeight: number = (window.innerHeight/1.3) - margin.top - margin.bottom;

  let dataDomain: string[] = [];
  if (data.sms.length > 0) {
    dataDomain = data.sms.map((sms) => {
      return sms.values.map((d) => d.label);
    })[0];
  }


  let xChart: d3.ScaleBand<string>;
  xChart = d3.scaleBand().rangeRound([0, chartWidth]);
  if (props.chartType !== 'contacts') {
    xChart.domain(data.sms.map((d) => (d.date as Date).toString()))
  } else {
    xChart.domain(data.sms.map((d) => d.contact as string))
  }

  const xGroup = d3.scaleBand()
    .domain(dataDomain)
    .rangeRound([0, xChart.bandwidth()])
    .paddingOuter(.1);

  const y = d3.scaleLinear()
    .domain([data.minY, data.maxY])
    .rangeRound([chartHeight, 0]).nice();

  const metadata = {
    xScale: xChart,
    xGroup: xGroup,
    yScale: y,
    plotWidth: chartWidth,
    plotHeight: chartHeight,
    data: data,
    chartType: props.chartType,
    timeFormat: props.timeFormat
  };

  const plotData = {
    plotData: data.sms.map((d, i) => {
      return {
        id: i,
        data: d,
        x: xChart(
          props.chartType !== 'contacts' ? (d.date as Date).toString() : (d.contact as string)
        ) as number,
        gx: xGroup,
        y: y
      };
    })
  };

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
          <Bars {...metadata} {...plotData} property='sent' />
        </g>
        <g id="infobox"></g>
      </svg>
    </div>
  );
}