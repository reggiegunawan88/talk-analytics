import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { configValues } from 'Config';
import styles from './styles.scss';

class BeforeLoginWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.clickButton = this.clickButton.bind(this);
  }

  clickButton() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    return (
      <div className={`login-wrapper ${styles['login--full']}`}>
        <div className={`${styles['login__container']} ${this.state.isOpen && styles.login__hide}`}>
          <div className={`p-l-50 m-l-20 p-r-50 m-r-20 p-t-40 p-b-40 ${styles['login__container-body']}`}>
            {this.props.children}
          </div>

          {/* mini chat button on bottom right corner */}
          <div className={styles['talkabot--button']}>
            <button type="submit" className={styles['shake']} onClick={this.clickButton}><img src={configValues.IMG.CHAT_BTN_WHITE} alt="" />
            </button>
          </div>
        </div>

        <div className={`${styles['chat__container']} ${styles['fadeInUpBig']} ${this.state.isOpen ? styles.chat__fullscreen : styles.chat__hide}`}>
          <div>
            <iframe
              src='https://your.talklogics.co/user/5d26fde74fd9280004cb0b0f?c=talklogic'
              scrolling="no"
              title="Chat with bott"
            />
          </div>
          <div className={this.state.isOpen ? styles.minimize : styles.minimize__hide} onClick={this.clickButton} role='none'><i className='fa fa-angle-down' /></div>
        </div>
      </div>
    );
  }
}

export default BeforeLoginWrapper;

/* eslint-disable */
BeforeLoginWrapper.propTypes = {
  children: PropTypes.any,
};
/* eslint-enable */

BeforeLoginWrapper.defaultProps = {
  children: {},
};