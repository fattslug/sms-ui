import React, { useState, useEffect, useCallback } from 'react';
import { getMonth } from '../../../services/chart.service';
import { FormProps } from '../../charts/types';
import { withRouter } from "react-router-dom";
import * as queryString from 'query-string';
import './MonthForm.scss';

type MonthFormType = {
  [key: string]: number,
  month: number,
  year: number
}

const MonthForm: React.FC<FormProps> = (props) => {
  const thisMonth = new Date().getMonth()+1;
  const yearParam = parseInt(queryString.parse(props.location.search)['y'] as string) || 2019;
  const monthParam = parseInt(queryString.parse(props.location.search)['m'] as string) || thisMonth;
  const setData = props.setData;
  const callback = useCallback(
    async () => {
      const data = await getMonth({ year: yearParam, month: monthParam });
      setData(data);
    },
    [setData, yearParam, monthParam],
  );

  useEffect(() => {
    callback();
  }, [callback]);

  const [ formValues, setFormValues ] = useState<MonthFormType>({
    month: monthParam,
    year: yearParam
  });

  async function setValue(name: string, value: number) {
    formValues[name] = value;

    const data = await getMonth(formValues);
    setData(data);

    setFormValues({
      month: formValues.month,
      year: formValues.year
    });
  }

  return (
      <form className="date-form">
        <h2>Pick a Month and Year</h2>
        <div>
          <select name="month"
            onChange={e => { setValue('month', parseInt(e.target.value)) }}
            value={formValues.month}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select name="year"
            onChange={e => setValue('year', parseInt(e.target.value))}
            value={formValues.year}
          >
            <option value="2014">2014</option>
            <option value="2015">2015</option>
            <option value="2016">2016</option>
            <option value="2017">2017</option>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
          </select>
        </div>
      </form>
  );
}

export default withRouter(MonthForm);
