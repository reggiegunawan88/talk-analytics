import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import fetchGet from 'Modules/fetch/get';
import fetchPost from 'Modules/fetch/post';
import fetchPut from 'Modules/fetch/put';
import { formatRef, dateDefaultFormat } from 'Modules/helper/utility';
import { endpoints } from 'Config';
import { errorHandler } from 'Modules/helper/error';

const CONV_FETCH_START = 'conversation/fetch/start';
const CONV_FETCH_END = 'conversation/fetch/end';
const CONV_FETCH_MORE_START = 'conversation/fetch/more/start';
const CONV_FETCH_MORE_END = 'conversation/fetch/more/end';
const CLEAR_CONVERSATION_STATE = 'conversation/clear';
const CLEAR_ACTIVE_CHAT = 'conversation/active/clear';

const CONV_SET = 'conversations/set';
const CONV_LAST_SET = 'conversations/last/set';
const CONV_APPEND = 'conv/append';

const FILTER_SET = 'filter/set';
const AGENT_SET = 'agent/set';

const CHAT_FETCH_START = 'chat/fetch/start';
const CHAT_FETCH_END = 'chat/fetch/end';
const CHAT_FETCH_MORE_START = 'chat/fetch/more/start';
const CHAT_FETCH_MORE_END = 'chat/fetch/more/end';
const CHAT_SET = 'chat/set';
const CHAT_APPEND = 'chat/append';
const CHAT_PREPEND = 'chat/prepend';
const BOT_STATUS_FETCH_START = 'bot/status/fetch/start';
const BOT_STATUS_FETCH_END = 'bot/status/fetch/end';
const BOT_STATUS_SET = 'bot/status/set';
const BIODATA_FETCH_START = 'biodata/fetch/start';
const BIODATA_FETCH_END = 'biodata/fetch/end';
const BIODATA_SET = 'biodata/status/set';
const UPLOADED_IMAGE_SET = 'chat/upload/set';
const UPLOAD_FETCH_START = 'chat/upload/start';
const UPLOAD_FETCH_END = 'chat/upload/end';
const UNREAD_FETCH_START = 'unread/fetch/start';
const UNREAD_FETCH_END = 'unread/fetch/end';

