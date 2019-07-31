import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';
import cloneDep from 'lodash/cloneDeep';

import Button from 'shared_components/Button';
import Checkbox from 'shared_components/Checkbox';
import { formattedMessageHelper } from 'Modules/helper/utility';

import styles from './styles.scss';

class ChooseLoyalty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      checked: {},
    };

    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange() {
    console.log('change');
  }

  submit() {
    console.log('submit');
  }

  render() {
    const { isModalOpen, onClose, data } = this.props;
    const { isFetching } = this.state;

    return (
      <Modal
        classNames={{ modal: styles['c-modal__normal'] }}
        open={isModalOpen}
        onClose={onClose}
        center
      >
        <b>
          <FormattedMessage id={broadcast.loyaltyModalTitle} />
        </b>
      </Modal>
    );
  }
}

export default ChooseLoyalty;
