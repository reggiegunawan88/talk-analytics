import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import { formattedMessageHelper } from 'Modules/helper/utility';
import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import Dropdown from 'shared_components/Dropdown';
import styles from './style.scss';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    const {
      activeChatUser: { biodata },
    } = this.props;

    this.state = {
      isEditing: false,
      biodata: {
        _id: biodata ? biodata._id : '',
        address: biodata ? biodata.address : '',
        zipcode: biodata ? biodata.zipcode : '',
        birthdate: biodata ? biodata.birthdate : '',
        email: biodata ? biodata.email : '',
        gender: biodata ? biodata.gender : '',
        name: biodata ? biodata.name : '',
        phone: biodata ? biodata.phone : '',
        usertag: biodata ? biodata.usertag : '',
      },
      listGender: [
        {
          label: 'Perempuan',
          value: 'Perempuan',
        },
        {
          label: 'Laki-laki',
          value: 'Laki-laki',
        },
        {
          label: 'No Gender',
          value: '-',
        },
      ],
    };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  componentDidUpdate() {
    const { activeChatUser: { biodata } } = this.props;

    if (this.state.isEditing && !this.state.biodata._id && biodata && biodata._id) {
      this.setState({ 
        biodata: { ...biodata },
        isEditing: !this.state.isEditing 
      });
    }
  }

  onClick() {
    const newValue = cloneDeep(this.state);
    newValue.biodata.name = this.state.biodata.name.trim();

    if (this.state.isEditing) {
      this.props.updateBiodataUser(newValue.biodata);
    }
    if (this.state.biodata._id || !this.state.isEditing){
      newValue.isEditing = !this.state.isEditing;
    }

    this.setState(newValue);
  }

  onChange(e) {
    this.changeState(e.name, e.value);
  }

  onDropdownChange(name, { value }) {
    this.changeState(name, value);
  }

  changeState(name, value) {
    const newValue = cloneDeep(this.state);
    newValue.biodata[name] = value;

    this.setState(newValue);
  }

  render() {
    const { isFetching } = this.props;
    const { biodata, isEditing } = this.state;
    
    return (
      <div
        className={`split-details ${styles['adjusted-height']} ${
          styles['user-info-wrapper']
        }`}
      >
        <div className={`${styles['title-wrapper']}`}>
          <h5 className={`${styles.title}`}>
            <FormattedMessage id="chatroom.userinfo.visitorProfile" />
          </h5>
        </div>

        {!isEditing && (
          <div className={`${styles['user-name-wrapper']}`}>
            <div className={`${styles['online-indicator']}`} />
            <span className={`${styles['user-name']}`}>{biodata.name}</span>
          </div>
        )}

        <ul className={`${styles['user-data-list']}`}>
          {isEditing && (
            <li className={`${styles['user-data-list-item']}`}>
              <div className={styles['user-data-form-group']}>
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper('chatroom.userinfo.name')}
                  base={{
                    type: 'text',
                    name: 'name',
                    value: biodata.name,
                    disabled: isFetching,
                  }}
                />
              </div>
            </li>
          )}
          <li className={`${styles['user-data-list-item']}`}>
            {isEditing ? (
              <div className={styles['user-data-form-group']}>
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper('chatroom.userinfo.birthDate')}
                  base={{
                    type: 'date',
                    name: 'birthdate',
                    value: biodata.birthdate,
                    disabled: isFetching,
                  }}
                />
              </div>
            ) : (
              <div>
                <span className={`${styles['user-data-label']}`}>
                  <FormattedMessage id="chatroom.userinfo.birthDate" />
                </span>
                <span className={`${styles['user-data']}`}>
                  {biodata.birthdate}
                </span>
              </div>
            )}
          </li>
          <li className={`${styles['user-data-list-item']}`}>
            {isEditing ? (
              <div className={styles['user-data-form-group']}>
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper('chatroom.userinfo.email')}
                  base={{
                    type: 'email',
                    name: 'email',
                    value: biodata.email,
                    disabled: isFetching,
                  }}
                />
              </div>
            ) : (
              <div>
                <span className={`${styles['user-data-label']}`}>
                  <FormattedMessage id="chatroom.userinfo.email" />
                </span>
                <span className={`${styles['user-data']}`}>
                  {biodata.email}
                </span>
              </div>
            )}
          </li>
          <li className={`${styles['user-data-list-item']}`}>
            {isEditing ? (
              <Dropdown
                onChange={this.onDropdownChange}
                options={this.state.listGender}
                label={formattedMessageHelper('chatroom.userinfo.gender')}
                className={styles['user-data-form-group']}
                base={{
                  name: 'gender',
                  required: false,
                  value: biodata.gender || '-',
                }}
              />
            ) : (
              <div>
                <span className={`${styles['user-data-label']}`}>
                  <FormattedMessage id="chatroom.userinfo.gender" />
                </span>
                <span className={`${styles['user-data']}`}>
                  {biodata.gender}
                </span>
              </div>
            )}
          </li>
          <li className={`${styles['user-data-list-item']}`}>
            {isEditing ? (
              <div className={styles['user-data-form-group']}>
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper('chatroom.userinfo.phone')}
                  base={{
                    type: 'text',
                    name: 'phone',
                    value: biodata.phone,
                    disabled: isFetching,
                  }}
                />
              </div>
            ) : (
              <div>
                <span className={`${styles['user-data-label']}`}>
                  <FormattedMessage id="chatroom.userinfo.phone" />
                </span>
                <span className={`${styles['user-data']}`}>
                  {biodata.phone}
                </span>
              </div>
            )}
          </li>
          <li className={`${styles['user-data-list-item']}`}>
            {isEditing ? (
              <div className={styles['user-data-form-group']}>
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper('chatroom.userinfo.address')}
                  base={{
                    name: 'address',
                    value: biodata.address,
                    disabled: isFetching,
                    rows: 3,
                  }}
                  textarea
                />
              </div>
            ) : (
              <div>
                <span className={`${styles['user-data-label']}`}>
                  <FormattedMessage id="chatroom.userinfo.address" />
                </span>
                <span className={`${styles['user-data']}`}>
                  {biodata.address}
                </span>
              </div>
            )}
          </li>
          <li className={`${styles['user-data-list-item']}`}>
            {isEditing ? (
              <div className={styles['user-data-form-group']}>
                <Input
                  onChange={this.onChange}
                  label={formattedMessageHelper('chatroom.userinfo.zipcode')}
                  base={{
                    type: 'text',
                    name: 'zipcode',
                    value: biodata.zipcode,
                    disabled: isFetching,
                  }}
                />
              </div>
            ) : (
              <div>
                <span className={`${styles['user-data-label']}`}>
                  <FormattedMessage id="chatroom.userinfo.zipcode" />
                </span>
                <span className={`${styles['user-data']}`}>
                  {biodata.zipcode}
                </span>
              </div>
            )}
          </li>
          <li className={`${styles['user-data-list-item']}`}>
            <Button
              className={`btn btn-block m-t-10 btn-primary ${
                styles['user-data-form-group']
              } ${!isEditing && 'btn-ghost'} `}
              isLoading={isFetching}
              onClick={this.onClick}
            >
              <i
                className={`fa ${isEditing ? 'fa-save' : 'fa-pencil'} m-r-5`}
              />
              {isEditing ? (
                <FormattedMessage id="chatroom.userinfo.save" />
              ) : (
                <FormattedMessage id="chatroom.userinfo.edit" />
              )}
            </Button>
            {!isEditing && (
              <div className={styles['chat__order-disabled']}>
                <Button
                  className={`btn btn-block m-t-10 btn-primary ${styles['user-data-form-group']} ${!biodata._id && styles['btn--disabled']}`}
                  isLoading={isFetching}
                  onClick={this.props.createOrder}
                >
                  <FormattedMessage id="chatroom.userinfo.createOrder" />
                </Button>
                {!biodata._id && (
                  <i>
                    <FormattedMessage id="chatroom.userinfo.disabledOrder" />
                  </i>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>
    );
  }
}

export default injectIntl(UserInfo);

UserInfo.propTypes = {
  activeChatUser: PropTypes.shape({}).isRequired,
  updateBiodataUser: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  createOrder: PropTypes.func.isRequired,
};
