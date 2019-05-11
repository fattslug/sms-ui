import { RouteComponentProps } from "react-router-dom";

export type FormProps = RouteComponentProps & {
  setData: any
}

export type Value = {
  label: string,
  value: number
}

export type DataType = {
  date?: Date,
  contact?: string,
  values: Value[]
}

export type DataProps = {
  sms: DataType[],
  minX: Date,
  minY: number,
  maxX: Date,
  maxY: number,
  length: number,
  chartType: string,
  timeFormat: string
}

export type PlotData = {
  id: number,
  data: DataType,
  x: number,
  gx?: any,
  y: any
}

export type LineChartProps = {
  transform?: string,
  data?: DataProps,
  color?: string,
  property?: string,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
  plotWidth: number,
  plotHeight: number
}

export type BarChartProps = {
  transform?: string,
  color?: string,
  property?: string,
  xScale: d3.ScaleBand<string>,
  xGroup: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>
  plotWidth: number,
  plotHeight: number,
  plotData?: PlotData[],
  chartType: string,
  timeFormat: string
}