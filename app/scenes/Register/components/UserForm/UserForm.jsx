import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import _ from 'lodash';
import PropTypes from 'prop-types';

import Button from '../../../../components/Button';
import Input from '../../../../components/Input';

import getUserFormState from './selector';
import paths from '../../../../config/paths';
import styles from './styles.scss';
import { formattedMessageHelper } from '../../../../modules/helper/utility';

const mapStateToProps = state => {
  const stateProps = getUserFormState(state);
  return stateProps;
};

class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fname: props.googleUser.fname || '',
      lname: props.googleUser.lname || '',
      email: props.googleUser.email || '',
      phone: '',
    };

    this.onChange = this.onChange.bind(this);
    this.register = this.register.bind(this);
  }

  componentDidMount() {
    this.fname.focus();
  }

  onChange(e) {
    const newValue = _.cloneDeep(this.state);
    const { name, value } = e;
    newValue[name] = value;
    this.setState(newValue);
  }

  register(e) {
    e.preventDefault();

    const { fname, lname, email, phone } = this.state;
    this.props.submit('user', {
      name: `${fname}${lname ? ` ${lname}` : ''}`,
      email,
      phone,
    });
  }

  render() {
    const { isFetching, googleUser } = this.props;
    const { fname, lname, email } = googleUser;

    return (
      <div className={styles['register__inner-container']}>
        <p className={styles.register__title}>
          <FormattedMessage id="register.title" />
        </p>

        <form onSubmit={this.register}>
          <div className="clear-fix">
            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('register.firstNameLabel')}
              styles="form-group-default col-sm-6"
              base={{
                name: 'fname',
                disabled: isFetching || fname,
                value: fname,
                ref: input => {
                  this.fname = input;
                },
              }}
              required
            />

            <Input
              onChange={this.onChange}
              label={formattedMessageHelper('register.lastNameLabel')}
              styles="form-group-default col-sm-6"
              base={{
                name: 'lname',
                value: lname,
                disabled: isFetching || lname,
              }}
            />
          </div>

          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('register.emailLabel')}
            styles="form-group-default"
            base={{
              type: 'email',
              value: email,
              name: 'email',
              disabled: isFetching || email,
            }}
            required
          />

          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('register.phoneLabel')}
            styles="form-group-default"
            base={{ type: 'number', name: 'phone', disabled: isFetching }}
            required
          />

          <Button
            className="btn btn-primary btn-block m-t-30 m-b-15"
            isLoading={isFetching}
          >
            <FormattedMessage id="register.register" />
          </Button>

          <div>
            <FormattedMessage id="register.loginIntro" />
            <Link to={paths.public.login}>
              <FormattedMessage id="register.login" />
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(UserForm);

/* eslint-disable */
UserForm.propTypes = {
  googleUser: PropTypes.any,
  submit: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
};
/* eslint-enable */

UserForm.defaultProps = {
  isFetching: false,
  googleUser: {},
};
