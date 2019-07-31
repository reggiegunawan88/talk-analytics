import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';

import Button from 'shared_components/Button';

import styles from './styles.scss';

class modalCaution extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.prop.onClick();
  }

  render() {
    const { isFetching, isModalOpen, onClose } = this.props;

    return (
      <Modal
        classNames={{ modal: styles['c-modal__normal'] }}
        open={isModalOpen}
        onClose={onClose}
        center
      >
        <b>
          <FormattedMessage id={broadcast.cautionTitle} />
        </b>
        <div>
          <p className="fg-shade m-t-20">
            <FormattedMessage id="broadcast.cautionText" />
          </p>
          <div className="row">
            <div className="col-md-6">
              <Button
                className="btn btn-danger btn-block"
                onClick={this.props.onClose}
              >
                <FormattedMessage id="broadcast.deleteYes" />
              </Button>
            </div>
            <div className="col-md-6">
              <Button
                className="btn btn-primary btn-block btn-ghost"
                onClick={this.onClick}
              >
                <FormattedMessage id="broadcast.cautionYes" />
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default modalCaution;

/* eslint-disable */
modalCaution.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  isFetching: PropTypes.bool,
};
/* eslint-enable */

modalCaution.defaultProps = {
  onClose: () => {},
};
