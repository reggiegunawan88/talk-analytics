import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import styles from './styles.scss';

class Breadcrumb extends PureComponent {
  handleBreadcrumb() {
    const { pathname } = this.props.location;
    const parsedPath = pathname.split('/');

    return parsedPath.map(
      path =>
        path !== '' && (
          <li key={path}>
            <FormattedMessage id={`navigation.${path}`} />
          </li>
        )
    );
  }

  render() {
    return (
      <div
        className={`jumbotron ${styles.breadcrumb__container}`}
        data-pages="parallax"
      >
        <div className="container-fluid container-fixed-lg sm-p-l-20 sm-p-r-20">
          <div className="inner">
            <ul className="breadcrumb">
              <li>
                <p>LOGICS</p>
              </li>
              {this.handleBreadcrumb()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Breadcrumb);

/* eslint-disable */
Breadcrumb.propTypes = {
  location: PropTypes.any.isRequired,
};
/* eslint-enable */
