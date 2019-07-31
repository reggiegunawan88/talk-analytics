import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import TablePlaceholder from 'shared_components/TablePlaceholder';
import TableRow from './ProductsTableRow';
import styles from './styles.scss';

class TableBody extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { products, activeProductId, setActive } = this.props;

    return (
      <tbody>
        {products.map((product, index) => {
          return (
            <TableRow
              noData={index + 1}
              key={product.id}
              product={product}
              activeProductId={activeProductId}
              setActive={setActive}
              isDelete={this.props.isDelete}
            />
          );
        })}
      </tbody>
    );
  }
}

/* eslint-disable */
TableBody.propTypes = {
  products: PropTypes.array.isRequired,
  activeProductId: PropTypes.any,
  setActive: PropTypes.func.isRequired
};
/* eslint-enable */

TableBody.defaultProps = {
  activeProductId: undefined
};

class ProductsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeProductId: undefined
    };

    this.setActive = this.setActive.bind(this);
  }

  setActive(id, modal, productDetail) {
    this.props.productActive(modal, productDetail);
    this.setState({ activeProductId: id });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isActive !== this.props.isActive && !this.props.isActive) {
      this.setState({ activeProductId: undefined });
    }
  }

  handleBody() {
    const { isFetching, products, pagination } = this.props;
    if (!isFetching) {
      if (products.length === 0 && pagination.page === 1) {
        return (
          <TablePlaceholder totalCol={8}>
            <h3 className={styles['text-center']}>
              <FormattedMessage id="table.noProduct" />
            </h3>
          </TablePlaceholder>
        );
      }
      return (
        <TableBody
          products={products}
          setActive={this.setActive}
          activeProductId={this.state.activeProductId}
          isDelete={this.props.isDelete}
        />
      );
    }
    if (pagination.page === 1) {
      return (
        <TablePlaceholder totalCol={8}>
          <h3 className={styles['text-center']}>
            <FormattedMessage id="table.loading" />
          </h3>
        </TablePlaceholder>
      );
    }
  }

  render() {
    const { dataSize } = this.props;
    return (
      <div className={`table-responsive ${styles.table}`}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>
                <FormattedMessage id="table.no" />
              </th>
              <th>
                <FormattedMessage id="table.image" />
              </th>
              <th>
                <FormattedMessage id="table.name" />
              </th>
              <th>
                <FormattedMessage id="table.category" />
              </th>
              <th>
                <FormattedMessage id="table.stock" />
              </th>
              <th>
                <FormattedMessage id="table.totalsales" />
              </th>
              <th>
                <FormattedMessage id="table.price" />
              </th>
              <th />
            </tr>
          </thead>
          {this.handleBody()}
        </table>
      </div>
    );
  }
}

export default ProductsTable;

/* eslint-disable */
ProductsTable.propTypes = {
  products: PropTypes.array,
  isFetching: PropTypes.bool.isRequired
};
/* eslint-enable */

ProductsTable.defaultProps = {
  products: []
};
