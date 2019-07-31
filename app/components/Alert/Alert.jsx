import React, { Component } from 'react';

import PropTypes from 'prop-types';

import styles from './styles.scss';

class Alert extends Component {
  componentDidUpdate() {
    const { showAlert, onHide, time } = this.props;
    if (showAlert) {
      setTimeout(() => {
        onHide();
      }, time);
    }
  }

  render() {
    const { showAlert, children } = this.props;
    return (
      <div className={`alert alert-danger ${styles['alert-custom']} ${showAlert ? styles['alert-show'] : styles['alert-hide']}`}>
        {children}
      </div>
    );
  };
}
export default Alert;

/* eslint-disable */
Alert.propTypes = {
  showAlert: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired,
  onHide: PropTypes.func,
  time: PropTypes.number,
};
/* eslint-enable */

Alert.defaultProps = {
  time: 4000,
  onHide: () => {},
};
