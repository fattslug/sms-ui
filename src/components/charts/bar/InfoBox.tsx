import * as d3 from 'd3';
import { BarChartProps, PlotData } from '../types';

/**
 * Calculates optimal coordinates for Info Box
 * @param boxCoords Default box coordinates
 * @param chartSize Width + Height of chart
 * @param boxSize Width + Height of info box
 */
export const calculatePosition = (
  props: BarChartProps,
  dataPoint: PlotData,
  boxSize: { height: number, width: number }
) => {
  const margin = { top: 20, right: 40, bottom: 50, left: 40 };
  let newX = ((dataPoint.x + margin.left) + ((props.xGroup.paddingOuter() * props.xScale.bandwidth()) / 2)) - boxSize.width;
  let newY = dataPoint.y(dataPoint.data.values[0].value) + margin.top;
  // Handle bottom overhang
  if (newY + boxSize.height > props.plotHeight) {
    const overhang = newY + boxSize.height - (props.plotHeight + margin.bottom + margin.top);
    newY -= overhang + 50;
  }
  // Handle left overhang
  if (newX - boxSize.width < 0) {
    newX += boxSize.width + (props.xScale.bandwidth()) - ((props.xGroup.paddingOuter() * props.xScale.bandwidth()));
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
  const id = `x${dataPoint.x.toFixed(0)}y${dataPoint.y(dataPoint.data.values[0].value)}`;
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
 * Removes all infoboxes
 */
export const removeAll = () => {
  d3.selectAll(`.infobox`).remove();
} 

/**
 * Generates an SVG label for the provided data point
 * @param dataPoint Data relevant to infobox content
 * @param props Props relevant to chart (we use chart width/height)
 */
export const add = (dataPoint: PlotData, props: BarChartProps) => {
  const boxSize = {
    height: 150,
    width: 100
  };

  const infoboxCoords = calculatePosition(props, dataPoint, boxSize);

  const circles = d3.selectAll('circle').filter((e, index, t) => {
    const el: SVGCircleElement = t[index] as SVGCircleElement;
    return parseInt(el.getAttribute('cx') as string) === dataPoint.x;
  });
  circles.each((e, index, group) => {
    const circle = group[index] as SVGCircleElement;
    circle.setAttribute('r', '10');
  });

  const id = `x${dataPoint.x.toFixed(0)}y${dataPoint.y(dataPoint.data.values[0].value)}`;

  d3.select('#infobox')
    .append('g')
    .attr('id', id)
    .attr('class', 'infobox')
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

  let label: string;
  let labelVal: string;
  if (props.chartType !== 'contacts') {
    label = 'Date:';
    labelVal = d3.timeFormat('%b-%d-%Y')(dataPoint.data.date as Date);
  } else {
    label = 'Contact:';
    labelVal = dataPoint.data.contact as string === '' ? '' : dataPoint.data.contact as string;
  }

  y = addTextGroup(id, x, y, label, labelVal);
  dataPoint.data.values.forEach((val, index) => {
    y = addTextGroup(id, x, y, `${val.label}:`, val.value, d3.schemeCategory10[index]);
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