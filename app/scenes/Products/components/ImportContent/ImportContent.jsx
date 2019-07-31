import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import DragDropImageUploader from '../DragDropImageUploader';
import Button from 'shared_components/Button';
import Icon from 'shared_components/Icon';
import { configValues as config } from 'Config';
import styles from './styles.scss';
import { importProductList } from 'Modules/import';
import getImportState from './selector';

const mapStateToProps = state => {
  const stateProps = getImportState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators({ importProductList }, dispatch);
  return dispatchFunc;
};

class ImportContent extends Component {
  constructor(props) {
    super(props);

    this.onDropAccepted = this.onDropAccepted.bind(this);
    this.downloadTemplate = this.downloadTemplate.bind(this);
  }

  onDropAccepted({ file, withVariant }) {
    this.props.importProductList(file, withVariant);
  }

  downloadTemplate(withVariant) {
    const { CSV_HEADER, CSV_EG_CONTENT } = config;
    const { platform } = navigator;
    const fileName = withVariant
      ? 'Talkabot_import_template_with_variant.csv'
      : 'Talkabot_import_template.csv';
    const header = withVariant
      ? CSV_HEADER.WITH_VARIANT
      : CSV_HEADER.NO_VARIANT;
    const example = withVariant
      ? CSV_EG_CONTENT.WITH_VARIANT
      : CSV_EG_CONTENT.NO_VARIANT;
    let content;

    if (platform.indexOf('Mac') !== 1) {
      content = `${header.join(';')}\n${example.join(';')}`;
    } else {
      content = `${header.join(',')}\n${example.join(',')}`;
    }

    const blob = new Blob([content], {
      type: 'text/csv;charset=utf-8;'
    });

    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = window.URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  render() {
    return (
      <div className="p-t-30">
        <DragDropImageUploader
          onDropAccepted={this.onDropAccepted}
          isFetching={this.props.isFetching}
          isSucceed={this.props.isSucceed}
        />

        <div className={styles['download__type--variant']}>
          <h5>
            <FormattedMessage id="products.importProducts.withVariantTitle" />
          </h5>
          <span>
            <FormattedMessage id="products.importProducts.withVariantDesc" />
          </span>
          <p>
            <FormattedMessage id="products.importProducts.withVariantEg" />
          </p>
        </div>

        <div className={styles['download__type--no_variant']}>
          <h5>
            <FormattedMessage id="products.importProducts.withoutVariantTitle" />
          </h5>
          <span>
            <FormattedMessage id="products.importProducts.withoutVariantDesc" />
          </span>
          <p>
            <FormattedMessage id="products.importProducts.withoutVariantEg" />
          </p>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportContent);

/* eslint-disable */
ImportContent.propTypes = {
  isFetching: PropTypes.bool,
  isSucceed: PropTypes.bool,
  importProductList: PropTypes.func.isRequired
};
/* eslint-enable */

ImportContent.defaultProps = {
  isFetching: false,
  isSucceed: true
};
