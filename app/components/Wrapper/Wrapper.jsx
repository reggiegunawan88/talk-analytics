import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import id from 'react-intl/locale-data/id';

import PropTypes from 'prop-types';

import { paths } from 'Config';
import { logout, loginWithGoogle } from 'Modules/auth';
import { getProfile } from 'Modules/profile';
import { isPrivatePath, flattenMessages } from 'Modules/helper/utility';
import googleSignIn from '../../lib/googleSignIn';
import language from '../../language';
import SideBar from '../SideBar';
import styles from './styles.scss';
import getWrapperState from './selector';
import PageContainer from '../PageContainer';
import Notification from '../Notification';
import PageLoader from '../PageLoader';

addLocaleData([...en, ...id]);

const pathNoChannel = [ 'registerChannel', 'profile' ];

const mapStateToProps = state => {
  const stateProps = getWrapperState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    { logout, getProfile, loginWithGoogle },
    dispatch
  );
  return dispatchFunc;
};

class Wrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      hideChannel: true,
    };

    this.processChannel = this.processChannel.bind(this);
  }

  componentDidMount() {
    const { token, location, email } = this.props;

    googleSignIn(
      async (idToken, profile) => {
        try {
          if (isPrivatePath(location.pathname)) {
            if (!token) {
              this.props.history.push(paths.public.login);
            } else if (token && email === profile.email) {
              if (idToken && token !== idToken) {
                await this.props.loginWithGoogle(idToken, profile);
              }

              await this.props.getProfile();
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.setState({ isReady: true });
        }
      },
      () => {
        this.props.history.push(paths.public.login);
        this.setState({ isReady: true });
      }
    );
  }

  componentWillReceiveProps(props){
    if(!props.token && props.location.pathname !== paths.public.login){
      this.props.history.push(paths.public.login);
    }
  }

  async componentWillUpdate({ pages, location, history, token, activeChannel, channels, isValid, googleUser, name }) {
    if (isValid && token) {
      if (!name || (location.pathname !== paths.private.registerChannel && this.props.location.pathname === paths.private.registerChannel) ) {
        if (location.pathname !== paths.private.registerChannel && this.props.location.pathname === paths.private.registerChannel) {
          this.setState({ isReady: false });
        }
        await this.props.getProfile();
      };
      
      let pathname = location.pathname.slice(1);

      if (location.pathname.includes(`${paths.private.product}/`)){
        pathname = paths.private.product.slice(1);
      }

      if (
        activeChannel && channels && 
        ((pages.length > 0 && !pages.includes(pathname) && location.pathname !== paths.private.registerChannel ) ||
        (this.props.activeChannel && activeChannel.id !== this.props.activeChannel.id) || 
        (this.props.channels && channels.length !== this.props.channels.length) )
      ) {
        this.props.history.push(paths.private.chatRoom);
      } else if ( name && !pathNoChannel.includes(location.pathname.slice(1)) && channels && channels.length < 1 && !googleUser) {
        this.props.history.push(paths.private.profile);
      } else if ( googleUser && location.pathname !== paths.private.registerChannel ){
        this.props.history.push(paths.private.registerChannel);
      }
    }

    if (location.pathname === this.props.location.pathname) return;

    const { gtag } = window;
    
    if (history.action === 'PUSH' && typeof gtag === 'function') {
      gtag('config', 'GA_TRACKING_ID', {
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profileChannel && this.props.profileChannel && this.props.profileChannel !== prevProps.profileChannel) {
      this.setState({ isReady: true });
    }
    if (prevProps.token && !this.props.token) {
      this.props.history.push(paths.public.login);
    }
  }

  processChannel(channelStatus) {
    this.setState({ hideChannel: channelStatus });
  }

  handleView() {
    const {
      location,
      children,
      token,
      name,
      notification,
      lang,
      wideNotif,
    } = this.props;
    const { pathname } = location;

    if (this.state.isReady) {
      if ((!token && location.pathname === paths.public.login) || (token && location.pathname === paths.private.registerChannel)) {
        return (
          <div className={styles['height-100']}>
            {notification.isVisible && <Notification currLang={lang.locale} />}
            {children}
          </div>
        );
      }

      return (
        <div className={`${styles['height-100']} home`}>
          <SideBar current={pathname} currLang={lang.locale} processChannel={this.processChannel} hideChannel={this.state.hideChannel} historyPush={this.props.history.push} />
          <PageContainer
            logout={this.logout}
            name={name}
            currLang={lang.locale}
            processChannel={this.processChannel}
            hideChannel={this.state.hideChannel}
          >
            {( this.props.activeChannel || pathNoChannel.includes(location.pathname.slice(1))) && children}
          </PageContainer>
          {notification.isVisible && (
            <Notification currLang={lang.locale} wideNotif={wideNotif} />
          )}
        </div>
      );
    }

    return <PageLoader className="m-t-100" />;
  }

  render() {
    const { locale } = this.props.lang;

    return (
      <IntlProvider
        locale={locale}
        defaultLocale="en-US"
        messages={flattenMessages(language[locale])}
      >
        {this.handleView()}
      </IntlProvider>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Wrapper)
);

/* eslint-disable */
Wrapper.propTypes = {
  location: PropTypes.any.isRequired,
  token: PropTypes.any,
  children: PropTypes.any,
  history: PropTypes.any.isRequired,
  name: PropTypes.any,
  channels: PropTypes.any,
  notification: PropTypes.any.isRequired,
  lang: PropTypes.any.isRequired,
  getProfile: PropTypes.func.isRequired,
  wideNotif: PropTypes.bool.isRequired,
  activeChannel: PropTypes.any,
  loginWithGoogle: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  pages: PropTypes.any.isRequired,
  isValid: PropTypes.bool,
  googleUser: PropTypes.any,
  email: PropTypes.string,
  profileChannel: PropTypes.array,
};
/* eslint-enable */

Wrapper.defaultProps = {
  children: {},
  token: null,
  name: '',
  activeChannel: null,
  googleUser: null,
  email: '',
  profileChannel: [],
};