const initialState = {
  isFetching: false,
  isFetchingMore: false,
  isFetchingChat: false,
  isFetchingMoreChat: false,
  isFetchingBotStatus: false,
  isFetchingBiodata: false,
  isFetchingUpload: false,
  isFetchingUnread: false,
  conversations: [],
  lastConversations: [],
  hasMoreConversation: false,
  activeChatUser: null,
  activeChat: null,
  hasMoreChat: false,
  perPage: 20,
  page: 1,
  chatPage: 1,
  platform: ['line', 'web', 'whatsapp','telegram'],
  agent: 'all',
  imageUploaded: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONV_FETCH_START: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case CONV_FETCH_END: {
      return Object.assign({}, state, {
        isFetching: false,
      });
    }

    case CONV_FETCH_MORE_START: {
      return Object.assign({}, state, {
        isFetchingMore: true,
      });
    }

    case CONV_FETCH_MORE_END: {
      return Object.assign({}, state, {
        isFetchingMore: false,
      });
    }

    case CONV_SET: {
      return Object.assign({}, state, {
        conversations: action.payload.conversations,
        page: action.payload.page,
        perPage: action.payload.perPage,
        hasMoreConversation: action.payload.hasMoreConversation,
        sort: action.payload.sort,
      });
    }

    case CLEAR_CONVERSATION_STATE: {
      return Object.assign({}, initialState);
    }

    case CONV_APPEND: {
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
      };
    }

    case CONV_LAST_SET: {
      return Object.assign({}, state, {
        lastConversations: action.payload,
      });
    }

    case CHAT_FETCH_START: {
      return Object.assign({}, state, {
        isFetchingChat: true,
      });
    }

    case CHAT_FETCH_END: {
      return Object.assign({}, state, {
        isFetchingChat: false,
      });
    }

    case CHAT_FETCH_MORE_START: {
      return Object.assign({}, state, {
        isFetchingMoreChat: true,
      });
    }

    case CHAT_FETCH_MORE_END: {
      return Object.assign({}, state, {
        isFetchingMoreChat: false,
      });
    }

    case CHAT_SET: {
      const {
        activeChatUser,
        activeChat,
        hasMoreChat,
        chatPage,
      } = action.payload;

      if (activeChatUser) {
        // set read to true locally
        activeChatUser.isRead = true;
      }

      return Object.assign({}, state, {
        activeChatUser,
        activeChat: activeChat ? activeChat.reverse() : null,
        hasMoreChat,
        chatPage,
      });
    }

    case CHAT_APPEND: {
      // TODO: Test Update LastLog & isRead Data
      // update lastLog
      const conversationIdx = state.conversations.findIndex(
        conversation => conversation.id === action.payload.roomId
      );
      const updatedConversation = [...state.conversations];
      // update last log
      updatedConversation[conversationIdx].updatedAt = action.payload.updatedAt;
      updatedConversation[conversationIdx].lastLog.message =
        action.payload.message;
      updatedConversation[conversationIdx].lastLog.type = action.payload.type;
      // updatedConversation[conversationIdx].lastLog = {
      //   id: '',
      //   type: action.payload.type,
      //   message: action.payload.message,
      // };
      updatedConversation[conversationIdx].isRead = false;

      if (
        state.activeChat &&
        state.activeChatUser.id === action.payload.roomId
      ) {
        return {
          ...state,
          activeChat: [...state.activeChat, action.payload],
          conversations: [...updatedConversation],
        };
      }

      if (
        state.activeChat &&
        state.activeChatUser.id !== action.payload.roomId
      ) {
        updatedConversation[conversationIdx].isRead = false;
      }

      return {
        ...state,
        conversations: [...updatedConversation],
      };
    }

    case CHAT_PREPEND: {
      return {
        ...state,
        activeChat: [...action.payload.activeChat, ...state.activeChat],
        chatPage: action.payload.chatPage,
        hasMoreChat: action.payload.hasMoreChat,
      };
    }

    case BOT_STATUS_FETCH_START: {
      return Object.assign({}, state, {
        isFetchingBotStatus: true,
      });
    }

    case BOT_STATUS_FETCH_END: {
      return Object.assign({}, state, {
        isFetchingBotStatus: false,
        activeChatUser: {
          ...state.activeChatUser,
          botStatus: !state.activeChatUser.botStatus,
        },
      });
    }

    case BOT_STATUS_SET: {
      return Object.assign({}, state, {
        activeChatUser: {
          ...state.activeChatUser,
          botStatus: action.payload.botStatus,
          agent: action.payload.agent,
          agentName: action.payload.agentName,
        },
        conversations: action.payload.conversations,
      });
    }

    case BIODATA_FETCH_START: {
      return { ...state, isFetchingBiodata: true };
    }

    case BIODATA_FETCH_END: {
      return { ...state, isFetchingBiodata: false };
    }

    case UNREAD_FETCH_START: {
      return { ...state, isFetchingUnread: true };
    }

    case UNREAD_FETCH_END: {
      return { ...state, isFetchingUnread: false };
    }

    case BIODATA_SET: {
      return { ...state, ...action.payload };
    }

    case FILTER_SET: {
      return {
        ...state,
        platform: action.payload,
        conversations: [],
        page: 1,
        isFetching: false,
        hasMoreConversation: false,
        activeChatUser: null,
        activeChat: null,
      };
    }

    case AGENT_SET: {
      return {
        ...state,
        agent: action.payload,
        conversations: [],
        page: 1,
        isFetching: false,
        hasMoreConversation: false,
        activeChatUser: null,
        activeChat: null,
      };
    }

    case CLEAR_ACTIVE_CHAT: {
      return {
        ...state,
        activeChat: null,
        activeChatUser: null,
      };
    }

    case UPLOADED_IMAGE_SET: {
      return { ...state, ...action.payload };
    }

    case UPLOAD_FETCH_START: {
      return Object.assign({}, state, {
        isFetchingUpload: true,
      });
    }

    case UPLOAD_FETCH_END: {
      return Object.assign({}, state, {
        isFetchingUpload: false,
      });
    }

    default:
      return state;
  }
};

