import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import inputStyles from './styles.scss';

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requiredShow: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onBlur() {
    this.props.onBlur();
    let requiredShow = false;
    if (!this.props.base.value) {
      requiredShow = true;
    }
    this.setState({ requiredShow });
  }

  onChange(e) {
    const { name } = this.props.base;
    const { value } = e.target;
    this.props.onChange({
      value,
      name,
    });
  }

  onKeyDown(e) {
    const { name } = this.props.base;
    const { value } = e.target;
    this.props.onKeyDown({
      value,
      name,
      ...e
    });
  }

  handleDisplay() {
    const { required, base, textarea, intl, placeholderId, requiredShow } = this.props;
    const custInputClass = `form-control ${
      textarea ? inputStyles.textarea : ''
    } ${base.styles || ''} ${required && (this.state.requiredShow || requiredShow) && inputStyles['border--required']}`;

    if (textarea) {
      return (
        <textarea
          {...base}
          required={required}
          className={custInputClass}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
      );
    }

    return (
      <input
        {...base}
        placeholder={placeholderId && intl.formatMessage({ id: placeholderId })}
        required={required}
        className={custInputClass}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    );
  }

  render() {
    const { styles, label, required, base, withLabel, requiredShow, textRequired, inputGroup } = this.props;
    const custContainerClass = `form-group ${styles || ''}
      ${required ? 'required' : ''}
      ${base.disabled ? 'disabled' : ''}`;

    return (
      <div className={custContainerClass}>
        {withLabel && <label htmlFor={base.name}>{label}</label>}
        <div className={`controls ${inputGroup && inputStyles['input-group']}`}>
          {inputGroup && (<label htmlFor={`group-${base.name}`}>{inputGroup}</label>)}
          {this.handleDisplay()}
        </div>
        {required && (this.state.requiredShow || requiredShow) && (<div className={`text-danger ${inputStyles['input--required']}`}>{textRequired || (<FormattedMessage id="notif.input.required"/>)}</div>)}
      </div>
    );
  }
}

export default injectIntl(Input);

/* eslint-disable */
Input.propTypes = {
  base: PropTypes.any,
  styles: PropTypes.any,
  label: PropTypes.any,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  required: PropTypes.bool,
  textarea: PropTypes.bool,
  intl: PropTypes.any.isRequired,
  placeholderId: PropTypes.any,
  disabled: PropTypes.bool,
  inputTag: PropTypes.bool,
  inputTagProps: PropTypes.any,
  withLabel: PropTypes.bool,
  requiredShow: PropTypes.bool,
  textRequired: PropTypes.any,
  inputGroup: PropTypes.any,
};
/* eslint-enable */

Input.defaultProps = {
  base: {},
  style: '',
  label: '',
  placeholderId: null,
  onKeyDown: () => {},
  onChange: () => {},
  onBlur: () => {},
  required: false,
  textarea: false,
  disabled: false,
  inputTag: false,
  inputTagProps: {},
  inputGroup: '',
  withLabel: true,
  requiredShow: false,
  textRequired: '',
};
