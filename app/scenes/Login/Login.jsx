import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { getProfile } from 'Modules/profile';
import BeforeLoginWrapper from 'shared_components/BeforeLoginWrapper';
import Button from 'shared_components/Button';
import { configValues as config, paths } from 'Config';
import { login, loginWithGoogle } from 'Modules/auth';
import getLoginState from './selector';
import { googleLogin } from '../../lib/googleSignIn';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getLoginState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    { login, loginWithGoogle, getProfile },
    dispatch
  );
  return dispatchFunc;
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.onChange = this.onChange.bind(this);
    this.login = this.login.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
  }

  componentDidMount() {
    if (this.props.token) {
      this.props.history.push(paths.private.chatRoom);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.token !== nextProps.token) {
      if (nextProps.token && nextProps.isValid) {
        await this.props.getProfile();
        this.props.history.push(paths.private.chatRoom);
      }
    }
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue[name] = value;
    this.setState(newValue);
  }

  googleLogin() {
    googleLogin(async (token, profile) => {
      await this.props.loginWithGoogle(token, profile);
      await this.props.getProfile();
    });
  }

  login(e) {
    e.preventDefault();
    const { email, password } = this.state;
    this.props.login({
      email,
      password,
    });
  }

  render() {
    const { isFetching } = this.props;

    return (
      <BeforeLoginWrapper>
        <div className={styles.welcome__bob}>
          <div className={styles['welcome__bob-bubble']}>
            <img src={config.IMG.WELCOME_IMAGE} alt="Welcome Bobb" />
            <p><FormattedMessage id="login.welcomeText" /></p>
            <div className={styles['welcome__bob-talkabot']}>
              <img src={config.IMG.LOGO_SMALL} alt="Talkabot small" className={styles.talkabot__text} />
            </div>
          </div>
          <img src={config.IMG.BOB_IMAGE} alt="Bobb HI" />
        </div>
        <p className={`p-t-30 ${styles.login__text}`}>
          <FormattedMessage id="login.title" />
        </p>

        <Button
          className="btn btn-primary btn-ghost btn-block m-t-5"
          onClick={this.googleLogin}
          isLoading={isFetching}
        >
          <img
            className={styles['c-google-login--icon']}
            width="16"
            src={config.IMG.GOOGLE_LOGO}
            alt="lang"
          />
          <FormattedMessage id="login.signInWGoogle" />
        </Button>

        <div className={styles['login__chat-info']}>
          <i className="fa fa-angle-double-left" />
          <p><FormattedHTMLMessage id="login.chatInfo"/></p>
        </div>
      </BeforeLoginWrapper>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

/* eslint-disable */
Login.propTypes = {
  login: PropTypes.func.isRequired,
  loginWithGoogle: PropTypes.func.isRequired,
  getProfile: PropTypes.func.isRequired,
  token: PropTypes.any,
  history: PropTypes.any.isRequired,
  isValid: PropTypes.bool,
  isFetching: PropTypes.bool,
};
/* eslint-enable */

Login.defaultProps = {
  token: null,
  isError: false,
  isFetching: false,
};
