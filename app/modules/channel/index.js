import fetchGet from 'Modules/fetch/get';
import fetchPut from 'Modules/fetch/put';
import errorHandler from 'Modules/helper/error';
import { formatRef, completeProp } from 'Modules/helper/utility';
import { getMenuList } from 'Modules/menu';
import { showNotification } from 'Modules/notification';
import { logout } from 'Modules/auth';
import { clearConversationState } from 'Modules/conversations';
import { endpoints, configValues } from 'Config';

const CHANNEL_FETCH_START = 'channel/fetch/start';
const CHANNEL_FETCH_STOP = 'channel/fetch/stop';
const CHANNEL_LIST_SET = 'channel/list/set';
const CHANNEL_ACTIVE_SET = 'channel/active/set';

const initialState = {
  channels: [],
  activeChannel: null,
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANNEL_FETCH_START: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case CHANNEL_FETCH_STOP: {
      return {
        ...state,
        isFetching: false,
      };
    }

    case CHANNEL_LIST_SET: {
      return {
        ...state,
        channels: action.payload,
      };
    }

    case CHANNEL_ACTIVE_SET: {
      return Object.assign({}, state, {
        activeChannel: action.payload,
      });
    }

    default:
      return state;
  }
};

const setActiveChannel = channel => {
  const dispatchFunc = async dispatch => {
    dispatch({
      type: CHANNEL_FETCH_START,
    });
    try {
      await dispatch({
        type: CHANNEL_ACTIVE_SET,
        payload: channel,
      });
      await dispatch(getMenuList());
      await dispatch(clearConversationState());
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: CHANNEL_FETCH_STOP,
      });
    }
  };
  return dispatchFunc;
};

const getChannelList = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, userChannel } = getState();
    const { token } = userLogged;
    const { activeChannel } = userChannel;
    const url = formatRef(endpoints.CHANNEL, endpoints.USER);

    dispatch({
      type: CHANNEL_FETCH_START,
    });
    
    await dispatch({
      type: CHANNEL_LIST_SET,
      payload: {},
    });

    try {
      let response = await fetchGet(url, token, null, 'v3');

      if (!response.ok) {
        response = await response.json();

        if (
          configValues.EXPIRE_TOKEN_MESSAGES.indexOf(response.message) !== -1
        ) {
          dispatch(logout(true));
          throw new Error('notif.auth.sessionExpire');
        }
      }
      response = await response.json();

      const channels = response.data;

      await dispatch({
        type: CHANNEL_LIST_SET,
        payload: channels,
      });

      let tempActiveChannel = null;
      if (channels.length > 0) {
        const findChannel = activeChannel && channels.find(c => c.id === activeChannel.id);
        if (activeChannel && findChannel) {
          tempActiveChannel = findChannel;
        } else {
          tempActiveChannel = channels[0];
        }

        dispatch(setActiveChannel(tempActiveChannel));
      } else {
        throw new Error('notif.channel.noChannel');
      }
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: CHANNEL_FETCH_STOP,
      });
    }
  };

  return dispatchFunc;
};

const updateChannel = body => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, userChannel } = getState();
    const { token } = userLogged;
    const { activeChannel } = userChannel;
    const url = formatRef(endpoints.CHANNEL);
    const completedBody = completeProp(activeChannel, body);

    dispatch({
      type: CHANNEL_FETCH_START,
    });

    try {
      const response = await fetchPut(url, token, null, completedBody, 'v3');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      await dispatch(getChannelList());

      dispatch(
        showNotification({
          message: 'channelManagement.botUpdated',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: CHANNEL_FETCH_STOP,
      });
    }
  };

  return dispatchFunc;
};

export { getChannelList, setActiveChannel, updateChannel };
