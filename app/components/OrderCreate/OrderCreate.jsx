import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import PropTypes from 'prop-types';

import { createOrder } from 'Modules/orders';
import { getCustomers } from 'Modules/customers';
import { getProvinces, getCities, getSubDistricts } from 'Modules/location';
import { getShipping } from 'Modules/rajaongkir';
import { fetchProducts } from 'Modules/products';
import { fetchCategories } from 'Modules/categories';
import Alert from 'shared_components/Alert';
import getDataOrder from './selector';
import styles from './styles.scss';
import Customer from './Customer';
import CartInfo from './CartInfo';
import Shipping from './Shipping';
import Products from './Products';

const mapStateToProps = state => {
  const stateProps = getDataOrder(state);
  return stateProps;
} 

const defaultState = { 
  order: {
    billing: {},
    shipping: {},
    listProduct: [],
    isBilling: true,
    subtotal: 0,
    shippingFee: 0,
    weight: 0,
    total: 0,
  },
  activeTab: 'customer',
};
const defaultPagination = { page: 1, size: 10 };

class OrderCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...defaultState,
      productPagination:{
        page: 1,
        size: 10,
      },
      categoryPagination:{
        page: 1,
        size: 10,
      },
      tabs: ['customer','shipping','products'],
      showAlert: false,
      alertText: '',

    }

    this.onChange = this.onChange.bind(this);
    this.changeActiveTab = this.changeActiveTab.bind(this);
    this.renderActiveTabContent = this.renderActiveTabContent.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.onVoid = this.onVoid.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onPay = this.onPay.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.validationForm = this.validationForm.bind(this);
    this.modalChange = this.modalChange.bind(this);
    this.fetchNextProducts = this.fetchNextProducts.bind(this);
    this.saveOrder = this.saveOrder.bind(this);
  }

  componentDidMount() {
    const { categoryPagination, productPagination } = this.state;

    this.props.getProvinces();
    this.props.fetchCategories(categoryPagination);
    this.props.fetchProducts(productPagination);
  }

  componentDidUpdate() {
    if (this.state.order.billing.customerId && this.props.isChatRoom && this.props.customerData.biodata && this.state.order.billing.customerId !== this.props.customerData.biodata._id) {
      this.setState({ ...defaultState });
    }
  }
  
  onChange(name, value, callback = () => {}) {
    const newValue = cloneDeep(this.state);
    newValue.order[name] = value;

    if (name === "billing" && newValue.order.isBilling) {
      newValue.order.shipping = { ...value };
    }

    if (name === "shipping" && newValue.order.isBilling) {
      newValue.order.billing = value;
    }

    let newsubtotal = 0;
    let weight = 0;

    newValue.order.listProduct.map(product => {
      newsubtotal += parseInt( product.subtotal );
      weight += parseInt( product.weight ) * product.qty;
    });

    weight = weight > 1000 ? weight : 1000;
    let fee = 0;

    if (newValue.order.shipping.shippingAgentId) {
      const getCost = find(this.props.rajaongkir.listShipping, { value: newValue.order.shipping.shippingAgentId });
      fee = getCost.cost;
    }

    const shippingfee = fee * ( Math.ceil(weight/1000));
    
    newValue.order = {
      ...newValue.order,
      subtotal: newsubtotal,
      weight,
      shippingFee: shippingfee,
      total: newsubtotal+shippingfee
    }

    this.setState(newValue, () => callback());
  }

  onVoid() {
    this.setState({ ...defaultState });
    this.props.modalChange();
  }

  onSave() {
    this.validationForm(() => { 
      this.saveOrder("pending");
    });
  }

  onPay() {
    this.validationForm(() => {
      this.saveOrder("processing")
    });
  }

  getProducts(idcategory) {
    let filter = {};

    if (idcategory) {
      filter = { category: idcategory };
    }

    this.setState({ productPagination: defaultPagination });
    this.props.fetchProducts({ ...defaultPagination, ...filter });
  }

  async saveOrder(paymentStatus) {
    if (!this.state.showAlert) {
      const { modalChange,submitClose,isChatRoom } = this.props;

      await this.props.createOrder(this.state.order, paymentStatus);
      this.setState({ ...defaultState });

      if (isChatRoom) {
        modalChange();
      }else{
        submitClose();
      }
    }
  }
  
  fetchNextProducts(idcategory) {
    let filter = {};

    if (idcategory !== "all") {
      filter = { category: idcategory };
    }

    setTimeout(() => {
      if (this.props.products.hasMoreData) {
        const newVal = cloneDeep(this.state);
        newVal.productPagination.page = this.state.productPagination.page + 1;
        this.setState(newVal);
        this.props.fetchProducts({ ...newVal.productPagination, ...filter });
      }
    }, 500);
  }

  modalChange() {
    this.setState({
      activeTab: 'customer',
    });
    this.props.modalChange();
  }

  validationForm(callback = () => {}) {
    if (!this.state.order.billing.customerId) {
      return this.setState({ activeTab: 'customer', showAlert: true, alertText: (<FormattedMessage id='notif.order.errorCustomer' />) });
    }

    const shippingRequired = [ 'firstName','lastName','address','province','city','subdistrict','shippingAgent' ];
    const emptyField = [];

    Object.keys(shippingRequired).map(key => {
      const keyName = shippingRequired[key];
      if (!this.state.order.shipping[keyName]) {
        emptyField.push(keyName);
      }
    });

    if (emptyField.length > 0) {
      return this.setState({ activeTab: 'shipping', showAlert: true, alertText: emptyField });
    }

    if (this.state.order.listProduct.length < 1) {
      return this.setState({ activeTab: 'products', showAlert: true, alertText: (<FormattedMessage id='notif.order.errorProducts' />) });
    }

    return callback();
  }

  changeActiveTab(tab) {
    this.setState({ activeTab: tab });
  }
  
  closeAlert() {
    this.setState({ showAlert: false });
  }

  renderActiveTabContent() {
    const { activeTab, order } = this.state;
    const { customer, location, products, categories, rajaongkir, isChatRoom, customerData } = this.props;
    const tab = {
      customer: (<Customer 
                  detail={order} 
                  onChange={this.onChange} 
                  customer={customer} 
                  isFetching={this.props.isFetching} 
                  getCustomers={this.props.getCustomers}
                  isChatRoom={isChatRoom}
                  customerData={customerData.biodata}
                />),
      shipping: (<Shipping 
                  detail={order} 
                  onChange={this.onChange} 
                  location={location} 
                  rajaongkir={rajaongkir} 
                  fetchCities={this.props.getCities} 
                  fetchSubdistricts={this.props.getSubDistricts} 
                  fetchShipping={this.props.getShipping}
                />),
      products: (<Products 
                  detail={order} 
                  onChange={this.onChange} 
                  products={products} 
                  categories={categories}
                  getProducts={this.getProducts}
                  fetchNextProducts={this.fetchNextProducts}
                />),
    }
    
    return tab[activeTab];
  }

  render() {
    const { order } = this.state;
    const { isModalOpen } = this.props;

    return (
      <Modal
        classNames={{ modal: styles['c-modal_full'] }}
        open={isModalOpen}
        onClose={this.modalChange}
        center
      >
        <Alert onHide={this.closeAlert} showAlert={this.state.showAlert}>
          {this.state.showAlert && (this.state.activeTab === "shipping" && this.state.alertText.length > 0 ? (
            <ul>
              {this.state.alertText.map((text,index) => (<li key={index}><FormattedMessage id={`order.shipping.${text}`} /> <FormattedMessage id='order.shipping.isRequired' /> </li>))}
            </ul>
          ) : (<p>{this.state.alertText}</p>))}
        </Alert>
        <div className="row p-t-40 full-height">
          <div className="col-md-6 full-height">
            <form
              className="modal-form full-height"
              onSubmit={this.submit}
            >
              <div className="panel panel-default full-height">
                <div className="panel-body padding-20">
                  <ul
                    className={`nav nav-tabs nav-tabs-simple ${
                      styles['c-management__tab']
                      }`}
                  >
                    {this.state.tabs.map(tab => (
                      <li
                        role="none"
                        className={`nav-item ${
                          this.state.activeTab === tab ? 'active' : ''
                          }`}
                        key={`${tab}-tab`}
                        onClick={() => this.changeActiveTab(tab)}
                      >
                        <a>
                          <FormattedMessage id={`order.${tab}.title`} />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className={styles["tab-body"]}>
                    {this.renderActiveTabContent()}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-6 full-height">
            <CartInfo detail={order} isFetching={this.props.userOrder.isFetching} onChange={this.onChange} onVoid={this.onVoid} onSave={this.onSave} onPay={this.onPay} />
          </div>
        </div>
      </Modal>
    );
  }
}


export default connect(mapStateToProps, { getCustomers, getProvinces, getCities, getSubDistricts, getShipping, fetchCategories, fetchProducts, createOrder })(OrderCreate);

/* eslint-disable */
OrderCreate.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  modalChange: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  getCustomers: PropTypes.func.isRequired,
  getProvinces: PropTypes.func.isRequired,
  getCities: PropTypes.func.isRequired,
  getSubDistricts: PropTypes.func.isRequired,
  getShipping: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  createOrder: PropTypes.func.isRequired,
  submitClose: PropTypes.func,
  customer: PropTypes.any,
  location: PropTypes.any,
  products: PropTypes.any,
  categories: PropTypes.any,
  rajaongkir: PropTypes.any,
  isChatRoom: PropTypes.bool,
  customerData:  PropTypes.any,
  userOrder:  PropTypes.any
};
/* eslint-enable */
