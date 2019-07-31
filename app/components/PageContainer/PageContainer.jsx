import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { getFirstName, getLastName } from 'Modules/helper/user';
import { changeToEN, changeToID } from 'Modules/language';
import { logout } from 'Modules/auth';
import { configValues as config, paths } from 'Config';
import getPageContainer from './selector';
import Initial from '../Initial';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getPageContainer(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    { changeToEN, changeToID, logout },
    dispatch
  );
  return dispatchFunc;
};

class PageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLangOpen: false,
    };

    this.openLang = this.openLang.bind(this);
    this.closeLang = this.closeLang.bind(this);
  }

  openLang() {
    this.setState({ isLangOpen: true });
  }

  closeLang() {
    this.setState({ isLangOpen: false });
  }

  render() {
    const { children, widePage, name, activeChannel, processChannel, hideChannel } = this.props;

    return (
      <div className={`page-container ${widePage ? styles.wide : ''} ${styles.responsive__container}`}>
        <div className={`header ${styles.responsive__header}`}>
          <div className="pull-left">
            <div className={styles.logo__container}>
              <img src={config.IMG.LOGO} width="25" alt="" />
            </div>
            {activeChannel && (
            <div role="none" className={styles['logo__active-channel']} onClick={() => processChannel(!hideChannel)}>
              <img src={activeChannel.channelPicture} alt={activeChannel.name} />
              {activeChannel.name}
            </div>
            )}
            <div className={styles.channel__plan}>
              {activeChannel
                ? `${activeChannel.plan} | IDR ${activeChannel.price}`
                : '...'}
            </div>
          </div>
          <div className="pull-right">
            <div className={styles['right-header__container']}>
              <div className="visible-lg visible-md pull-left p-r-20 p-t-10 p-l-30 fs-16 font-heading">
                <span className="semi-bold text-white">
                  {getFirstName(name)}
                </span>
                <span className="text-master text-white">
                  &nbsp;{getLastName(name)}
                </span>
              </div>
              <div className="dropdown pull-left">
                <button
                  className="profile-dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={() => this.props.processChannel(true)}
                >
                  <span className="thumbnail-wrapper d32 circular inline">
                    <Initial name={name} />
                  </span>
                </button>
                <ul className="dropdown-menu profile-dropdown" role="menu">
                  <li>
                    <Link to={paths.private.profile}>
                      <i className="fa fa-user" />{' '}
                      <FormattedMessage id="navigation.profile" />
                    </Link>
                  </li>
                  <li
                    className={`visible-lg visible-md ${
                      this.state.isLangOpen ? 'open ' : ''
                    }${styles['lang-opt__outer-container']}`}
                    onMouseEnter={this.openLang}
                    onMouseLeave={this.closeLang}
                  >
                    <a>
                      <i className="fa fa-flag" />{' '}
                      <FormattedMessage id="navigation.language" />
                    </a>
                    <ul
                      className={`dropdown-menu ${
                        styles['lang-opt__container']
                      }`}
                    >
                      <li>
                        <a onClick={this.props.changeToEN} role="none">
                          <img src={config.IMG.EN} alt="lang" />
                          EN
                        </a>
                      </li>
                      <li>
                        <a onClick={this.props.changeToID} role="none">
                          <img src={config.IMG.ID} alt="lang" />
                          ID
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to={paths.private.channelManagement}>
                      <i className="fa fa-gear" />{' '}
                      <FormattedMessage id="navigation.channel-management" />
                    </Link>
                  </li>
                  <li
                    role="none"
                    className="bg-master-lighter"
                    onClick={this.props.logout}
                  >
                    <a className="clearfix">
                      <span className="pull-left">
                        <FormattedMessage id="navigation.logout" />
                      </span>
                      <span className="pull-right">
                        <i className="pg-power" />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="pull-right p-t-10 p-l-20 p-r-20 visible-md visible-lg">
                <Link to={paths.private.shoppingPage}>
                  <img src="/img/icon/header/cart_light.png" alt="" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false }
)(PageContainer);

/* eslint-disable */
PageContainer.propTypes = {
  children: PropTypes.any,
  name: PropTypes.any.isRequired,
  changeToEN: PropTypes.func.isRequired,
  changeToID: PropTypes.func.isRequired,
  widePage: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  activeChannel: PropTypes.any,
  processChannel: PropTypes.func.isRequired,
  hideChannel: PropTypes.bool.isRequired,
};
/* eslint-enable */

PageContainer.defaultProps = {
  children: {},
  activeChannel: null,
  widePage: true,
};
