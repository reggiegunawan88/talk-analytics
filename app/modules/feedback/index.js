import fetchGet from 'Modules/fetch/get';
import errorHandler from 'Modules/helper/error';
import { endpoints } from 'Config';
import { formatRef } from 'Modules/helper/utility';

const FEEDBACK_FETCH_START = 'feedback/fetch/start';
const FEEDBACK_SET = 'feedback/set';
const FEEDBACK_FETCH_STOP = 'feedback/fetch/stop';

const initialState = {
  feedbacks: [],
  isFetching: false,
  hasMoreData: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FEEDBACK_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case FEEDBACK_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case FEEDBACK_SET: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};

const getFeedback = (payload=[]) => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id },
      },
      feedback: { feedbacks }
    } = getState();
    const url = formatRef(endpoints.FEEDBACK);
    const query = { channel_id: id, ...payload };

    dispatch({ type: FEEDBACK_FETCH_START });

    if (payload.page === 1 || !payload.page){
      await dispatch({
        type: FEEDBACK_SET,
        payload: { 
          feedbacks: [],
          hasMoreData: false,
        },
      });
    }

    try {
      let response = await fetchGet(url, token, query);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      let listnew = feedbacks;
      if (payload.page === 1) {
        listnew = response.data;
      } else {
        response.data.map(feedback => listnew.push(feedback));
      }

      await dispatch({
        type: FEEDBACK_SET,
        payload: { 
          feedbacks: listnew, 
          hasMoreData: response.data.length === payload.size
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: FEEDBACK_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

export { getFeedback };
