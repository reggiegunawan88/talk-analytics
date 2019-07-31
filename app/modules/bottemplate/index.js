import fetchGet from 'Modules/fetch/get';
import errorHandler from 'Modules/helper/error';
import { endpoints } from 'Config';
import { formatRef } from 'Modules/helper/utility';

const TEMPLATE_FETCH_START = 'template/fetch/start';
const TEMPLATE_FETCH_STOP = 'template/fetch/stop';
const TEMPLATE_SET = 'template/set';

const initialState = {
  isFetching: false,
  listTemplate: [],
  hasMoreData: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TEMPLATE_FETCH_START: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case TEMPLATE_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case TEMPLATE_SET: {
      return Object.assign({}, state, {
        ...action.payload,
      });
    }

    default:
      return state;
  }
};

const getTemplates = (payload={}) => {
  const dispatchFunc = async (dispatch, getState) => {
    if (payload.page === 1) {
      await dispatch({
        type: TEMPLATE_SET,
        payload: { 
          listTemplate: [],
          hasMoreData: false
        },
      });
    }
    const { 
      userLogged: { token },
      botTemplate: { listTemplate } } = getState();
    const url = formatRef(endpoints.TEMPLATE);
    const query = { ...payload };

    dispatch({ type: TEMPLATE_FETCH_START });
    try {
      let response = await fetchGet(url, token, query);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      const listnew = listTemplate;
      response.data.map((data) => {
        listnew.push({
          ...data,
          title: data.title, 
          value: data.name,
        });
      });


      await dispatch({
        type: TEMPLATE_SET,
        payload: { 
          listTemplate: listnew,
          hasMoreData: response.data.length === payload.size 
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: TEMPLATE_FETCH_STOP });
    }
  };
  return dispatchFunc;
};

export { getTemplates };
