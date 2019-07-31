import React from 'react';

import PropTypes from 'prop-types';

function Icon({ name, className }) {
  return <i className={`${name} ${className}`} />;
}

export default Icon;

/* eslint-disable */
Icon.propTypes = {
  name: PropTypes.any,
  className: PropTypes.any,
};
/* eslint-enable */

Icon.defaultProps = {
  className: '',
};
