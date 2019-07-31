import React, { Component } from 'react';

import PropTypes from 'prop-types';

import styles from './styles.scss';

class Initial extends Component {
  constructor(props) {
    super(props);

    this.getInitial = this.getInitial.bind(this);
  }

  getInitial() {
    if (this.props.name === '') return '';

    const splittedName = this.props.name.toUpperCase().split(' ');
    const fInitial = splittedName[0][0];
    const sInitial = splittedName[1] ? splittedName[1][0] : '';
    const initial = `${fInitial}${sInitial}`;
    return initial;
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`${styles.initial} ${className}`}>
        {this.getInitial()}
      </div>
    );
  }
}

export default Initial;

Initial.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Initial.defaultProps = {
  className: '',
};
