import React, { useEffect, useCallback } from 'react';
import { getContacts } from '../../../services/chart.service';
import { FormProps } from '../../charts/types';
import { withRouter } from "react-router-dom";
import * as queryString from 'query-string';
import './ContactsForm.scss';

const ContactsForm: React.FC<FormProps> = (props) => {
  const thisMonth = new Date().getMonth()+1;
  const today = new Date().getDate();
  const yearParam = parseInt(queryString.parse(props.location.search)['y'] as string) || 2019;
  const monthParam = parseInt(queryString.parse(props.location.search)['m'] as string) || thisMonth;
  const dayParam = parseInt(queryString.parse(props.location.search)['d'] as string) || today;

  const setData = props.setData;
  const callback = useCallback(
    async () => {
      const data = await getContacts({ year: yearParam, month: monthParam, day: dayParam });
      setData(data);
    },
    [setData, yearParam, monthParam, dayParam],
  );

  useEffect(() => {
    callback();
  }, [callback]);

  return (
      <form className="date-form">
        <h2>Contacts on {monthParam}-{dayParam}-{yearParam}</h2>
      </form>
  );
}

export default withRouter(ContactsForm);