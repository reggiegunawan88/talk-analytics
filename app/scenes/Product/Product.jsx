import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import propTypes from 'prop-types';
import * as _ from 'lodash';

import Page from 'shared_components/Page';
import Button from 'shared_components/Button';
import paths from 'Config/paths';
import { validateProduct, setInitialState } from 'Modules/product';
import getProductState from './selector';
import ProductData from './components/ProductData';
import Variant from './components/Variant';
import ProductDetails from './components/ProductDetails';
import styles from './styles.scss';

const mapStateToProps = state => {
  const stateProps = getProductState(state);
  return stateProps;
};

class Product extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.setParam = this.setParam.bind(this);
    this.state = {
      productPost: this.props.product
    };
  }

  componentDidMount() {
    if (
      this.props.location.pathname === paths.private.product_edit &&
      !this.props.product.isFetching &&
      !this.props.product.id
    ) {
      this.props.history.push(paths.private.products);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.product.successfullyAdded &&
        !this.props.product.successfullyAdded) ||
      (nextProps.product.successfullyEdited &&
        !this.props.product.successfullyEdited)
    ) {
      this.props.history.push(paths.private.products);
    }
  }

  componentWillUnmount() {
    this.props.setInitialState();
  }

  submit(e) {
    e.preventDefault();
    this.props.validateProduct(this.state.productPost);
  }

  setParam({ name, value }) {
    let newValue = _.cloneDeep(this.state);
    newValue.productPost[name] = value;
    this.setState(newValue);
  }

  handleType() {
    const { locale } = this.props;
    if (this.state.productPost.type === 'simple') {
      return (
        <ProductDetails
          locale={locale}
          productPost={this.state.productPost}
          setParam={e => this.setParam(e)}
        />
      );
    }
    return (
      <Variant
        locale={locale}
        productPost={this.state.productPost}
        setParam={e => this.setParam(e)}
      />
    );
  }

  render() {
    const { product, locale } = this.props;
    return (
      <Page>
        <div className="page__title">
          <h3>
            {!product.isEditing ? (
              <FormattedMessage id="product.addProduct" />
            ) : (
              <FormattedMessage id="product.updateProduct" />
            )}
          </h3>
        </div>
        <form className={styles['product__panel']} onSubmit={this.submit}>
          <ProductData
            locale={locale}
            productPost={this.state.productPost}
            setParam={e => this.setParam(e)}
          />
          {this.handleType()}
          <div className="col-md-10 padding-0 m-b-15 col-md-offset-1">
            <hr />
            <Button
              className="btn btn-cons btn-primary pull-right"
              onClick={this.submit}
              isLoading={product.isFetching}
            >
              {!product.isEditing ? (
                <span>
                  <i className="pg pg-plus m-r-5" />
                  <FormattedMessage id="product.addProduct" />
                </span>
              ) : (
                <span>
                  <i className="fa fa-pencil m-r-5" />
                  <FormattedMessage id="product.updateProduct" />
                </span>
              )}
            </Button>
            {!product.isFetching && (
              <Link
                className="btn btn-primary btn-ghost pull-right m-r-10"
                to={paths.private.products}
              >
                <FormattedMessage id="product.cancel" />
              </Link>
            )}
          </div>
        </form>
      </Page>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    { validateProduct, setInitialState }
  )(Product)
);
