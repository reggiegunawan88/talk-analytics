import fetchPost from 'Modules/fetch/post';
import fetchGet from 'Modules/fetch/get';
import { endpoints } from 'Config';
import { urlParams, formatRef, getDiffDate } from 'Modules/helper/utility';
import errorHandler from '../helper/error';

const EVENT_FETCH_START = 'event/fetch/start';
const EVENT_FETCH_STOP = 'event/fetch/stop';

const HUMAN_TO_BOT = "TAKEOVER_HUMAN_BOT";
const BOT_TO_HUMAN = "TAKEOVER_BOT_HUMAN";

const initialState = {
  isFetching: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case EVENT_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case EVENT_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    default:
      return state;
  }
}

const takeoverEvent = (status, agentId = '') => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      profile: { 
        id: userLoginId,
      },
      userChannel: {
        activeChannel: { id }
      },
      conversations: { 
        activeChatUser: { 
          customerId,
        } 
      }
    } = getState();

    const userId = agentId || userLoginId;
    const url = formatRef(endpoints.EVENT) + urlParams({ channel_id: id });
    let diffTime = 0;
    
    if (status === HUMAN_TO_BOT) {
      const urlGet = formatRef(endpoints.EVENT);
      const bodyGet = { user_id: userId, name: BOT_TO_HUMAN, channel_id: id, customer_id: customerId };
      try {
        let responseGet = await fetchGet(urlGet, token, bodyGet, null);
        if (!responseGet.ok) {
          throw new Error('notif.somethingWentWrong');
        }
        
        responseGet = await responseGet.json(); 
        if (responseGet.data.length > 0){
          const createdAt = responseGet.data[0].createdat;
          diffTime = getDiffDate(createdAt,new Date());
        }
      } catch(e) {
        dispatch(errorHandler(e));
      }
    }
    
    const body = { userId, name: status, customerId, action: diffTime };

    dispatch({ type: EVENT_FETCH_START });

    try {
      const response = await fetchPost(url, token, body, null);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: EVENT_FETCH_STOP });
    }
  }

  return dispatchFunc;
}

const takeoverBot = () => {
  const dispatchFunc = (dispatch) => {
    dispatch(takeoverEvent(HUMAN_TO_BOT));
  }

  return dispatchFunc;
}

const takeoverHuman = () => {
  const dispatchFunc = (dispatch, getState) => {
    const {
      conversations: { 
        activeChatUser: { 
          botStatus,
          agent 
        } 
      }
    } = getState();
    if (!botStatus) {
      dispatch(takeoverEvent(HUMAN_TO_BOT, agent));
    }
    dispatch(takeoverEvent(BOT_TO_HUMAN));
  }

  return dispatchFunc;
}

export { takeoverBot, takeoverHuman, takeoverEvent };
