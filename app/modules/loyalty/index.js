import fetchGet from 'Modules/fetch/get';
import fetchPost from 'Modules/fetch/post';
import fetchPut from 'Modules/fetch/put';
import fetchDelete from 'Modules/fetch/delete';
import errorHandler from 'Modules/helper/error';
import { configValues, endpoints } from 'Config';
import { showNotification } from 'Modules/notification';
import { formatRef } from 'Modules/helper/utility';

const LOYALTY_FETCH_START = 'loyalty/fetch/start';
const LOYALTY_SET = 'loyalty/set';
const LOYALTY_FETCH_STOP = 'loyalty/fetch/stop';

const initialState = {
  isFetching: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOYALTY_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case LOYALTY_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case LOYALTY_SET: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};

const addLoyalty = loyaltyInfo => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.LOYALTY);
    const body = { channelId: id, ...loyaltyInfo };

    dispatch({ type: LOYALTY_FETCH_START });

    try {
      const response = await fetchPost(url, token, body);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(
        showNotification({
          message: 'notif.loyalty.successUpdate',
          type: configValues.NOTIF_TYPE.SUCCESS
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: LOYALTY_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const getLoyalities = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.LOYALTY);
    const query = { channel_id: id, page: 1, size: 10 };

    dispatch({ type: LOYALTY_FETCH_START });

    try {
      let response = await fetchGet(url, token, query);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      const loyalities = response.data;

      await dispatch({
        type: LOYALTY_SET,
        payload: { loyalities }
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: LOYALTY_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const updateLoyalty = loyalty => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token }
    } = getState();
    const url = formatRef(endpoints.LOYALTY);

    dispatch({ type: LOYALTY_FETCH_START });

    try {
      const response = await fetchPut(url, token, null, loyalty);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(
        showNotification({
          message: 'notif.loyalty.successUpdateLoyalty',
          type: configValues.NOTIF_TYPE.SUCCESS
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: LOYALTY_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const deleteLoyalty = id => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token }
    } = getState();
    const url = formatRef(endpoints.LOYALTY);

    dispatch({ type: LOYALTY_FETCH_START });

    try {
      const response = await fetchDelete(url, token, { id });

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(getLoyalities());
      dispatch(
        showNotification({
          message: 'notif.loyalty.successDeleteLoyalty',
          type: configValues.NOTIF_TYPE.SUCCESS
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: LOYALTY_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

export { addLoyalty, getLoyalities, updateLoyalty, deleteLoyalty };