const fetchConversations = (page = 1, perPage = 20, sort = 'desc') => {
  const dispatchFunc = async (dispatch, getState) => {
    dispatch({
      type: CONV_FETCH_START,
    });
    
    const { userLogged, conversations, userChannel, profile } = getState();
    const { token } = userLogged;
    const url = formatRef(endpoints.CHATS, endpoints.ROOM, endpoints.SORTED_BY_CHANNEL);

    try {
      let response = await fetchGet(
        url,
        token,
        {
          page,
          sort,
          platform: conversations.platform.join(','),
          channel_id: userChannel.activeChannel.id,
          agent: conversations.agent,
          id: profile.id,
        },
        'v2'
      );

      if (!response.ok) {
        response = await response.json();
        throw new Error(response.message);
      }

      response = await response.json();
      const { data } = response;

      dispatch({
        type: CONV_SET,
        payload: {
          conversations: [...conversations.conversations, ...data],
          page,
          perPage,
          hasMoreConversation: !(data.length < 20),
          sort,
        },
      });
    } catch (e) {
      dispatch({
        type: CONV_FETCH_END,
      });
    } finally {
      dispatch({
        type: CONV_FETCH_END,
      });
    }
  };
  return dispatchFunc;
};

const fetchActiveChat = (user, page = 1, sort = 'desc') => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged } = getState();
    const { token } = userLogged;
    const url = formatRef(endpoints.CHATS);
    if (user) {
      dispatch({
        type: CHAT_FETCH_START,
      });
      try {
        let response = await fetchGet(
          url,
          token,
          {
            page,
            room_id: user.id,
            sort,
          },
          'v2'
        );

        if (!response.ok) {
          response = await response.json();
          throw new Error(response.message);
        }

        response = await response.json();

        const { data } = response;
        if (page > 1) {
          dispatch({
            type: CHAT_PREPEND,
            payload: {
              activeChatUser: user,
              activeChat: data,
              hasMoreChat: !(data.length < 20),
              chatPage: page,
            },
          });
        } else {
          dispatch({
            type: CHAT_SET,
            payload: {
              activeChatUser: user,
              activeChat: data,
              hasMoreChat: !(data.length < 20),
              chatPage: page,
            },
          });
        }
      } catch (e) {
        dispatch(errorHandler(e));
        dispatch({
          type: CHAT_FETCH_END,
        });
      } finally {
        dispatch({
          type: CHAT_FETCH_END,
        });
      }
    } else {
      dispatch({
        type: CHAT_FETCH_START,
      });
      dispatch({
        type: CHAT_SET,
        payload: {
          activeChatUser: null,
          activeChat: null,
          hasMoreChat: false,
        },
      });

      dispatch({
        type: CHAT_FETCH_END,
      });
    }
  };

  return dispatchFunc;
};

const fetchConvByFlag = (flag, page = 0) => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, conversations } = getState();
    const { token } = userLogged;
    const { activeChat } = conversations;
    const url = formatRef(
      endpoints.AUTH,
      endpoints.CHATS,
      endpoints.ROOM_BY_CHANNEL
    );

    if (page === 0) {
      dispatch({
        type: CHAT_FETCH_START,
      });
    } else {
      dispatch({
        type: CHAT_FETCH_MORE_START,
      });
    }

    try {
      let response = await fetchGet(url, token, {
        flag,
        page,
        size: 50,
      });

      if (!response.ok) {
        response = await response.json();
        throw new Error(response.message);
      }

      response = await response.json();

      const { content, pageMetaData } = response;
      const { pageNumber, totalPages } = pageMetaData;

      if (page === 0) {
        dispatch({
          type: CHAT_SET,
          payload: {
            activeChat: content,
            hasMoreChat: pageNumber < totalPages - 1,
          },
        });
      } else {
        dispatch({
          type: CHAT_SET,
          payload: {
            activeChat: [...activeChat, ...content],
            hasMoreChat: pageNumber < totalPages,
          },
        });
      }
    } catch (e) {
      dispatch(errorHandler(e));
      if (page === 0) {
        dispatch({
          type: CHAT_FETCH_END,
        });
      } else {
        dispatch({
          type: CHAT_FETCH_MORE_END,
        });
      }
    } finally {
      if (page === 0) {
        dispatch({
          type: CHAT_FETCH_END,
        });
      } else {
        dispatch({
          type: CHAT_FETCH_MORE_END,
        });
      }
    }
  };
  return dispatchFunc;
};

