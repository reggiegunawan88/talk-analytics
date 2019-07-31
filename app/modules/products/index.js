import fetchGet from 'Modules/fetch/get';
import fetchDelete from 'Modules/fetch/delete';
import { formatRef } from 'Modules/helper/utility';
import { errorHandler } from 'Modules/helper/error';
import { endpoints, configValues as config } from 'Config';
import { showNotification } from 'Modules/notification';

const PRODUCTS_FETCH_START = 'products/fetch/start';
const PRODUCTS_FETCH_END = 'products/fetch/end';
const PRODUCTS_SET = 'products/set';
const PRODUCTS_ADD_START = 'products/add/start';
const PRODUCTS_ADD_END = 'products/add/end';

const initialState = {
  isFetching: false,
  successDelete: false,
  isAdding: false,
  list: [],
  hasMoreData: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PRODUCTS_FETCH_START: {
      return {
        ...state,
        isFetching: true
      };
    }

    case PRODUCTS_FETCH_END: {
      return {
        ...state,
        isFetching: false
      };
    }

    case PRODUCTS_SET: {
      return {
        ...state,
        ...action.payload
      };
    }

    case PRODUCTS_ADD_START: {
      return {
        ...state,
        isAdding: true
      };
    }

    case PRODUCTS_ADD_END: {
      return {
        ...state,
        isAdding: false
      };
    }

    default:
      return state;
  }
};

const getVariantValues = async (token,id,productId) => {
  const url = formatRef(endpoints.VARIANTS);
  const query = { channel_id: id, id: productId };
  let response = {};

  try {
    response = await fetchGet(url, token, query, 'v2');

    if (!response.ok) {
      throw new Error('notif.somethingWentWrong');
    }

    response = await response.json();
    response = response.data;
  } catch (e) {
    errorHandler(e);
  }

  return response;
};

const fetchProducts = payload => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      },
      products: { list }
    } = getState();
    const url = formatRef(endpoints.PRODUCTS);
    const query = { channel_id: id, ...payload };

    if (payload.page === 1) {
      dispatch({
        type: PRODUCTS_FETCH_START
      });
    }

    if (payload.page === 1) {
      await dispatch({
        type: PRODUCTS_SET,
        payload: {
          list: [],
          hasMoreData: false
        }
      });
    }

    try {
      let response = await fetchGet(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      response.data.map((data, idx)=>{
        if(data.variations.length > 0){
          getVariantValues(token, id, data.id).then(e => {
            response.data[idx].variations = e;
          });
        }
      })
      
      let listnew = list;
      
      if (payload.page === 1) {
        listnew = response.data;
      } else {
        response.data.map(product => listnew.push(product));
      }

      await dispatch({
        type: PRODUCTS_SET,
        payload: {
          list: listnew,
          hasMoreData: response.data.length === payload.size
        }
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PRODUCTS_FETCH_END });
    }
  };

  return dispatchFunc;
};

const deleteProduct = productId => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.product);
    const query = { channel_id: id, id: productId }

    dispatch({ type: PRODUCTS_FETCH_START });
    try {
      await fetchDelete(url, token, query, 'v2');

      dispatch(
        showNotification({
          message: 'notif.products.successDelete',
          type: config.NOTIF_TYPE.SUCCESS
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PRODUCTS_FETCH_END });
    }
  };

  return dispatchFunc;
};

export { fetchProducts, deleteProduct };
