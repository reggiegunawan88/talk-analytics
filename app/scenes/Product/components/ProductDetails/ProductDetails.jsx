import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Switch from 'react-switch';

import PropTypes from 'prop-types';
import * as _ from 'lodash';

import Panel from 'shared_components/Panel';
import { formattedMessageHelper } from 'Modules/helper/utility';
import Input from 'shared_components/Input';
import styles from './styles.scss';

class ProductDetails extends Component {
  constructor(props) {
    super(props);

    this.toggleAlwaysReady = this.toggleAlwaysReady.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(param) {
    if (param.name) {
      if (param.name === 'code') {
        const newValue = _.cloneDeep(param);
        newValue.value = newValue.value.replace(/\s+/g, '');
        this.props.setParam(newValue);
      } else {
        this.props.setParam(param);
      }
    } else {
      const { value } = param.target;
      this.props.setParam({ name: 'stock', value });
    }
  }

  toggleAlwaysReady() {
    if (this.props.productPost.unlimited) {
      this.props.setParam({ name: 'unlimited', value: false });
    } else {
      this.props.setParam({ name: 'unlimited', value: true });
      this.props.setParam({ name: 'stock', value: '' });
    }
  }

  render() {
    const {
      productPost: { code, price, weight, stock, unlimited, haveVariant },
      isFetching
    } = this.props;
    const defaultInputProps = {
      onChange: this.onChange,
      required: true
    };

    return (
      <Panel
        className="col-md-10 col-md-offset-1"
        title={formattedMessageHelper('product.productDetails.title')}
      >
        <div className={styles.body}>
          <Input
            {...defaultInputProps}
            label={formattedMessageHelper('product.productDetails.code')}
            base={{
              name: 'code',
              disabled: isFetching,
              value: code
            }}
          />

          <Input
            {...defaultInputProps}
            label={formattedMessageHelper('product.productDetails.price')}
            base={{
              name: 'price',
              disabled: isFetching,
              type: 'number',
              value: price
            }}
          />

          <Input
            {...defaultInputProps}
            label={formattedMessageHelper('product.productDetails.weight')}
            base={{
              name: 'weight',
              disabled: isFetching,
              type: 'number',
              value: weight
            }}
          />

          <div className={'form-group'}>
            <label>
              <FormattedMessage id="product.productDetails.alwaysReady" />
            </label>
            <div className="col-md-12">
              <Switch onChange={this.toggleAlwaysReady} checked={unlimited} />
            </div>
          </div>

          {!unlimited && (
            <Input
              {...defaultInputProps}
              label={formattedMessageHelper('product.productDetails.addStock')}
              base={{
                name: 'stock',
                disabled: isFetching,
                type: 'number',
                value: stock || 0
              }}
            />
          )}
        </div>
      </Panel>
    );
  }
}

export default ProductDetails;

/* eslint-disable */
ProductDetails.propTypes = {
  productPost: PropTypes.any.isRequired
};
/* eslint-enable */
