import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import Button from 'shared_components/Button';
import Icon from 'shared_components/Icon';
import { removeHtmlTag } from 'Modules/helper/utility';
import { getProductDetail } from 'Modules/product';
import styles from './styles.scss';

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators({ getProductDetail }, dispatch);
  return dispatchFunc;
};

class ProductsTableRow extends Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
  }

  handleToggle() {
    const { activeProductId, setActive, product } = this.props;
    if (activeProductId === product.id) {
      setActive('', false, {});
    } else {
      setActive(product.id, true, product);
    }
  }

  edit() {
    this.props.getProductDetail(this.props.product.id);
  }

  delete() {
    this.props.isDelete(true, this.props.product);
  }

  render() {
    const { product, activeProductId, noData } = this.props;
    const isActive = activeProductId === product.id;

    const groupName = _.map(product.categories, function(list) {
      return list.name;
    }).join(', ');

    return (
      <tr
        className={`${activeProductId === product.id && styles.row__active} ${
          styles.row
        }`}
      >
        <td className="v-align-middle text-center" onClick={this.handleToggle}>
          <p>{noData}</p>
        </td>
        <td className="v-align-middle" onClick={this.handleToggle}>
          {product.images !== undefined ? (
            <img alt="product" src={product.images[0].src} />
          ) : (
            <p>No Image</p>
          )}
        </td>
        <td className="v-align-middle" onClick={this.handleToggle}>
          <p>{product.name}</p>
        </td>
        <td className="v-align-middle" onClick={this.handleToggle}>
          <p>{groupName}</p>
        </td>
        <td className="v-align-middle" onClick={this.handleToggle}>
          <p>
            {product.manage_stock ? (
              product.stock_quantity
            ) : (
              <FormattedMessage id="table.unlimited" />
            )}
          </p>
        </td>
        <td className="v-align-middle" onClick={this.handleToggle}>
          <p>{product.total_sales}</p>
        </td>
        <td className="v-align-middle" onClick={this.handleToggle}>
          <p
            dangerouslySetInnerHTML={{
              __html: removeHtmlTag(product.price_html)
            }}
          />
        </td>
        <td className="text-right v-align-middle">
          <Button className="btn btn-link" onClick={this.edit}>
            <span className="text-primary">
              <i className="fa fa-pencil m-r-5" />
              <FormattedMessage id="products.edit" />
            </span>
          </Button>
          <Button className="btn btn-link" onClick={this.delete}>
            <span className="text-primary">
              <i className="fa fa-trash m-r-5" />
              <FormattedMessage id="products.delete" />
            </span>
          </Button>
        </td>
      </tr>
    );
  }
}

export default injectIntl(
  connect(
    null,
    mapDispatchToProps
  )(ProductsTableRow)
);

/* eslint-disable */
ProductsTableRow.propTypes = {
  product: PropTypes.any.isRequired,
  activeProductId: PropTypes.any,
  setActive: PropTypes.func.isRequired,
  intl: PropTypes.any.isRequired,
  getProductDetail: PropTypes.func.isRequired
};
/* eslint-enable */

ProductsTableRow.defaultProps = {
  activeProductId: undefined
};