const saveToChatLog = chat => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, conversations, userChannel } = getState();
    const { token } = userLogged;
    const { activeChatUser } = conversations;
    const { activeChannel } = userChannel;

    const url = formatRef(endpoints.CHATS);
    try {
      let response = await fetchPost(url, token, {
        roomId: activeChatUser.id,
        channelId: activeChannel.id,
        message: '',
        response: [
          {
            content: [chat],
            type: 'text',
          },
        ],
        flag: 'known',
      });

      if (!response.ok) {
        response = await response.json();
        throw new Error(response.message);
      }
      response = await response.json();
    } catch (e) {
      dispatch(errorHandler(e));
    }
  };
  return dispatchFunc;
};

const updateConversation = ({ customerId, timestamp, room, platform }) => {
  const dispatchFunc = async (dispatch, getState) => {
    const { conversations, userChannel } = getState();

    const convIdx = conversations.conversations.findIndex(
      conv => conv.id === room
    );
    if (convIdx === -1) {
      const newConversation = {
        id: room,
        channelId: userChannel.activeChannel.id,
        customerId,
        name: customerId,
        platform,
        botStatus: true,
        status: 'user',
        userStatus: 'user',
        createdAt: timestamp,
        updatedAt: timestamp,
        unreadMessage: 1,
      };
      const updated = [...conversations.conversations, newConversation];
      dispatch({
        type: CONV_SET,
        payload: updated,
      });
    } else {
      const clonedConvs = conversations.conversations.slice();
      const oldConv = conversations.conversations[convIdx];
      const updatedConv = Object.assign({}, oldConv, {
        updatedAt: timestamp,
        unreadMessage: (oldConv.unreadMessage += 1),
      });
      clonedConvs.splice(convIdx, 1);
      dispatch({
        type: CONV_SET,
        payload: [updatedConv, ...clonedConvs],
      });
    }
  };

  return dispatchFunc;
};

const processSocketData = data => {
  const dispatchFunc = async (dispatch, getState) => {
    const { profile, conversations } = getState();
    let payload = {};
    switch (data.action) {
      case 'response':
        payload = {
          customerId: data.customerId,
          channelId: data.channelId,
          platform: data.platform,
          roomId: data.roomId,
          message: data.message,
          type: data.action,
          updatedAt: data.timestamp,
          createdAt: data.timestamp,
        };
        dispatch({
          type: CHAT_APPEND,
          payload,
        });
        break;
      case 'message':
        const createdAt = new Date(data.timestamp);
        payload = {
          customerId: data.customerId,
          channelId: data.channelId,
          platform: data.platform,
          roomId: data.roomId,
          message: data.message,
          type: data.action,
          updatedAt: data.timestamp,
          createdAt: createdAt.toISOString(),
        };
        dispatch({
          type: CHAT_APPEND,
          payload,
        });
        break;
      case 'notify':
        payload = {
          customerId: data.customerId,
          channelId: data.channelId,
          platform: data.platform,
          roomId: data.roomId,
          message: data.message,
        };
        dispatch({
          type: '',
          payload,
        });
        break;
      case 'takeover':
        const newValue = cloneDeep(conversations.conversations);
        const indexUpdate = findIndex(newValue, { id: conversations.activeChatUser.id });
        let assignOpt = {};
        if ( newValue[indexUpdate].agent && !data.botStatus ) {
          newValue[indexUpdate].botStatus = false;
          newValue[indexUpdate].agent = profile.id;
          newValue[indexUpdate].agentName = profile.name;
          assignOpt = {
            botStatus: data.botStatus,
            agent: data.botStatus ? "" : profile.id,
            agentName: data.botStatus ? "" : profile.name,
          };
        } else {
          newValue[indexUpdate].botStatus = data.botStatus;
          newValue[indexUpdate].agent = data.botStatus ? "" : profile.id;
          newValue[indexUpdate].agentName = data.botStatus ? "" : profile.name;
          assignOpt = {
            botStatus: data.botStatus,
            agent: data.botStatus ? "" : profile.id,
            agentName: data.botStatus ? "" : profile.name,
          };
        }
        payload = {
          customerId: data.customerId,
          channelId: data.channelId,
          platform: data.platform,
          roomId: data.roomId,
          userId: data.userId,
          ...assignOpt,
          conversations: newValue
        };

        dispatch({
          type: BOT_STATUS_SET,
          payload,
        });
        break;
      case 'new_conversation':
        payload = {
          ...data.room,
        };
        dispatch({
          type: CONV_APPEND,
          payload,
        });
        break;
      default:
        return null;
    }
    return null;
  };
  return dispatchFunc;
};

