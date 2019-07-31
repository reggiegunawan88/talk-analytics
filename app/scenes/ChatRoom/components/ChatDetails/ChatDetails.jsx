import React, { Component } from 'react';
import { injectIntl, FormattedTime, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import Switch from 'react-switch';

import PropTypes from 'prop-types';

import { showNotification } from 'Modules/notification';
import { configValues } from 'Config';
import Button from 'shared_components/Button';
import styles from './style.scss';
import ButtonMessage from './components/ButtonMessage';
import FormMessage from './components/FormMessage';
import ImageMessage from './components/ImageMessage';
import CarouselMessage from './components/CarouselMessage';

let heightConversation = 0;
let lastScroll = 0;
let allImage = [];
let listImageLoad = [];

class ChatDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submit: false,
      chatInput: '',
      imageChat: '',
      imageOnPreview: '',
      isFetchingUpload: false,
      modalFeedback: false,
      maxLine: 5,
      lineTextarea: 1,
      lineHeight: 16,
      indeximg: 0,
    };

    this.submit = this.submit.bind(this);
    this.isInputDisabled = this.isInputDisabled.bind(this);
    this.triggerUploadFile = this.triggerUploadFile.bind(this);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.sendToSocket = this.sendToSocket.bind(this);
    this.previewImage = this.previewImage.bind(this);
    this.handleTextarea = this.handleTextarea.bind(this);
    this.renderSwitch = this.renderSwitch.bind(this);
    this.renderTextBox = this.renderTextBox.bind(this);
    this.sendTakeoverSocket = this.sendTakeoverSocket.bind(this);
    this.closeFeedback = this.closeFeedback.bind(this);
    this.askFeedback = this.askFeedback.bind(this);
    this.previewEvent = this.previewEvent.bind(this);
  }

  componentDidMount() {
    this.scrollToBottom();

    const chatContainer = document.getElementById('my-conversation');
    
    chatContainer.addEventListener('scroll', () => {
      const { activeChatUser, chatPage, hasMore, isFetching } = this.props;

      lastScroll = chatContainer.scrollTop;
      if (
        chatContainer.scrollTop <= 10 &&
        hasMore &&
        !isFetching
      ) {
        this.loadImage();
        this.props.fetchChat(activeChatUser, chatPage + 1);
      }
    });
  }

  componentDidUpdate(prevProps) {
    const chatContainer = document.getElementById('my-conversation');
    const divChatContainer = document.getElementById('conversation-length');
    const oldLastChat = prevProps.chats[prevProps.chats.length - 1];
    const newLastChat = this.props.chats[this.props.chats.length - 1];

    if (
      prevProps.activeChatUser.id !== this.props.activeChatUser.id ||
      (prevProps.chats.length !== this.props.chats.length &&
        oldLastChat.createdAt !== newLastChat.createdAt)
    ) {
      lastScroll = 0;
      if (prevProps.activeChatUser.id !== this.props.activeChatUser.id) {
        this.setState({ chatInput: '', imageChat: '' });
        allImage = [];
      }
    } else if (
        prevProps.chats.length !== this.props.chats.length && 
        oldLastChat.createdAt === newLastChat.createdAt &&
        prevProps.chatPage !== this.props.chatPage &&
        divChatContainer.clientHeight !== heightConversation &&
        heightConversation !== 0
      ) {
      lastScroll = divChatContainer.clientHeight - heightConversation;
    }

    heightConversation = divChatContainer.clientHeight;
    if (lastScroll === 0 && (oldLastChat.createdAt !== newLastChat.createdAt || this.props.chats.length <= 20)){
      lastScroll = heightConversation;
    }

    if (chatContainer.scrollTop !== lastScroll && !this.props.isFetching) {
      chatContainer.scrollTop = lastScroll;
    }
  }

  onChange = e => {
    const value = this.state.submit ? '' : e.target.value;

    if (!this.state.submit) {
      this.handleTextarea(e);
    }

    this.setState({
      chatInput: value,
      submit: false,
    });
  };

  onClick = type => {
    const { activeChatUser } = this.props;
    let cBotStatus = !activeChatUser.botStatus;

    if (type === "assign") {
      cBotStatus = false;
    } else if(type === "end") {
      cBotStatus = true;
    }

    if (cBotStatus) {
      this.setState({ modalFeedback:true });
    } else {
      this.sendTakeoverSocket(cBotStatus);
    }
  };

  onFileSelected() {
    this.setState({ isFetchingUpload: true });

    const reader = new FileReader();
    const fsize = this.uploadFile.files[0].size / 1024;

    reader.readAsDataURL(this.uploadFile.files[0]);
    if (fsize > 1024) {
      this.setState({ isFetchingUpload: false });
      this.props.showNotification({
        message: 'notif.register.pictureSize',
        type: configValues.NOTIF_TYPE.DANGER,
      });
      document.getElementById("uploadImageChat").value = "";
    } else {
      reader.onload = e => {
        this.setState({ isFetchingUpload: false });
        this.setState({ imageChat: e.target.result });
      };
    }
  }

  sendTakeoverSocket(cBotStatus) {
    const { activeChatUser, sendSocketMessage, profileId } = this.props;

    const socketPayload = {
      action: 'takeover',
      customerId: activeChatUser.customerId,
      channelId: activeChatUser.channelId,
      platform: activeChatUser.platform,
      roomId: activeChatUser.id,
      userId: profileId,
      botStatus: cBotStatus,
    };

    sendSocketMessage(socketPayload);
  }

  closeFeedback() {
    this.setState({ 'modalFeedback':false });
  }

  async askFeedback(feedback) {
    const { activeChatUser, sendSocketMessage, profileId } = this.props;
    const now = new Date();
    const timestamp = now.toISOString();
    if (feedback) {
      const messageData = {
        action: 'feedback',
        userId: profileId,
        customerId: activeChatUser.customerId,
        channelId: activeChatUser.channelId,
        platform: activeChatUser.platform,
        roomId: activeChatUser.id,
        updatedAt: activeChatUser.updatedAt,
        message: {
          content: ['Silakan tekan tombol di bawah untuk memberikan feedback pada admin'],
          type: 'text',
        },
        timestamp,
      };

      await sendSocketMessage(messageData);
    }

    setTimeout(() => {
      this.sendTakeoverSocket(true);
      this.closeFeedback();
    },1000);
  }
  
  loadImage() {
    listImageLoad.reverse();
    listImageLoad.map(i => allImage.push(i));
    listImageLoad = [];
  }

  triggerUploadFile = () => {
    this.uploadFile.click();
  };

  submit(e) {
    const { chatInput, imageChat } = this.state;

    if (e.key === 'Enter' && !e.shiftKey) {
      if (imageChat) {
        this.props.chatUploadImage(imageChat).then(() => {
          const imgMsg = this.props.imageUploaded;

          this.sendToSocket(imgMsg, 'img');
          if (chatInput) {
            this.sendToSocket(chatInput, 'text');
          }
        });
      } else if (chatInput) {
        this.sendToSocket(chatInput, 'text');
      }

      this.setState({
        submit: true,
        chatInput: '',
        imageChat: '',
        lineTextarea: 1,
      });
    }
  }

  sendToSocket(messageresponse, type) {
    const { activeChatUser, sendSocketMessage } = this.props;
    const now = new Date();
    const timestamp = now.toISOString();
    const messageData = {
      action: 'response',
      customerId: activeChatUser.customerId,
      channelId: activeChatUser.channelId,
      platform: activeChatUser.platform,
      roomId: activeChatUser.id,
      updatedAt: activeChatUser.updatedAt,
      message: {
        content: [messageresponse],
        type: type === 'img' ? 'image' : 'text',
      },
      timestamp,
    };

    sendSocketMessage(messageData);
  }

  scrollToBottom() {
    const chatContainer = document.getElementById('my-conversation');
    const divchatContainer = document.getElementById('conversation-length');

    chatContainer.scrollTop = divchatContainer.clientHeight;
  }

  removeImage() {
    this.setState({ imageChat: '' });
  }

  isInputDisabled() {
    const { activeChatUser } = this.props;

    return activeChatUser.botStatus;
  }

  disableChat() {
    const {
      activeChatUser: { botStatus },
      isChannelInactive,
    } = this.props;

    return isChannelInactive ? false : botStatus;
  }

  handleTextarea(e) {
    const { maxLine, lineHeight } = this.state;
    const previousRows = e.target.rows;
    e.target.rows = 1;
    const currentRows = e.target.scrollHeight / lineHeight;

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    if (currentRows >= maxLine) {
      e.target.rows = maxLine;
      e.target.scrollTop = e.target.scrollHeight;
    }

    this.setState({
      lineTextarea: currentRows < maxLine ? currentRows : maxLine,
    });
  }

  previewImage(imageUrl) {
    this.loadImage();
    const indeximg = allImage.indexOf(imageUrl);
    this.setState({ imageOnPreview: imageUrl, indeximg });
  }

  previewEvent(step) {
    const indeximg = allImage.indexOf(this.state.imageOnPreview);
    let displayIndex = indeximg;

    if (step === "next" && indeximg > 0 ) {
      displayIndex = indeximg-1;
    } else if ( allImage.length > indeximg + 1 ) {
      displayIndex = indeximg+1;
    }

    this.setState({ imageOnPreview: allImage[displayIndex], indeximg: displayIndex });
  }

  renderProfileImage() {
    const { activeChatName: name, activeChatUser } = this.props;

    if (activeChatUser.picture) {
      return (
        <div>
          <img className={styles.chat__picture} src={activeChatUser.picture} alt="" />
        </div>
      );
    }

    if (name && name.length > 0 && name !== '') {
      const [firstName, ...lastName] = name.split(' ');
      const [firstNameInitial] = firstName;
      // TODO: Refactor

      if (lastName.length > 0) {
        const [lastNameInitial] = lastName[lastName.length - 1];

        return (
          <div>
            {firstNameInitial ? firstNameInitial.toUpperCase() : null}
            {lastNameInitial ? lastNameInitial.toUpperCase() : null}
          </div>
        );
      }
      return <div>{firstNameInitial.toUpperCase()}</div>;
    }

    return <div />;
  }

  renderMessageBubble(message, createdAt, index) {
    switch (message.type) {
      case 'text':
        return message.content.map((content, idx) => (
          <div className="message clearfix" key={idx}>
            <div
              className={`chat-bubble from-them ${
                styles['adjusted-from-them']
              }`}
            >
              {content}
            </div>
            <div className={`pull-left ${styles.chat__time}`}>
              <FormattedTime value={new Date(createdAt)} hour12={false} />
            </div>
          </div>
        ));
      case 'button':
        return <ButtonMessage responses={message.content} key={index} />;
      case 'form':
        return <FormMessage responses={message.content} key={index} />;
      case 'image':
        if (!allImage.find((p) => p === message.content[0]) && !listImageLoad.find((p) => p === message.content[0])) {
          listImageLoad.push(message.content[0]);
        }
        return (
          <ImageMessage
            contents={message.content}
            key={index}
            onClick={e => this.previewImage(e)}
            type="message"
          />
        );
      default:
        return null;
    }
  }

  renderResponseBubble(message, createdAt, index) {
    switch (message.type) {
      case 'text':
        return message.content.map((content, idx) => (
          <div className="message clearfix" key={idx}>
            <div
              className={`chat-bubble from-me ${styles['adjusted-from-me']}`}
            >
              {content}
            </div>
            <div className={styles.chat__time}>
              <FormattedTime value={new Date(createdAt)} hour12={false} />
            </div>
          </div>
        ));
      case 'button':
        return (
          <ButtonMessage
            responses={message.content}
            createdAt={createdAt}
            key={index}
          />
        );
      case 'form':
        return (
          <FormMessage
            responses={message.content}
            createdAt={createdAt}
            key={index}
          />
        );
      case 'image':
        if (!allImage.find((p) => p === message.content[0]) && !listImageLoad.find((p) => p === message.content[0])) {
          listImageLoad.push(message.content[0]);
        }
        return (
          <ImageMessage
            contents={message.content}
            key={index}
            createdAt={createdAt}
            onClick={e => this.previewImage(e)}
            type="response"
          />
        );
      case 'flexform':
        return <FormMessage responses={message.content} key={index} />;
      case "carousel":
        return <CarouselMessage responses={message.content} key={index} />;
      default:
        return null;
    }
  }

  renderChatBubbleList() {
    const { chats, sortedActiveChat } = this.props;

    return sortedActiveChat.map(date =>(
        <div key={date}>
          <div className={styles['chat__info-date']}>
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          {chats.map(({ type, message, createdAt }, index) => {
            if (createdAt.split('T')[0] === date) {
              if (type === 'message') {
                return this.renderMessageBubble(message, createdAt, index);
              } else if (type === 'response') {
                return this.renderResponseBubble(message, createdAt, index);
              }
            }
            return "";
          })}
        </div>
      ));
  }

  renderSwitch() {
    const { activeChatUser, profileId, isChannelInactive } = this.props;

    if (isChannelInactive && activeChatUser.agent === profileId) {
      return (<Button
        onClick={() => this.onClick('end')}
        className={`${styles['btn-end-chat']}`}
      > 
        <FormattedMessage id="chatroom.chat.end" />
        <i>
          <FormattedMessage id="chatroom.chat.endConversation" />
        </i>
      </Button>);
    } else if (!isChannelInactive) {
      return(
        <div className={styles['chat__bot-status']}>
          <Switch
            onChange={this.onClick}
            checked={this.disableChat()}
          />
          <i>
            {this.disableChat() ? (
              <FormattedMessage id="chatroom.chat.bot" />
            ) : (
              <FormattedMessage id="chatroom.chat.human" />
            )}
          </i>
        </div>
      )
    }
    return "";
  }

  renderTextBox() {
    const { isChannelInactive, activeChatUser, profileId, isFetchingUpload } = this.props;

    if (!isChannelInactive || (isChannelInactive && activeChatUser.agent === profileId)) {
      return (
        <div
          className={`b-t b-grey clearfix ${
            this.disableChat() ? 'bg-master-lightest' : 'bg-white'
          } ${styles.textbox_absolute} ${isFetchingUpload &&
            styles.disable}`}
        >
          <a
            role="none"
            onClick={this.commingSoon}
            className={`col-xs-1 text-center link text-master ${
              styles.chat__attach
            }`}
          >
            <i className="fa fa-plus-circle" />
          </a>
          <div
            className={`col-xs-10 col-xs-offset-1 no-padding ${
              styles.chat__input
            }`}
          >
            <textarea
              onChange={this.onChange}
              value={this.state.chatInput}
              onKeyDown={this.submit}
              type="text"
              className="form-control chat-input"
              data-chat-input
              data-chat-conversation="#my-conversation"
              placeholder="Say something"
              disabled={this.disableChat() || isFetchingUpload}
              rows={this.state.lineTextarea}
            />
          </div>
          {this.state.imageChat && (
            <div
              className={`${
                styles.chat__image_preview
              } ${isFetchingUpload && styles.disable}`}
            >
              <div className={styles.chat__image_thumb}>
                <img src={this.state.imageChat} alt="" />
                <i
                  role="none"
                  className={`fa fa-remove ${isFetchingUpload &&
                    styles.disable}`}
                  onClick={this.removeImage}
                />
              </div>
            </div>
          )}
          <div
            className={`col-xs-1 p-t-15 text-center ${styles.chat__camera} ${(this.disableChat() || isFetchingUpload) && styles['chat__camera-disabled']}`}
          >
            <input
              type="file"
              className="hide"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={this.onFileSelected}
              disabled={this.disableChat() || isFetchingUpload}
              ref={uploadFile => {
                this.uploadFile = uploadFile;
              }}
              id="uploadImageChat"
            />
            <a
              role="none"
              onClick={this.triggerUploadFile}
              className={`link text-master ${(isFetchingUpload ||
                this.state.isFetchingUpload) &&
                styles.disable}`}
            >
              <i className="pg-camera" />
            </a>
          </div>
        </div>
      );
    } 
      return (
        <div className={styles['chat__assign-area']}>
          <Button
            onClick={() => this.onClick("assign")}
            className={`btn btn-primary ${styles['chat__assign-btn']}`}
          > 
            <FormattedMessage id="chatroom.chat.assignToMe"/>
          </Button>
        </div>
      );
    
  }

  render() {
    const { activeChatName } = this.props;
    const { lineTextarea, lineHeight, indeximg } = this.state;
    const heightTextbox = lineTextarea * lineHeight + 30;

    return (
      <div
        className={`split-details ${styles['adjusted-height']} ${
          styles['chat-details']
        }`}
      >
        <div className="full-height">
          <div
            className={`view chat-view bg-white clearfix ${
              styles['adjusted-chat-view']
            }`}
            style={{ paddingBottom: `${heightTextbox}px` }}
          >
            {/* BEGIN Header  ! */}
            <div className={`navbar ${styles['adjusted-navbar']}`}>
              <div className={`view-heading ${styles['adjusted-heading']}`}>
                <div
                  role="none"
                  className={styles.chat__back}
                  onClick={this.props.back}
                >
                  <i className="fa fa-arrow-left fa-2x" />
                </div>
                <div
                  className={`thumbnail-wrapper d32 circular ${
                    styles['profile-image']
                  }`}
                >
                  {this.renderProfileImage()}
                </div>
                <div className={`${styles['view-heading-name']}`}>
                  {activeChatName}
                  <div className="fs-11 hint-text">Online</div>
                </div>
              </div>
              {this.renderSwitch()}
            </div>
            {/* END Header  ! */}
            {/* BEGIN Conversation  ! */}
            <div
              className={`chat-inner ${styles['adjusted-inner-chat']}`}
              id="my-conversation"
            >
              <div id="conversation-length">
                {this.renderChatBubbleList()}
              </div>
            </div>
            {/* END Conversation  ! */}
            {/* BEGIN Chat Input  ! */}
            {this.renderTextBox()}
            {/* END Chat Input  ! */}
          </div>
        </div>
        <Modal
          classNames={{ modal: styles['c-modal__preview'] }}
          open={this.state.imageOnPreview}
          onClose={() => this.previewImage('')}
          center
        >
          { allImage.length > indeximg + 1 && (
          <button type="button" onClick={() => this.previewEvent('prev')} className={`${styles['chat__image-button']} ${styles['chat__image-prev']}`}><i className="fa fa-angle-left" /></button>
          )}
          <img alt="none" src={this.state.imageOnPreview} />
          { indeximg > 0 && (
            <button type="button" onClick={() => this.previewEvent('next')} className={`${styles['chat__image-button']} ${styles['chat__image-next']}`}><i className="fa fa-angle-right" /></button>
          )}
        </Modal>
        <Modal
          classNames={{ modal: styles['c-modal__large'] }}
          open={!!this.state.modalFeedback}
          onClose={this.closeFeedback}
          center
        >
          <b>
            <FormattedMessage id="chatroom.chat.askFeedback" />
          </b>
          <div>
            <p className="fg-shade m-t-20 fs-14">
              <FormattedMessage id="chatroom.chat.textFeedback" />
            </p>
            <div className={`row ${styles['c-modal__button']}`}>
              <div className="col-md-6 m-b-5 p-r-5">
                <Button
                  className="btn btn-primary btn-block"
                  onClick={() => this.askFeedback(1)}
                >
                  <FormattedMessage id="chatroom.chat.feedbackYes" />
                </Button>
              </div>
              <div className="col-md-6 p-l-5">
                <Button
                  className="btn btn-primary btn-block btn-ghost"
                  onClick={() => this.askFeedback(0)}
                >
                  <FormattedMessage id="chatroom.chat.feedbackNo" />
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { showNotification })(injectIntl(ChatDetails));

/* eslint-disable */
ChatDetails.propTypes = {
  activeChatUser: PropTypes.any.isRequired,
  chats: PropTypes.any.isRequired,
  intl: PropTypes.any.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isFetchingUpload: PropTypes.bool.isRequired,
  fetchChat: PropTypes.func.isRequired,
  sortedChatDate: PropTypes.array.isRequired,
  back: PropTypes.func.isRequired,
  chatPage: PropTypes.number.isRequired,
  sendSocketMessage: PropTypes.func.isRequired,
  chatUploadImage: PropTypes.func.isRequired,
  isChannelInactive: PropTypes.bool.isRequired,
  activeChatName: PropTypes.string.isRequired,
  sortedActiveChat: PropTypes.any.isRequired,
  takeoverBot: PropTypes.func.isRequired,
  takeoverHuman: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  profileId: PropTypes.any,
  imageUploaded: PropTypes.any,
};
/* eslint-enable */

ChatDetails.defaultProps = {
  profileId: {},
  imageUploaded: {},
};
