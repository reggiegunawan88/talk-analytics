import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import Breadcrumb from '../Breadcrumb';
import Footer from '../Footer';

class Page extends PureComponent {
  render() {
    const { fullHeight, isFluid, isChatPage, showBreadcrumb } = this.props;
    return (
      <div
        className={`page-content-wrapper ${fullHeight ? 'full-height' : ''}`}
      >
        <div
          className={`content ${
            fullHeight ? 'full-height' : ''
          } container-fixed-lg`}
        >
          <div
            className={`${isFluid ? 'container-fluid' : ''} ${
              isChatPage ? 'full-height' : ''
            }`}
          >
            {this.props.children}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Page;

/* eslint-disable */
Page.propTypes = {
  children: PropTypes.any,
  fullHeight: PropTypes.bool,
  isFluid: PropTypes.bool,
  showBreadcrumb: PropTypes.bool,
  isChatPage: PropTypes.bool,
};
/* eslint-enable */

Page.defaultProps = {
  children: {},
  fullHeight: false,
  isFluid: true,
  showBreadcrumb: true,
  isChatPage: false,
};
