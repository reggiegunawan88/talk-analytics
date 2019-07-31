import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { paths } from 'Config';
import { formattedMessageHelper, camelize } from 'Modules/helper/utility';
import { getChannelList, setActiveChannel } from 'Modules/channel';
import { initializeSocket, socketSubscribe } from 'Modules/websocket';
import SideBarMenu from '../SideBarMenu';
import getSideBarState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getSideBarState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    { getChannelList, setActiveChannel, initializeSocket, socketSubscribe },
    dispatch
  );
  return dispatchFunc;
};

class SideBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sidebarOpened: false,
      subMenuOpened: null,
    };

    this.openSideBar = this.openSideBar.bind(this);
    this.closeSideBar = this.closeSideBar.bind(this);
    this.toggleSubMenu = this.toggleSubMenu.bind(this);
  }

  componentDidMount() {
    if (this.props.profile.id) {
      this.props.getChannelList();
    }
  }

  componentDidUpdate(prevProps){
    if (prevProps.profile.id !== this.props.profile.id) {
      this.props.getChannelList();
    }
  }

  selectChannel(channel) {
    const { userChannel : { activeChannel } } = this.props;
    if (channel.id !== activeChannel.id) {
      this.props.setActiveChannel(channel);
    }
    this.props.historyPush(paths.private.chatRoom);
    this.props.processChannel(true);
  }

  sideBarHandler() {
    const { sidebarOpened } = this.state;

    return sidebarOpened
      ? { transform: 'translate3d(210px, 0, 0)' }
      : { transform: 'translate3d(0, 0, 0)' };
  }

  toggleSubMenu(subMenu) {
    if (subMenu === this.state.subMenuOpened) {
      this.setState({ subMenuOpened: null });
    } else {
      this.setState({ subMenuOpened: subMenu });
    }
  }

  handleSideBarMenuView() {
    const {
      current,
      userMenu,
      userChannel: { activeChannel },
    } = this.props;
    const { menus } = userMenu;

    if (!userMenu.isFetching) {
      return menus.map(menu => {
        const camelCasedName = camelize(menu.menu_name);
        return (
          <SideBarMenu
            channelName={activeChannel.name}
            key={camelCasedName}
            to={paths.private[camelCasedName]}
            title={formattedMessageHelper(`navigation.${camelCasedName}`)}
            name={camelCasedName}
            current={current}
            closeSideBar={this.closeSideBar}
            subMenu={menu.submenu || []}
            subMenuOpened={this.state.subMenuOpened}
            toggleSubMenu={this.toggleSubMenu}
          />
        );
      });
    }
    return (
      <div className="text-center p-t-20">
        <i className="fa fa-circle-o-notch fa-spin text-white" />
      </div>
    );
  }

  handleChannelView() {
    const { activeChannel, channels } = this.props.userChannel;

    if (!this.props.userChannel.isFetching) {
      return (
        <ul className="menu-items p-t-30">
          {channels.map(channel => (
            <li
              role="none"
              key={channel.id}
              className={
                channel.id === activeChannel.id || ''
                  ? styles['channel__thumbnail--active']
                  : ''
              }
              onClick={() => this.selectChannel(channel)}
            >
              <a>
                <div className={styles.channel__thumbnail}>
                  <img
                    title={channel.name}
                    src={channel.channelPicture}
                    alt=""
                    width="32"
                    height="32"
                  />
                </div>
                <span className={styles['channel__info-name']}>
                  {channel.name}
                </span>
              </a>
            </li>
          ))}
          <li>
            <Link to={paths.private.registerChannel}>
              <div className={styles.channel__add}>
                <i className="fa fa-plus" />
              </div>
              <span className={styles['channel__info-name']}>
                <FormattedMessage id="navigation.addChannel" />
              </span>
            </Link>
          </li>
        </ul>
      );
    }

    return (
      <div className="text-center p-t-20">
        <i className="fa fa-circle-o-notch fa-spin text-white" />
      </div>
    );
  }

  openSideBar() {
    this.setState({ sidebarOpened: true });
  }

  closeSideBar() {
    this.setState({ sidebarOpened: false });
  }

  render() {
    const {
      userMenu: { menus },
      userChannel: { activeChannel, channels },
      hideChannel
    } = this.props;

    return (
      <div>
        <div className={`${styles.channel} ${hideChannel ? styles['channel--hide'] : styles['channel--show']}`}>
          <div className={styles.channel__menu}>
            <div className={styles.channel__plan}>
              {activeChannel ? `${activeChannel.plan} | IDR ${activeChannel.price}` : '...'}
            </div>
            {this.handleChannelView()}
          </div>
        </div>
        {channels.length > 0 && menus.length > 0 && (
          <div
            className={`page-sidebar ${styles.menu}`}
            data-pages="sidebar"
            style={this.sideBarHandler()}
            onMouseEnter={this.openSideBar}
            onMouseLeave={this.closeSideBar}
            role="none"
          >
            <div role="none" onClick={this.state.sidebarOpened ? this.closeSideBar : this.openSideBar} className={`${styles.toggle__menu} ${this.state.sidebarOpened && styles["toggle__menu-open"]}`}>
              <i className={`fa fa-angle-double-${this.state.sidebarOpened ? 'left' : 'right'}`} />
            </div>
            <div id="appMenu" className="sidebar-overlay-slide from-top" />
            <div className={`sidebar-menu ${styles['sidebar--custom']}`}>
              <h3 className={styles['channel__menu-title']}>
                <a role="none" className={`detailed ${styles['channel__menu-title']}`}>
                  <span className="title">{activeChannel.name}</span>
                </a>
              </h3>
              <div>
                <ul className="menu-items">
                  {this.handleSideBarMenuView()}
                </ul>
                <div className="clearfix" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);

/* eslint-disable */
SideBar.propTypes = {
  current: PropTypes.any,
  getChannelList: PropTypes.func.isRequired,
  setActiveChannel: PropTypes.func.isRequired,
  userChannel: PropTypes.any.isRequired,
  userMenu: PropTypes.any.isRequired,
  profile: PropTypes.any.isRequired,
  hideChannel: PropTypes.bool.isRequired,
  processChannel: PropTypes.func.isRequired,
  historyPush: PropTypes.func.isRequired,
};
/* eslint-enable */

SideBar.defaultProps = {
  current: '',
};
