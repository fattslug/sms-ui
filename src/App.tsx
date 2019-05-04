import React, { useState } from 'react';
import axios from 'axios';
import { Navbar, BarChart } from './components';
import MonthForm from './components/month-form/MonthForm';
import YearForm from './components/year-form/YearForm';
import DecadeForm from './components/decade-form/DecadeForm';
import { DataProps } from './components/charts/types';
import { BrowserRouter as Router, Route, RouteComponentProps } from 'react-router-dom';
import './App.scss';


export const getData = ({
  year = 0,
  month = 0
} = {}): Promise<DataProps> => {
  let queryString = '';
  let chartOpts: { type: string, timeFormat: string } = {
    type: '',
    timeFormat: ''
  };

  if (month > 0) {
    queryString = `month/${month}?year=${year}`;
    chartOpts = { type: 'dod', timeFormat: '%b-%d' };
  } else if (year > 0) {
    queryString = `year/${year}`
    chartOpts = { type: 'mom', timeFormat: '%b-%Y' };
  } else {
    queryString = `decade`;
    chartOpts = { type: 'yoy', timeFormat: '%Y'};
  }

  return axios.get<DataProps>(`http://localhost:8080/sms/${queryString}`).then((res) => {
    let sms = res.data.sms;
    sms.map((d) => d.date = new Date(d.date));
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

interface Props {
  router: RouteComponentProps;
}

const App: React.FC = () => {
  const [ data, setData ] = useState<DataProps>({
    sms: [],
    minX: new Date(),
    minY: 0,
    maxX: new Date(),
    maxY: 0,
    length: 0,
    chartType: '',
    timeFormat: ''
  });



  return (
    <Router>
      <div className="app">
        <header>
          <Navbar />
        </header>
        <section>
          <Route path="/month" render={() =>  <MonthForm setData={setData} />} />
          <Route path="/year" render={() =>  <YearForm setData={setData} />} />
          <Route path="/decade" render={() =>  <DecadeForm setData={setData} />} />
          <BarChart {...data} />
        </section>
      </div>
    </Router>
  );
}

export default App;
