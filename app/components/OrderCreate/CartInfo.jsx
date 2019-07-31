import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import remove from 'lodash/remove';

import { formatCurr } from 'Modules/helper/utility';
import Input from 'shared_components/Input';
import Button from 'shared_components/Button';
import Dropdown from 'shared_components/Dropdown';
import styles from './styles.scss';

class CartInfo extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.onDeleteProduct = this.onDeleteProduct.bind(this);
  }

  onChange(e, idx, name) {
    const newValue = cloneDeep(this.props.detail);
    let newQty = e.value > 0 ? e.value : 1;

    if (newValue.listProduct[idx].manage_stock && newValue.listProduct[idx].stock_quantity < newQty) {
      newQty = parseInt(newValue.listProduct[idx].qty);
    }

    newValue.listProduct[idx][name] = newQty;
    newValue.listProduct[idx].subtotal = newQty * newValue.listProduct[idx].regular_price;

    this.props.onChange("listProduct", newValue.listProduct);
  }

  onDropdownChange(e, idx) {
    const newValue = cloneDeep(this.props.detail);
    const variations = find(newValue.listProduct[idx].variations, {id: e.value});
    const checkVariant = find(newValue.listProduct, { variantId: e.value });
    
    if (!checkVariant) {
      newValue.listProduct[idx] = {
        ...newValue.listProduct[idx],
        variantId: e.value,
        variantName: e.label,
        regular_price: variations.regular_price,
        subtotal: newValue.listProduct[idx].qty * variations.regular_price,
        stock_quantity: variations.stock_quantity,
        weight: variations.weight,
        manage_stock: !!variations.manage_stock,
      }
    } else {
      remove(newValue.listProduct, (n,i) => i === idx);
    }

    this.props.onChange("listProduct", newValue.listProduct);
  }
  
  onDeleteProduct(idx) {
    const newValue = cloneDeep(this.props.detail);

    remove(newValue.listProduct, (n,i) => i === idx);
    this.props.onChange("listProduct", newValue.listProduct);
  }

  render() {
    const { detail } = this.props;
    return (
      <div className={styles['order__cart-info']}>
        <div className={styles['order__cart-header']}>
          <h2><FormattedMessage id="order.cartInfo.title" /></h2>
        </div>
        <div className={styles['order__cart-body']}>
          <div className={styles['order__cart-customer']}>
            <FormattedMessage id="order.cartInfo.customer" />
            <b>: {detail.billing.customerName}</b>
          </div>
          <div className={styles['order__cart-product']}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th className={styles["w-100px"]}>Qty</th>
                  <th className={`text-right ${styles["w-140px"]}`}>Subtotal</th>
                  <th className={styles["w-50px"]} />
                </tr>
              </thead>
              <tbody>
                {detail.listProduct.length > 0 ? detail.listProduct.map((product,index) => {
                  const listVariations = [];
                  product.variations.map(variant => {
                    const nameVariant = variant.attributes.map((atr) => atr.option).join(' - ');
                    listVariations.push({ label: `${product.name} ( ${nameVariant} )`, value: variant.id });
                  });
                  return(
                  <tr key={index}>
                    <td>
                      {product.attributes.length > 0 ? (
                        <Dropdown
                          onChange={(name, e) => this.onDropdownChange(e,index)}
                          options={listVariations}
                          base={{
                            name: 'variant',
                            required: true,
                            value: product.variantId || '',
                          }}
                        />
                      ) : (
                        <span>{product.name}</span>
                      )}
                    </td>
                    <td>
                      <Input
                        onChange={e => this.onChange(e, index, 'qty')}
                        required
                        withLabel={false}
                        base={{
                          type: 'number',
                          name: 'qty',
                          disabled: product.attributes.length > 0 && !product.variantId,
                          value: product.qty
                        }}
                      />
                    </td>
                    <td className="text-right">
                      {formatCurr(product.subtotal)}
                    </td>
                    <td className={styles["order-product_delete"]}><i className="fa fa-trash text-danger" onClick={() => this.onDeleteProduct(index)} role="none" /></td>
                  </tr>
                )}) : (<tr><td colSpan="4" className="text-center"><FormattedMessage id="order.cartInfo.noData"/></td></tr>)}
              </tbody>
            </table>
          </div>
          <div className={styles['order__cart-footer']}>
            <table>
              <tbody>
                <tr>
                  <th><FormattedMessage id="order.cartInfo.subtotal" /></th>
                  <td>{formatCurr(detail.subtotal)}</td>
                </tr>
                <tr>
                  <th><FormattedMessage id="order.cartInfo.shippingFee" /></th>
                  <td>{formatCurr(detail.shippingFee)}</td>
                </tr>
                <tr className={styles["order__cart-total"]}>
                  <th><FormattedMessage id="order.cartInfo.total" /></th>
                  <td>{formatCurr(detail.total)}</td>
                </tr>
                <tr>
                  <td>
                    <div className="row">
                      <div className="col-md-6 p-r-5">
                        <Button
                          className="btn btn-default btn-cons"
                          onClick={this.props.onVoid}
                          isLoading={this.props.isFetching}
                        >
                          <FormattedMessage id="order.cartInfo.void" />
                        </Button>
                      </div>
                      <div className="col-md-6 p-l-5">
                        <Button
                          className="btn btn-default btn-cons"
                          base={{
                            type: 'submit'
                          }}
                          onClick={this.props.onSave}
                          isLoading={this.props.isFetching}
                        >
                          <FormattedMessage id="order.cartInfo.save" />
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Button
                      className="btn btn-primary btn-cons"
                      base={{
                        type: 'submit'
                      }}
                      onClick={this.props.onPay}
                      isLoading={this.props.isFetching}
                    >
                      <FormattedMessage id="order.cartInfo.pay" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } 
}

export default CartInfo;

/* eslint-disable */
CartInfo.propTypes = {
  detail: PropTypes.any,
  onChange: PropTypes.func,
  onVoid: PropTypes.func,
  onSave: PropTypes.func,
  onPay: PropTypes.func,
  isFetching: PropTypes.bool
};
/* eslint-enable */
