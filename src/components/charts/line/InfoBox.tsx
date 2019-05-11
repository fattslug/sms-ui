import * as d3 from 'd3';
import { LineChartProps, PlotData } from '../types';

/**
 * Calculates optimal coordinates for Info Box
 * @param boxCoords Default box coordinates
 * @param chartSize Width + Height of chart
 * @param boxSize Width + Height of info box
 */
export const calculatePosition = (
  boxCoords: { x: number, y: number },
  chartSize: { height: number, width: number },
  boxSize: { height: number, width: number }
) => {
  let newX = boxCoords.x + 55;
  let newY = boxCoords.y;
  if (newY < 0) {
    newY += boxSize.height * 2;
  }
  if (newY + boxSize.height > chartSize.height) {
    newY -= (boxSize.height - 20);
  }
  if (newX > chartSize.width
    || newX + boxSize.width > chartSize.width) {
    newX -= boxSize.width + 30;
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
  d3.select(`#x${dataPoint.x}y${dataPoint.y}`).remove();
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
export const add = (dataPoint: PlotData, props: LineChartProps) => {
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

  const infoboxCoords = calculatePosition(point, chartSize, boxSize);

  const circles = d3.selectAll('circle').filter((e, index, t) => {
    const el: SVGCircleElement = t[index] as SVGCircleElement;
    return parseInt(el.getAttribute('cx') as string) === dataPoint.x;
  });
  circles.each((e, index, group) => {
    const circle = group[index] as SVGCircleElement;
    circle.setAttribute('r', '10');
  });

  d3.select('#infobox')
    .append('g')
    .attr('id', `x${dataPoint.x}y${dataPoint.y}`)
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
  y = addTextGroup(`#x${dataPoint.x}y${dataPoint.y}`, x, y, 'Date:', d3.timeFormat('%b-%d-%Y')(dataPoint.data.date as Date));
  dataPoint.data.values.forEach((val, index) => {
    y = addTextGroup(`#x${dataPoint.x}y${dataPoint.y}`, x, y, `${val.label}:`, val.value, d3.schemeCategory10[index]);
  });

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
  d3.select(boxID)
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('style', 'font: 12px sans-serif')
    .text(label);
  d3.select(boxID)
    .append('text')
    .attr('x', x)
    .attr('y', y + 20)
    .attr('style', 'font: bold 14px sans-serif')
    .attr('fill', color || '#000')
    .text(value);
  return y + 50;
}