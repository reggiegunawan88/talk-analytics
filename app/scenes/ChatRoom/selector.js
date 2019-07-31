import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import keys from 'lodash/keys';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

const getState = state => {
  const { conversations, websocket, userChannel, profile } = state;
  return [conversations, websocket, userChannel, profile];
};

export default createSelector(
  [getState],
  state => {
    const {
      isFetching,
      isFetchingMore,
      isFetchingMoreChat,
      isFetchingChat,
      isFetchingBotStatus,
      isFetchingBiodata,
      isFetchingUnread,
      hasMoreConversation,
      conversations,
      lastConversations,
      conversationsWebsocket,
      totalPages,
      activeChatUser,
      hasMoreChat,
      page: conversationPage,
      perPage: conversationPerPage,
      sort: conversationSorting,
      chatPage,
      platform,
      agent,
      imageUploaded,
      isFetchingUpload,
    } = state[0];
    let { activeChat } = state[0];
    const { socket, newMessages } = state[1];
    const { activeChannel } = state[2];
    const { id: profileId } = state[3];
    const date = conv => moment(conv.updatedDate).format('YYYY-MM-DD');
    const groupedConv = groupBy(
      conversations.conversations,
      conversations.id
    );
    const sortedDate = keys(groupedConv)
      .sort()
      .reverse();

    const sortedConv = {};
    map(lastConversations, conv => {
      if (!sortedConv[conv.updatedAt.split('T')[0]]) {
        sortedConv[conv.updatedAt.split('T')[0]] = [];
      }
      map(conversations, conversation => {
        if (conversation.id === conv.roomId) {
          sortedConv[conv.updatedAt.split('T')[0]].push(conversation);
        }
      });
    });

    map(conversations, conversation => {
      const convObj = sortedConv[conversation.updatedAt.split('T')[0]];
      if (!convObj) {
        sortedConv[conversation.updatedAt.split('T')[0]] = [conversation];
      } else {
        sortedConv[conversation.updatedAt.split('T')[0]].push(conversation);
      }
    });
    const groupedChat = groupBy(activeChat, date);
    const sortedChatDate = keys(groupedChat).sort();
    const sortedGroupedChat = {};
    sortedChatDate.forEach(d => {
      sortedGroupedChat[d] = [];
      groupedChat[d].forEach(chat => {
        sortedGroupedChat[d] = [chat, ...sortedGroupedChat[d]];
      });
    });

    const sortedActiveChat = [];
    if (activeChat) {
      activeChat = orderBy(activeChat,'createdAt','asc');
      map(activeChat, chat => {
        if(!sortedActiveChat.includes(chat.createdAt.split('T')[0])){
          sortedActiveChat.push(chat.createdAt.split('T')[0]);
        }
      });
    }

    return {
      isFetching,
      isFetchingMore,
      isFetchingMoreChat,
      isFetchingChat,
      isFetchingBotStatus,
      conversations: sortedConv,
      shownChat: conversations.length,
      conversationPage,
      conversationPerPage,
      conversationSorting,
      chatPage,
      platform,
      agent,
      conversationsWebsocket,
      sortedDate,
      totalPages,
      hasMoreConversation,
      activeChatUser,
      activeChat,
      sortedActiveChat,
      sortedChatDate,
      hasMoreChat,
      activeChannel,
      socket,
      newMessages,
      profileId,
      imageUploaded,
      isFetchingUpload,
      isFetchingBiodata,
      isFetchingUnread,
    };
  }
);
