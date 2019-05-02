import React, { useState } from 'react';
import './YearForm.scss';

type IProps = {
  updateData: any
}

type YearFormType = {
  [key: string]: number,
  year: number
}

export const YearForm: React.FC<IProps> = (props) => {

  const [ formValues, setFormValues ] = useState<YearFormType>({
    year: 2019
  });

  function setValue(name: string, value: number) {
    formValues[name] = value;
    props.updateData(formValues.year);

    setFormValues({
      year: formValues.year
    });
  }

  return (
      <form className="date-form">
        <h2>Pick a Month and Year</h2>
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