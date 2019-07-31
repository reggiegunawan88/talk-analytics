import React, { Component } from 'react';

import PropTypes from 'prop-types';

import Icon from 'shared_components/Icon';
import styles from './styles.scss';

class Quickview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggleQuickview = this.toggleQuickview.bind(this);
    this.closeQuickview = this.closeQuickview.bind(this);
    this.openQuickview = this.openQuickview.bind(this);
  }

  closeQuickview() {
    this.props.onClose();
    this.setState({ isOpen: false });
  }

  openQuickview() {
    this.setState({ isOpen: true });
  }

  toggleQuickview() {
    this.state.isOpen ? this.closeQuickview() : this.openQuickview();
  }

  render() {
    const { hiddenToggle, customStyles } = this.props;
    const { builder } = customStyles;

    return (
      <div
        className={`quickview-wrapper builder hidden-sm hidden-xs 
          ${builder || ''}
          ${hiddenToggle ? styles.hideToggle : ''}
          ${this.state.isOpen ? 'open' : ''}`}
      >
        <div className="p-l-40 p-r-40 ">
          <a
            role="none"
            className="builder-close quickview-toggle pg-close"
            onClick={this.closeQuickview}
          >
            &nbsp;
          </a>
          {!hiddenToggle && (
            <a
              role="none"
              onClick={this.toggleQuickview}
              className="builder-toggle"
              data-toggle="quickview"
              data-toggle-element="#builder"
            >
              <Icon name="pg pg-theme" />
            </a>
          )}
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Quickview;

/* eslint-disable */
Quickview.propTypes = {
  children: PropTypes.any,
  onClose: PropTypes.func,
  hiddenToggle: PropTypes.bool,
  customStyles: PropTypes.any
};
/* eslint-enable */

Quickview.defaultProps = {
  children: null,
  onClose: () => {},
  hiddenToggle: false,
  customStyles: {}
};
