import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Switch from 'react-switch';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import { formattedMessageHelper } from 'Modules/helper/utility';
import Input from 'shared_components/Input';
import Dropdown from 'shared_components/Dropdown';
import Tooltip from 'shared_components/Tooltip';
import styles from './styles.scss';

class Shipping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      pagination: {
        page: 1,
        size: 10,
      },
      provincesOpt: [],
      citiesOpt: [],
      subdistrictsOpt: [],
    }

    this.onChange = this.onChange.bind(this);
    this.onDuplicate = this.onDuplicate.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.setCity = this.setCity.bind(this);
    this.setSubdistrict = this.setSubdistrict.bind(this);
  }

  componentDidMount() {
    if (this.props.location.provinces) {
      this.setCity();
      this.setSubdistrict();
      this.setShipping();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.detail.shipping.provinceId !== this.props.detail.shipping.provinceId) {
      this.setCity();
    }
    if (prevProps.detail.shipping.cityId !== this.props.detail.shipping.cityId) {
      this.setSubdistrict();
    }
    if (prevProps.detail.shipping.subdistrictId !== this.props.detail.shipping.subdistrictId) {
      this.setShipping();
    }
  }

  onChange(e, callback = () => {}) {
    const { name, value } = e;
    const newValue = cloneDeep(this.props.detail);
    newValue.shipping[name] = value;

    if (name === "provinceId" || name === "cityId" || name === "subdistrictId") {
      if (name === "provinceId") {
        newValue.shipping.cityId = '';
        newValue.shipping.city = '';
      }

      if (name === "cityId" || name === "provinceId") {
        newValue.shipping.subdistrictId = '';
        newValue.shipping.subdistrict = '';
      }

      newValue.shipping.shippingAgentId = '';
      newValue.shipping.shippingAgent = '';
    }

    this.props.onChange('shipping', newValue.shipping, () => { 
      callback()
    });
  }

  onDropdownChange(dropdownName, e) {
    this.onChange({ name: `${dropdownName}Id`, value: e.value }, () => {
      this.onChange({ name: dropdownName, value: e.label });
    });
  }

  onDuplicate() {
    const shipping = !this.props.detail.isBilling ? this.props.detail.billing : {};
    this.props.onChange('isBilling', !this.props.detail.isBilling, () => {
      this.props.onChange('shipping', shipping);
    });
  }
  
  setCity() {
    if (this.props.detail.shipping.provinceId) {
      this.props.fetchCities(this.props.detail.shipping.provinceId);
    }
  }

  setSubdistrict() {
    if (this.props.detail.shipping.cityId) {
      this.props.fetchSubdistricts(this.props.detail.shipping.cityId);
    }
  }

  setShipping() {
    if (this.props.detail.shipping.subdistrictId) {
      this.props.fetchShipping(this.props.detail.shipping.subdistrictId);
    }
  }

  render() {
    const { isFetching, detail, location } = this.props;
    const { isBilling, shipping } = detail;
    const isFetchingOngkir = location.isFetching;
    const { shippingAgentId, firstName, lastName, address, provinceId, cityId, subdistrictId, zipCode, notes } = shipping;

    return (
      <div className={styles["customer-panel"]}>
        <div className="row">
          <div className="col-md-4">
            <div className={'form-group'}>
              <label htmlFor="duplicateBilling">
                <FormattedMessage id="order.shipping.duplicateBilling" />
              </label>
              <div>
                <Switch onChange={this.onDuplicate} checked={isBilling} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <Input
              onChange={this.onChange}
              required
              label={formattedMessageHelper('order.shipping.firstName')}
              base={{
                name: 'firstName',
                disabled: isFetching,
                value: firstName || ''
              }}
            />
          </div>
          <div className="col-md-4">
            <Input
              onChange={this.onChange}
              required
              label={formattedMessageHelper('order.shipping.lastName')}
              base={{
                name: 'lastName',
                disabled: isFetching,
                value: lastName || ''
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Input
              onChange={this.onChange}
              required
              textarea
              label={formattedMessageHelper('order.shipping.address')}
              base={{
                name: 'address',
                disabled: isFetching,
                value: address || ''
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className={'form-group'}>
              <label htmlFor="Province">
                <FormattedMessage id="order.shipping.province" />
              </label>
              <div>
                <Dropdown
                  onChange={this.onDropdownChange}
                  options={this.props.location.provinces}
                  base={{
                    name: 'province',
                    required: true,
                    value: provinceId || '',
                    disabled: isFetchingOngkir,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className={'form-group'}>
              <label htmlFor="City">
                <FormattedMessage id="order.shipping.city" />
              </label>
              <div>
                <Tooltip 
                  position="bottom" 
                  text="location.provinceNeeded" 
                  display={!provinceId}
                  className="m-b-5"
                >
                  <Dropdown
                    onChange={this.onDropdownChange}
                    options={this.props.location.cities}
                    base={{
                      name: 'city',
                      required: true,
                      value: cityId || '',
                      disabled: !provinceId ? true : isFetchingOngkir,
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className={'form-group'}>
              <label htmlFor="Subdistrict">
                <FormattedMessage id="order.shipping.subdistrict" />
              </label>
              <div>
                <Tooltip 
                  position="bottom" 
                  text="location.cityNeeded" 
                  display={!cityId}
                  className="m-b-5"
                >
                  <Dropdown
                    onChange={this.onDropdownChange}
                    options={this.props.location.subDistricts}
                    base={{
                      name: 'subdistrict',
                      required: true,
                      value: subdistrictId || '',
                      disabled: !cityId ? true : isFetchingOngkir,
                    }}
                  />
                </Tooltip>                  
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('order.shipping.zipCode')}
              base={{
                name: 'zipCode',
                disabled: isFetching,
                value: zipCode || ''
              }}
            />
          </div>
          <div className="col-md-6">
            <div className={'form-group'}>
              <label htmlFor="shippingFee">
                <FormattedMessage id="order.shipping.shippingAgent" />
              </label>
              <div>
                <Tooltip 
                  position="bottom" 
                  text="location.subdistrictNeeded" 
                  display={!subdistrictId}
                  className="m-b-5"
                >
                  <Dropdown
                    onChange={this.onDropdownChange}
                    options={this.props.rajaongkir.listShipping}
                    base={{
                      name: 'shippingAgent',
                      required: true,
                      value: shippingAgentId || '',
                      disabled: !subdistrictId ? true : this.props.rajaongkir.isFetching,
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Input
              onChange={this.onChange}
              required
              textarea
              label={formattedMessageHelper('order.shipping.notes')}
              base={{
                name: 'notes',
                disabled: isFetching,
                value: notes
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Shipping;

/* eslint-disable */
Shipping.propTypes = {
  detail: PropTypes.any,
  location: PropTypes.any,
  rajaongkir: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  fetchCities: PropTypes.func.isRequired,
  fetchSubdistricts: PropTypes.func.isRequired,
  fetchShipping: PropTypes.func.isRequired,
  isFetching: PropTypes.bool
};
/* eslint-enable */
