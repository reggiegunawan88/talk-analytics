import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { hideNotification } from '../../modules/notification';
import getNotificationState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getNotificationState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators({ hideNotification }, dispatch);
  return dispatchFunc;
};

class Notification extends Component {
  componentDidMount() {
    if (!this.props.options.alwaysShown) {
      setTimeout(() => {
        this.props.hideNotification();
      }, 4000);
    }
  }

  render() {
    const {
      type,
      message,
      hideNotification: hideNotif,
      options,
      wideNotif,
    } = this.props;

    return (
      <div
        className={`pgn-wrapper ${
          wideNotif ? styles['notif_wrapper--wide'] : styles.notif_wrapper
        }`}
        data-position="top"
      >
        <div className="pgn pgn-bar">
          <div className={`alert alert-${type}`}>
            {!options.hideCloseBtn && (
              <button type="button" className="close" onClick={hideNotif}>
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
            )}
            {options.isHtmlContent ? (
              <FormattedHTMLMessage id={message} />
            ) : (
              <FormattedMessage id={message} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification);

/* eslint-disable */
Notification.propTypes = {
  hideNotification: PropTypes.func.isRequired,
  type: PropTypes.any.isRequired,
  message: PropTypes.any.isRequired,
  options: PropTypes.any,
  currLang: PropTypes.any.isRequired,
  wideNotif: PropTypes.bool,
};
/* eslint-enable */

Notification.defaultProps = {
  options: {},
  wideNotif: false,
};
