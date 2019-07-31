import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Switch from 'react-switch';

import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import {
  getProvinces,
  getCities,
  getSubDistricts,
} from 'Modules/location';
import { configValues } from 'Config';
import Input from 'shared_components/Input';
import Button from 'shared_components/Button';
import Dropdown from 'shared_components/Dropdown';
import Tooltip from 'shared_components/Tooltip';
import { formattedMessageHelper, inputOnlyNumber } from 'Modules/helper/utility';
import { googleLogin } from '../../../../lib/googleSignIn';
import styles from './styles.scss';

class ChannelForm extends Component {
  constructor(props) {
    super(props);

    const { channelData: { email, phone, location, usedEmail }, userEmail } = this.props;
    this.state = {
      submitClick: false,
      alertValidatePhone: '',
      companyEmail: email || userEmail,
      companyPhone: phone ? phone.replace('+62','') : '',
      companyAddress: location ? location.address : '',
      companyProvinceId: location ? location.province.id : '',
      companyProvince: location ? location.province.name : '',
      companyCityId: location ? location.city.id : '',
      companyCity: location ? location.city.name : '',
      companySubdistrictId: location ? location.subdistrict.id : '',
      companySubdistrict: location ? location.subdistrict.name : '',
      companyZipcode: location ? location.zipcode : '',
      companyUsedEmail: usedEmail || true,
      infoProvince: false,
      infoCity: false,
      infoSubdistrict: false,
    };

    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.toggleEmail = this.toggleEmail.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
    this.renderInputEmail = this.renderInputEmail.bind(this);
    this.validationForm = this.validationForm.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
    this.onInfoClick = this.onInfoClick.bind(this);
  }

  componentDidMount() {
    this.props.getProvinces();
    const { companyProvinceId, companyCityId } = this.state;
    if (companyProvinceId) {
      this.props.getCities(companyProvinceId);
    }
    if (companyCityId) {
      this.props.getSubDistricts(companyCityId);
    }
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    if (name === "companyPhone" || name === "companyZipcode") {
      newValue[name] = inputOnlyNumber(e,newValue[name]);
    } else {
      newValue[name] = value;
    }
    this.setState(newValue);
  }

  onDropdownChange(name, { value, label } ) {
    const newValue = cloneDeep(this.state);
    newValue[`${name}Id`] = value;
    newValue[name] = label;

    if (name === "companyProvince") {
      this.props.getCities(value);
      newValue.companyCityId = "";
      newValue.companyCity = "";
    } else if (name === "companyCity") {
      this.props.getSubDistricts(value);
    }
    if (name !== "companySubdistrict") {
      newValue.companySubdistrictId = "";
      newValue.companySubdistrict = "";
    }
    
    this.setState(newValue);
  }

  onInfoClick(info) {
    const newValue = this.state;
    newValue[info] = !newValue[info];
    this.setState(newValue);
  }

  submit(e, type = 'next') {
    e.preventDefault();

    this.validatePhone(() => { this.sendSubmit(type) });
  }

  sendSubmit(type) {
    if (this.state.alertValidatePhone && type === "next") {
      return;
    }

    const {
      companyEmail,
      companyPhone,
      companyAddress,
      companyProvinceId,
      companyProvince,
      companyCityId,
      companyCity,
      companySubdistrictId,
      companySubdistrict,
      companyZipcode,
      companyUsedEmail,
    } = this.state;
    this.props.submit(
      {
        email: companyEmail,
        usedEmail: companyUsedEmail,
        phone: `+62${companyPhone}`,
        location: {
          address: companyAddress,
          subdistrict: { id: companySubdistrictId, name: companySubdistrict },
          city: { id: companyCityId, name: companyCity },
          province: { id: companyProvinceId, name: companyProvince },
          zipcode: companyZipcode,
        },
      },
      type
    );
  }

  validationForm() {
    this.setState({ submitClick: true });
  }

  validatePhone(callback = () => {}) {
    const validateZero = /^([0-9]{8,15})$/i;
    let textValidate = '';
    if (this.state.companyPhone && !validateZero.test(this.state.companyPhone)) {
      textValidate = 'notif.input.phoneInput'
    }
    this.setState({ alertValidatePhone: textValidate }, callback);
  }
  
