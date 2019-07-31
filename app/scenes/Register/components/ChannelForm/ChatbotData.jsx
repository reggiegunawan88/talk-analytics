import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Switch from 'react-switch';
import Modal from 'react-responsive-modal';

import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import PageLoader from 'shared_components/PageLoader';
import Input from 'shared_components/Input';
import Button from 'shared_components/Button';
import Tooltip from 'shared_components/Tooltip';
import { formattedMessageHelper } from 'Modules/helper/utility';
import { showNotification } from 'Modules/notification';
import { configValues } from 'Config';
import styles from './styles.scss';

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators({ showNotification }, dispatch);
  return dispatchFunc;
};

class ChannelForm extends Component {
  constructor(props) {
    super(props);

    const { channelData } = this.props;
    this.state = {
      submitClick: false,
      name: channelData ? channelData.name : '',
      channelPicture: channelData ? channelData.channelPicture : '',
      isBotActive: channelData ? channelData.inactive : false,
      flow: channelData ? channelData.type : '',
      infoName: false,
      infoTemplate: false,
      modalIframe: false,
      alertTemplate: false,
      templateChoose: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.triggerUploadFile = this.triggerUploadFile.bind(this);
    this.toggleBot = this.toggleBot.bind(this);
    this.submit = this.submit.bind(this);
    this.onTemplateChange = this.onTemplateChange.bind(this);
    this.onInfoClick = this.onInfoClick.bind(this);
    this.onTemplateTry = this.onTemplateTry.bind(this);
  }

  componentDidMount() {
    const templateScroll = document.getElementById('template-list');
    
    templateScroll.addEventListener('scroll', () => {
      const detectEnd = templateScroll.scrollWidth - templateScroll.scrollLeft;
      if (templateScroll.clientWidth === detectEnd && this.props.hasMoreData) {
        this.props.loadTemplate();
      }
    });
  }

  onChange(e) {
    const newValue = cloneDeep(this.state);
    const { name, value } = e;
    newValue[name] = value;
    this.setState(newValue);
  }

  onFileSelected() {
    const reader = new FileReader();
    reader.readAsDataURL(this.uploadFile.files[0]);
    const fsize = this.uploadFile.files[0].size / 1024;
    if (fsize > 1024) {
      this.props.showNotification({
        message: 'notif.register.pictureSize',
        type: configValues.NOTIF_TYPE.DANGER,
      });
    } else {
      reader.onload = e => {
        this.setState({ channelPicture: e.target.result });
      };
    }
  }

  onTemplateChange(template) {
    this.setState({ flow: template, modalIframe: false, alertTemplate: false });
  }

  onTemplateTry(dataTemplate='') {
    const newValue = this.state;
    newValue.modalIframe = !newValue.modalIframe;
    newValue.templateChoose = dataTemplate;

    this.setState(newValue);
  }

  onInfoClick(info) {
    const newValue = this.state;
    newValue[info] = !newValue[info];
    this.setState(newValue);
  }

  toggleBot() {
    let flow = {};
    if (!this.state.isBotActive) {
      flow = { flow: '' };
    }
    this.setState({ isBotActive: !this.state.isBotActive, ...flow });
  }

  triggerUploadFile() {
    this.uploadFile.click();
  }

  submit(e) {
    e.preventDefault();

    const { name, channelPicture, isBotActive, flow } = this.state;
    const alertTemplate = isBotActive && !flow;

    if (name && (!isBotActive || (isBotActive && flow))) {
      this.props.submit({
        name,
        channelPicture,
        inactive: isBotActive,
        type: flow,
      });
    }
    this.setState({ submitClick: true, alertTemplate });
  }

  render() {
    const { isFetching } = this.props;
    return (
      <div className={styles['register__outer-container']}>
        <div className={styles['register__inner-container']}>
          <div className={styles['register__chatbot-area']}>
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
              <div className={styles.register__chatbot}>
                <div className="col-md-offset-3 col-md-6">
                  <div className={styles.label__info}>
                    <Input
                      onChange={this.onChange}
                      label={formattedMessageHelper(
                        'registerChannel.chatbotData.botName'
                      )}
                      placeholderId='registerChannel.placeholder.botName'
                      styles={`form-group ${styles['form__group-register']}`}
                      requiredShow={this.state.submitClick && !this.state.name}
                      base={{
                        name: 'name',
                        disabled: isFetching,
                        value: this.state.name,
                      }}
                      required
                    />
                    <Tooltip 
                      position="right" 
                      text="registerChannel.info.channelName"
                      className={`${styles['label__info-icon']} ${this.state.infoName && styles['label__info-show']}`}
                      onClick={() => this.onInfoClick('infoName')}
                    >
                      <span className='fa fa-info' />
                    </Tooltip>
                  </div>

                  <div className={`form-group m-t-15 m-b-15 required ${styles['form__group-register']}`}>
                    <label htmlFor="toggleBot" className='m-t-5'>
                      <FormattedMessage id="registerChannel.chatbotData.botActive" />
                    </label>
                    <Switch
                      onChange={this.toggleBot}
                      checked={this.state.isBotActive}
                      className={styles['form__group-switch']}
                    />
                  </div>
                  
                  {this.state.isBotActive && (
                    <div
                      className={`form-group ${
                        styles['form__group-register']
                      } ${styles.label__info}`}
                    >
                      <label htmlFor="flow" className={styles.mb5}>
                        <FormattedMessage id="registerChannel.chatbotData.botTemplate" />
                      </label>
                      <Tooltip 
                        position="right" 
                        text="registerChannel.info.botTemplate"
                        className={`${styles['label__info-icon']} ${this.state.infoTemplate && styles['label__info-show']}`}
                        onClick={() => this.onInfoClick('infoTemplate')}
                      >
                        <span className='fa fa-info' />
                      </Tooltip>
                      {this.state.alertTemplate && (<div className={`text-red ${styles['bot__template-alert']}`}><FormattedMessage id="registerChannel.chatbotData.alertTemplate" /></div>)}
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`form-group ${
                  styles['form__group-register']
                } ${styles.label__info} ${!this.state.isBotActive && 'hide'}`}
              >
                <div className={styles.bot__list}>
                  <div id="template-list">
                    <div className={`${styles['bot__list-wrap']} ${this.props.hasMoreData && 'p-r-80'}`}>
                      {this.props.botTemplate.map((data, index) => (
                        <li key={`bot-${index}`} className={styles['bot__list-li']}>
                          <div className={`${styles.bot__single} ${this.state.flow === data.value && styles['bot__single-active']}`}>
                            <div className={styles['bot__single-image']}>
                              <img src={data.logo} alt={data.title} />
                            </div>
                            <div className={styles['bot__single-info']}>
                              <h3>{data.title}</h3>
                              <p>{data.description}</p>
                            </div>
                            <div className={styles['bot__single-feature']}>
                              <b><FormattedMessage id="registerChannel.chatbotData.feature" /></b>
                              <ul>
                                {data.feature.map((feature, idx) => (
                                  <li key={idx}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                            <div className={styles['bot__single-button']}>
                              <Button
                                base={{
                                  type: 'button'
                                }}
                                className="btn btn-primary m-r-10"
                                isLoading={isFetching}
                                onClick={() => this.onTemplateChange(data.value)}
                              >
                                <FormattedMessage id="registerChannel.chatbotData.choose" />
                              </Button>
                              <Button
                                base={{
                                  type: 'button'
                                }}
                                className="btn btn-default"
                                isLoading={isFetching}
                                onClick={() => this.onTemplateTry(data)}
                              >
                                <FormattedMessage id="registerChannel.chatbotData.try" />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                      {this.props.hasMoreData && (
                        <PageLoader className={`full-width padding-10 ${styles['bot__list-loader']}`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.register__chatbot}>
                <div className="col-md-offset-3 col-md-6">
                  <Button
                    className="btn btn-block btn-primary"
                    isLoading={isFetching}
                    onClick={this.submit}
                  >
                    <FormattedMessage id="registerChannel.next" />
                    <i className="fa fa-angle-double-right m-l-10" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {this.state.isBotActive && (
          <Modal
            classNames={{ modal: styles.bot__modal }}
            open={this.state.modalIframe}
            onClose={this.onTemplateTry}
            center
          >
            <b>{this.state.templateChoose.title}</b>
            <div className={styles.bot__iframe}>
              <iframe src={this.state.templateChoose.link} title="Try Template" />
            </div>
            <div className={styles['bot__iframe-button']}>
              <Button
                className="btn-block btn-primary"
                onClick={() => this.onTemplateChange(this.state.templateChoose.value)}
              >
                <FormattedMessage id="registerChannel.chatbotData.choose" />
              </Button>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(ChannelForm);

/* eslint-disable */
ChannelForm.propTypes = {
  submit: PropTypes.func.isRequired,
  loadTemplate: PropTypes.func.isRequired,
  showNotification: PropTypes.func,
  hasMoreData: PropTypes.bool,
  isFetching: PropTypes.bool,
  channelData: PropTypes.any,
  botTemplate: PropTypes.array,
};
/* eslint-enable */

ChannelForm.defaultProps = {
  isFetching: false,
  hasMoreData: false,
  botTemplate: [],
};
