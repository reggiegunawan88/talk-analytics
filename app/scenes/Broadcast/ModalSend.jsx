import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';

import Button from 'shared_components/Button';

import styles from './styles.scss';

class modalSend extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.prop.onClick();
  }

  render() {
    const { isModalOpen, onClose } = this.props;

    return (
      <Modal
        classNames={{ modal: styles['c-modal__normal'] }}
        open={isModalOpen}
        onClose={onClose}
        center
      >
        <b>
          <FormattedMessage id={broadcast.broadcastSend} />
        </b>
        <Button
          className="btn btn-primary btn-block btn-ghost"
          onClick={this.props.onClose}
        >
          <FormattedMessage id="broadcast.close" />
        </Button>
      </Modal>
    );
  }
}

export default modalSend;

/* eslint-disable */
modalSend.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};
/* eslint-enable */

modalSend.defaultProps = {
  onClose: () => {},
};