  googleLogin() {
    const { userEmail } = this.props;
    const newValue = this.state;
    googleLogin(async (token, profile) => {
      newValue.companyEmail = profile.email;
      if (userEmail === profile.email) {
        newValue.companyUsedEmail = true;
      }
      this.setState(newValue);
    });
  }

  toggleEmail() {
    const newValue = this.state;
    newValue.companyUsedEmail = !newValue.companyUsedEmail;
    if (!newValue.companyUsedEmail) {
      newValue.companyeEmail = this.props.userEmail;
    }
    this.setState(newValue);
  }

  renderInputEmail() {
    if (this.state.companyUsedEmail || this.state.companyEmail !== this.props.userEmail) {
      return (
        <div className={styles['form__group-email']}>
          <Input
            onChange={this.onChange}
            styles={`form-group ${styles['form__group-register']}`}
            base={{
              type: 'email',
              name: 'companyEmail',
              disabled: true,
              value: this.state.companyEmail,
            }}
            withLabel={false}
            required
          />
          {this.state.companyEmail !== this.props.userEmail && (<div className={styles['button__change-email']} onClick={this.googleLogin} role="none"><FormattedMessage id="registerChannel.companyData.changeEmail" /></div>)}
        </div>
      );
    }
    
    return (
      <Button
        type="button"
        className={`btn btn-block ${styles['c-google-login--button']}`}
        onClick={this.googleLogin}
        isLoading={this.props.isFetching}
        base={{
          type: "button"
        }}
      >
        <img
          width="16"
          src={configValues.IMG.GOOGLE_LOGO}
          alt="lang"
        />
        <FormattedMessage id="login.signInWGoogle" />
      </Button>
    );
  }

