import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import PageLoader from 'shared_components/PageLoader';
import Page from 'shared_components/Page';
import Button from 'shared_components/Button';
import { getCustomers } from 'Modules/customers';
import getCustomerState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getCustomerState(state);
  return stateProps;
};

class Customers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      custInfo: {},
      isModalOpen: false,
      pagination: {
        page: 1,
        size: 20
      }
    };

    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
  }

  componentDidMount() {
    this.props.getCustomers('',this.state.pagination);
  }

  showModal(dataEdit = {}) {
    this.setState({ isModalOpen: true, custInfo: dataEdit });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  fetchNextPage() {
    const { hasMoreData } = this.props;

    setTimeout(() => {
      if (hasMoreData) {
        const newVal = cloneDeep(this.state);
        newVal.pagination.page = this.state.pagination.page + 1;

        this.setState(newVal);
        this.props.getCustomers('',this.state.pagination);
      }
    }, 500);
  }

  render() {
    const { customers, hasMoreData } = this.props;
    
    return (
      <Page>
        <div className="page__title">
          <h3><FormattedMessage id="customers.titlePage" /></h3>
        </div>
        <Modal
          classNames={{ modal: styles['c-modal__normal'] }}
          open={this.state.isModalOpen}
          onClose={this.closeModal}
          center
        >
          <b>
            <FormattedMessage id="customers.titleDetail" />
            &nbsp;{this.state.custInfo.name}
          </b>
          <br />
          <table className={`${styles['c-modal__detail']} table m-t-10`}>
            <tbody>
              <tr>
                <td>
                  <FormattedMessage id="customers.name" />
                </td>
                <td>{this.state.custInfo.name}</td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage id="customers.gender" />
                </td>
                <td>{this.state.custInfo.gender}</td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage id="customers.birthDate" />
                </td>
                <td>{this.state.custInfo.birthdate}</td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage id="customers.address" />
                </td>
                <td>{this.state.custInfo.address}</td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage id="customers.phone" />
                </td>
                <td>{this.state.custInfo.phone}</td>
              </tr>
              <tr>
                <td>
                  <FormattedMessage id="customers.email" />
                </td>
                <td>{this.state.custInfo.email}</td>
              </tr>
            </tbody>
          </table>
        </Modal>
        <InfiniteScroll
          dataLength={customers.length}
          next={this.fetchNextPage}
          hasMore={hasMoreData}
          loader={<PageLoader className="full-width padding-10" />}
        >
          <table className="table table-striped">
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="customers.no" />
                </th>
                <th>
                  <FormattedMessage id="customers.name" />
                </th>
                <th>
                  <FormattedMessage id="customers.gender" />
                </th>
                <th>
                  <FormattedMessage id="customers.birthDate" />
                </th>
                <th>
                  <FormattedMessage id="customers.address" />
                </th>
                <th>
                  <FormattedMessage id="customers.phone" />
                </th>
                <th>
                  <FormattedMessage id="customers.email" />
                </th>
                <th>
                  <FormattedMessage id="customers.detail" />
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((list, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{list.name}</td>
                    <td>{list.gender}</td>
                    <td>{list.birthdate}</td>
                    <td>{list.address}</td>
                    <td>{list.phone}</td>
                    <td>{list.email}</td>
                    <td className="text-right">
                      <Button
                        className="btn btn-link"
                        onClick={() => this.showModal(list)}
                      >
                        <span className="text-primary">
                          <i className="fa fa-search m-r-5" />
                          <FormattedMessage id="customers.detail" />
                        </span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    <FormattedMessage id="customers.emptyList" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  { getCustomers }
)(Customers);

/* eslint-disable */
Customers.propTypes = {
  getCustomers: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  hasMoreData: PropTypes.bool.isRequired,
  customers: PropTypes.array,
};
/* eslint-enable */

Customers.defaultProps = {
  customers: [],
};
