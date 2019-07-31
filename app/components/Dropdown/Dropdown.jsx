import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import styles from './styles.scss';

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requiredShow: false,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { name } = this.props.base;
    this.props.onChange(name, e);
    let requiredShow = false;
    if (!e.value) {
      requiredShow = true;
    }
    this.setState({ requiredShow });
  }

  render() {
    const { base, selectClass = '', label, options, className = '', requiredShow, textRequired } = this.props;
    const { required } = base;
    const requiredStyles = required && (this.state.requiredShow || requiredShow) && 'select--required';
    return (
      <div className={`controls ${className} ${styles[selectClass]} ${requiredStyles}`}>
        {label && <label htmlFor={base.name}>{label}</label>}
        <Select
          onChange={this.onChange}
          options={options}
          disabled={base.isLoading}
          {...base}
        />
        {required && (this.state.requiredShow || requiredShow) && (<div className={`text-danger ${styles['input--required']}`}>{textRequired || (<FormattedMessage id="notif.input.required"/>)}</div>)}
      </div>
    );
  }
}

export default Dropdown;

/* eslint-disable */
Dropdown.propTypes = {
  base: PropTypes.any,
  selectClass: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.any,
  options: PropTypes.array,
  requiredShow: PropTypes.bool,
  className: PropTypes.string,
  textRequired: PropTypes.string
};
/* eslint-enable */

Dropdown.defaultProps = {
  base: {},
  selectClass: '',
  label: null,
  options: [],
  requiredShow: false,
  className: '',
  textRequired: '',
};
