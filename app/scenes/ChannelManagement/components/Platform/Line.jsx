import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import { formattedMessageHelper } from 'Modules/helper/utility';

import styles from './styles.scss';

class Line extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      payload: {
        channelId: '',
        channelSecret: '',
        channelAccessToken: '',
        webhookURL: '',
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
      await this.props.update({ line: this.state.payload });
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
          <p className="fg-shade m-t-20">Line Account Data</p>
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.line.channelId')}
            styles="form-group-default"
            base={{
              name: 'channelId',
              value: this.state.payload.channelId,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.line.channelSecret')}
            styles="form-group-default"
            base={{
              name: 'channelSecret',
              value: this.state.payload.channelSecret,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.line.channelAccessToken')}
            styles="form-group-default"
            base={{
              name: 'channelAccessToken',
              value: this.state.payload.channelAccessToken,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.line.webhook')}
            styles={`form-group-default ${styles['form-group--disabled']}`}
            base={{
              name: 'webhookURL',
              value: this.state.payload.webhookURL,
              disabled: true,
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

export default Line;

/* eslint-disable */
Line.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  data: PropTypes.any.isRequired,
};
/* eslint-enable */

Line.defaultProps = {
  onClose: () => {},
};
