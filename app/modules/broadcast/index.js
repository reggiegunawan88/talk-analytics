import fetchPost from '../fetch/post';
import errorHandler from '../helper/error';
import { configValues, endpoints } from '../../config';
import { showNotification } from '../notification';
import { formatRef } from '../helper/utility';

const BROADCAST_FETCH_START = 'broadcast/fetch/start';
const BROADCAST_FETCH_STOP = 'broadcast/fetch/stop';

const initialState = {
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BROADCAST_FETCH_START: {
      return {
        ...state,
        isFetching: true,
      };
    }

    case BROADCAST_FETCH_STOP: {
      return {
        ...state,
        isFetching: false,
      };
    }

    default:
      return state;
  }
};

const sendBroadcast = broadcastDetail => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id },
      },
    } = getState();
    const url = formatRef(endpoints.BROADCAST);
    const body = { channelId: id, ...broadcastDetail };

    dispatch({
      type: BROADCAST_FETCH_START,
    });

    try {
      let response = await fetchPost(url, token, body, null, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(
        showNotification({
          message: 'notif.broadcast.successSend',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: BROADCAST_FETCH_STOP,
      });
    }
  };
  return dispatchFunc;
};

export { sendBroadcast };
