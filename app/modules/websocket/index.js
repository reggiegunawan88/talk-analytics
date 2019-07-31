import fetchPost from '../fetch/post';
import fetchWebsocket from '../fetch/websocket';
import { updateConversation } from '../conversations';
import { formatRef } from '../helper/utility';
import { endpoints } from '../../config';
import { errorHandler } from '../helper/error';

const SOCKET_CONNECTION_INIT = 'SOCKET_CONNECTION_INIT';
const SOCKET_CONNECTION_SUCCESS = 'SOCKET_CONNECTION_SUCCESS';
const SOCKET_CONNECTION_ERROR = 'SOCKET_CONNECTION_ERROR';
const SOCKET_CONNECTION_CLOSED = 'SOCKET_CONNECTION_CLOSED';
const SOCKET_MESSAGE = 'SOCKET_MESSAGE';
const SOCKET_SUBSCRIBE = 'SOCKET_SUBSCRIBE';

const initialState = {
  connected: false,
  socket: null,
  subscribed: false,
  newMessages: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SOCKET_CONNECTION_INIT:
      return Object.assign({}, state, {
        connected: false,
        socket: action.socket,
      });

    case SOCKET_CONNECTION_SUCCESS:
      return Object.assign({}, state, {
        connected: true,
      });

    case SOCKET_CONNECTION_ERROR:
      return Object.assign({}, state, {
        connected: false,
      });

    case SOCKET_CONNECTION_CLOSED:
      return Object.assign({}, state, {
        connected: false,
        socket: null,
      });

    case SOCKET_SUBSCRIBE:
      return Object.assign({}, state, {
        subscribed: true,
      });

    case SOCKET_MESSAGE:
      // Do your logic here with action.data
      // example handleIncomingMessage(action.data)
      return Object.assign({}, state, {
        newMessages: action.payload,
      });

    default:
      return state;
  }
}

function socketConnectionInit(socket) {
  return {
    type: SOCKET_CONNECTION_INIT,
    socket,
  };
}

function socketConnectionSuccess() {
  return {
    type: SOCKET_CONNECTION_SUCCESS,
  };
}

function socketConnectionError() {
  return {
    type: SOCKET_CONNECTION_ERROR,
  };
}

function socketConnectionClosed() {
  return {
    type: SOCKET_CONNECTION_CLOSED,
  };
}

function socketMessage(data) {
  return {
    type: SOCKET_MESSAGE,
    payload: data,
  };
}

export function initializeSocket() {
  return async (dispatch, getState) => {
    const { profile } = getState();
    const url = formatRef(endpoints.WS);
    const socket = fetchWebsocket(url, {
      id: `administrator${profile.id}`,
    });
    
    await dispatch(socketConnectionInit(socket));

    socket.onopen = function() {
      dispatch(socketConnectionSuccess());
    };

    socket.onerror = function() {
      dispatch(socketConnectionError());
    };

    socket.onmessage = function(event) {
      const newMessage = JSON.parse(event.data).reply[0];
      dispatch(updateConversation(newMessage));
    };

    socket.onclose = function() {
      dispatch(socketConnectionClosed());
    };
  };
}

export const socketSubscribe = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userChannel, userLogged, profile } = getState();
    const { token } = userLogged;
    const url = formatRef(endpoints.PUSH);

    try {
      let response = await fetchPost(url, token, {
        action: 'subscribe',
        customerId: `administrator${profile.id}`,
        channel: userChannel.activeChannel.id,
      });

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }
      response = await response.json();

      dispatch({
        type: SOCKET_SUBSCRIBE,
      });
    } catch (e) {
      dispatch(errorHandler(e));
    }
  };
  return dispatchFunc;
};

export const sendMessages = message => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, conversations, profile } = getState();
    const { activeChatUser } = conversations;
    const { token } = userLogged;
    const url = formatRef(endpoints.PUSH);
    try {
      let response = await fetchPost(url, token, {
        action: 'publish',
        customerId: `administrator${profile.id}`,
        channel: activeChatUser.channelId,
        platform: activeChatUser.platform,
        room: activeChatUser.customerId,
        message,
      });

      if (!response.ok) {
        response = await response.json();
        throw new Error(response.message);
      }
      response = response.json();
    } catch (e) {
      dispatch(errorHandler(e));
    }
  };
  return dispatchFunc;
};
