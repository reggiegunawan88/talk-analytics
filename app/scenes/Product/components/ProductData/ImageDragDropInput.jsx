import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'react-intl';

import * as _ from 'lodash';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import { configValues as config } from 'Config';

class ImageDragDropInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
    };

    this.handleContent = this.handleContent.bind(this);
    this.onDropAccepted = this.onDropAccepted.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.image !== nextProps.image) {
      this.setState({ files: [] });
    }
  }

  onDropAccepted(files) {
    this.setState({ files });
    const reader = new FileReader();

    files.forEach(file => {
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.props.onDropAccepted(e.target.result, file);
      };
    });
  }

  handleContent() {
    if (this.state.files.length === 0) {
      if (!this.props.image) {
        return (
          <div>
            <img
              className={styles['dropzone__img-placeholder']}
              alt="placeholder"
              src={config.IMG.ADD_IMAGE_PLACEHOLDER}
            />
          </div>
        );
      }

      return (
        <img
          className={styles['dropzone__img-preview']}
          alt="product"
          src={this.props.image}
        />
      );
    }

    const displayImage = _.map(this.state.files, file => (
      <img
        key={file.name}
        alt={file.name}
        src={file.preview}
        className={styles['dropzone__img-preview']}
      />
    ));

    return <div>{displayImage}</div>;
  }

  render() {
    return (
      <div className="form-group required">
        <label>
          <FormattedMessage id="products.addProduct.uploadImageLabel" />
        </label>
        <div className={`controls ${styles.control__image}`}>
          <Dropzone
            className={styles.dropzone}
            onDropAccepted={this.onDropAccepted}
            onDropRejected={this.onDropRejected}
            disabled={this.props.disabled}
            accept="image/*"
            multiple={false}
          >
            {this.handleContent}
          </Dropzone>
          <p className={styles.dropzone__text}>
            <FormattedMessage id="products.addProduct.uploadImagePlaceholder" />
          </p>
        </div>
      </div>
    );
  }
}

export default ImageDragDropInput;

/* eslint-disable */
ImageDragDropInput.propTypes = {
  onDropAccepted: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  image: PropTypes.any,
};
/* eslint-enable */

ImageDragDropInput.defaultProps = {
  disabled: false,
  image: null,
};
