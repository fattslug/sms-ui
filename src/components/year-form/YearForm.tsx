import React, { useState, useEffect, useCallback } from 'react';
import { getData } from '../../App';
import { FormProps } from '../charts/types';
import './YearForm.scss';
import { withRouter } from 'react-router-dom';
import * as queryString from 'query-string';

type YearFormType = {
  [key: string]: number,
  year: number
}

const YearForm: React.FC<FormProps> = (props) => {
  const yearParam = parseInt(queryString.parse(props.location.search)['y'] as string) || 2019;
  const setData = props.setData;
  const callback = useCallback(
    async () => {
      const data = await getData({ year: yearParam });
      setData(data);
    },
    [setData, yearParam],
  );

  useEffect(() => {
    callback();
  }, [callback]);

  const [ formValues, setFormValues ] = useState<YearFormType>({
    year: yearParam
  });

  async function setValue(name: string, value: number) {
    formValues[name] = value;

    const data = getData(formValues);
    setData(data);

    setFormValues({
      year: formValues.year
    });
  }

  return (
      <form className="date-form">
        <h2>Pick a Year</h2>
        <div>
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

export default withRouter(YearForm);