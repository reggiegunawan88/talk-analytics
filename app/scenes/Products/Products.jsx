import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import InfiniteScroll from 'react-infinite-scroll-component';

import * as _ from 'lodash';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { fetchProducts } from 'Modules/products';
import {
  getProductVariant,
  deleteProduct,
  deleteVariantProduct
} from 'Modules/product';
import { formattedMessageHelper } from 'Modules/helper/utility';
import { paths } from 'Config';
import PageLoader from 'shared_components/PageLoader';
import Page from 'shared_components/Page';
import Panel from 'shared_components/Panel';
import Button from 'shared_components/Button';
import Icon from 'shared_components/Icon';
import ProductsTable from './components/ProductsTable';
import ProductDetail from './components/ProductDetail';
import getProductsState from './selector';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getProductsState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    { fetchProducts, getProductVariant, deleteProduct, deleteVariantProduct },
    dispatch
  );
  return dispatchFunc;
};

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pagination: {
        page: 1,
        size: 10
      },
      openDetail: false,
      detailOpen: false,
      isModalOpen: false,
      productDetail: {}
    };

    this.openDetailview = this.openDetailview.bind(this);
    this.openModal = this.openModal.bind(this);
    this.delete = this.delete.bind(this);
    this.closeActive = this.closeActive.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
  }

  componentDidMount() {
    this.props.fetchProducts(this.state.pagination);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isEditing) {
      this.props.history.push(paths.private.product_edit);
    }
  }

  fetchNextPage() {
    setTimeout(() => {
      if (this.props.products.hasMoreData) {
        const newVal = _.cloneDeep(this.state);
        newVal.pagination.page = this.state.pagination.page + 1;
        this.setState(newVal);
        this.props.fetchProducts(this.state.pagination);
      }
    }, 500);
  }

  openDetailview(open, e) {
    this.setState({ openDetail: open, productDetail: e });
    if (open) {
      this.props.getProductVariant(e.id);
      this.productsDetailview.openQuickview();
    } else {
      this.productsDetailview.closeQuickview();
    }
  }

  openModal(action, product = {}) {
    this.setState({ isModalOpen: action, productDetail: product });
  }

  async delete() {
    const productId = this.state.productDetail.id;
    await this.props.getProductVariant(productId);
    await this.props.listVariant.map(list => {
      this.props.deleteVariantProduct(productId, list.id);
    });
    await this.props.deleteProduct(productId);
    await this.openModal(false);
    this.props.fetchProducts({ page: 1, size: 10 });
  }

  closeActive() {
    this.setState({ openDetail: false, productDetail: {} });
  }

  render() {
    const { products, fetchingProduct } = this.props;
    const { list, isFetching, isAdding, hasMoreData } = products;

    return (
      <Page>
        <div className="page__title">
          <h3>
            <FormattedMessage id="products.title" />
          </h3>
        </div>
        <Panel noHeader>
          <Link
            className="btn btn-primary btn-cons pull-right"
            to={paths.private.product_new}
          >
            <Icon name="fa" className={`fa-plus ${styles.btn_icon}`} />
            <FormattedMessage id="products.addProduct.title" />
          </Link>
          <div id="scrollableDiv" className={styles.productsScroll}>
            <InfiniteScroll
              dataLength={list.length}
              next={this.fetchNextPage}
              hasMore={hasMoreData}
              loader={<PageLoader className="full-width padding-10" />}
            >
              <ProductsTable
                products={list}
                dataSize={list.length}
                isFetching={isFetching}
                pagination={this.state.pagination}
                isActive={this.state.openDetail}
                productActive={(open, e) => this.openDetailview(open, e)}
                isDelete={(e, product) => this.openModal(e, product)}
              />
            </InfiniteScroll>
          </div>
          <ProductDetail
            isAdding={isAdding}
            onRef={ref => {
              this.productsDetailview = ref;
            }}
            variants={this.props.listVariant}
            product={this.state.productDetail}
            onClose={this.closeActive}
          />
        </Panel>

        <Modal
          classNames={{ modal: styles['c-modal__normal'] }}
          open={this.state.isModalOpen}
          onClose={() => this.openModal(false)}
          center
        >
          <b>
            <FormattedMessage id="products.deleteProduct" />
          </b>
          <div>
            <p className="fg-shade m-t-20">
              <FormattedMessage id="products.areYouSureDelete" />
            </p>
            <div className="row">
              <div className="col-md-6">
                <Button
                  className="btn btn-danger btn-block"
                  isLoading={fetchingProduct}
                  onClick={this.delete}
                >
                  <FormattedMessage id="products.deleteYes" />
                </Button>
              </div>
              <div className="col-md-6">
                <Button
                  className="btn btn-primary btn-block btn-ghost"
                  onClick={() => this.openModal(false)}
                >
                  <FormattedMessage id="products.deleteCancel" />
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Products);

/* eslint-disable */
Products.propTypes = {
  fetchProducts: PropTypes.func.isRequired,
  getProductVariant: PropTypes.func.isRequired,
  products: PropTypes.any.isRequired,
  list: PropTypes.array,
  isEditing: PropTypes.bool.isRequired,
  history: PropTypes.any.isRequired,
  listVariant: PropTypes.any,
  deleteVariantProduct: PropTypes.func,
  deleteProduct: PropTypes.func,
  fetchingProduct: PropTypes.bool

};
/* eslint-enable */

Products.defaultProps = {
  list: []
};
