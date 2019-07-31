import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import Panel from 'shared_components/Panel';
import VariantTable from './VariantTable';
import VariantList from './VariantList';
import ModalAddVariant from './ModalAddVariant';
import {
  formattedMessageHelper,
  cartesianProduct
} from 'Modules/helper/utility';
import styles from './styles.scss';
import { getVariants, addVariants, addVariantsValues } from 'Modules/variant';
import getVariantState from './selector';

const mapStateToProps = state => {
  const stateProps = getVariantState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    {
      getVariants,
      addVariants,
      addVariantsValues
    },
    dispatch
  );
  return dispatchFunc;
};

class Variant extends Component {
  constructor(props) {
    super(props);

    this.toggleVariant = this.toggleVariant.bind(this);
    this.removeVariant = this.removeVariant.bind(this);
    this.submitVariant = this.submitVariant.bind(this);
    this.submitVariantValues = this.submitVariantValues.bind(this);
    this.setVariantName = this.setVariantName.bind(this);
    this.setVariantValues = this.setVariantValues.bind(this);
    this.initVariantValues = this.initVariantValues.bind(this);
    this.addVariant = this.addVariant.bind(this);

    this.state = {
      isVariantAdd: false,
      variantId: '',
      isVariantValues: false,
      i: false
    };
  }

  componentDidMount() {
    if (
      this.props.productPost.isEditing &&
      this.props.productPost.haveVariant
    ) {
      this.props.getVariants();
      this.initVariantValues();
    }
  }

  initVariantValues() {
    const { variants, isEditing } = this.props.productPost;
    const listVariant = this.props.productPost.variantValues;
    const variantValues = _.map(variants, variant => {
      return variant.options;
    });

    const allCombination = cartesianProduct(...variantValues);

    const newVariantValues = [];

    allCombination.forEach(combination => {
      const values = [];

      combination.forEach((value, idx) => {
        values.push({
          id: variants[idx].id,
          name: variants[idx].name,
          option: value
        });
      });

      const checkCurrent = _.filter(listVariant, { values });
      let detVariant = [];
      if (checkCurrent.length > 0) {
        detVariant = checkCurrent[0];
      } else if (isEditing) {
        const checkEdit = _.filter(this.props.variantValues, { values });
        if (checkEdit.length > 0) {
          detVariant = checkEdit[0];
        }
      }

      newVariantValues.push({
        id: detVariant['id'] || '',
        values,
        sku: detVariant['sku'] || '',
        regular_price: detVariant['regular_price'] || '',
        weight: detVariant['weight'] || '',
        unlimited: detVariant['unlimited'] || false,
        stock_quantity: detVariant['stock_quantity'] || ''
      });
    });
    this.props.setParam({ name: 'variantValues', value: newVariantValues });
  }

  addVariant() {
    const variantTemplate = {
      id: '',
      name: '',
      visible: true,
      variation: true,
      options: [],
      values: []
    };
    const { variants } = this.props.productPost;
    this.props.setParam({
      name: 'variants',
      value: [...variants, variantTemplate]
    });
  }

  async removeVariant(idx) {
    if (this.props.productPost.variants.length === 1) {
      this.toggleVariant();
    } else {
      const { variants } = this.props.productPost;
      const newVal = _.cloneDeep(variants);
      newVal.splice(idx, 1);

      await this.props.setParam({ name: 'variants', value: newVal });

      this.initVariantValues();
    }
  }

  async toggleVariant() {
    if (!this.props.isFetching) {
      if (this.props.productPost.haveVariant) {
        await this.props.setParam({ name: 'variants', value: [] });
        this.props.setParam({ name: 'haveVariant', value: false });
      } else {
        this.props.getVariants();
        await this.props.setParam({ name: 'haveVariant', value: true });
        this.addVariant();
      }
    }
  }

  async setVariantName(idx, variantId, val, valuesList = []) {
    const { variants } = this.props.productPost;
    const newVal = _.cloneDeep(variants);
    newVal[idx].name = val;
    newVal[idx].id = variantId;
    newVal[idx].options = [];
    valuesList.map(list => {
      newVal[idx].options.push(list);
    });

    await this.props.setParam({ name: 'variants', value: newVal });
    this.initVariantValues();
  }

  submitVariant(e) {
    this.props.addVariants(e).then(() => {
      this.setState({ isVariantAdd: false });
      this.props.getVariants();
    });
  }

  submitVariantValues(e) {
    const variantId = this.state.variantId;
    this.props.addVariantsValues({ id: variantId, name: e.name }).then(() => {
      this.setState({ isVariantValues: false });
      this.props.getVariants();
    });
  }

  async setVariantValues(idx, name, value) {
    const { variantValues } = this.props.productPost;
    const newValue = _.cloneDeep(variantValues);
    newValue[idx][name] = value;

    await this.props.setParam({ name: 'variantValues', value: newValue });
    this.initVariantValues();
  }

  render() {
    const {
      productPost: {
        variants,
        variantValues,
        unlimited,
        isEditing,
        haveVariant
      },
      isFetching,
      getVariants,
      variantFetching,
      variantMaster
    } = this.props;

    return (
      <Panel
        className="col-md-10 col-md-offset-1"
        title={formattedMessageHelper('product.variant.title')}
      >
        <p className="col-md-8">
          <FormattedMessage id="product.variant.description" />
        </p>
        <p
          role="none"
          className={`col-md-4 ${
            haveVariant ? 'text-danger' : 'text-primary'
          } ${styles.variant}`}
          onClick={this.toggleVariant}
        >
          {haveVariant ? (
            <FormattedMessage id="product.variant.cancelVariant" />
          ) : (
            <FormattedMessage id="product.variant.addVariant" />
          )}
        </p>

        {haveVariant && (
          <VariantTable
            variants={variants}
            addVariant={this.addVariant}
            removeVariant={this.removeVariant}
            setVariantName={this.setVariantName}
            isFetching={isFetching}
            getVariants={getVariants}
            isEditing={isEditing}
            variantFetching={variantFetching}
            variantMaster={variantMaster}
            isVariantAdd={this.state.isVariantAdd}
            openModal={e => this.setState({ isVariantAdd: e })}
            openModalValues={e => {
              this.setState({ isVariantValues: e.modal, variantId: e.id });
            }}
          />
        )}

        {variants.length > 0 && (
          <VariantList
            variants={variants}
            variantValues={variantValues}
            setVariantValues={this.setVariantValues}
            unlimited={unlimited}
            isFetching={isFetching}
          />
        )}

        <ModalAddVariant
          isVariantAdd={this.state.isVariantAdd}
          onClose={() => this.setState({ isVariantAdd: false })}
          onSubmit={this.submitVariant}
          isFetching={variantFetching}
          title="product.variant.addVariant"
          label="product.variant.variantName"
        />
        <ModalAddVariant
          isVariantAdd={this.state.isVariantValues}
          onClose={() => this.setState({ isVariantValues: false })}
          onSubmit={this.submitVariantValues}
          isFetching={variantFetching}
          title="product.variant.addVariantValues"
          label="product.variant.variantValues"
        />
      </Panel>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Variant);

/* eslint-disable */
Variant.propTypes = {
  setParam: PropTypes.func.isRequired,
  getVariants: PropTypes.func.isRequired,
  addVariantsValues: PropTypes.func.isRequired,
  variantFetching: PropTypes.bool.isRequired,
  variantMaster: PropTypes.array.isRequired
};
/* eslint-enable */
