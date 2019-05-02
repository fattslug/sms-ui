import React, { useState } from 'react';
import axios from 'axios';
import { Navbar, BarChart, MonthForm, YearForm } from './components';
import { DataProps } from './components/charts/types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';

const App: React.FC = () => {
  let [ data, setData ] = useState<DataProps>({
    sms: [],
    minX: new Date(),
    minY: 0,
    maxX: new Date(),
    maxY: 0,
    length: 0
  });

  function updateMonth(month: number, year: number) {
    axios.get<DataProps>(`http://localhost:8080/sms/month/${month}?year=${year}`).then((res) => {
      let sms = res.data.sms;
      sms.map((d) => d.date = new Date(d.date));
      setData({
        sms: sms,
        minX: new Date(res.data.minX),
        minY: res.data.minY,
        maxX: new Date(res.data.maxX),
        maxY: res.data.maxY,
        length: res.data.length
      });
    });
  }

  function updateYear(year: number) {
    axios.get<DataProps>(`http://localhost:8080/sms/year/${year}`).then((res) => {
      let sms = res.data.sms;
      sms.map((d) => d.date = new Date(d.date));
      setData({
        sms: sms,
        minX: new Date(res.data.minX),
        minY: res.data.minY,
        maxX: new Date(res.data.maxX),
        maxY: res.data.maxY,
        length: res.data.length
      });
    });
  }

  return (
    <Router>
      <div className="app">
        <header>
          <Navbar />
        </header>
        <section>
          <Route path="/month" render={() =>  <MonthForm updateData={updateMonth} />} />
          <Route path="/year" render={() =>  <YearForm updateData={updateYear} />} />
          {/* <LineChart
            sms={data.sms}
            maxX={data.maxX}
            maxY={data.maxY}
            minY={data.minY}
            minX={data.minX}
            length={data.length}
          /> */}
          <BarChart
            sms={data.sms}
            maxX={data.maxX}
            maxY={data.maxY}
            minY={data.minY}
            minX={data.minX}
            length={data.length}
          />
        </section>
      </div>
    </Router>
  );
}

export default App;
