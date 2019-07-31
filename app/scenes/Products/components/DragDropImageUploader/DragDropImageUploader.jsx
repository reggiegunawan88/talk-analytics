import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';

import PropTypes from 'prop-types';

import Icon from 'shared_components/Icon';
import { configValues as config } from 'Config';
import styles from './styles.scss';

const dragDropState = {
  INITIAL: 'initial',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

class DragDropImageUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragDropState: dragDropState.INITIAL,
      file: null,
    };

    this.onDropAccepted = this.onDropAccepted.bind(this);
    this.onDropRejected = this.onDropRejected.bind(this);
    this.handleContent = this.handleContent.bind(this);
  }

  onDropAccepted(file) {
    const { formatMessage } = this.props.intl;

    if (FileReader) {
      const reader = new FileReader();

      reader.onload = () => {
        const approved = confirm(
          `${formatMessage({
            id: 'products.importProducts.areYouSure',
          })} ${file[0].name}?`
        );
        if (approved) {
          const { result } = reader;
          const { CSV_HEADER } = config;
          const header = result.split('\n')[0];
          const delimiter = header.indexOf(';') !== -1 ? ';' : ',';
          const normalizedHeader = header.split(delimiter).join();

          if (normalizedHeader === CSV_HEADER.NO_VARIANT.join()) {
            this.dropAccepted(file[0]);
            this.props.onDropAccepted({ file: file[0], withVariant: false });
          } else if (normalizedHeader === CSV_HEADER.WITH_VARIANT.join()) {
            this.dropAccepted(file[0]);
            this.props.onDropAccepted({ file: file[0], withVariant: true });
          } else {
            alert(formatMessage({ id: 'products.wrongStructure' }));
          }
        }
      };

      if (
        file[0].type === 'text/csv' ||
        file[0].type === 'application/vnd.ms-excel' ||
        file[0].type === ''
      ) {
        if (file[0].size >= 2048) {
          alert(formatMessage({ id: 'products.importProducts.tooLarge' }));
        } else {
          reader.readAsBinaryString(file[0]);
        }
      } else {
        this.onDropRejected();
      }
    } else {
      alert(formatMessage({ id: 'utility.browserNotSupport' }));
    }
  }

  onDropRejected() {
    alert(
      this.props.intl.formatMessage({ id: 'products.importProducts.makeSure' })
    );
    this.setState({
      dragDropState: dragDropState.REJECTED,
      file: null,
    });
  }

  dropAccepted(file) {
    this.setState({
      dragDropState: dragDropState.ACCEPTED,
      file,
    });
  }

  handleContent() {
    const { isFetching, isSucceed } = this.props;
    if (isFetching) {
      return (
        <p className={styles['dropzone-text']}>
          <FormattedMessage id="products.importProducts.uploading" />
          <span
            className={`${styles['accent-color']} ${styles.display_file_name}`}
          >
            {this.state.file.name}
          </span>
          ...
          <br />
          <Icon name="fa fa-circle-o-notch" className="fa-spin" />
        </p>
      );
    }
    if (this.state.dragDropState === dragDropState.ACCEPTED) {
      if (isSucceed) {
        return (
          <p className={styles['dropzone-text']}>
            <span className={styles['accent-color']}>
              {this.state.file.name}
            </span>
            <FormattedMessage id="products.importProducts.uploaded" />
          </p>
        );
      }

      return (
        <p className={styles['dropzone-text']}>
          <FormattedMessage id="products.importProducts.uploadFailed" />
          <span
            title={this.state.file.name}
            className={`${styles['red-color']} ${styles.display_file_name}`}
          >
            {this.state.file.name}
          </span>
        </p>
      );
    }
    return (
      <div>
        <p className={styles['dropzone-text']}>
          <FormattedHTMLMessage id="products.importProducts.dropCSV" />
        </p>
        <a className={styles['click-here']}>
          <FormattedMessage id="products.importProducts.orClickHere" />
        </a>
      </div>
    );
  }

  render() {
    return (
      <div className={styles['outer-container']}>
        <div className={styles.header}>&nbsp;</div>
        <Dropzone
          className={styles.dropzone}
          onDropAccepted={this.onDropAccepted}
          onDropRejected={this.onDropRejected}
          multiple={false}
        >
          {this.handleContent}
        </Dropzone>
      </div>
    );
  }
}

export default injectIntl(DragDropImageUploader);

DragDropImageUploader.propTypes = {
  onDropAccepted: PropTypes.func,
  isFetching: PropTypes.bool.isRequired,
  isSucceed: PropTypes.bool.isRequired,
  intl: PropTypes.any.isRequired,
};

DragDropImageUploader.defaultProps = {
  onDropAccepted: () => {},
};
