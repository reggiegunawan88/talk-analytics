import fetchGet from '../fetch/get';
import fetchPut from '../fetch/put';
import errorHandler from '../helper/error';
import { endpoints, configValues } from '../../config';
import { formatRef } from '../helper/utility';
import { showNotification } from '../notification';

const PLATFORM_FETCH_START = 'platform/fetch/start';
const PLATFORM_FETCH_STOP = 'platform/fetch/stop';
const PLATFORM_SET = 'platform/set';

const initialState = {
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PLATFORM_FETCH_START: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case PLATFORM_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case PLATFORM_SET: {
      return Object.assign({}, state, {
        ...action.payload,
      });
    }

    default:
      return state;
  }
};

const getPlatforms = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, userChannel } = getState();
    const { token } = userLogged;
    const { activeChannel } = userChannel;
    const url = formatRef(endpoints.PLATFORM, endpoints.CHANNEL);
    const query = {
      channel_id: activeChannel.id,
      platform: 'all',
    };

    dispatch({ type: PLATFORM_FETCH_START });

    try {
      let response = await fetchGet(url, token, query);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      const { whatsapp, web, line } = response.data;

      await dispatch({
        type: PLATFORM_SET,
        payload: { whatsapp, web, line },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PLATFORM_FETCH_STOP });
    }
  };
  return dispatchFunc;
};

const updatePlatform = platform => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, userChannel } = getState();
    const { token } = userLogged;
    const { activeChannel } = userChannel;
    const url = formatRef(endpoints.PLATFORM, endpoints.UPDATE);
    const body = {
      channelId: activeChannel.id,
      ...platform,
    };

    dispatch({ type: PLATFORM_FETCH_START });

    try {
      let response = await fetchPut(url, token, null, body);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      const { whatsapp, web, line } = response.data;

      await dispatch({
        type: PLATFORM_SET,
        payload: { whatsapp, web, line },
      });

      await dispatch(
        showNotification({
          message: 'notif.platform.successUpdate',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PLATFORM_FETCH_STOP });
    }
  };
  return dispatchFunc;
};

export { getPlatforms, updatePlatform };
