import React, { useEffect, useCallback } from 'react';
import { getDecade } from '../../../services/chart.service';
import './DecadeForm.scss';
import { FormProps } from '../../charts/types';
import { withRouter } from 'react-router';

const DecadeForm: React.FC<FormProps> = (props) => {
  const setData = props.setData;
  const callback = useCallback(
    async () => {
      const data = await getDecade();
      setData(data);
    },
    [setData],
  );

  useEffect(() => {
    callback();
  }, [callback]);

  return (
    <form className="date-form">
      <div>
        <button type="button"
          onClick={async () => {
            const data = await getDecade();
            props.setData(data);
          }}
        >
          Get Decade
        </button>
      </div>
    </form>
  );
}

export default withRouter(DecadeForm);