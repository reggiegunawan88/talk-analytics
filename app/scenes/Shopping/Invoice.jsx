import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import { dateDefaultFormat, formatCurr } from 'Modules/helper/utility';
import { configValues, paths } from 'Config';
import styles from './styles.scss';

class Invoice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bankName: 'BCA',
      bankAccount: '243-0107171',
      bankAccName: 'PT TALKABOT TEKNOLOGI INDONESIA',
    }
  }

  render() {
    const { statusUpgrade, invoiceData, plans } = this.props;
    const invoiceList = statusUpgrade ? [invoiceData] : invoiceData;
    
    return (
      <div key={this.props.key} className={`${styles.invoice__area} ${this.props.className}`}>
        <div className={styles['invoice__area-header']}>
          <img 
            src={configValues.IMG.LOGO_FULL_IMAGE}
            alt=""
            className="pull-left"
          />
          <h2 className="text-right">
            <FormattedMessage id={`shopping.${statusUpgrade ? 'invoice' : 'invoiceList'}`} />
            <span>{statusUpgrade ? `#${invoiceData.invoiceId}` : this.props.channelName}</span>
          </h2>
        </div>
        {statusUpgrade && (
        <div className={styles['invoice__customer-info']}>
          <label htmlFor='invoice info'>
            <FormattedMessage id='shopping.invoiceTo' />
          </label>
          <span>{this.props.channelName}</span>
        </div>
        )}
        <div className={styles['invoice__list-table']}>
          <table className="table no-footer">
            <thead>
              <tr>
                <th><FormattedMessage id="shopping.package" /></th>
                <th><FormattedMessage id="shopping.invoiceBill" /></th>
                <th><FormattedMessage id="shopping.invoiceDate" /></th>
                <th><FormattedMessage id="shopping.invoiceDueDate" /></th>
                <th><FormattedMessage id="shopping.status" /></th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((data,index) => {
                const getDataPlan = plans.find((p) => p.id === data.plan);
                const invoiceDate = dateDefaultFormat(data.lastPaidDate,'MMMM Do YYYY');
                const dueDate = dateDefaultFormat(data.tolerancePaidDate,'MMMM Do YYYY');
                return (
                  <tr key={index}>
                    <td>
                      <img
                        height="24"
                        src={`/img/icon/shopping/${getDataPlan && getDataPlan.id}.png`}
                        alt=""
                        className="m-r-10"
                      />
                      <b>{getDataPlan && getDataPlan.name}</b>
                    </td>
                    <td>{formatCurr(data.amount)}</td>
                    <td>{invoiceDate}</td>
                    <td>{dueDate}</td>
                    <td className={`bold ${data.isPaid ? "text-success" : "text-danger"}`}>
                      <FormattedMessage id={data.isPaid ? 'shopping.paid' : 'shopping.unpaid'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {statusUpgrade && (
          <div>
            <div className={styles['invoice__transfer-action']}>
              <Link to={paths.private.chatRoom}  className="btn btn-primary pull-right">
                <FormattedMessage id="shopping.proceedPayment" />
              </Link>
              <div className={styles['invoice__transfer-info']}>
                <p><FormattedMessage id="shopping.transferTo" /></p>
                <p>{this.state.bankName} {this.state.bankAccount}</p>
                <p>{this.state.bankAccName}</p>
              </div>
            </div>
            <div className="alert alert-warning m-t-20">
              <FormattedHTMLMessage id="shopping.cautionInvoice" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Invoice;

/* eslint-disable */
Invoice.propTypes = {
  invoiceData: PropTypes.any,
  key: PropTypes.string,
  className: PropTypes.string,
  channelName: PropTypes.string,
  plans: PropTypes.array,
  statusUpgrade: PropTypes.bool.isRequired,
};
/* eslint-enable */

Invoice.defaultProps = {
  plans: [],
  invoiceData: {},
  key: '',
  className: '',
  channelName: '',
};
