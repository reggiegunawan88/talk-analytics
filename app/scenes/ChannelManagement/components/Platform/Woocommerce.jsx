import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import { formattedMessageHelper, formattedHtmlMessageHelper } from 'Modules/helper/utility';

import styles from './styles.scss';

class Woocommerce extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      payload: {
        apikey: '',
        json: '',
        sessionId: '',
        projectId: '',
      },
    };

    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillReceiveProps(props, prev) {
    if (props.data !== prev.data) this.setState({ payload: props.data });
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue.payload[name] = value;
    this.setState(newValue);
  }

  async submit(e) {
    e.preventDefault();

    try {
      await this.props.update({ woocommerce: this.state.payload });
      this.props.onClose();
    } catch (err) {
      throw err;
    }
  }

  render() {
    const { isModalOpen, onClose } = this.props;
    const { isFetching } = this.state;

    return (
      <Modal
        classNames={{ modal: styles['platform-modal'] }}
        open={isModalOpen}
        onClose={onClose}
        center
      >
        <form onSubmit={this.submit}>
          <b>Link Form</b>
          <p className="fg-shade m-t-20"><FormattedMessage id="platform.woocommerce.data" /></p>
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.woocommerce.store')}
            styles="form-group-default"
            base={{
              name: 'store',
              value: this.state.payload.store,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.woocommerce.username')}
            styles="form-group-default"
            base={{
              name: 'username',
              value: this.state.payload.username,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.woocommerce.password')}
            styles="form-group-default"
            base={{
              type: 'password',
              name: 'password',
              value: this.state.payload.password,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.woocommerce.key')}
            styles="form-group-default"
            base={{
              name: 'key',
              value: this.state.payload.key,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedHtmlMessageHelper('platform.woocommerce.secret')}
            styles='form-group-default'
            base={{
              name: 'secret',
              value: this.state.payload.secret,
              disabled: isFetching,
            }}
            required
          />

          <Button className="btn-primary btn-block m-t-20">
            <FormattedMessage id="profile.save" />
          </Button>
        </form>
      </Modal>
    );
  }
}

export default Woocommerce;

/* eslint-disable */
Woocommerce.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  data: PropTypes.any.isRequired,
};
/* eslint-enable */

Woocommerce.defaultProps = {
  onClose: () => {},
};
