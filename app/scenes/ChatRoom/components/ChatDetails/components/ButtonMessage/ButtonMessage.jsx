import React from 'react';
import { FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import styles from '../../style.scss';

const ButtonMessage = ({ responses, createdAt }) => (
      <div className="message clearfix">
        <div className={`chat-bubble from-me ${styles['adjusted-from-me']}`}>
          {map(responses, (response, index) => (
            <button key={index} className="btn btn-default btn-cons m-b-5">
              {response.label}
            </button>
          ))}
        </div>
        <div className={styles.chat__time}>
          <FormattedTime value={new Date(createdAt)} hour12={false} />
        </div>
      </div>
    );

export default ButtonMessage;

/* eslint-disable */
ButtonMessage.propTypes = {
  responses: PropTypes.any,
  createdAt: PropTypes.string
}
/* eslint-enable */