import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import PropTypes from 'prop-types';

import styles from './styles.scss';

class OrdersTable extends Component {
  constructor(props) {
    super(props);

    this.handleActive = this.handleActive.bind(this);
  }

  handleActive(order) {
    const { activeOrder } = this.props;
    if (activeOrder.id !== order.id) {
      this.props.setActive(true, order);
    } else {
      this.props.setActive(false, order);
    }
  }

  render() {
    const { orders, activeOrder } = this.props;
    return (
      <table className="table table-hover table-responsive">
        <thead>
          <tr>
            <th>
              <FormattedMessage id="order.no" />
            </th>
            <th>
              <FormattedMessage id="order.invoice" />
            </th>
            <th>
              <FormattedMessage id="order.customerName" />
            </th>
            <th>
              <FormattedMessage id="order.address" />
            </th>
            <th>
              <FormattedMessage id="order.total" />
            </th>
            <th>
              <FormattedMessage id="order.status" />
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => this.handleActive(order)}
                  className={
                    activeOrder.id === order.id ? styles.row__active : ''
                  }
                >
                  <td className="text-center">{index + 1}</td>
                  <td>{order.order_key}</td>
                  <td>
                    {order.billing.first_name} {order.billing.last_name}
                  </td>
                  <td>{order.shipping.address_1}</td>
                  <td>
                    {order.currency} {order.total}
                  </td>
                  <td>
                    <span
                      className={`${styles['label__status']} ${
                        styles['label__status-' + order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                <FormattedMessage id="order.noData" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default OrdersTable;

/* eslint-disable */
OrdersTable.propTypes = {
  setActive: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired
};
/* eslint-enable */
