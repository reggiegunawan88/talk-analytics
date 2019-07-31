import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import Button from 'shared_components/Button';
import Dropdown from 'shared_components/Dropdown';
import Input from 'shared_components/Input';
import config from 'Config/configValues';
import {
  getProvinces,
  getCities,
  getSubDistricts,
} from 'Modules/location';
import { formattedMessageHelper, handleEmptyString } from 'Modules/helper/utility';
import styles from './styles.scss';
import getLocationState from './selector';

const mapStateToProps = state => {
  const stateProps = getLocationState(state);
  return stateProps;
};

class LocationCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      address: '',
      province: {},
      city: {},
      subdistrict: {},
      zipcode: '',
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.props.getProvinces();
    const { province, city } = this.props.channelInfo;
    if (province && province.id !== '') {
      this.props.getCities(province.id);
    }
    if (city && city.id !== '') {
      this.props.getSubDistricts(city.id);
    }
  }

  onDropdownChange(name, { value, label }) {
    this.setState({ [name]: { id: value, name: label } });
    if (name === config.LOCATION.PROVINCE) {
      this.props.getCities(value, true);
      this.setState({ city: {}, subdistrict: {} });
    } else if (name === config.LOCATION.CITY) {
      this.props.getSubDistricts(value, true);
      this.setState({ subdistrict: {} });
    }
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue[name] = value;
    this.setState(newValue);
  }

  submit(e) {
    e.preventDefault();
    const { isModalOpen, ...location } = this.state;
    this.props
      .updateChannel({ location: { ...location } })
      .then(() => this.closeModal())
      .catch(() => this.closeModal());
  }

  openModal() {
    const {
      address,
      province,
      subdistrict,
      city,
      zipcode,
    } = this.props.channelInfo;
    this.setState({
      isModalOpen: true,
      address,
      province,
      subdistrict,
      city,
      zipcode,
    });
  }

  isLocationComplete() {
    let isComplete = true;
    const requiredProp = ['province', 'subdistrict', 'city'];

    requiredProp.forEach(p => { 
      if (!isComplete || handleEmptyString(this.props.channelInfo[p].id) === "-") {
        isComplete = false;
      }
    });

    return isComplete;
  }

  handleView() {
    const {
      address,
      province,
      city,
      subdistrict,
      zipcode,
    } = this.props.channelInfo;
    if (this.props.channelInfo.province && this.isLocationComplete()) {
      return (
        <div>
          <b>
            <FormattedMessage id="profile.address" />
          </b>
          <p className="m-b-10">{handleEmptyString(address)}</p>
          <b>
            <FormattedMessage id="profile.province" />
          </b>
          <p className="m-b-10">{province.name}</p>
          <b>
            <FormattedMessage id="profile.district" />
          </b>
          <p className="m-b-10">{subdistrict.name}</p>
          <b>
            <FormattedMessage id="profile.city" />
          </b>
          <p className="m-b-10">{city.name}</p>
          <b>
            <FormattedMessage id="profile.zipCode" />
          </b>
          <p className="m-b-10">{handleEmptyString(zipcode)}</p>
        </div>
      );
    }

    return (
      <div className="alert alert-warning">
        <FormattedHTMLMessage id="profile.noLocation" />
      </div>
    );
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  render() {
    const {
      provinces,
      cities,
      subDistricts,
      isFetching,
      channelInfo,
    } = this.props;

    return (
      <div className="panel panel-transparent">
        <div className={`panel-body ${styles['panel--responsive']}`}>
          <b className="display-inline-block m-t-10 fs-16">
            <FormattedMessage id="profile.location" />
          </b>
          <Button
            className={`btn-primary btn-ghost ${styles.location__btn}`}
            onClick={this.openModal}
          >
            {channelInfo.province && this.isLocationComplete() ? (
              <FormattedMessage id="profile.edit" />
            ) : (
              <div>
                <i className="fa fa-plus" />{' '}
                <FormattedMessage id="profile.add" />
              </div>
            )}
          </Button>
          <hr />
          {this.handleView()}
        </div>

        <Modal
          classNames={{ modal: styles['location-card--modal'] }}
          open={this.state.isModalOpen}
          onClose={this.closeModal}
          center
        >
          <b>
            <FormattedMessage id="profile.editLocation" />
          </b>

          <p className="fg-shade m-t-20">
            <FormattedMessage id="profile.fillForm" />
          </p>

          <form onSubmit={this.submit}>
            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('profile.address')}
              styles="form-group-default"
              textarea
              base={{
                name: 'address',
                value: this.state.address,
                disabled: isFetching,
              }}
              required
            />

            <div className={`m-b-5 ${styles['province-dropdown']}`}>
              <Dropdown
                onChange={this.onDropdownChange}
                label={formattedMessageHelper('profile.province')}
                options={provinces}
                base={{
                  name: 'province',
                  placeholder: formattedMessageHelper('profile.province'),
                  required: true,
                  value: this.state.province && this.state.province.id ? this.state.province.id : '',
                  isLoading: isFetching,
                }}
              />
            </div>
            <div className={`m-b-5 ${styles['city-dropdown']}`}>
              <Dropdown
                onChange={this.onDropdownChange}
                label={formattedMessageHelper('profile.city')}
                options={cities}
                base={{
                  name: 'city',
                  placeholder: formattedMessageHelper('profile.city'),
                  required: true,
                  value: this.state.city && this.state.city.id ? this.state.city.id : '',
                  isLoading: isFetching,
                }}
              />
            </div>

            <Dropdown
              onChange={this.onDropdownChange}
              className="form-group"
              label={formattedMessageHelper('profile.district')}
              options={subDistricts}
              base={{
                name: 'subdistrict',
                placeholder: formattedMessageHelper('profile.district'),
                required: true,
                value: this.state.subdistrict && this.state.subdistrict.id ? this.state.subdistrict.id : '',
                isLoading: isFetching,
              }}
            />

            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('profile.zipCode')}
              styles="form-group-default m-t-10"
              base={{
                name: 'zipcode',
                value: this.state.zipcode,
                disabled: isFetching,
              }}
              required
            />

            <Button className="btn-primary btn-block m-t-20">
              <FormattedMessage id="profile.save" />
            </Button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  { getProvinces, getCities, getSubDistricts }
)(LocationCard);

/* eslint-disable */
LocationCard.propTypes = {
  getProvinces: PropTypes.func.isRequired,
  getCities: PropTypes.func.isRequired,
  getSubDistricts: PropTypes.func.isRequired,
  updateChannel: PropTypes.func.isRequired,
  provinces: PropTypes.array,
  cities: PropTypes.array,
  subDistricts: PropTypes.array,
  isFetching: PropTypes.bool.isRequired,
  channelInfo: PropTypes.any.isRequired,
};
/* eslint-enable */

LocationCard.defaultProps = {
  provinces: [],
  cities: [],
  subDistricts: [],
};
