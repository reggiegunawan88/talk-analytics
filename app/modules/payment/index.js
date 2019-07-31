import fetchGet from 'Modules/fetch/get';
import fetchPost from 'Modules/fetch/post';
import errorHandler from 'Modules/helper/error';
import { endpoints } from 'Config';
import { formatRef } from 'Modules/helper/utility';

const PAYMENT_FETCH_START = 'payment/fetch/start';
const PAYMENT_SET = 'payment/set';
const PAYMENT_FETCH_STOP = 'payment/fetch/stop';

const initialState = {
  listInvoice: [],
  statusUpgrade: false,
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case PAYMENT_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case PAYMENT_SET: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};

const checkUpgrade = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      } 
    } = getState();
    const url = formatRef(endpoints.BILL, endpoints.CAN,  endpoints.UPGRADE);
    const query = { channel_id: id };

    dispatch({ type: PAYMENT_FETCH_START });
    await dispatch({
      type: PAYMENT_SET,
      payload: { listInvoice: [], statusUpgrade: false },
    });

    try {
      let response = await fetchGet(url, token, query);

      if (!response.ok) {
        response = await response.json();
        const listInvoice = response.data.bill;

        await dispatch({
          type: PAYMENT_SET,
          payload: { listInvoice, statusUpgrade: false },
        });
      } else {
        await dispatch({
          type: PAYMENT_SET,
          payload: { statusUpgrade: true },
        });
      }
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PAYMENT_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const upgradePlan = (payload, register='') => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
    } = getState();
    let url = formatRef(endpoints.BILL, endpoints.UPGRADE);
    if (register) {
      url = formatRef(endpoints.BILL);
    }

    dispatch({ type: PAYMENT_FETCH_START });

    try {
      let response = await fetchPost(url, token, payload);
      
      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      const listInvoice = [response.data];

      await dispatch({
        type: PAYMENT_SET,
        payload: { listInvoice },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PAYMENT_FETCH_STOP });
    }
  };

  return dispatchFunc;
};



export { checkUpgrade, upgradePlan };
