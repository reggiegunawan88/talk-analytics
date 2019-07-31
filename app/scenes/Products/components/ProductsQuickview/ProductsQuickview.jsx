import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import Quickview from 'shared_components/Quickview';
import ImportContent from '../ImportContent';
import styles from './styles.scss';

class ProductsQuickview extends Component {
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
    return (
      <Quickview
        customStyles={{ builder: styles.products_quickview }}
        onClose={this.onQuickviewClose}
        hiddenToggle={true}
        ref={quickview => {
          this.quickview = quickview;
        }}
      >
        <div className={styles['full-height']}>
          <ul
            className={`nav nav-tabs nav-tabs-simple nav-tabs-primary m-t-10
            ${styles['nav-tab']}`}
          >
            <li role="none" className={`${styles['nav-tab__tab']} active`}>
              <a data-toggle="tab">
                <FormattedMessage id="products.importProducts.title" />
              </a>
            </li>
          </ul>

          {React.createElement(ImportContent, {
            onRef: ref => {
              this.addImport = ref;
            }
          })}
        </div>
      </Quickview>
    );
  }
}

export default ProductsQuickview;

/* eslint-disable */
ProductsQuickview.propTypes = {
  isAdding: PropTypes.bool.isRequired,
  product: PropTypes.any,
  onRef: PropTypes.func.isRequired
};
/* eslint-enable */

ProductsQuickview.defaultProps = {
  product: null
};
