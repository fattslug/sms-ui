import React, { useEffect, useCallback } from 'react';
import { getData } from '../../../App';
import './DecadeForm.scss';
import { FormProps } from '../../charts/types';
import { withRouter } from 'react-router';

const DecadeForm: React.FC<FormProps> = (props) => {
  const setData = props.setData;
  const callback = useCallback(
    async () => {
      const data = await getData();
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
            const data = await getData();
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