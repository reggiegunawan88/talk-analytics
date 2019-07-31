import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import { formattedMessageHelper, formattedHtmlMessageHelper } from 'Modules/helper/utility';

import styles from './styles.scss';

class ModalNlp extends Component {
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
      await this.props.update({ nlp: this.state.payload });
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
          <p className="fg-shade m-t-20"><FormattedMessage id="platform.nlp.nlpdata" /></p>
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.nlp.apiKey')}
            styles="form-group-default"
            base={{
              name: 'apikey',
              value: this.state.payload.apikey,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedHtmlMessageHelper('platform.nlp.json')}
            textarea
            styles={`form-group-default ${styles['textarea-custom']}`}
            base={{
              rows: 3,
              name: 'json',
              value: this.state.payload.json,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.nlp.sessionId')}
            styles="form-group-default"
            base={{
              name: 'sessionId',
              value: this.state.payload.sessionId,
              disabled: isFetching,
            }}
            required
          />
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper('platform.nlp.projectId')}
            styles="form-group-default"
            base={{
              name: 'projectId',
              value: this.state.payload.projectId,
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

export default ModalNlp;

/* eslint-disable */
ModalNlp.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  update: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  data: PropTypes.any.isRequired,
};
/* eslint-enable */

ModalNlp.defaultProps = {
  onClose: () => {},
};
