import * as d3 from 'd3';
import { BarChartProps, PlotData } from '../types';

/**
 * Calculates optimal coordinates for Info Box
 * @param boxCoords Default box coordinates
 * @param chartSize Width + Height of chart
 * @param boxSize Width + Height of info box
 */
export const calculatePosition = (
  dataPoint: { x: number, y: number },
  chartSize: { height: number, width: number },
  boxSize: { height: number, width: number },
  barSize: { height: number, width: number }
) => {
  const margin = { top: 20, right: 40, bottom: 50, left: 40 };
  let newX = (dataPoint.x + margin.left) - boxSize.width;
  let newY = dataPoint.y + margin.top;
  // Handle bottom overhang
  if (newY + boxSize.height > chartSize.height) {
    const overhang = newY + boxSize.height - (chartSize.height + margin.bottom + margin.top);
    newY -= overhang + 50;
  }
  // Handle left overhang
  if (newX - boxSize.width < 0) {
    newX += boxSize.width + barSize.width;
  }

  return {
    x: newX,
    y: newY
  };
}

/**
 * 
 * @param dataPoint Data relevant to infobox content
 */
export const remove = (dataPoint: PlotData) => {
  const id = `x${dataPoint.x.toFixed(0)}y${dataPoint.y}`;
  d3.select(`#${id}`).remove();
  const circles = d3.selectAll('circle').filter((e, index, t) => {
    const el: SVGCircleElement = t[index] as SVGCircleElement;
    return parseInt(el.getAttribute('cx') as string) === dataPoint.x;
  });
  circles.each((e, index, group) => {
    const circle = group[index] as SVGCircleElement;
    circle.setAttribute('r', '5');
  });
} 

/**
 * Generates an SVG label for the provided data point
 * @param dataPoint Data relevant to infobox content
 * @param props Props relevant to chart (we use chart width/height)
 */
export const add = (dataPoint: PlotData, props: BarChartProps, barSize: { height: number, width: number }) => {
  const boxSize = {
    height: 150,
    width: 100
  };
  const chartSize = {
    height: props.plotHeight,
    width: props.plotWidth
  }
  const point = {
    x: dataPoint.x,
    y: dataPoint.y
  };

  const infoboxCoords = calculatePosition(point, chartSize, boxSize, barSize);

  const circles = d3.selectAll('circle').filter((e, index, t) => {
    const el: SVGCircleElement = t[index] as SVGCircleElement;
    return parseInt(el.getAttribute('cx') as string) === dataPoint.x;
  });
  circles.each((e, index, group) => {
    const circle = group[index] as SVGCircleElement;
    circle.setAttribute('r', '10');
  });

  const id = `x${dataPoint.x.toFixed(0)}y${dataPoint.y}`;

  d3.select('#infobox')
    .append('g')
    .attr('id', id)
    .append('rect')
    .attr('x', infoboxCoords.x)
    .attr('rx', 0)
    .attr('y', infoboxCoords.y)
    .attr('ry', 0)
    .attr('height', boxSize.height)
    .attr('width', boxSize.width)
    .attr('fill', '#f4f4f4')
    .attr('stroke', '#666')

  let y = infoboxCoords.y + 20;
  let x = infoboxCoords.x + 10;
  y = addTextGroup(id, x, y, 'Date:', d3.timeFormat('%b-%d-%Y')(dataPoint.data.date));
  y = addTextGroup(id, x, y, 'Sent:', dataPoint.data.sent, d3.schemeCategory10[0]);
  addTextGroup(id, x, y, 'Received:', dataPoint.data.received, d3.schemeCategory10[1]);

}

/**
 * Adds a label \n value text grouping
 * at specified coordinates
 * @param boxID ID of label box to add to
 * @param x X coordinate of text grouping
 * @param y Y coordinate of text grouping
 * @param label Title for label
 * @param value Value for label
 * @returns y coordinate for next text grouping
 */
function addTextGroup(boxID: string, x: number, y: number, label: string, value: string | number, color?: string): number {
  d3.select(`#${boxID}`)
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('style', 'font: 12px sans-serif')
    .text(label);
  d3.select(`#${boxID}`)
    .append('text')
    .attr('x', x)
    .attr('y', y + 20)
    .attr('style', 'font: bold 14px sans-serif')
    .attr('fill', color || '#000')
    .text(value);
  return y + 50;
}