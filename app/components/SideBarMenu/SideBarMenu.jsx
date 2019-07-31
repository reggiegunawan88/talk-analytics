import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import { paths, configValues } from 'Config';
import { camelize } from 'Modules/helper/utility';

class SideBarMenu extends Component {
  constructor(props) {
    super(props);

    this.toggleSubMenu = this.toggleSubMenu.bind(this);
    this.handleProductMenu = this.handleProductMenu.bind(this);
  }

  componentDidMount() {
    const { toggleSubMenu, name, subMenu, current } = this.props;
    
    if (subMenu) {
      subMenu.map(sub => { 
        const submenuName = this.handleProductMenu(sub.submenu_name);
        if (current.includes(paths.private[submenuName])) {
          toggleSubMenu(name);
        }
      });
    }
  }

  isActive() {
    const { to, current, subMenu } = this.props;
    let classMenu = to && current.includes(to);

    if (subMenu) {
      subMenu.map(sub => { 
        const submenuName = this.handleProductMenu(sub.submenu_name);
        if (current.includes(paths.private[submenuName])) {
          classMenu = current.includes(paths.private[submenuName]);
        }
      });
    }
    
    return classMenu ? 'active' : '';
  }

  isSubmenuOpened() {
    const { subMenuOpened, name } = this.props;

    return subMenuOpened === name;
  }

  toggleSubMenu() {
    const { name, toggleSubMenu } = this.props;

    toggleSubMenu(name);
  }

  handleProductMenu(submenuName) {
    if (submenuName === 'Product') {
      return camelize('products');
    }
    return camelize(submenuName);
  }

  render() {
    const { to, title, details, name, closeSideBar, subMenu, current } = this.props;

    if (subMenu.length) {
      return (
        <li className={this.isActive()}>
          <a role="none" className="detailed" onClick={this.toggleSubMenu}>
            <span className="title">{title}</span>
            <span className={`arrow ${this.isSubmenuOpened() ? 'open' : ''} lh-30px`} />
            <span className="details">{details}</span>
          </a>
          <span className="icon-thumbnail">
            <i className={configValues.ICONMENU[name]} />
          </span>
          <ul
            className={`sub-menu ${
              this.isSubmenuOpened() ? 'display-block' : 'hide'
            }`}
          >
            {subMenu.map(sub => {
              const submenuName = this.handleProductMenu(sub.submenu_name);
              const classActive = current.includes(paths.private[submenuName]) && 'active' ;
              return (
                <li key={submenuName} className={classActive}>
                  <Link to={paths.private[submenuName]}>
                    {sub.submenu_name}
                  </Link>
                  <span className="icon-thumbnail">
                    <i className={configValues.ICONMENU[submenuName]} />
                  </span>
                </li>
              );
            })}
          </ul>
        </li>
      );
    }

    return (
      <li className={this.isActive()}>
        <Link className="detailed" to={to} onClick={closeSideBar}>
          <span className="title">{title}</span>
          <span className="details">{details}</span>
        </Link>
        <span className="icon-thumbnail">
          <i className={configValues.ICONMENU[name]} />
        </span>
      </li>
    );
  }
}

export default SideBarMenu;

/* eslint-disable */
SideBarMenu.propTypes = {
  to: PropTypes.any,
  title: PropTypes.any.isRequired,
  details: PropTypes.any,
  name: PropTypes.string.isRequired,
  activeClass: PropTypes.any,
  current: PropTypes.any.isRequired,
  closeSideBar: PropTypes.func.isRequired,
  toggleSubMenu: PropTypes.func.isRequired,
  subMenu: PropTypes.array,
  subMenuOpened: PropTypes.string
};
/* eslint-enable */

SideBarMenu.defaultProps = {
  to: '',
  details: '',
  activeClass: '',
  subMenuOpened: null,
  subMenu: [],
};
