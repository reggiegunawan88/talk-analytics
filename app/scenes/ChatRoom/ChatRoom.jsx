import React, { Component } from 'react';
import { connect } from 'react-redux';
import Websocket from 'react-websocket';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';

import keys from 'lodash/keys';
import PropTypes from 'prop-types';

import Icon from 'shared_components/Icon';
import Page from 'shared_components/Page';
import {
  fetchConversations,
  fetchActiveChat,
  saveToChatLog,
  processSocketData,
  setFilter,
  setAgent,
  clearConversationState,
  chatUploadImage,
  clearActiveChat,
  updateBiodataUser,
  setUnreadChat,
} from 'Modules/conversations';
import {
  takeoverBot,
  takeoverHuman
} from 'Modules/webevent';
import { getChannelList } from 'Modules/channel';
import OrderCreate from 'shared_components/OrderCreate';
import config from 'Modules/fetch/config';
import ChatList from './components/ChatList';
import ChatDetails from './components/ChatDetails';
import UserInfo from './components/UserInfo';
import getConversationState from './selector';

import styles from './style.scss';

const mapStateToProps = state => {
  const stateProps = getConversationState(state);
  return stateProps;
};

const mapDispatchToProps = dispatch => {
  const dispatchFunc = bindActionCreators(
    {
      fetchConversations,
      fetchActiveChat,
      saveToChatLog,
      getChannelList,
      processSocketData,
      setFilter,
      setAgent,
      clearConversationState,
      clearActiveChat,
      updateBiodataUser,
      chatUploadImage,
      setUnreadChat,
      takeoverBot,
      takeoverHuman,
    },
    dispatch
  );
  return dispatchFunc;
};

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };

    this.handleChatListView = this.handleChatListView.bind(this);
    this.handleChatView = this.handleChatView.bind(this);
    this.handleUserInfo = this.handleUserInfo.bind(this);
    this.changeChatListSorting = this.changeChatListSorting.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.agentChange = this.agentChange.bind(this);
    this.onSocketConnected = this.onSocketConnected.bind(this);
    this.onSocketMessage = this.onSocketMessage.bind(this);
    this.sendSocketMessage = this.sendSocketMessage.bind(this);
    this.modalChange = this.modalChange.bind(this);
  }

  async componentDidMount() {
    try {
      this.props.clearConversationState();

      if (!this.props.activeChannel) await this.props.getChannelList();
      await this.props.fetchConversations(
        1,
        20,
        this.props.conversationSorting
      );
    } catch (error) {
      throw error;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeChannel.id !== this.props.activeChannel.id) {
      const { profileId, activeChannel } = prevProps;
      this.props.fetchConversations(1, 20, this.props.conversationSorting);
      if (profileId) {
        this.sendSocketMessage({
          action: 'unsubscribe',
          userId: profileId,
          channelId: activeChannel.id,
        });
      }
      this.onSocketConnected();
    }

    if (
      prevProps.platform !== this.props.platform ||
      prevProps.agent !== this.props.agent
    ) {
      this.props.fetchConversations(
        this.props.conversationPage,
        20,
        this.props.conversationSorting
      );
    }
  }

  onSocketMessage(data) {
    if (data) {
      const parsedData = JSON.parse(data);
      if (keys(parsedData).length > 0) {
        this.props.processSocketData(parsedData);
      }
    }
  }

  onSocketConnected() {
    const { activeChannel, profileId } = this.props;
    if (profileId) {
      this.sendSocketMessage({
        action: 'subscribe',
        userId: profileId,
        channelId: activeChannel.id,
      });
    }
  }

  agentChange(name) {
    this.props.setAgent(name);
  }

  changeChatListSorting() {
    const { conversationSorting } = this.props;
    if (conversationSorting === 'desc') {
      this.props.fetchConversations(1, 20, 'asc');
    } else {
      this.props.fetchConversations(1, 20, 'asc');
    }
  }

  modalChange() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  handleChatListView() {
    const {
      isFetching,
      isFetchingMore,
      isFetchingUnread,
      conversations,
      shownChat,
      sortedDate,
      hasMoreConversation,
      activeChat,
    } = this.props;

    return (
      <ChatList
        list={conversations}
        shownChat={shownChat}
        dates={sortedDate}
        fetchConversations={this.props.fetchConversations}
        clearConversationState={this.props.clearConversationState}
        changeChatListSorting={this.changeChatListSorting}
        conversationSorting={this.props.conversationSorting}
        conversationPage={this.props.conversationPage}
        platform={this.props.platform}
        activeChannel={this.props.activeChannel}
        activeAgent={this.props.agent}
        agentChange={this.agentChange}
        filterChange={this.filterChange}
        hasMore={hasMoreConversation}
        isFetching={isFetchingMore || isFetching}
        isFetchingUnread={isFetchingUnread}
        fetchChat={this.props.fetchActiveChat}
        newMessages={this.props.newMessages}
        isFetchingChat={this.props.isFetchingChat}
        activeChat={activeChat}
        isFetchingMobile={this.props.isFetchingMoreChat}
        hasMoreChat={this.props.hasMoreChat}
        chatsMobile={this.props.activeChat}
        fetchChatMobile={this.props.fetchActiveChat}
        sortedChatDateMobile={this.props.sortedChatDate}
        activeChatUserMobile={this.props.activeChatUser}
        onBotSwitchChangeMobile={this.onBotSwitchChange}
        websocketMobile={this.props.socket}
        saveToChatLogMobile={this.props.saveToChatLog}
        sendMessages={this.props.sendMessages}
        setUnread={this.props.setUnreadChat}
      />
    );
  }

  handleChatView() {
    const {
      isFetchingChat,
      isFetchingUpload,
      activeChatUser,
      activeChat,
      hasMoreChat,
      sortedChatDate,
      chatPage,
      activeChannel,
      profileId,
      sortedActiveChat
    } = this.props;

    if (isFetchingChat && !activeChat) {
      return (
        <h3 className={`text-center m-t-50 ${styles.hidden} ${styles['chat-loading']}`}>
          <Icon name="fa fa-circle-o-notch fa-spin" />
        </h3>
      );
    }

    if (activeChat && activeChatUser) {
      const activeChatName =
        activeChatUser.biodata && activeChatUser.biodata.name
          ? activeChatUser.biodata.name
          : activeChatUser.name;
      return (
        <ChatDetails
          isFetching={isFetchingChat}
          isFetchingUpload={isFetchingUpload}
          hasMore={hasMoreChat}
          chats={activeChat}
          chatPage={chatPage}
          fetchChat={this.props.fetchActiveChat}
          sortedChatDate={sortedChatDate}
          sortedActiveChat={sortedActiveChat}
          activeChat={activeChat}
          activeChatUser={activeChatUser}
          profileId={profileId}
          isChannelInactive={activeChannel.inactive}
          onBotSwitchChange={this.onBotSwitchChange}
          sendSocketMessage={this.sendSocketMessage}
          back={this.props.clearActiveChat}
          activeChatName={activeChatName}
          imageUploaded={this.props.imageUploaded}
          chatUploadImage={this.props.chatUploadImage}
          takeoverHuman={this.props.takeoverHuman}
          takeoverBot={this.props.takeoverBot}
        />
      );
    }

    return null;
  }

  handleUserInfo() {
    const { activeChatUser, isFetching, isFetchingChat } = this.props;
    if (activeChatUser && !isFetching && !isFetchingChat) {
      return (
        <UserInfo
          updateBiodataUser={this.props.updateBiodataUser}
          activeChatUser={activeChatUser}
          isFetching={this.props.isFetchingBiodata}
          createOrder={this.modalChange}
        />
      );
    }

    return null;
  }

  filterChange(name) {
    const { platform } = this.props;

    let newFilter;
    if (platform.indexOf(name) >= 0) {
      newFilter = platform.filter(filter => filter !== name);
      this.props.setFilter(newFilter);
    } else {
      newFilter = platform.concat(name);
      this.props.setFilter(newFilter);
    }
  }

  sendSocketMessage(message) {
    this.websocketEl.sendMessage(JSON.stringify(message));
    this.onSocketMessage(JSON.stringify(message));
  }

  render() {
    const { wsAPI } = config;
    const { profileId, activeChatUser } = this.props;
    const wsUrl = `${wsAPI}/v1/ws?id=${profileId}`;
    return (
      <Page isFluid={false} fullHeight isChatPage>
        <div className={`split-view`}>
          {profileId && (
            <Websocket
              url={wsUrl}
              ref={websocketEl => {
                this.websocketEl = websocketEl;
              }}
              onOpen={this.onSocketConnected}
              onMessage={this.onSocketMessage}
              reconnect
            />
          )}
          {this.handleChatListView()}
          {this.handleChatView()}
          {this.handleUserInfo()}
        </div>
        {activeChatUser && activeChatUser.biodata && (
          <OrderCreate
            isModalOpen={this.state.isModalOpen}
            modalChange={this.modalChange}
            isChatRoom
            customerData={activeChatUser}
          />
        )}
      </Page>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatRoom);

/* eslint-disable */
ChatRoom.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isFetchingMore: PropTypes.bool.isRequired,
  isFetchingMoreChat: PropTypes.bool.isRequired,
  isFetchingUpload: PropTypes.bool.isRequired,
  conversations: PropTypes.any.isRequired,
  fetchConversations: PropTypes.func.isRequired,
  clearConversationState: PropTypes.func.isRequired,
  processSocketData: PropTypes.func.isRequired,
  sortedDate: PropTypes.array.isRequired,
  hasMoreConversation: PropTypes.bool.isRequired,
  fetchActiveChat: PropTypes.func.isRequired,
  isFetchingChat: PropTypes.bool.isRequired,
  hasMoreChat: PropTypes.bool.isRequired,
  sortedChatDate: PropTypes.array.isRequired,
  activeChannel: PropTypes.any,
  getChannelList: PropTypes.func.isRequired,
  newMessages: PropTypes.any,
  activeChat: PropTypes.any,
  sortedActiveChat: PropTypes.any,
  conversationPage: PropTypes.number,
  conversationSorting: PropTypes.string,
  activeChatUser: PropTypes.shape({}),
  profileId: PropTypes.string,
  setAgent: PropTypes.func,
  shownChat: PropTypes.any.isRequired,
  platform: PropTypes.any,
  agent: PropTypes.any,
  imageUploaded: PropTypes.any,
  setFilter: PropTypes.func.isRequired,
  socket: PropTypes.any,
  saveToChatLog: PropTypes.func.isRequired,
  sendMessages: PropTypes.func,
  chatPage: PropTypes.any,
  updateBiodataUser: PropTypes.func.isRequired,
  chatUploadImage: PropTypes.func.isRequired,
  clearActiveChat: PropTypes.func.isRequired,
  takeoverBot: PropTypes.func.isRequired,
  takeoverHuman: PropTypes.func.isRequired,
  isFetchingUnread: PropTypes.bool,
  setUnreadChat: PropTypes.func,
  isFetchingBiodata: PropTypes.bool,
};
/* eslint-enable */