  render() {
    const { isFetching, provinces, cities, subDistricts } = this.props;
    return (
      <div className={styles['register__outer-container']}>
        <div className={styles['register__inner-container']}>
          <div className={styles.register__chatbot}>
            <form onSubmit={this.submit}>
              <div className="col-md-12">
                <div className={`form-group required ${styles['form__group-register']}`}>
                  <label htmlFor="toggleBot" className='m-t-5'>
                    <FormattedMessage id="registerChannel.companyData.usedEmail" />
                  </label>
                  <Switch
                    onChange={this.toggleEmail}
                    checked={this.state.companyUsedEmail}
                    className={styles['form__group-switch']}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className={`form-group required ${styles['form__group-register']}`}>
                  <label htmlFor="toggleBot" className='m-t-5'>
                    <FormattedMessage id="registerChannel.companyData.email" />
                  </label>
                  {this.renderInputEmail()}
                </div>
              </div>
              <div className="col-md-12">
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper(
                    'registerChannel.companyData.phone'
                  )}
                  styles={`form-group ${styles['form__group-register']}`}
                  requiredShow={(this.state.submitClick && !this.state.companyPhone) || Boolean(this.state.alertValidatePhone)}
                  textRequired={this.state.alertValidatePhone && formattedMessageHelper(this.state.alertValidatePhone)}
                  base={{
                    name: 'companyPhone',
                    disabled: isFetching,
                    value: this.state.companyPhone,
                  }}
                  required
                  onBlur={this.validatePhone}
                  inputGroup={formattedMessageHelper('registerChannel.placeholder.phone')}
                />
              </div>
              <div className="col-md-12">
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper(
                    'registerChannel.companyData.address'
                  )}
                  placeholderId='registerChannel.placeholder.address'
                  styles={`form-group ${styles['form__group-register']}`}
                  requiredShow={this.state.submitClick && !this.state.companyAddress}
                  textarea
                  base={{
                    name: 'companyAddress',
                    disabled: isFetching,
                    value: this.state.companyAddress,
                  }}
                  required
                />
              </div>
              <div className="col-md-12">
                <div
                  className={`form-group ${styles['form__group-register']} ${styles.label__info}`}
                >
                  <label htmlFor="flow">
                    <FormattedMessage id="registerChannel.companyData.province" />
                  </label>
                  <div className="m-b-5">
                    <Dropdown
                      onChange={this.onDropdownChange}
                      options={provinces}
                      className='m-b-5 select__register'
                      requiredShow={this.state.submitClick && !this.state.companyProvinceId}
                      base={{
                        name: 'companyProvince',
                        required: true,
                        value: this.state.companyProvinceId,
                        isLoading: isFetching,
                        placeholder: formattedMessageHelper('registerChannel.placeholder.select')
                      }}
                    />
                  </div>
                  <Tooltip 
                    position="right" 
                    text="registerChannel.info.province"
                    className={`${styles['label__info-icon']} ${this.state.infoProvince && styles['label__info-show']}`}
                    onClick={() => this.onInfoClick('infoProvince')}
                  >
                    <span className='fa fa-info' />
                  </Tooltip>
                </div>
              </div>
              <div className="col-md-12">
                <div
                  className={`form-group ${styles['form__group-register']} ${styles.label__info}`}
                >
                  <label htmlFor="flow" className={styles.mb5}>
                    <FormattedMessage id="registerChannel.companyData.city" />
                  </label>
                  <Dropdown
                    onChange={this.onDropdownChange}
                    options={cities}
                    className='m-b-5 select__register'
                    requiredShow={this.state.submitClick && !this.state.companyCityId}
                    base={{
                      name: 'companyCity',
                      required: true,
                      value: this.state.companyCityId,
                      disabled: !this.state.companyProvinceId ? true : isFetching,
                      placeholder: formattedMessageHelper('registerChannel.placeholder.select')
                    }}
                  />
                  <Tooltip 
                    position="right" 
                    text="registerChannel.info.city"
                    className={`${styles['label__info-icon']} ${this.state.infoCity && styles['label__info-show']}`}
                    onClick={() => this.onInfoClick('infoCity')}
                  >
                    <span className='fa fa-info' />
                  </Tooltip>
                </div>
              </div>
              <div className="col-md-12">
                <div
                  className={`form-group ${styles['form__group-register']} ${styles.label__info}`}
                >
                  <label htmlFor="flow" className={styles.mb5}>
                    <FormattedMessage id="registerChannel.companyData.subdistrict" />
                  </label>
                  <Dropdown
                    onChange={this.onDropdownChange}
                    options={subDistricts}
                    className='m-b-5 select__register'
                    requiredShow={this.state.submitClick && !this.state.companySubdistrictId}
                    base={{
                      name: 'companySubdistrict',
                      required: true,
                      value: this.state.companySubdistrictId,
                      disabled: !this.state.companyCityId ? true : isFetching,
                      placeholder: formattedMessageHelper('registerChannel.placeholder.select')
                    }}
                  />
                  <Tooltip 
                    position="right" 
                    text="registerChannel.info.subdistrict"
                    className={`${styles['label__info-icon']} ${this.state.infoSubdistrict && styles['label__info-show']}`}
                    onClick={() => this.onInfoClick('infoSubdistrict')}
                  >
                    <span className='fa fa-info' />
                  </Tooltip>
                </div>
              </div>
              <div className="col-md-12">
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper(
                    'registerChannel.companyData.zipcode'
                  )}
                  styles={`form-group ${styles['form__group-register']}`}
                  placeholderId='registerChannel.placeholder.zipcode'
                  base={{
                    name: 'companyZipcode',
                    disabled: isFetching,
                    value: this.state.companyZipcode,
                    maxLength: 5,
                  }}
                  requiredShow={this.state.submitClick && !this.state.companyZipcode}
                  required
                />
              </div>
              <div className="col-sm-6">
                <Button
                  className="btn btn-block btn-primary m-b-10"
                  isLoading={isFetching}
                  onClick={e => this.submit(e, 'prev')}
                >
                  <i className="fa fa-angle-double-left m-r-10" />
                  <FormattedMessage id="registerChannel.prev" />
                </Button>
              </div>
              <div className="col-sm-6">
                <Button
                  className="btn btn-block btn-primary"
                  isLoading={isFetching}
                  onClick={this.validationForm}
                >
                  <FormattedMessage id="registerChannel.next" />
                  <i className="fa fa-angle-double-right m-l-10" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { getProvinces, getCities, getSubDistricts }
)(ChannelForm);

/* eslint-disable */
ChannelForm.propTypes = {
  submit: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  channelData: PropTypes.any,
  getProvinces: PropTypes.func.isRequired,
  getCities: PropTypes.func.isRequired,
  getSubDistricts: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  provinces: PropTypes.array,
  cities: PropTypes.array,
  subDistricts: PropTypes.array
};
/* eslint-enable */

ChannelForm.defaultProps = {
  isFetching: false,
  provinces: [],
  cities: [],
  subDistricts: []
};
