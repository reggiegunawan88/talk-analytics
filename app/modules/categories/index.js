import fetchGet from 'Modules/fetch/get';
import fetchPost from 'Modules/fetch/post';
import { errorHandler } from 'Modules/helper/error';
import { formatRef } from 'Modules/helper/utility/index';
import { configValues, endpoints } from 'Config';
import { showNotification } from 'Modules/notification';

const CATEGORIES_FETCH_START = 'categories/fetch/start';
const CATEGORIES_FETCH_END = 'categories/fetch/end';
const CATEGORIES_SET = 'categories/set';

const initialState = {
  isFetching: false,
  categories: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CATEGORIES_FETCH_START: {
      return Object.assign({}, state, { isFetching: true });
    }

    case CATEGORIES_FETCH_END: {
      return Object.assign({}, state, { isFetching: false });
    }

    case CATEGORIES_SET: {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
};

const fetchCategories = payload => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.CATEGORIES);
    const query = { channel_id: id, ...payload };

    dispatch({ type: CATEGORIES_FETCH_START });

    try {
      let response = await fetchGet(url, token, query, 'v2');

      if (!response.ok) {
        response = await response.json();
        throw new Error(response.message);
      }

      response = await response.json();

      const categories = response.data;

      dispatch({
        type: CATEGORIES_SET,
        payload: { categories }
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: CATEGORIES_FETCH_END
      });
    }
  };

  return dispatchFunc;
};

const addCategories = categoriesInfo => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.CATEGORY);
    const body = { channelId: id, ...categoriesInfo };

    dispatch({ type: CATEGORIES_FETCH_START });

    try {
      const response = await fetchPost(url, token, body, null, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(
        showNotification({
          message: 'notif.categories.successAdd',
          type: configValues.NOTIF_TYPE.SUCCESS
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: CATEGORIES_FETCH_END });
    }
  };

  return dispatchFunc;
};

export { fetchCategories, addCategories };
