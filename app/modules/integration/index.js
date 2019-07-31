import fetchGet from 'Modules/fetch/get';
import fetchPost from 'Modules/fetch/post';
import fetchPut from 'Modules/fetch/put';
import errorHandler from 'Modules/helper/error';
import { endpoints, configValues } from 'Config';
import { formatRef } from 'Modules/helper/utility';
import { showNotification } from 'Modules/notification';

const INTEGRATION_FETCH_START = 'integration/fetch/start';
const INTEGRATION_FETCH_STOP = 'integration/fetch/stop';
const INTEGRATION_SET = 'integration/set';

const initialState = {
  isFetching: false,
  integrationData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INTEGRATION_FETCH_START: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case INTEGRATION_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case INTEGRATION_SET: {
      return Object.assign({}, state, {
        ...action.payload,
      });
    }

    default:
      return state;
  }
};

const getIntegration = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged: { token }, userChannel: { activeChannel: { id } } } = getState();
    const url = formatRef(endpoints.INTEGRATION);
    const query = { channel_id: id };

    dispatch({ type: INTEGRATION_FETCH_START });

    try {
      let response = await fetchGet(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      const { id: idIntegration, whatsapp, web, telegram, line, nlp, woocommerce } = response.data;

      await dispatch({
        type: INTEGRATION_SET,
        payload: { idIntegration, integrationData: response.data, whatsapp, web, telegram, line, nlp, woocommerce },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: INTEGRATION_FETCH_STOP });
    }
  };
  return dispatchFunc;
};

const processIntegration = payload => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged: { token }, userChannel: { activeChannel: { id } }, integration } = getState();
    const url = formatRef(endpoints.INTEGRATION);
    const body = {
      ...integration.integrationData,
      id: integration.idIntegration || '',
      channelId: id,
      ...payload,
    };

    dispatch({ type: INTEGRATION_FETCH_START });

    try {
      let response = "";
      
      if (integration.idIntegration) {
        response = await fetchPut(url, token, null, body, 'v2');
      } else {
        response = await fetchPost(url, token, body, null, 'v2');
      }

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      const { id: idIntegration, whatsapp, web, telegram, line, nlp, woocommerce } = response.data;

      await dispatch({
        type: INTEGRATION_SET,
        payload: { idIntegration, integrationData: response.data, whatsapp, web, telegram, line, nlp, woocommerce },
      });

      await dispatch(
        showNotification({
          message: 'notif.integration.successUpdate',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: INTEGRATION_FETCH_STOP });
    }
  };
  return dispatchFunc;
};

export { getIntegration, processIntegration };
