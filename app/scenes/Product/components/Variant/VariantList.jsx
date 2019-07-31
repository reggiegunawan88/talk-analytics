import React, { Component } from 'react';
import Switch from 'react-switch';

import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styles from './styles.scss';

class VariantList extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.toggleAlwaysReady = this.toggleAlwaysReady.bind(this);
  }

  onChange(e, idx, name) {
    const { value } = e.target;
    if (name === 'sku') {
      this.props.setVariantValues(idx, name, value.replace(/\s+/g, ''));
    } else {
      this.props.setVariantValues(idx, name, value);
    }
  }


  toggleAlwaysReady(idx) {
    let unlimited = true;
    if (this.props.variantValues[idx].unlimited) {
      unlimited = false;
    }
    this.props.setVariantValues(idx, "unlimited", unlimited);
  }

  render() {
    const { variantValues, unlimited, isFetching } = this.props;

    return (
      <div className="col-md-12 padding-15">
        <table className="table table-hover table-condensed">
          <thead>
            <tr>
              <th>
                <FormattedMessage id="product.variant.variants" />
              </th>
              <th>
                <FormattedMessage id="product.variant.sku" />
              </th>
              <th>
                <FormattedMessage id="product.variant.price" />
              </th>
              <th>
                <FormattedMessage id="product.variant.weight" />
              </th>
              <th>
                <FormattedMessage id="product.variant.alwaysReady" />
              </th>
              <th>
                <FormattedMessage id="product.variant.stock" />
              </th>
            </tr>
          </thead>
          <tbody>
            {_.map(variantValues, (variantValue, idx) => (
              <tr key={idx}>
                <td>
                  {_.map(variantValue.values, variant => `${variant.option} `)}
                </td>
                <td>
                  <input
                    required={true}
                    disabled={isFetching}
                    className="form-control"
                    value={variantValue.sku}
                    onChange={e => this.onChange(e, idx, 'sku')}
                  />
                </td>
                <td>
                  <input
                    required={true}
                    disabled={isFetching}
                    className="form-control"
                    value={variantValue.regular_price}
                    type="number"
                    onChange={e => this.onChange(e, idx, 'regular_price')}
                  />
                </td>
                <td>
                  <input
                    required={true}
                    disabled={isFetching}
                    className="form-control"
                    value={variantValue.weight}
                    type="number"
                    onChange={e => this.onChange(e, idx, 'weight')}
                  />
                </td>
                <td>
                  <Switch onChange={() => this.toggleAlwaysReady(idx)} checked={variantValue.unlimited} />
                </td>
                <td>
                  {!variantValue.unlimited && (
                    <input
                      required={true}
                      disabled={isFetching}
                      className="form-control"
                      value={variantValue.stock_quantity || 0}
                      type="number"
                      onChange={e => this.onChange(e, idx, 'stock_quantity')}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default VariantList;

/* eslint-disable */
VariantList.propTypes = {
  variantValues: PropTypes.array.isRequired,
  setVariantValues: PropTypes.func.isRequired,
  unlimited: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};
/* eslint-enable */
