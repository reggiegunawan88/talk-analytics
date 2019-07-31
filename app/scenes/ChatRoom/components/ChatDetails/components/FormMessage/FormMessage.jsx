import React, { Component } from 'react';
import { FormattedTime } from 'react-intl';

import PropTypes from 'prop-types';

import styles from '../../style.scss';

class FormMessage extends Component {
  renderResponses() {
    const { responses } = this.props;

    let lButton;
    return (
      <div>
        <h5 style={{ color: 'white' }}>{responses.title}</h5>
        <form>
          {responses.map((response, index) => {
            if (response.type === 'button') {
              return response.content.map((button, btnIndex) => {
                lButton = (
                  <button
                    key={btnIndex}
                    className="btn btn-default btn-cons m-b-5"
                  >
                    {button.label}
                  </button>
                );
              });
            }
            
            return (
              <div className="form-group" key={index}>
                <label htmlFor="label">{response.label}</label>
                <label htmlFor="value" className="form-control">
                  {response.value}
                </label>
              </div>
            );
          })}
          {lButton}
        </form>
      </div>
    );
  }

  render() {
    const { createdAt } = this.props;
    return (
      <div className="message clearfix">
        <div className="profile-img-wrapper m-t-5 m-l-5 inline pull-right">
          <img
            className="col-top"
            width={30}
            height={30}
            src="/img/profiles/avatar.png"
            alt="user profile"
          />
        </div>
        <div className={`chat-bubble from-me ${styles['adjusted-from-me']}`}>
          {this.renderResponses()}
        </div>
        <div className={styles.chat__time}>
          <FormattedTime value={new Date(createdAt)} hour12={false} />
        </div>
      </div>
    );
  }
}

export default FormMessage;

/* eslint-disable */
FormMessage.propTypes = {
  responses: PropTypes.any,
  createdAt: PropTypes.string,
};
/* eslint-enable */

FormMessage.defaultProps = {
  responses: {},
  createdAt: '',
};
