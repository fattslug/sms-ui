import React, { useState } from 'react';
import axios from 'axios';
import { Navbar, BarChart } from './components';
import MonthForm from './components/sms-date-forms/month-form/MonthForm';
import YearForm from './components/sms-date-forms/year-form/YearForm';
import DecadeForm from './components/sms-date-forms/decade-form/DecadeForm';
import ContactsForm from './components/sms-contacts-forms/contacts-form/ContactsForm';
import { DataProps } from './components/charts/types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';


export const getData = ({
  year = 0,
  month = 0,
  day = 0
} = {}): Promise<DataProps> => {
  let queryString = '';
  let chartOpts: { type: string, timeFormat: string } = {
    type: '',
    timeFormat: ''
  };

  if (day > 0) {
    queryString = `contacts?month=${month}&day=${day}&year=${year}`;
    chartOpts = { type: 'contacts', timeFormat: '' };
  } else if (month > 0) {
    queryString = `month/${month}?year=${year}`;
    chartOpts = { type: 'dod', timeFormat: '%d' };
  } else if (year > 0) {
    queryString = `year/${year}`
    chartOpts = { type: 'mom', timeFormat: '%b' };
  } else {
    queryString = `decade`;
    chartOpts = { type: 'yoy', timeFormat: '%Y'};
  }

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
          <Route path="/day" render={() =>  <ContactsForm setData={setData} />} />
          <BarChart {...data} />
        </section>
      </div>
    </Router>
  );
}

export default App;