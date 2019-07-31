import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import { formattedMessageHelper } from 'Modules/helper/utility';
import Dropdown from 'shared_components/Dropdown';
import Button from 'shared_components/Button';
import Icon from 'shared_components/Icon';
import styles from './styles.scss';

class VariantTable extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.changeTabValue = this.changeTabValue.bind(this);

    this.state = {
      addVariants: ''
    };
  }

  onChange(e, idx) {
    const { value, label } = e;
    if (value === 'addnew') {
      this.props.openModal(true);
      this.setState({ addVariants: value });
    } else {
      this.setState({ addVariants: '' });
      this.props.setVariantName(idx, value, label);
    }
  }

  changeTabValue(name, e, idx) {
    const { variants } = this.props;
    const listValues = e !== '' ? _.split(e, ',') : [];
    this.props.setVariantName(
      idx,
      variants[idx].id,
      variants[idx].name,
      listValues
    );
  }

  render() {
    const {
      variants,
      addVariant,
      removeVariant,
      isFetching,
      isEditing,
      variantFetching,
      variantMaster,
      isVariantAdd,
      openModalValues
    } = this.props;

    let canAddMoreVariant = true;

    return (
      <div className="col-md-12 bg-master-lightest padding-15">
        <table className={styles.variant_table}>
          <thead>
            <tr>
              <th className={styles.variant__width35}>
                <FormattedMessage id="product.variant.variantName" />
              </th>
              <th className={styles.variant__width35}>
                <FormattedMessage id="product.variant.variantValues" />
              </th>
              <th className={styles.variant__width30} />
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, idx) => {
              const checkBtnAdd =
                (variant.options.length && variant.options.values !== '') > 0 &&
                variants.length < 3;

              if (!checkBtnAdd) {
                canAddMoreVariant = false;
              }
              let taglist = [];
              let variantsOption = [
                {
                  label: formattedMessageHelper(
                    'product.variant.addVariantAttribute'
                  ),
                  value: 'addnew',
                  terms: []
                }
              ];
              variantMaster.map((list, index) => {
                if (list.id === variant.id && list.terms !== undefined) {
                  list.terms.map(term => {
                    return taglist.push({ label: term.name, value: term.name });
                  });
                }
                if (
                  _.filter(variants, ['id', list.id]).length < 1 ||
                  list.id === variant.id
                ) {
                  return variantsOption.push({
                    label: list.name,
                    value: list.id,
                    terms: list.terms || []
                  });
                }
              });
              return (
                <tr key={idx}>
                  <td>
                    <Dropdown
                      onChange={(name, e) => this.onChange(e, idx)}
                      options={variantsOption}
                      base={{
                        name: 'variantList',
                        isLoading: variantFetching || isFetching,
                        placeholder: formattedMessageHelper(
                          'product.variant.chooseVariant'
                        ),
                        removeSelected: true,
                        required: false,
                        value:
                          variant.id || (isVariantAdd && this.state.addVariants)
                      }}
                    />
                  </td>
                  <td>
                    <Dropdown
                      className={!variant.id && styles.disabled}
                      onChange={(name, e) => this.changeTabValue(name, e, idx)}
                      options={taglist}
                      base={{
                        name: 'type',
                        isLoading: variantFetching || isFetching,
                        placeholder: formattedMessageHelper(
                          'product.variant.variantValues'
                        ),
                        required: false,
                        multi: true,
                        delimiter: ',',
                        simpleValue: true,
                        removeSelected: true,
                        value: variant.options.join(',')
                      }}
                    />
                  </td>
                  <td>
                    <Button
                      className={`btn btn-default m-r-5 ${!variant.id &&
                        styles.disabled}`}
                      onClick={() =>
                        openModalValues({ modal: true, id: variant.id })
                      }
                      base={{ disabled: variantFetching, type: 'button' }}
                    >
                      <Icon name="fa" className="fa-plus m-r-5" />
                      <FormattedMessage id="product.variant.addVariantValues" />
                    </Button>
                    <Button
                      className="btn btn-default"
                      onClick={() => removeVariant(idx)}
                      base={{ disabled: isFetching, type: 'button' }}
                    >
                      <Icon name="fa" className="fa-trash-o" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {variants.length === 3 && (
          <div className="col-md-12 padding-5 hint-text">
            <FormattedMessage id="product.variant.maxVariantNumber" />
          </div>
        )}

        <Button
          className="btn btn-primary m-l-5 m-t-30"
          onClick={addVariant}
          base={{ disabled: !canAddMoreVariant || isFetching }}
        >
          <i className="pg pg-plus m-r-5" />
          <FormattedMessage id="product.variant.addVariant" />
        </Button>
      </div>
    );
  }
}

export default VariantTable;

/* eslint-disable */
VariantTable.propTypes = {
  variants: PropTypes.array.isRequired,
  addVariant: PropTypes.func.isRequired,
  removeVariant: PropTypes.func.isRequired,
  setVariantName: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  variantFetching: PropTypes.bool.isRequired
};
/* eslint-enable */
