import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import PropTypes from 'prop-types';

import { configValues as config } from 'Config';
import styles from './styles.scss';

class TagInput extends Component {
  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.focusInput = this.focusInput.bind(this);
  }

  onKeyDown(e) {
    const {
      addVariantValue,
      removeVariantValue,
      variantIdx,
      tags,
    } = this.props;

    if (e.keyCode === config.KEY_ACTION.COMMA && e.target.value !== '') {
      addVariantValue(variantIdx, e.target.value);
      setTimeout(() => {
        this.input.value = '';
      }, 10);
    } else if (
      e.keyCode === config.KEY_ACTION.BACKSPACE &&
      e.target.value === ''
    ) {
      removeVariantValue(variantIdx, tags.length - 1);
    }
  }

  focusInput() {
    this.input.focus();
  }

  render() {
    const {
      tags,
      className,
      removeVariantValue,
      variantIdx,
      disabled,
    } = this.props;

    return (
      <div
        role="none"
        className={`bootstrap-tagsinput padding-5 m-b-0 ${className} ${
          disabled ? styles.text_disabled : styles.text_pointer
        }`}
        onClick={this.focusInput}
      >
        {tags.map((tag, idx) => (
          <span className={`tag label label-info ${styles.tag}`} key={tag}>
            {tag}
            {!disabled && (
              <span
                role="none"
                data-role="remove"
                className={styles.cursor_pointer}
                onClick={() => removeVariantValue(variantIdx, idx)}
              />
            )}
          </span>
        ))}
        <input
          size="20"
          type="text"
          onKeyDown={this.onKeyDown}
          disabled={disabled}
          placeholder={this.props.intl.formatMessage({
            id: 'product.variant.tagPlaceholder',
          })}
          ref={input => {
            this.input = input;
          }}
        />
      </div>
    );
  }
}

export default injectIntl(TagInput);

/* eslint-disable */
TagInput.propTypes = {
  tags: PropTypes.array.isRequired,
  addVariantValue: PropTypes.func.isRequired,
  removeVariantValue: PropTypes.func.isRequired,
  variantIdx: PropTypes.number,
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.any.isRequired,
  className: PropTypes.any,
};
/* eslint-enable */

TagInput.defaultProps = {
  className: '',
  variantIdx: null,
};
