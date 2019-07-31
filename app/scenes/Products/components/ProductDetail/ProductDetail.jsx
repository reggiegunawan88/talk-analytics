import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import PropTypes from 'prop-types';

import { formatCurr, removeHtmlTag } from 'Modules/helper/utility';
import Quickview from 'shared_components/Quickview';
import styles from './styles.scss';

class ProductDetail extends Component {
  constructor(props) {
    super(props);

    this.onQuickviewClose = this.onQuickviewClose.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this.quickview);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAdding && !nextProps.isAdding) {
      this.quickview.closeQuickview();
    }
  }

  onQuickviewClose() {
    if (this.addImport) this.addImport.resetForm();
  }

  render() {
    const { product, variants } = this.props;
    const groupName = _.map(product.categories, function(list) {
      return list.name;
    }).join(', ');
    return (
      <Quickview
        customStyles={{ builder: styles.products_quickview }}
        hiddenToggle={true}
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
                <FormattedMessage id="products.detailProduct.title" />
              </a>
            </li>
          </ul>

          <div className="p-t-30">
            <div className="form-group">
              <label>
                <FormattedMessage id="products.detailProduct.name" />
              </label>
              <p>{product.name}</p>
            </div>
            <div className="form-group">
              <label>
                <FormattedMessage id="products.detailProduct.description" />
              </label>
              <p>{removeHtmlTag(product.description)}</p>
            </div>
            <div className={styles['detail__info--product']}>
              <li>
                <div>
                  <FormattedMessage id="products.detailProduct.price" />
                  <p>
                    <i>:</i>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: removeHtmlTag(product.price_html)
                      }}
                    />
                  </p>
                </div>
                <div>
                  <FormattedMessage id="products.detailProduct.stock" />
                  <p>
                    <i>:</i>
                    {product.manage_stock ? (
                      product.stock_quantity
                    ) : (
                      <FormattedMessage id="table.unlimited" />
                    )}
                  </p>
                </div>
              </li>
              <li>
                <div>
                  <FormattedMessage id="products.detailProduct.category" />
                  <p>
                    <i>:</i>
                    {groupName}
                  </p>
                </div>
              </li>
            </div>
          </div>
          <div className="p-t-20">
            <table className={`table ${styles.detail__product_variant}`}>
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id="products.detailProduct.varian" />
                  </th>
                  <th className="text-center">
                    <FormattedMessage id="products.detailProduct.weight" />
                  </th>
                  <th className="text-right">
                    <FormattedMessage id="products.detailProduct.price" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {variants.length > 0 ? (
                  variants.map((variant, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <ul className={styles.attribute_list}>
                            {variant.attributes.map((term, idx) => {
                              return (
                                <li key={idx}>
                                  {term.name} : {term.option}
                                </li>
                              );
                            })}
                          </ul>
                        </td>
                        <td className="text-center">{variant.weight}</td>
                        <td className="text-right">
                          {formatCurr(variant.regular_price)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      <FormattedMessage id="products.detailProduct.varianno" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Quickview>
    );
  }
}

export default ProductDetail;

/* eslint-disable */
ProductDetail.propTypes = {
  product: PropTypes.object,
  onRef: PropTypes.func.isRequired,
  variants: PropTypes.array
};
/* eslint-enable */
ProductDetail.defaultProps = {
  product: {},
  variants: {}
};
