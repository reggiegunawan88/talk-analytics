import React, { Component } from 'react';
import { FormattedMessage, FormattedTime } from 'react-intl';

import PropTypes from 'prop-types';

import { configValues as config } from 'Config';
import styles from './styles.scss';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { onClick, user } = this.props;
    onClick(user);
  }

  renderProfileImage() {
    const biodata = this.props.biodata;
    const name = biodata && biodata.name ? biodata.name : this.props.name;
    const { user } = this.props;

    if (user.picture) {
      return (
        <div>
          <img className={styles.chat__picture} src={user.picture} alt="" />
        </div>
      );
    }

    if (name && name.length > 0 && name !== '') {
      const [firstName, ...lastName] = name.split(' ');
      const [firstNameInitial] = firstName;
      // TODO: Refactor

      if (lastName.length > 0) {
        const [lastNameInitial] = lastName[lastName.length - 1];
        return (
          <div>
            {firstNameInitial ? firstNameInitial.toUpperCase() : null}
            {lastNameInitial ? lastNameInitial.toUpperCase() : null}
          </div>
        );
      }
      return <div>{firstNameInitial.toUpperCase()}</div>;
    }

    return <div />;
  }

  renderPlatformIcon() {
    const { platform } = this.props;
    switch (platform) {
      case 'line':
        return (
          <div className={`${styles['platform-icon']}`}>
            <img alt="" src={config.IMG.LINE_ICON} />
            &nbsp;
          </div>
        );
      case 'web':
        return (
          <div className={`${styles['platform-icon']}`}>
            <i className="fa fa-globe" />
            &nbsp;
          </div>
        );
      case 'whatsapp':
        return (
          <div className={`${styles['platform-icon']}`}>
            <i className="fa fa-whatsapp" />
            &nbsp;
          </div>
        );
      case 'telegram':
        return (
          <div className={`${styles['platform-icon']}`}>
            <img alt="" src={config.IMG.TELEGRAM_GRAY} />
            &nbsp;
          </div>
        );
      default:
        return null;
    }
  }

  renderLastMessage() {
    const { lastLog } = this.props;
    if (lastLog) {
      const { type, message } = lastLog;

      let lastMessage;

      if (message) {
        const { type: messageType, content } = message;

        switch (messageType) {
          case 'text':
            lastMessage = content;
            break;
          default:
            lastMessage = `You send a ${messageType}`;
        }
      } else {
        lastMessage = '';
      }

      return (
        <span
          className={`block text-master hint-text fs-12 ${
            styles['last-message']
          }`}
        >
          {type === 'response' ? <i className="fa fa-reply" /> : null}
          &nbsp;{lastMessage}
        </span>
      );
    }
    return null;
  }

  render() {
    const { isActive, isFetchingUnread, biodata, user, name, timestamp } = this.props;
    return (
      <li
        className={`${styles.chat} ${
          isActive ? styles['chat--active'] : ''
        } clearfix`}
        role="none"
      >
        <div
          role="none"
          className={styles['chat__click-area']}
          onClick={this.onClick}
        >
          {this.renderPlatformIcon()}
          <span
            className={`thumbnail-wrapper d32 circular ${
              styles['profile-image']
            }`}
          >
            {this.renderProfileImage()}
          </span>
          <p className={`${styles.chat__details} p-l-10`}>
            <b className="text-master">
              {biodata && biodata.name ? biodata.name : name}
              {user.agentName && <i>- {user.agentName}</i>}
            </b>
            <span className={`pull-righ ${styles.chat__time}`}>
              <FormattedTime value={new Date(timestamp)} hour12={false} />
            </span>
            {this.renderLastMessage()}
          </p>
        </div>
        {user.isRead === false ? (
          <span className={styles['chat__notif-bubble']} />
        ) : (
          <div
            role="none"
            onClick={() => this.props.setUnread(this.props.user)}
            className={`${styles['chat__read-bubble']} ${isFetchingUnread &&
              styles['chat__disabled-bubble']}`}
          >
            <i>
              <FormattedMessage id="chatroom.chat.setUnread" />
            </i>
          </div>
        )}
      </li>
    );
  }
}

export default Chat;

/* eslint-disable */
Chat.propTypes = {
  name: PropTypes.any,
  response: PropTypes.any,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  user: PropTypes.any.isRequired,
  platform: PropTypes.any,
  biodata: PropTypes.any,
  lastLog: PropTypes.any,
  isFetchingUnread: PropTypes.bool,
  setUnread: PropTypes.func,
  timestamp: PropTypes.string
};
/* eslint-enable */

Chat.defaultProps = {
  response: 'No response',
  name: undefined,
  platform: '',
  lastLog: '',
  timestamp: '',
};
