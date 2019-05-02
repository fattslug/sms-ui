import React, { useState } from 'react';
import './MonthForm.scss';

type IProps = {
  updateData: any
}

type MonthFormType = {
  [key: string]: number,
  month: number,
  year: number
}

export const MonthForm: React.FC<IProps> = (props) => {

  const [ formValues, setFormValues ] = useState<MonthFormType>({
    month: 1,
    year: 2019
  });

  function setValue(name: string, value: number) {
    formValues[name] = value;
    props.updateData(formValues.month, formValues.year);

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
          </select>
        </div>
      </form>
  );
}