import React, { Component } from 'react';
import { injectIntl, FormattedDate, FormattedTime } from 'react-intl';

import PropTypes from 'prop-types';
import * as _ from 'lodash';

import Switch from 'react-switchery';

import styles from './style.scss';

import ButtonMessage from '../ChatDetails/components/ButtonMessage';
import FormMessage from '../ChatDetails/components/FormMessage';

class ChatDetailsMobile extends Component {
  constructor(props) {
    super(props);

    this.loadMore = this.loadMore.bind(this);
    this.state = {
      chatInput: '',
      sendMesage: [],
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.newMessages !== null &&
      this.props.activeChatUser.customerId === this.props.newMessages.room
    ) {
      if (prevProps.newMessages !== this.props.newMessages) {
        let { sendMesage } = this.state;
        sendMesage.push(this.props.newMessages);
        this.setState({
          sendMesage,
        });
      }
    }
    this.scrollToBottom();
  }

  scrollToBottom() {
    const chatContainer = document.getElementById('my-conversation-mobile');
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  }

  handleView() {
    const { chats, sortedChatDate } = this.props;

    return _.map(sortedChatDate, date => (
      <div key={date}>
        <div className="message clearfix text-center m-t-30 m-b-30">
          <FormattedDate
            value={new Date(new Date(date).valueOf())}
            year="numeric"
            month="long"
            day="2-digit"
          />
        </div>
        {_.map(chats[date], (chat, idx) => (
          <div className="chat-view" key={idx}>
            <div className="message clearfix">
              <div className="chat-bubble from-them">{chat.message}</div>
              <div className={styles.chat__time}>
                <FormattedTime value={new Date(chat.createdDate)} />
              </div>
            </div>
            <div className="message clearfix">
              <div
                className={`chat-bubble from-me ${
                  chat.flag !== 'KNOWN' ? styles['chat--unknown'] : ''
                }`}
              >
                {chat.response}
              </div>
              <div className={`pull-right ${styles.chat__time}`}>
                <FormattedTime value={new Date(chat.createdDate)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  }

  submit = e => {
    const {
      activeChatUser,
      websocket,
      saveToChatLog,
      sendMessages,
    } = this.props;
    if (e.key === 'Enter') {
      let { sendMesage, chatInput } = this.state;
      if (chatInput !== '') {
        sendMessages(chatInput);

        saveToChatLog(chatInput);

        sendMesage.push({
          response: chatInput,
          customerId: activeChatUser.customerId,
        });
        chatInput = '';
        this.setState({
          chatInput,
          sendMesage,
        });
      }
    }
  };

  loadMore(page) {
    const { chats, sortedChatDate } = this.props;
    const { lineId } = chats[sortedChatDate[0]][0];
    const chatContainer = document.getElementById('chat_details');

    this.props.fetchChat(lineId, page);
    chatContainer.scrollTop += 4500;
  }

  onClick = e => {
    const { activeChatUser } = this.props;
    this.props.onBotSwitchChange(activeChatUser);
    activeChatUser.botStatus = !activeChatUser.botStatus;
    this.props.fetchChat(activeChatUser);
  };

  commingSoon = e => {
    alert('Coming soon!');
  };

  onChange = e => {
    this.setState({
      chatInput: e.target.value,
    });
  };

  render() {
    const {
      activeChatUser,
      chats,
      hasMore,
      isFetching,
      sortedChatDate,
    } = this.props;
    const { sendMesage } = this.state;
    const scrollLoader = <h1 className="text-center">...</h1>;
    return (
      <div className="view chat-view bg-white clearfix">
        {/* BEGIN Header  !*/}
        <div className={`navbar ${styles['adjusted-navbar']}`}>
          <a
            onClick={this.props.hideChatDetails}
            href="javascript:;"
            className="link text-master inline action p-l-10 p-r-10"
            data-navigate="view"
            data-view-port="#chat"
            data-view-animation="push-parrallax"
          >
            <i className="pg-arrow_left" />
          </a>
          <div className={`view-heading ${styles['adjusted-heading']}`}>
            {activeChatUser.name}
            <div className="fs-11 hint-text">Online</div>
          </div>
          <div className={`${styles['adjusted-button-bot']}`}>
            {activeChatUser.botStatus ? 'ON' : 'OFF'}
          </div>
          <Switch
            onChange={this.onClick}
            checked={activeChatUser.botStatus}
            options={{
              color: '#099444',
            }}
          />
        </div>
        {/* END Header  !*/}
        {/* BEGIN Conversation  !*/}
        <div
          className={`chat-inner ${styles['adjusted-inner-chat']}`}
          id="my-conversation-mobile"
        >
          {/* BEGIN From Me Message  !*/}
          {_.map([...chats].reverse(), (chat, index) => {
            return (
              <div key={index}>
                {chat.message && chat.message !== 'null' ? (
                  <div className="message clearfix">
                    <div className="profile-img-wrapper m-t-5 inline">
                      <img
                        className="col-top"
                        width={30}
                        height={30}
                        src="/img/profiles/avatar.png"
                      />
                    </div>
                    <div
                      className={`chat-bubble from-them ${
                        styles['adjusted-from-them']
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                ) : (
                  <div />
                )}
                {chat.response && chat.response !== 'null' ? (
                  _.map(chat.response, (responses, index) => {
                    if (responses.type === 'text') {
                      if (responses.content instanceof Array) {
                        return _.map(responses.content, (response, index) => {
                          return (
                            <div className="message clearfix" key={index}>
                              <div
                                className={`chat-bubble from-me ${
                                  styles['adjusted-from-me']
                                }`}
                              >
                                {response}
                              </div>
                            </div>
                          );
                        });
                      }
                    } else if (responses.type === 'button') {
                      return (
                        <ButtonMessage responses={responses} key={index} />
                      );
                    } else if (
                      responses.type === 'form' ||
                      responses.type === 'flexform'
                    ) {
                      return <FormMessage responses={responses} key={index} />;
                    } else {
                      return _.map(responses.content, (response, index) => {
                        return (
                          <div className="message clearfix" key={index}>
                            <div
                              className={`chat-bubble from-me ${
                                styles['adjusted-from-me']
                              }`}
                            >
                              {JSON.stringify(response)}
                            </div>
                          </div>
                        );
                      });
                    }
                  })
                ) : (
                  <div />
                )}
              </div>
            );
          })}
          {sendMesage &&
            _.map(sendMesage, (message, index) => {
              return activeChatUser.customerId === message.customerId ? (
                <div key={index} className="message clearfix">
                  <div
                    className={`chat-bubble from-me ${
                      styles['adjusted-from-me']
                    }`}
                  >
                    {message.response}
                  </div>
                </div>
              ) : (
                activeChatUser.customerId === message.room && (
                  <div key={index} className="message clearfix">
                    <div className="profile-img-wrapper m-t-5 inline">
                      <img
                        className="col-top"
                        width={30}
                        height={30}
                        src="/img/profiles/avatar.png"
                      />
                    </div>
                    <div
                      className={`chat-bubble from-them ${
                        styles['adjusted-from-them']
                      }`}
                    >
                      {message.message}
                    </div>
                  </div>
                )
              );
            })}
          {/* END From Them Message  !*/}
        </div>
        {/* BEGIN Conversation  !*/}
        {/* BEGIN Chat Input  !*/}
        <div className="b-t b-grey bg-white clearfix p-l-10 p-r-10">
          <div className="row">
            <div className="col-xs-1 p-t-15">
              <a onClick={this.commingSoon} className="link text-master">
                <i className="fa fa-plus-circle" />
              </a>
            </div>
            <div className="col-xs-8 no-padding">
              <input
                onChange={this.onChange}
                value={this.state.chatInput}
                onKeyPress={this.submit}
                type="text"
                className="form-control chat-input"
                data-chat-input
                data-chat-conversation="#my-conversation"
                placeholder="Say something"
                disabled={activeChatUser.botStatus ? 'disabled' : ''}
              />
            </div>
            <div className="col-xs-2 link text-master m-l-10 m-t-15 p-l-10 b-l b-grey col-top">
              <a onClick={this.commingSoon} className="link text-master">
                <i className="pg-camera" />
              </a>
            </div>
          </div>
        </div>
        {/* END Chat Input  !*/}
      </div>
    );
  }
}

export default injectIntl(ChatDetailsMobile);

ChatDetailsMobile.propTypes = {
  activeChatUser: PropTypes.any.isRequired,
  chats: PropTypes.any.isRequired,
  intl: PropTypes.any.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchChat: PropTypes.func.isRequired,
  sortedChatDate: PropTypes.array.isRequired,
};
