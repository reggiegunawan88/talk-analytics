import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { registerAccount, registerChannel } from 'Modules/auth';
import ChannelForm from './components/ChannelForm';

import getRegisterState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getRegisterState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators({ registerAccount, registerChannel }, dispatch);
  return dispatchFunc;
};

class Register extends PureComponent {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  submit(body) {
    this.props.registerChannel(body);
  }

  render() {
    return (
      <div className={styles['register__outer-container']}>
        <ChannelForm
          submit={this.submit}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);

/* eslint-disable */
Register.propTypes = {
  registerAccount: PropTypes.func.isRequired,
  registerChannel: PropTypes.func.isRequired,
  history: PropTypes.any.isRequired,
  isFetching: PropTypes.bool,
  userId: PropTypes.string,
  token: PropTypes.any,
};
/* eslint-enable */

Register.defaultProps = {
  token: undefined,
  isFetching: false,
  userId: '',
};
