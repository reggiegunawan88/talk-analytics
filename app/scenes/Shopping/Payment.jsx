import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';

import Button from 'shared_components/Button';
import styles from './styles.scss';

class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleTablePayment = this.handleTablePayment.bind(this);
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  handleTablePayment() {
    const { plan } = this.props;
    return (
      <table>
        <tbody>
          <tr>
            <th>{plan.name}</th>
            <td className="text-right">
              {plan.idrPrice}
            </td>
          </tr>
          <tr>
            <th>Total Payment</th>
            <td className="text-right">{plan.idrPrice}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    const { plan } = this.props;
    const { isModalOpen } = this.state;
    return (
      <div className={`${styles.payment__area} ${this.props.className}`}>
        <div className="row">
          <div className={`col-md-6 ${styles['payment__plan-border']}`}>
            <div className={`m-b-15 ${styles["payment__info-title"]}`}>
              <img
                height="24"
                src={`/img/icon/shopping/${plan.id}.png`}
                alt=""
                className="m-r-10"
              />
              <b>{plan.name}</b>
            </div>
            
            {plan.price !== 0 ? (
              <h3 className="semi-bold m-t-20 m-b-15">
                IDR{' '}
                <p className="display-inline bold fs-35">
                  {plan.price}
                </p>
                <FormattedMessage id="shopping.priceUnit" />
              </h3>
            ) : (
              <h3
                className="bold fs-35 m-t-20 m-b-15"
              >
                Free
              </h3>
            )}

            <div className={styles["payment__info-features"]}>
              <p>{plan.size} <FormattedHTMLMessage id="shopping.fileUpload" /></p>
              <p className={`m-t-10 ${styles['shopping__feature-info']}`}><FormattedMessage id="shopping.featureInfo" /></p>
              <ul>
                {plan.features.map( (feature, index) => feature && (<li key={index}><i className="fa fa-check" /> {feature}</li>))}
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <div className={styles['payment__billing-area']}>
              <h6><FormattedMessage id="shopping.billing" /></h6>
              <div className={styles['payment__billing-list']}>
                {this.handleTablePayment()}
                <div className="alert alert-warning">
                  <FormattedHTMLMessage id="shopping.cautionPayment" />
                </div>
                <Button className="btn btn-block btn-primary" type="button" onClick={this.openModal}>
                  <FormattedMessage id="shopping.processPayment" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <span role="none" className={styles['shopping--back']} onClick={() => this.props.goBack('plan')}>
          <i className="fa fa-angle-left" />
          <FormattedMessage id="shopping.back" />
        </span>
        <Modal
          open={isModalOpen}
          onClose={this.closeModal}
          classNames={{ modal: styles['shopping--modal'] }}
          center
        >
          <h3 className={styles['payment__modal-title']}>
            <FormattedMessage id="shopping.paymentConfirmation" />
          </h3>
          <div className={styles['payment__modal-table']}>
            {this.handleTablePayment()}
          </div>
          <div className="alert alert-warning m-t-20">
            <FormattedHTMLMessage id="shopping.cautionModal" />
          </div>
          <button
            className="btn btn-primary btn-block"
            onClick={this.props.onClick}
          >
            <FormattedMessage id="shopping.proceedPayment" />
          </button>
        </Modal>
      </div>
    );
  }
}

export default Payment;

/* eslint-disable */
Payment.propTypes = {
  plan: PropTypes.any,
  onClick: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  className: PropTypes.string,
};
/* eslint-enable */

Payment.defaultProps = {
  plan: {},
  className: '',
};
