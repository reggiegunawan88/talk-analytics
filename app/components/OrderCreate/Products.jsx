import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';

import { configValues } from 'Config';
import { formattedMessageHelper, removeHtmlTag } from 'Modules/helper/utility';
import Dropdown from 'shared_components/Dropdown';
import PageLoader from 'shared_components/PageLoader';
import styles from './styles.scss';

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'all',
      categoriesList: [],
      productClicked: '',
    }

    this.onDropdownChange = this.onDropdownChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    if (this.props.categories.categories) {
      const categorieslist= [{
        label: formattedMessageHelper('order.products.allProducts'),
        value: "all",
      }];

      this.props.categories.categories.map(data => {
        categorieslist.push({ label: data.name , value: data.id });
      });

      this.setState({ categoriesList: categorieslist });
    }
  }

  onDropdownChange(name, e) {
    const filterCategory = e.value !== "all" && e.value;

    this.setState({ filter: e.value });
    this.props.getProducts(filterCategory);
  }

  onClick(detail) {
    const newValue = cloneDeep(this.props.detail);
    const subtotal = detail.attributes.length > 0 ? detail.price : detail.regular_price;
    let prodDuplicate = -1;
    let variantFirst = {};

    this.setState({ productClicked: detail.id });
    if (detail.attributes.length > 0) {
      detail.variations.map((variant,index) => {
        const checkVariant = findIndex(newValue.listProduct, {variantId: variant.id}) < 0;

        if (checkVariant && !variantFirst.variantId) {
          variantFirst = {
            variantId: variant.id,
            regular_price: variant.regular_price,
            subtotal: variant.regular_price,
            stock_quantity: variant.stock_quantity,
            weight: variant.weight,
            manage_stock: !!variant.manage_stock,
          };
        } else if ( index + 1 === detail.variations.length && !variantFirst.variantId ) {
          prodDuplicate = 0;
        }
      });
    } else {
      prodDuplicate = findIndex(newValue.listProduct, { id:detail.id });
    }

    if (prodDuplicate < 0) {
      newValue.listProduct.push({ ...detail, qty: 1, subtotal, ...variantFirst });
    }

    this.props.onChange('listProduct', newValue.listProduct);
  }

  render() {
    const { categories, products } = this.props;
    const { filter, categoriesList } = this.state;

    return (
      <div className={styles["customer-panel"]}>
        <div className={styles["order__product-filter"]}>
          <div className={'form-group'}>
            <div>
              <Dropdown
                onChange={this.onDropdownChange}
                options={categoriesList}
                base={{
                  name: 'province',
                  value: filter,
                  disabled: categories.isFetching,
                }}
              />
            </div>
          </div>
        </div>
        <div className={`row ${styles["order__product-list"]}`} id="productsView">
          <InfiniteScroll
            dataLength={products.list.length}
            next={() => this.props.fetchNextProducts(filter)}
            hasMore={products.hasMoreData}
            loader={<PageLoader className={`full-width padding-10 ${styles.loader}`} />}
            scrollableTarget="productsView"
          >
          {!products.isFetching ? (
            products.list.map(data => (
            <div key={data.id} className={`col-md-4 ${styles["order__product-sort"]}`}>
              <div 
                className={`${styles["order__product-single"]} ${this.state.productClicked === data.id && styles["order__product-active"]}`}
                onClick={() => this.onClick(data)}
                role="none"
              >
                <div className={styles["order__product-thumbnail"]}>
                  <img src={data.images ? data.images[0].src : configValues.IMG.LOGO_NO_IMAGE} alt={data.name} />
                </div>
                <div className={styles["order__product-info"]}>
                  <h4>{data.name}</h4>
                  {data.price_html ? (<span dangerouslySetInnerHTML={{__html: removeHtmlTag(data.price_html) }} />) : (<span>Rp-</span>)}
                </div>
              </div>
            </div>
          ))) : ( <PageLoader className="m-t-100" /> )}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default Products;

/* eslint-disable */
Products.propTypes = {
  categories: PropTypes.any,
  products: PropTypes.any,
  getProducts: PropTypes.func,
  onChange: PropTypes.func,
  detail: PropTypes.any,
  fetchNextProducts: PropTypes.func
};
/* eslint-enable */
