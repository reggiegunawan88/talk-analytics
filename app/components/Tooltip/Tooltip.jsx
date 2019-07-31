import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import styles from './styles.scss';

class Tooltip extends PureComponent {

  render() {
    const { position, display, className, text, children, onClick } = this.props;

    let tooltipPosition = `tooltip__position-top`;

    if (position) {
      tooltipPosition = `tooltip__position-${position}`;
    }

    return (
      <div role="none" className={`${styles.tooltip} ${styles[tooltipPosition]} ${className}`} onClick={onClick}>
        {display && (<i><FormattedMessage id={text} /></i>)}
        {children}
      </div>
    );  
  }
}

export default Tooltip;

/* eslint-disable */
Tooltip.propTypes = {
  position: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  display: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func
};
/* eslint-enable */

Tooltip.defaultProps = {
  position: "top",
  className: "",
  display: true,
  children: {},
  onClick: () => {},
};
