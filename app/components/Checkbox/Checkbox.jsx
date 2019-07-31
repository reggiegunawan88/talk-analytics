import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import styles from './styles.scss';

class Checkbox extends PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      checked: this.props.checked || '',
    };
  }

  onChange(value) {
    this.setState({ checked: value });
    this.props.onChange(this.props.base.name, value);
  }

  render() {
    const { disable, label, base } = this.props;
    const { name, value } = base;
    return (
      <div className={styles['checkbox-custom']}>
        <input
          type="checkbox"
          disabled={disable}
          checked={this.state.checked}
          value={value}
          name={name}
          id={(name, value)}
          onChange={() => this.onChange(value)}
        />
        <span onClick={() => this.onChange(value)} />
        <label
          onClick={() => this.onChange(value)}
          htmlFor={(name, value)}
          className="light"
        >
          <span className={`m-l-10 fs-14 ${styles['label-checkbox']}`}>
            {label}
          </span>
        </label>
      </div>
    );
  }
}

export default Checkbox;

/* eslint-disabled */
Checkbox.propTypes = {
  base: PropTypes.any,
  onChange: PropTypes.func,
  label: PropTypes.array,
  disabled: PropTypes.bool,
  checked: PropTypes.any,
};
/* eslind-enable */

Checkbox.defaultProps = {
  base: {},
  onChange: () => {},
  label: '',
  disabled: false,
  checked: '',
};
