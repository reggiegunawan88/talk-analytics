import fetchGet from 'Modules/fetch/get';
import fetchPost from 'Modules/fetch/post';
import errorHandler from 'Modules/helper/error';
import { endpoints, configValues } from 'Config';
import { showNotification } from 'Modules/notification';
import { formatRef, urlParams } from 'Modules/helper/utility';

const ORDER_FETCH_START = 'order/fetch/start';
const ORDER_FETCH_STOP = 'order/fetch/stop';
const ORDER_LIST_SET = 'order/list/set';
const ORDER_FILTER_SET = 'order/filter/set';
const ORDER_FILTERED_ORDER_SET = 'order/filtered/set';

const initialState = {
  orders: [],
  currentPage: 0,
  filteredOrder: [],
  filter: 'all',
  isFetching: false,
  hasMoreData: false,
  notesDetail: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ORDER_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case ORDER_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case ORDER_FILTER_SET: {
      return { ...state, ...action.payload };
    }

    case ORDER_LIST_SET: {
      return { ...state, ...action.payload };
    }

    case ORDER_FILTERED_ORDER_SET: {
      return { ...state, filteredOrder: action.payload };
    }

    default:
      return state;
  }
};

const getOrderNote = orderId => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      },
    } = getState();
    const url = formatRef(endpoints.ORDERNOTES);
    const query = { channel_id: id, order_id: orderId };
    
    dispatch({ type: ORDER_FETCH_START });
    
    await dispatch({
      type: ORDER_LIST_SET,
      payload: {
        notesDetail: '',
      }
    });
    try {
      let response = await fetchGet(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      const notesLength = response.data.length;
      const notes = notesLength ? response.data[notesLength-1].note : '';

      await dispatch({
        type: ORDER_LIST_SET,
        payload: {
          notesDetail: notes,
        }
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: ORDER_FETCH_STOP });
    }
  }

  return dispatchFunc;
};

const getOrderList = pagination => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      },
      userOrder: { orders }
    } = getState();
    const url = formatRef(endpoints.ORDERS);
    const query = {
      channel_id: id,
      ...pagination
    };

    dispatch({ type: ORDER_FETCH_START });
    
    if (pagination.page === 1) {
      await dispatch({
        type: ORDER_LIST_SET,
        payload: {
          orders: [],
          hasMoreData: false,
        }
      });
    }

    try {
      let response = await fetchGet(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      let listnew = orders;
      if (pagination.page === 1) {
        listnew = response.data;
      } else {
        listnew = [...listnew, ...response.data];
      }

      await dispatch({
        type: ORDER_LIST_SET,
        payload: {
          orders: listnew,
          hasMoreData: response.data.length === pagination.size
        }
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: ORDER_FETCH_STOP });
    }
  };
  return dispatchFunc;
};  

const setFilteredOrder = (filter = 'all') => {
  const dispatchFunc = (dispatch, getState) => {
    const { userOrder } = getState();
    dispatch({ type: ORDER_FETCH_START });

    try {
      const totalOrder = [];
      if(filter !== 'all') {
        userOrder.orders.map(order => {
          if(order.status === filter.toLowerCase()){
            totalOrder.push(order)
          }
        });
      }

      dispatch({
        type: ORDER_FILTER_SET,
        payload: { filter }
      });

      dispatch({
        type: ORDER_FILTERED_ORDER_SET,
        payload: totalOrder
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: ORDER_FETCH_STOP });
    }
  };
  return dispatchFunc;
};

const createOrder = (payload, status) => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const { billing, shipping, listProduct, shippingFee } = payload;
    const url = formatRef(endpoints.ORDER);
    const lineItems = [];
    listProduct.map(product => {
      let variation = {};
      if(product.variantId){
        variation = { variation_id: product.variantId };
      }
      lineItems.push({ 
        product_id: product.id, 
        quantity: parseInt(product.qty),
        ...variation
      });
    });
    const body = {
      channelId: id,
      status,
      billing: {
        first_name: billing.firstName,
        last_name: billing.lastName,
        address_1: billing.address,
        city: billing.city,
        postcode: billing.zipCode,
        email: billing.email,
        phone: billing.phone
      },
      shipping: {
        first_name: shipping.firstName,
        last_name: shipping.lastName,
        address_1: shipping.address,
        city: shipping.city,
        postcode: shipping.zipCode,
      },
      line_items: lineItems,
      shipping_lines: [{
        method_id: "flat",
        method_title: shipping.shippingAgentId,
        total: shippingFee.toString()
      }]
    };
    
    dispatch({ type: ORDER_FETCH_START });

    try {
      let response = await fetchPost(url, token, body, null, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      if (response.data.id && shipping.notes) {
        const paramUrl = { channel_id: id, order_id: response.data.id };
        const urlNotes = formatRef(endpoints.ORDERNOTE);
        const bodyNotes = { note: shipping.notes };
        
        try {
          let responseNotes = await fetchPost(urlNotes + urlParams(paramUrl), token, bodyNotes, null, 'v2');

          if (!responseNotes.ok) {
            throw new Error('notif.somethingWentWrong');
          }

          responseNotes = await responseNotes.json();
        } catch (e) {
          dispatch(errorHandler(e));
        }
      }

      dispatch(
        showNotification({
          message: 'notif.order.successAdd',
          type: configValues.NOTIF_TYPE.SUCCESS
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: ORDER_FETCH_STOP });
    }
  }
  return dispatchFunc
}

export { getOrderList, setFilteredOrder, createOrder, getOrderNote };
