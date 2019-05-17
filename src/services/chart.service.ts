import axios from 'axios';
import { DataProps } from '../components/charts/types';

export const getContacts = ({
  year = 0,
  month = 0,
  day = 0
} = {}): Promise<DataProps> => {
  const queryString = `contacts?month=${month}&day=${day}&year=${year}`;
  const chartOpts = { type: 'contacts', timeFormat: '' };
  return getData(queryString, chartOpts);
}

export const getMonth = ({
  year = 0,
  month = 0
} = {}): Promise<DataProps> => {
  const queryString = `messages/count?month=${month}&year=${year}`;
  const chartOpts = { type: 'dod', timeFormat: '%d' };
  return getData(queryString, chartOpts);
}

export const getYear = ({
  year = 0
} = {}): Promise<DataProps> => {
    const queryString = `messages/count?year=${year}`
    const chartOpts = { type: 'mom', timeFormat: '%b' };
    return getData(queryString, chartOpts);
}

export const getDecade = (): Promise<DataProps> => {
  const queryString = `messages/count`;
  const chartOpts = { type: 'yoy', timeFormat: '%Y'};
  return getData(queryString, chartOpts);
}

const getData = (queryString: string, chartOpts: {type: string, timeFormat: string}): Promise<DataProps> => {
  return axios.get<DataProps>(`http://localhost:8080/sms/${queryString}`).then((res) => {
    let sms = res.data.sms;
    if (sms.length > 0 && Object.keys(sms[0]).includes('date')) {
      sms.map((d) => d.date = new Date(d.date as Date));
    }
    return {
      sms: sms,
      minX: new Date(res.data.minX),
      minY: res.data.minY,
      maxX: new Date(res.data.maxX),
      maxY: res.data.maxY,
      length: res.data.length,
      chartType: chartOpts.type,
      timeFormat: chartOpts.timeFormat
    };
  });
}