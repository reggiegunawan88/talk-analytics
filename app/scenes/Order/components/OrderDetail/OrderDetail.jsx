import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import { formatCurr } from 'Modules/helper/utility';
import Quickview from 'shared_components/Quickview';
import styles from './styles.scss';

class OrderDetail extends Component {
  componentDidMount() {
    this.props.onRef(this.quickview);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAdding && !nextProps.isAdding) {
      this.quickview.closeQuickview();
    }
  }

  handleDisplay(order) {
    return (
      <div className={styles.order__area}>
        <div className="p-t-30">
          <div className={styles.order__header}>
            <h5>
              <FormattedMessage id="order.invoiceTo" />
            </h5>

            <span
              className={`btn ${styles.label__status} ${
                styles[`label__status-${order.status}`]
              }`}
            >
              {order.status}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="CustomerName">
              {order.billing.first_name} {order.billing.last_name}
            </label>
            <p>{order.shipping.address_1}</p>
          </div>
          <div className={styles['detail__info--order']}>
            <li className="row">
              <div className="col-md-6">
                <FormattedMessage id="order.phone" />
                <p>
                  <i>:</i>
                  {order.billing.phone}
                </p>
              </div>
              <div className="col-md-6">
                <FormattedMessage id="order.invoiceNo" />
                <p>
                  <i>:</i>
                  {order.order_key}
                </p>
              </div>
            </li>
            <li className="row">
              <div className="col-md-6">
                <FormattedMessage id="order.email" />
                <p>
                  <i>:</i>
                  {order.billing.email}
                </p>
              </div>
              <div className="col-md-6">
                <FormattedMessage id="order.invoiceDate" />
                <p>
                  <i>:</i>
                  {order.date_created}
                </p>
              </div>
            </li>
            <li className="row">
              <div className="col-md-12">
                <FormattedMessage id="order.note" />
                <p>
                  <i>:</i>
                  {this.props.notesDetail}
                </p>
              </div>
            </li>
          </div>
        </div>
        <div className="p-t-20">
          <table className={`table ${styles['order__product-table']}`}>
            <thead>
              <tr>
                <th className="text-left">
                  <FormattedMessage id="order.productName" />
                </th>
                <th className="text-center">
                  <FormattedMessage id="order.price" />
                </th>
                <th className="text-center">
                  <FormattedMessage id="order.qty" />
                </th>
                <th className="text-right">
                  <FormattedMessage id="order.subtotal" />
                </th>
              </tr>
            </thead>
            <tbody>
              {order.line_items.length > 0 ? (
                order.line_items.map((item, index) => (
                  <tr key={index}>
                    <td className="text-left">{item.name}</td>
                    <td className="text-center">
                      {item.currency} {formatCurr(item.price)}
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      {formatCurr(item.subtotal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    <FormattedMessage id="order.noData" />
                  </td>
                </tr>
              )}
            </tbody>
            {order.shipping_lines && order.shipping_lines.length > 0 && (
              <tfoot>
                {order.shipping_lines.length > 0 && order.shipping_lines.map((shipping, index) => (
                  <tr key={index}>
                    <th colSpan="3">Shipped by {shipping.method_title.toUpperCase()}</th>
                    <th className="text-right">{formatCurr(order.shipping_total)}</th>
                  </tr>
                ))}
              </tfoot>
            )}
          </table>
          <div className={`row ${styles['order__footer-area']}`}>
            <div className="col-md-4">
              <div className={styles['order__info-footer']}>
                <label htmlFor="subtotal"><FormattedMessage id="order.subtotal" /></label>
                <span>{formatCurr(order.total)}</span>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className={styles['order__info-footer']}>
                <label htmlFor="discount"><FormattedMessage id="order.discountApplied" /></label>
                <span>{`- ${formatCurr(order.discount_total)}`}</span>
              </div>
            </div>
            <div className="col-md-4 text-right">
              <div className={styles['order__info-footer']}>
                <label htmlFor="total"><FormattedMessage id="order.total" /></label>
                <span>{formatCurr(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { order } = this.props;
    const hiddenToggle = true;

    return (
      <Quickview
        customStyles={{ builder: styles.order_quickview }}
        hiddenToggle={hiddenToggle}
        ref={quickview => {
          this.quickview = quickview;
        }}
        onClose={this.props.onClose}
      >
        <div className={styles['full-height']}>
          <ul
            className={`nav nav-tabs nav-tabs-simple nav-tabs-primary m-t-10
            ${styles['nav-tab']}`}
          >
            <li role="none" className={`${styles['nav-tab__tab']} active`}>
              <a data-toggle="tab">
                <FormattedMessage id="order.detailInvoice" />
              </a>
            </li>
          </ul>
          {order.id && this.handleDisplay(order)}
        </div>
      </Quickview>
    );
  }
}

export default OrderDetail;

/* eslint-disable */
OrderDetail.propTypes = {
  onRef: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.any.isRequired,
  isAdding: PropTypes.bool,
  notesDetail: PropTypes.string,
};
/* eslint-enable */

OrderDetail.defaultProps = {
  isAdding: false,
  notesDetail: '',
};
