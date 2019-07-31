import fetchGet from '../fetch/get';
import fetchPost from '../fetch/post';
import fetchPut from '../fetch/put';
import fetchDelete from '../fetch/delete';
import errorHandler from '../helper/error';
import { configValues, endpoints } from '../../config';
import { showNotification } from '../notification';
import { formatRef } from '../helper/utility';

const BANK_FETCH_START = 'bank/fetch/start';
const BANK_SET = 'bank/set';
const BANK_FETCH_STOP = 'bank/fetch/stop';

const initialState = {
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BANK_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case BANK_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case BANK_SET: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};

const addBank = bankInfo => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id },
      },
    } = getState();
    const url = formatRef(endpoints.BANK);
    const body = { channelId: id, ...bankInfo };

    dispatch({ type: BANK_FETCH_START });

    try {
      const response = await fetchPost(url, token, body, null, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(
        showNotification({
          message: 'notif.profile.successUpdate',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: BANK_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const getBanks = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id },
      },
    } = getState();
    const url = formatRef(endpoints.BANKS);
    const query = { channel_id: id, page: 0, size: 10 };

    dispatch({ type: BANK_FETCH_START });

    try {
      let response = await fetchGet(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      const banks = response.data;

      await dispatch({
        type: BANK_SET,
        payload: { banks },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: BANK_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const updateBank = bank => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
    } = getState();
    const url = formatRef(endpoints.BANK);

    dispatch({ type: BANK_FETCH_START });

    try {
      const response = await fetchPut(url, token, null, bank, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(
        showNotification({
          message: 'notif.profile.successUpdateBank',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: BANK_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const deleteBank = id => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
    } = getState();
    const url = formatRef(endpoints.BANK);

    dispatch({ type: BANK_FETCH_START });

    try {
      const response = await fetchDelete(url, token, { id }, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(getBanks());
      dispatch(
        showNotification({
          message: 'notif.profile.successDeleteBank',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: BANK_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

export { addBank, getBanks, updateBank, deleteBank };
