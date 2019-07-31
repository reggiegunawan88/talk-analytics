import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import styles from './styles.scss';

class Panel extends PureComponent {
  render() {
    const { noHeader, className: custClass, title, children } = this.props;
    const className = `panel ${custClass} ${styles.header}`;
    return (
      <div className={className}>
        {!noHeader && (
          <div className="panel-heading">
            <div className="panel-title">{title}</div>
            <div className="clearfix" />
          </div>
        )}
        <div className="panel-body">{children}</div>
      </div>
    );
  }
}

export default Panel;

/* eslint-disable */
Panel.propTypes = {
  title: PropTypes.any,
  children: PropTypes.any,
  className: PropTypes.any,
  noHeader: PropTypes.bool
};
/* eslint-enable */

Panel.defaultProps = {
  children: {},
  className: '',
  noHeader: false
};
