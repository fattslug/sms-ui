import React, { useState } from 'react';

import { Navbar, BarChart } from './components';
import MonthForm from './components/sms-date-forms/month-form/MonthForm';
import YearForm from './components/sms-date-forms/year-form/YearForm';
import DecadeForm from './components/sms-date-forms/decade-form/DecadeForm';
import ContactsForm from './components/sms-contacts-forms/contacts-form/ContactsForm';
import { DataProps } from './components/charts/types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';

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