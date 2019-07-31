import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import Loader from 'shared_components/PageLoader';
import Initial from 'shared_components/Initial';
import { updateProfile } from 'Modules/profile';
import { formattedMessageHelper } from 'Modules/helper/utility';
import getProfileState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getProfileState(state);
  return stateProps;
};

class UserCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: {},
      isModalOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue.profile[name] = value;
    this.setState(newValue);
  }

  openModal() {
    const { isFetching, ...profile } = this.props;
    this.setState({
      profile,
      isModalOpen: true,
    });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  isAffiliateLoaded() {
    return Object.keys(this.state.profile).length !== 0;
  }

  submit(e) {
    e.preventDefault();

    const { fname, lname, email, phone } = this.state.profile;
    this.props
      .updateProfile({ name: `${fname} ${lname}`, email, phone })
      .then(() => {
        this.closeModal();
      });
  }

  render() {
    const { name, email, phone, isFetching } = this.props;

    return (
      <div className="panel panel-default">
        <div className="panel-body padding-20">
          <div className={styles['user__img-left']}>
            <div className="text-center">
              <div role="none" className={styles['user__img-outer-container']}>
                <div className={styles['user__img-container']}>
                  {isFetching ? (
                    <Loader className="m-t-60" />
                  ) : (
                    <Initial name={name} className="fs-70" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles['user__info-right']}>
            <b className="display-inline-block m-t-10 fs-16">
              <FormattedMessage id="profile.profile" />
            </b>
            {name && !isFetching && (
              <Button
                className="pull-right btn-primary btn-ghost"
                onClick={this.openModal}
              >
                <i className="fa fa-pencil" />{' '}
                <FormattedMessage id="profile.edit" />
              </Button>
            )}
            <hr />

            <div className={`row ${styles['user__info-data']}`}>
              <div className="col-md-6">
                <b className="fs-11">
                  <FormattedMessage id="profile.name" />
                </b>
                <p className="fg-shade">{name}</p>
              </div>

              <div className="col-md-6">
                <b className="fs-11">
                  <FormattedMessage id="profile.email" />
                </b>
                <p className="fg-shade">{email}</p>
              </div>

              <div className="col-md-6">
                <b className="fs-11">
                  <FormattedMessage id="profile.phone" />
                </b>
                <p className="fg-shade">{phone}</p>
              </div>
            </div>
          </div>
        </div>

        <Modal
          classNames={{ modal: styles['user-card--modal'] }}
          open={this.state.isModalOpen}
          onClose={this.closeModal}
          center
        >
          <b>
            <FormattedMessage id="profile.editProfile" />
          </b>

          <p className="fg-shade m-t-20">
            <FormattedMessage id="profile.fillForm" />
          </p>

          <form onSubmit={this.submit}>
            <div className="row">
              <div className="col-md-6">
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper('profile.fname')}
                  styles="form-group-default"
                  base={{
                    name: 'fname',
                    value: this.state.profile.fname,
                    disabled: isFetching,
                  }}
                  required
                />
              </div>
              <div className="col-md-6">
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper('profile.lname')}
                  styles="form-group-default"
                  base={{
                    name: 'lname',
                    value: this.state.profile.lname,
                    disabled: isFetching,
                  }}
                  required
                />
              </div>
            </div>
            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('profile.email')}
              styles="form-group-default"
              base={{
                type: 'email',
                name: 'email',
                value: this.state.profile.email,
                disabled: isFetching,
              }}
              required
            />
            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('profile.phone')}
              styles="form-group-default"
              base={{
                type: 'number',
                name: 'phone',
                value: this.state.profile.phone,
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
  { updateProfile }
)(UserCard);

/* eslint-disable */
UserCard.propTypes = {
  name: PropTypes.any,
  email: PropTypes.any,
  phone: PropTypes.any,
  isFetching: PropTypes.bool,
  updateProfile: PropTypes.func.isRequired,
};
/* eslint-enable */

UserCard.defaultProps = {
  name: '',
  email: '',
  phone: '',
  isFetching: false,
};
