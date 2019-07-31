import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';

import Input from 'shared_components/Input';
import Button from 'shared_components/Button';
import { formattedMessageHelper } from 'Modules/helper/utility';
import styles from './styles.scss';

class ModalAddVariant extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      nameVariant: '',
    };
  }

  onChange(e) {
    const { value } = e;
    this.setState({ nameVariant: value });
  }

  submit() {
    this.props.onSubmit({ name: this.state.nameVariant });
  }

  closeModal() {
    this.setState({ nameVariant: '' });
    this.props.onClose();
  }

  componentDidUpdate() {
    if (!this.props.isVariantAdd && this.state.nameVariant !== '') {
      this.setState({ nameVariant: '' });
    }
  }

  render() {
    const { isVariantAdd, isFetching, title, label } = this.props;
    return (
      <Modal
        classNames={{ modal: styles['c-modal__normal'] }}
        open={isVariantAdd}
        onClose={this.closeModal}
        center
      >
        <b>
          <FormattedMessage id={title} />
        </b>
        <div className="modal-form m-t-15">
          <Input
            onChange={this.onChange}
            label={formattedMessageHelper(label)}
            styles="form-group-default"
            base={{
              type: 'text',
              name: 'name',
              value: this.state.nameVariant,
              disabled: isFetching,
            }}
            required
          />
          <Button
            className="btn-primary btn-block m-t-20"
            onClick={this.submit}
            isLoading={isFetching}
          >
            <FormattedMessage id="product.variant.add" />
          </Button>
        </div>
      </Modal>
    );
  }
}

export default ModalAddVariant;

/* eslint-disable */
ModalAddVariant.propTypes = {
  isVariantAdd: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};
/* eslint-enable */

ModalAddVariant.defaultProps = {
  isVariantAdd: false,
};
