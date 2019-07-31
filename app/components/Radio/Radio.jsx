import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import styles from './styles.scss';

class Radio extends PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      checked: this.props.value || ''
    };
  }

  onChange(value) {
    this.setState({ checked: value });
    this.props.onChange(this.props.base.name, value);
  }

  render() {
    const { data, base, label } = this.props;
    return (
      <div className={styles['radio-styles']}>
        {label && <label htmlFor={base.name}>{label}</label>}
        {data.map((list, index) => {
          return (
            <div
              className={`${styles['radio-custom']} ${base.style}`}
              key={list.value}
            >
              <input
                type="radio"
                disabled={base.disabled}
                checked={this.state.checked === list.value}
                value={list.value}
                name={base.name}
                id={(base.name, index + 1)}
                onChange={() => this.onChange(list.value)}
              />
              <span onClick={() => this.onChange(list.value)} />
              <label
                onClick={() => this.onChange(list.value)}
                htmlFor={(base.name, index + 1)}
                className="light"
              >
                <span className={`m-l-10 fs-14 ${styles['label-radio']}`}>
                  {list.img !== undefined && (
                    <img src={list.img} width="20" className="m-r-10  " />
                  )}
                  {list.label}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Radio;

/* eslint-disabled */
Radio.propTypes = {
  base: PropTypes.any,
  onChange: PropTypes.func,
  data: PropTypes.array,
  value: PropTypes.any
};
/* eslind-enable */

Radio.defaultProps = {
  base: {},
  onChange: () => {},
  data: [],
  value: ''
};
