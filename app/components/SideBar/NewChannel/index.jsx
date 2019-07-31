import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import cloneDeep from 'lodash/cloneDeep';

import { formattedMessageHelper } from 'Modules/helper/utility';
import { registerChannel } from 'Modules/auth';
import { getChannelList } from 'Modules/channel';
import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import styles from '../styles.scss';

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    { registerChannel, getChannelList },
    dispatch
  );
  return dispatchFunc;
};

class NewChannel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isModalOpen: false,
      img: '',
      name: '',
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.triggerUploadFile = this.triggerUploadFile.bind(this);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onFileSelected() {
    const reader = new FileReader();
    reader.readAsDataURL(this.uploadFile.files[0]);
    reader.onload = e => {
      this.setState({ channelPicture: e.target.result });
    };
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue[name] = value;
    this.setState(newValue);
  }

  triggerUploadFile() {
    this.uploadFile.click();
  }

  async submit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { name, channelPicture } = this.state;

    try {
      await this.props.registerChannel({ name, channelPicture });
      await this.props.getChannelList();
    } catch (err) {
      throw err;
    } finally {
      this.setState({ isLoading: false });
    }
  }

  openModal() {
    this.setState({
      isModalOpen: true,
      name: '',
      channelPicture: null,
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
  }

  render() {
    const { isLoading } = this.state;

    return (
      <li role="none" onClick={this.openModal}>
        <a>
          <div className={styles['channel--add']}>
            <i className="fa fa-plus" />
          </div>
        </a>

        <Modal
          classNames={{ modal: styles['new-channel__modal'] }}
          open={this.state.isModalOpen}
          onClose={this.closeModal}
          center
        >
          <div className="text-center">
            <input
              type="file"
              className="hide"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={this.onFileSelected}
              ref={uploadFile => {
                this.uploadFile = uploadFile;
              }}
            />
            <div
              role="none"
              className={styles['bot__img-outer-container']}
              onClick={this.triggerUploadFile}
            >
              <div className={styles['bot__img-floating-icon']}>
                <img src="/img/icon/register/collections.png" alt="" />
              </div>
              <div className={styles['bot__img-container']}>
                <img
                  className={styles.bot__img}
                  src={
                    this.state.channelPicture ||
                    '/img/icon/register/bot_img_template.png'
                  }
                  alt=""
                />
              </div>
            </div>
            <p className="small-text text-master m-t-10">
              Minimum size: <b>200 x 200</b>
            </p>
          </div>

          <form onSubmit={this.submit}>
            <div className="col-md-offset-3 col-md-6">
              <Input
                onChange={this.onChange}
                label={formattedMessageHelper('registerChannel.botName')}
                styles="form-group-default"
                base={{ name: 'name', disabled: isLoading }}
                required
              />
            </div>

            <div className="col-md-offset-3 col-md-6">
              <Button
                className="btn btn-block btn-primary"
                isLoading={isLoading}
              >
                <FormattedMessage id="registerChannel.add" />
              </Button>
            </div>
          </form>
        </Modal>
      </li>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(NewChannel);

NewChannel.propTypes = {
  registerChannel: PropTypes.func.isRequired,
  getChannelList: PropTypes.func.isRequired,
};
