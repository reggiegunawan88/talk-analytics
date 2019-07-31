import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import PageLoader from 'shared_components/PageLoader';
import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import styles from './styles.scss';

const defaultPagination = { page: 1, size: 20 };
class Customer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      customerPagination:{
        page: 1,
        size: 20,
      },
    }

    this.onChange = this.onChange.bind(this);
    this.chooseCustomer = this.chooseCustomer.bind(this);
    this.fetchNextCustomer = this.fetchNextCustomer.bind(this);
  }

  componentDidMount() {
    if (this.props.isChatRoom && !this.props.detail.billing.customerId) {
      this.chooseCustomer(this.props.customerData);
    }
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    const { getCustomers } = this.props;
    newValue[name] = value;
    newValue.customerPagination = defaultPagination;

    this.setState(newValue);
    setTimeout(() => {
      getCustomers(value, defaultPagination);
    }, 2000);
  }

  chooseCustomer(detail) {
    const [ firstname, ...lastName ] = detail.name.split(' ');
    const { isBilling, shipping } = this.props.detail;
    const shippingInfo = isBilling ? shipping : {};
    const billing = {
      province: detail.province,
      city: detail.city,
      subdistrict: detail.subdistrict,
      ...shippingInfo,
      email: detail.email,
      customerId: detail._id,
      customerName: detail.name,
      firstName: firstname,
      lastName: lastName.join(" "),
      address: detail.address,
      zipCode: detail.zipcode,
      phone: detail.phone,
    }

    this.props.onChange('billing', billing);
    this.setState({ keyword: '' });
  }

  fetchNextCustomer() {
    setTimeout(() => {
      if (this.props.customer.hasMoreData) {
        const newVal = cloneDeep(this.state);
        newVal.customerPagination.page = this.state.customerPagination.page + 1;

        this.setState(newVal);
        this.props.getCustomers(newVal.keyword, newVal.customerPagination);
      }
    }, 500);
  }

  render() {
    const { isFetching, customer, detail, isChatRoom } = this.props;
    const { customerId, firstName, lastName, address, province, city, subdistrict, zipCode, phone } = detail.billing;
    const { customers, hasMoreData } = customer;
    const { keyword } = this.state;

    return (
      <div className={styles["customer-panel"]} >
        {!isChatRoom && (
          <Input
            onChange={this.onChange}
            withLabel={false}
            placeholderId='order.customer.chooseCustomer'
            base={{
              name: 'keyword',
              disabled: isFetching,
              value: keyword,
            }}
          />
        )}
        <div className={styles["order__customer-table"]} id="customerView">
          <InfiniteScroll
            dataLength={customers.length}
            next={this.fetchNextCustomer}
            hasMore={hasMoreData}
            loader={<PageLoader className="full-width padding-10" />}
            scrollableTarget="customerView"
          >
          {keyword !== "" && customers && !isChatRoom && !customers.isFetching && (
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Customer Name</th>
                  <th>Email</th> 
                  <th>Phone</th>
                  <th/>
                </tr>
              </thead>
              <tbody>
                {customers.map((data,index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{data.name}</td>
                    <td>{data.email}</td>
                    <td>{data.phone}</td>
                    <td><Button base={{ type: "button" }} className="btn btn-primary btn-sm" onClick={(e) => { e.preventDefault();this.chooseCustomer(data); }}><FormattedMessage id="order.customer.choose" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {customerId && !keyword && (
            <div className={styles["order__customer-billing"]}>
              <div className={styles["order__customer-header"]}>
                <FormattedMessage id="order.customer.billing" />
              </div>
              <table>
                <tbody>
                  <tr>
                    <th>First Name</th>
                    <td><i>:</i> {firstName}</td>
                  </tr>
                  <tr>
                    <th>Last Name</th>
                    <td><i>:</i> {lastName}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td><i>:</i> {address}</td>
                  </tr>
                  <tr>
                    <th>Province</th>
                    <td><i>:</i> {province}</td>
                  </tr>
                  <tr>
                    <th>City</th>
                    <td><i>:</i> {city}</td>
                  </tr>
                  <tr>
                    <th>Subdistrict</th>
                    <td><i>:</i> {subdistrict}</td>
                  </tr>
                  <tr>
                    <th>Zip Code</th>
                    <td><i>:</i> {zipCode}</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td><i>:</i> {phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default Customer;

/* eslint-disable */
Customer.propTypes = {
  getCustomers: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  fetchNextCustomer: PropTypes.func,
  isFetching: PropTypes.bool,
  customer: PropTypes.any, 
  detail: PropTypes.any,
  isChatRoom: PropTypes.bool,
  customerData: PropTypes.any,
};
/* eslint-enable */
