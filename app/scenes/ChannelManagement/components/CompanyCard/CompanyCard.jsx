import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import { formattedMessageHelper, handleEmptyString } from 'Modules/helper/utility';
import styles from './styles.scss';

class CompanyCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      email: '',
      phone: '',
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.handleView = this.handleView.bind(this);
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue[name] = value;
    this.setState(newValue);
  }

  submit(e) {
    e.preventDefault();
    const { isModalOpen, ...companyData } = this.state;
    this.props
      .updateChannel({ ...companyData })
      .then(() => this.closeModal())
      .catch(() => this.closeModal());
  }

  openModal() {
    const {
      email,
      phone,
    } = this.props.channelInfo;
    this.setState({
      isModalOpen: true,
      email,
      phone
    });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  handleView() {
    const {
      email,
      phone
    } = this.props.channelInfo;
    if (email || phone) {
      return (
        <div>
          <b>
            <FormattedMessage id="profile.companyEmail" />
          </b>
          <p className="m-b-10">{handleEmptyString(email)}</p>
          <b>
            <FormattedMessage id="profile.companyPhoneNumber" />
          </b>
          <p className="m-b-10">{handleEmptyString(phone)}</p>
        </div>
      );
    }

    return (
      <div className="alert alert-warning">
        <FormattedHTMLMessage id="profile.noCompanyData" />
      </div>
    );
  }

  render() {
    const {
      channelInfo,
      isFetching
    } = this.props;

    return (
      <div className="panel panel-transparent p-t-20">
        <div className={`panel-body ${styles['panel--responsive']}`}>
          <b className="display-inline-block m-t-10 fs-16">
            <FormattedMessage id="profile.companyData" />
          </b>
          <Button
            className="pull-right btn-primary btn-ghost"
            onClick={this.openModal}
          >
            {channelInfo.email || channelInfo.phone ? (
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
            <FormattedMessage id="profile.editCompanyData" />
          </b>

          <p className="fg-shade m-t-20">
            <FormattedMessage id="profile.fillForm" />
          </p>

          <form onSubmit={this.submit}>
            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('profile.companyEmail')}
              styles="form-group-default"
              base={{
                name: 'email',
                value: this.state.email,
                disabled: isFetching,
              }}
              required
            />

            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('profile.companyPhoneNumber')}
              styles="form-group-default"
              base={{
                name: 'phone',
                value: this.state.phone,
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

export default CompanyCard;

/* eslint-disable */
CompanyCard.propTypes = {
  updateChannel: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  channelInfo: PropTypes.any.isRequired,
};
/* eslint-enable */
