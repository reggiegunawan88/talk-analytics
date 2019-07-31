import React from 'react';

import PropTypes from 'prop-types';

function Switch({ checked }) {
  const activeStyle = {
    backgroundColor: 'rgb(109, 92, 174)',
    borderColor: 'rgb(109, 92, 174)',
    boxShadow: 'rgb(109, 92, 174) 0px 0px 0px 11px inset',
    transition: 'border 0.4s, box-shadow 0.4s, background-color 1.2s',
  };
  const activeSliderStyle = {
    left: '13px',
    backgroundColor: 'rgb(255, 255, 255)',
    transition: 'left 0.2s',
  };

  const inactiveStyle = {
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: 'rgb(223, 223, 223)',
    boxShadow: 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
    transition: 'border 0.4s, box-shadow 0.4s',
  };
  const inactiveSliderStyle = {
    left: '0px',
    backgroundColor: 'rgb(255, 255, 255)',
    transition: 'left 0.2s',
  };
  return (
    <span
      className="switchery switchery-small"
      style={checked ? activeStyle : inactiveStyle}
    >
      <small style={checked ? activeSliderStyle : inactiveSliderStyle} />
    </span>
  );
}

export default Switch;

Switch.propTypes = {
  checked: PropTypes.bool,
};

Switch.defaultProps = {
  checked: false,
};
