import fetchGet from 'Modules/fetch/get';
import errorHandler from 'Modules/helper/error';
import { endpoints } from 'Config';
import { formatRef } from 'Modules/helper/utility';

const CUST_FETCH_START = 'customer/fetch/start';
const CUST_SET = 'customer/set';
const CUST_FETCH_STOP = 'customer/fetch/stop';

const initialState = {
  isFetching: false,
  customers: [],
  hasMoreData: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CUST_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case CUST_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case CUST_SET: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};

const getCustomers = (search='',payload={}) => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id },
      },
      customer: { customers }
    } = getState();
    let url = formatRef(endpoints.CUSTOMER);
    let query = { channel_id: id, page: 1, size: 10, sort: 'desc' };
    if(search){
      url = formatRef(endpoints.CUSTOMER, endpoints.NAME);
      query = { ...query, name: search, ...payload };
    }

    dispatch({ type: CUST_FETCH_START });
    if (payload.page === 1) {
      await dispatch({
        type: CUST_SET,
        payload: { 
          customers: [],
          hasMoreData: false
        },
      });
    }
    try {
      let response = await fetchGet(url, token, query);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      
      let listnew = customers;
      if (payload.page === 1) {
        listnew = response.data;
      } else {
        response.data.map(product => listnew.push(product));
      }

      await dispatch({
        type: CUST_SET,
        payload: { 
          customers: listnew,
          hasMoreData: response.data.length === payload.size
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: CUST_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

export { getCustomers };
