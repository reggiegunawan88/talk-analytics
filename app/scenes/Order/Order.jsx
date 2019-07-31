import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import PageLoader from 'shared_components/PageLoader';
import { formattedMessageHelper } from 'Modules/helper/utility';
import { getOrderList, setFilteredOrder, getOrderNote } from 'Modules/orders';
import Page from 'shared_components/Page';
import Dropdown from 'shared_components/Dropdown';
import Button from 'shared_components/Button';import OrderCreate from 'shared_components/OrderCreate';
import getOrderState from './selector';
import OrdersTable from './components/OrdersTable';
import OrderDetail from './components/OrderDetail';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getOrderState(state);
  return stateProps;
};

class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      optionFilter: [
        {
          label: formattedMessageHelper('order.allStatus'),
          value: 'all'
        },
        {
          label: formattedMessageHelper('order.finished'),
          value: 'completed'
        },
        {
          label: formattedMessageHelper('order.onGoing'),
          value: 'processing'
        },
        {
          label: formattedMessageHelper('order.canceled'),
          value: 'cancelled'
        }
      ],
      activeOrder: {},
      isModalOpen: false,
      pagination: {
        page: 1,
        size: 10
      }
    };

    this.changeFilter = this.changeFilter.bind(this);
    this.setActive = this.setActive.bind(this);
    this.closeActive = this.closeActive.bind(this);
    this.modalChange = this.modalChange.bind(this);
    this.submitClose = this.submitClose.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
  }

  componentDidMount() {
    this.props.getOrderList(this.state.pagination);
  }

  setActive(active, order) {
    const orderData = active ? order : {};

    if (active || (!active && this.state.activeOrder.id !== undefined)) {
      this.setState({ activeOrder: orderData });
    }
    if (active) {
      this.props.getOrderNote(orderData.id);
      this.orderDetail.openQuickview();
    } else {
      this.orderDetail.closeQuickview();
    }
  }

  fetchNextPage() {
    const { hasMoreData } = this.props;

    setTimeout(() => {
      if (hasMoreData) {
        const newVal = cloneDeep(this.state);
        newVal.pagination.page = this.state.pagination.page + 1;
        
        this.setState(newVal);
        this.props.getOrderList(this.state.pagination);
      }
    }, 500);
  }

  changeFilter(name, { value }) {
    this.props.setFilteredOrder(value);
  }

  closeActive() {
    this.setState({ activeOrder: {} });
  }

  modalChange() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  submitClose(){
    this.props.getOrderList({
      page: 1,
      size: 10
    });
    this.modalChange();
  }

  render() {
    const { orders, filter, filteredOrder, hasMoreData, notesDetail } = this.props;

    return (
      <Page>
        <div className="page__title">
          <h3>
            <FormattedMessage id="order.title" />
          </h3>
        </div>
        <div className="row">
          <div className={`col-md-9`}>
            <div className="text-left m-b-20">
              <Button
                className="btn btn-primary btn-cons"
                onClick={this.modalChange}
              >
                <i className="pg pg-plus m-r-5" />
                <FormattedMessage id="order.create" />
              </Button>
            </div>
          </div>
          <div className={`col-md-3 ${styles.header__filter}`}>
            <Dropdown
              onChange={this.changeFilter}
              options={this.state.optionFilter}
              label={formattedMessageHelper('order.filterBy')}
              base={{
                name: 'filter',
                required: false,
                value: this.props.filter
              }}
            />
          </div>
        </div>
        <InfiniteScroll
          dataLength={orders.length}
          next={this.fetchNextPage}
          hasMore={hasMoreData}
          loader={filter === "all" && <PageLoader className="full-width padding-10" />}
        >
          <OrdersTable
            status={filter}
            orders={
              filteredOrder.length > 0 || filter !== 'all' ? filteredOrder : orders
            }
            setActive={this.setActive}
            activeOrder={this.state.activeOrder}
          />
        </InfiniteScroll>
        
        <OrderDetail
          order={this.state.activeOrder}
          onRef={ref => {
            this.orderDetail = ref;
          }}
          onClose={this.closeActive}
          notesDetail={notesDetail}
        />
        <OrderCreate
          isModalOpen={this.state.isModalOpen}
          modalChange={this.modalChange}
          isChatRoom={false}
          submitClose={this.submitClose}
          customerData
        />
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  { getOrderList, setFilteredOrder, getOrderNote }
)(Order);

/* eslint-disable */
Order.propTypes = {
  getOrderList: PropTypes.func.isRequired,
  setFilteredOrder: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  orders: PropTypes.array.isRequired,
  filteredOrder: PropTypes.array.isRequired,
  getOrderNote: PropTypes.func.isRequired,
  notesDetail: PropTypes.string,
  filter: PropTypes.any,
  hasMoreData: PropTypes.bool,
};
/* eslint-enable */

Order.defaultProps = {
  filter: {},
  hasMoreData: false,
  notesDetail: '',
};
