import React from 'react';

import PropTypes from 'prop-types';

import styles from './styles.scss';

function Button({ className, children, style, base, isLoading, onClick }) {
  const btnClassName = `btn ${className} ${style}`;

  return (
    <button
      className={btnClassName}
      disabled={isLoading}
      onClick={onClick}
      {...base}
    >
      {children}{' '}
      {isLoading && (
        <i
          className={`fa fa-circle-o-notch fa-spin ${styles['color-white']}`}
        />
      )}
    </button>
  );
}

/* eslint-disable */
Button.propTypes = {
  className: PropTypes.any,
  children: PropTypes.any,
  base: PropTypes.any,
  style: PropTypes.any,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
};
/* eslint-enable */

Button.defaultProps = {
  className: null,
  children: null,
  base: {},
  style: '',
  isLoading: false,
  onClick: () => {},
};

export default Button;