const setFilter = filter => {
  const dispatchFunc = async dispatch => {
    dispatch({
      type: FILTER_SET,
      payload: filter,
    });
  };
  return dispatchFunc;
};

const setAgent = agent => {
  const dispatchFunc = async dispatch => {
    dispatch({
      type: AGENT_SET,
      payload: agent,
    });
  };
  return dispatchFunc;
};

const clearConversationState = () => {
  const dispatchFunc = async dispatch => {
    dispatch({
      type: CLEAR_CONVERSATION_STATE,
    });
  };
  return dispatchFunc;
};

const clearActiveChat = () => {
  const dispatchFunc = async dispatch => {
    dispatch({
      type: CLEAR_ACTIVE_CHAT,
    });
  };
  return dispatchFunc;
};

const chatUploadImage = imgbase64 => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id },
      },
    } = getState();
    const url = formatRef(endpoints.UPLOAD);
    const imageName = `${id}-${new Date().getTime()}`;
    const body = { filename: imageName, base64: imgbase64 };

    dispatch({ type: UPLOAD_FETCH_START });

    try {
      let response = await fetchPost(url, token, body);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      await dispatch({
        type: UPLOADED_IMAGE_SET,
        payload: {
          imageUploaded: response.message,
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: UPLOAD_FETCH_END });
    }
  };

  return dispatchFunc;
};

const updateBiodataUser = biodata => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      conversations: { conversations, activeChatUser },
    } = getState();
    const url = formatRef(endpoints.CUSTOMER);
    const birthdate = dateDefaultFormat(biodata.birthdate, 'YYYY-MM-DD');
    const query = {
      channel_id: activeChatUser.channelId,
      customer_id: activeChatUser.customerId,
      platform: activeChatUser.platform,
    };
    const body = {
      createdAt: activeChatUser.createdAt,
      ...biodata,
      birthdate,
    };

    dispatch({ type: BIODATA_FETCH_START });

    try {
      let response = await fetchPut(url, token, query, body);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      const newValue = cloneDeep(conversations);
      const indexUpdate = findIndex(newValue, { id: activeChatUser.id });
      const biodataId = response.data._id ? response.data._id : response.data.biodataId;
      newValue[indexUpdate].biodata = { ...biodata, _id: biodataId };
      dispatch({
        type: BIODATA_SET,
        payload: {
          activeChatUser: newValue[indexUpdate],
          conversations: newValue,
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: BIODATA_FETCH_END });
    }
  };

  return dispatchFunc;
};

const setUnreadChat = user => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      conversations: { conversations },
    } = getState();
    const url = formatRef(endpoints.CHATS, endpoints.ROOM);
    const body = { ...user, isRead: false };

    dispatch({ type: UNREAD_FETCH_START });
    try {
      let response = await fetchPut(url, token, null, body, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      const newValue = cloneDeep(conversations);
      const indexUpdate = findIndex(newValue, { id: user.id });
      newValue[indexUpdate] = { ...body };

      dispatch({
        type: BIODATA_SET,
        payload: {
          conversations: newValue,
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: UNREAD_FETCH_END });
    }
  };

  return dispatchFunc;
};

export {
  fetchConversations,
  fetchActiveChat,
  fetchConvByFlag,
  saveToChatLog,
  updateConversation,
  processSocketData,
  setFilter,
  setAgent,
  clearConversationState,
  clearActiveChat,
  updateBiodataUser,
  chatUploadImage,
  setUnreadChat,
};
