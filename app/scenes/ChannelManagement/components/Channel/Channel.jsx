import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import Loader from 'shared_components/PageLoader';
import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import { updateChannel } from 'Modules/channel';
import { formattedMessageHelper } from 'Modules/helper/utility';
import BankCard from '../BankCard';
import LocationCard from '../LocationCard';
import CompanyCard from '../CompanyCard';
import styles from './styles.scss';

class Channel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      isModalOpen: false,
      copySuccess: false,
    };

    this.onFileSelected = this.onFileSelected.bind(this);
    this.triggerUploadFile = this.triggerUploadFile.bind(this);
    this.toggleActiveBot = this.toggleActiveBot.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
  }

  onFileSelected() {
    if (this.props.isFetching) return;

    const reader = new FileReader();
    reader.readAsDataURL(this.uploadFile.files[0]);
    reader.onload = e => {
      this.props.updateChannel({ channelPicture: e.target.result });
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

  openModal() {
    const { name } = this.props.bot;
    this.setState({ name, isModalOpen: true });
  }

  toggleActiveBot() {
    this.props.updateChannel({ inactive: !this.props.bot.inactive });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  async submit(e) {
    e.preventDefault();

    try {
      await this.props.updateChannel({ name: this.state.name });
    } catch (err) {
      console.error(err);
    } finally {
      this.closeModal();
    }
  }

  copyToClipboard() {
    document.getElementById('copyToClipboard').select();
    document.execCommand('copy');
    this.setState({ copySuccess: true });
    setTimeout(() => {
      this.setState({ copySuccess: false });
    }, 3000);
  }

  render() {
    const { isFetching, bot } = this.props;
    return (
      <div>
        <div className="col-md-7 nopadding">
          <div className="panel panel-transparent">
            <div className={`panel-body ${styles['panel--responsive']}`}>
              <div className={`${styles['bot__img-area']}`}>
                <div className="text-center">
                  <input
                    type="file"
                    className="hide"
                    accept="image/x-png,image/gif,image/jpeg"
                    onChange={this.onFileSelected}
                    ref={el => {
                      this.uploadFile = el;
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
                      {isFetching ? (
                        <Loader className="m-t-60" />
                      ) : (
                        <img
                          className={styles.bot__img}
                          src={
                            bot.channelPicture ||
                            '/img/icon/register/bot_img_template.png'
                          }
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                  <p className="small-text text-master m-t-10">
                    Minimum size: <b>200 x 200</b>
                  </p>

                  <Button
                    isLoading={isFetching}
                    onClick={this.toggleActiveBot}
                    className={`m-t-15 btn-ghost ${
                      bot && bot.inactive ? 'btn-primary' : 'btn-danger'
                    }`}
                  >
                    <FormattedMessage
                      id={`channelManagement.${
                        bot && bot.inactive ? 'activate' : 'deactivate'
                      }`}
                    />{' '}
                    BOT
                  </Button>
                </div>
              </div>

              <div className={`${styles['bot__info-data']}`}>
                <div className="form-group m-t-20">
                  <label htmlFor className="m-r-20">
                    <FormattedMessage id="channelManagement.name" />
                  </label>
                  <Button
                    isLoading={isFetching}
                    className="btn-ghost btn-primary pull-right"
                    onClick={this.openModal}
                  >
                    <i className="fa fa-pencil m-r-5" />
                    <FormattedMessage id="channelManagement.edit" />
                  </Button>
                  <p className="fg-shade">{bot ? bot.name : ''}</p>
                </div>

                <div className={styles["bot__info-id"]}>
                  <input type="text" value={bot.id} id="copyToClipboard" /> 
                  <i className="fa fa-copy" role="none" onClick={this.copyToClipboard} />
                  {this.state.copySuccess && (<div className={`text-red ${styles.copy__alert}`}><FormattedMessage id="channelManagement.copySuccess" /></div>)}
                </div>

                <hr className="m-t-30 m-b-30" />

                {false && (
                  <div className="form-group">
                    <label htmlFor className="m-r-20">
                      <FormattedMessage id="channelManagement.package" />
                    </label>
                    <Link
                      className="btn btn-ghost btn-primary"
                      to="/shopping-page"
                    >
                      <FormattedMessage id="channelManagement.changePackage" />
                    </Link>
                  </div>
                )}

                <div className="text-primary">
                  <img
                    src={`/img/icon/shopping/${bot.plan}.png`}
                    alt=""
                    width="30"
                    className="m-r-15"
                  />
                  <span className="bold all-caps fs-16">{bot.plan}</span>
                  <p className="m-t-10">
                    <FormattedHTMLMessage
                      id={`channelManagement.${bot.plan}Note`}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <BankCard />
        </div>

        <div className="col-md-5">
          <CompanyCard channelInfo={bot} updateChannel={this.props.updateChannel} isFetching={isFetching}/>
          <LocationCard channelInfo={bot.location} updateChannel={this.props.updateChannel} isFetching={isFetching} />
        </div>

        <Modal
          classNames={{ modal: styles['bot-overview--modal'] }}
          open={this.state.isModalOpen}
          onClose={this.closeModal}
          center
        >
          <b>
            <FormattedMessage id="channelManagement.editBotName" />
          </b>

          <p className="fg-shade m-t-20">
            <FormattedMessage id="profile.fillForm" />
          </p>

          <form onSubmit={this.submit}>
            <div className="row">
              <Input
                onChange={this.onChange}
                label={formattedMessageHelper('channelManagement.botName')}
                styles="form-group-default"
                ref={el => {
                  this.nameInput = el;
                }}
                base={{
                  name: 'name',
                  value: this.state.name,
                  disabled: isFetching,
                }}
                required
              />
            </div>
            <Button className="btn-primary btn-block m-t-20">
              <FormattedMessage id="channelManagement.save" />
            </Button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default connect(
  null,
  { updateChannel }
)(Channel);

/* eslint-disable */
Channel.propTypes = {
  bot: PropTypes.any,
  isFetching: PropTypes.bool.isRequired,
  updateChannel: PropTypes.func.isRequired,
};
/* eslint-enable */

Channel.defaultProps = {
  bot: {},
};
