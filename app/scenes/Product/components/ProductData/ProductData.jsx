import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import Panel from 'shared_components/Panel';
import Input from 'shared_components/Input';
import Button from 'shared_components/Button';
import Radio from 'shared_components/Radio';
import Dropdown from 'shared_components/Dropdown';
import { formattedMessageHelper, removeHtmlTag } from 'Modules/helper/utility';
import { addCategories, fetchCategories } from 'Modules/categories';
import styles from './styles.scss';
import getProductDataState from './selector';

const mapStateToProps = state => {
  const stateProps = getProductDataState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    { addCategories, fetchCategories },
    dispatch
  );
  return dispatchFunc;
};

class ProductData extends Component {
  constructor(props) {
    super(props);

    this.onImageDrop = this.onImageDrop.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.showAddCategory = this.showAddCategory.bind(this);
    this.submitCategory = this.submitCategory.bind(this);
    this.onChange = this.onChange.bind(this);
    this.radioChange = this.radioChange.bind(this);

    this.state = {
      categoryPagination: { page: 1 },
      categoryAdd: false,
      categoryNew: {
        name: '',
      },
      valueCategory: this.props.valueCategory,
      productType: [
        {
          label: formattedMessageHelper('product.productData.simpleProduct'),
          value: 'simple',
        },
        {
          label: formattedMessageHelper('product.productData.variableProduct'),
          value: 'variable',
        },
      ],
    };
  }

  componentDidMount() {
    this.props.fetchCategories(this.state.categoryPagination);
  }

  onImageDrop(imageBase64, fileOpt) {
    const arrBase64 = imageBase64.split('base64,');
    this.props.setParam({ name: 'imageHandle', value: imageBase64 });
    this.props.setParam({ name: 'imageBase64', value: arrBase64[1] });
    this.props.setParam({ name: 'imageName', value: fileOpt.name });
    this.props.setParam({ name: 'imageType', value: fileOpt.type });
  }

  onCategoryChange(name, e) {
    const listCategory = _.split(e, ',').map(val => ({ id: Number(val) }));
    this.props.setParam({ name: 'category', value: listCategory });
    this.setState({ valueCategory: e });
  }

  onChange(e) {
    const newValue = _.cloneDeep(this.state);
    const { name, value } = e;
    newValue.categoryNew[name] = value;
    this.setState(newValue);
  }

  showAddCategory(value) {
    this.setState({ categoryAdd: value });
  }

  radioChange(radioName, radioValue) {
    this.props.setParam({ name: radioName, value: radioValue });
  }

  submitCategory() {
    this.props.addCategories(this.state.categoryNew).then(() => {
      this.setState({ categoryAdd: false, categoryNew: { name: '' } });
      this.props.fetchCategories(this.state.categoryPagination);
    });
  }

  render() {
    const {
      productPost: { name, description, type },
      isFetching,
      categories,
      categoryFetching,
    } = this.props;
    const categoriesOption = [];
    if (categories.length > 0) {
      categories.map(list =>
        categoriesOption.push({
          label: list.name,
          value: list.id,
        })
      );
    }
    const defaultInputProps = {
      onChange: this.props.setParam,
      required: true,
    };

    return (
      <Panel
        className={`col-md-10 col-md-offset-1 ${styles.panel__custom}`}
        title={formattedMessageHelper('product.productData.title')}
      >
        <div className={`m-t-10 ${styles.body}`}>
          <Input
            {...defaultInputProps}
            label={formattedMessageHelper('product.productData.productName')}
            base={{
              name: 'name',
              disabled: isFetching,
              ref: input => {
                this.name = input;
              },
              value: name,
            }}
          />

          <Input
            {...defaultInputProps}
            label={formattedMessageHelper('product.productData.description')}
            base={{
              name: 'description',
              disabled: isFetching,
              rows: 4,
              value: removeHtmlTag(description),
            }}
            textarea
          />

          <div className="form-group row">
            <div className="col-md-12">
              <label htmlFor="category">
                <FormattedMessage id="product.productData.category" />
              </label>
            </div>
            <div className="col-md-4">
              <div name="category" className="controls">
                <Dropdown
                  onChange={this.onCategoryChange}
                  options={categoriesOption}
                  base={{
                    name: 'type',
                    isLoading: categoryFetching,
                    placeholder: formattedMessageHelper(
                      'product.productData.chooseCategory'
                    ),
                    required: false,
                    multi: true,
                    delimiter: ',',
                    simpleValue: true,
                    removeSelected: true,
                    value: this.state.valueCategory,
                  }}
                />
              </div>
            </div>
            <div className="col-md-8">
              {!this.state.categoryAdd ? (
                <span
                  role="none"
                  onClick={() => this.showAddCategory(true)}
                  className={`text-primary ${styles.text__list}`}
                >
                  <i className="pg pg-plus m-r-5" />
                  <FormattedMessage id="product.productData.addCategory" />
                </span>
              ) : (
                <div className="row">
                  <div className="col-md-6">
                    <Input
                      onChange={this.onChange}
                      withLabel={false}
                      base={{
                        name: 'name',
                        disabled: categoryFetching,
                        value: this.state.categoryNew.name,
                      }}
                    />
                  </div>
                  <div className="col-md-2">
                    <Button
                      className="btn btn-primary"
                      onClick={this.submitCategory}
                      isFetching={categoryFetching}
                      base={{
                        type: 'button',
                      }}
                    >
                      <FormattedMessage id="product.productData.add" />
                    </Button>
                  </div>
                  <div className="col-md-4">
                    <span
                      role="none"
                      onClick={() => this.showAddCategory(false)}
                      className={styles.text__list}
                    >
                      <i className="fa fa-minus m-r-5" />
                      <FormattedMessage id="product.productData.removeCategory" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Radio
            value={type}
            label="Product Type"
            data={this.state.productType}
            onChange={this.radioChange}
            base={{
              name: 'type',
              style: styles.radioInline,
            }}
          />
        </div>
      </Panel>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductData);

/* eslint-disable */
ProductData.propTypes = {
  setParam: PropTypes.func.isRequired,
  categoryFetching: PropTypes.bool.isRequired,
  addCategories: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  valueCategory: PropTypes.string,
  productPost: PropTypes.any,
  isFetching: PropTypes.bool,
};
/* eslint-enable */

ProductData.defaultProps = {
  categories: [],
};
