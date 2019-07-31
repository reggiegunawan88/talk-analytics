import fetchGet from 'Modules/fetch/get';
import fetchPut from 'Modules/fetch/put';
import fetchPost from 'Modules/fetch/post';
import errorHandler from 'Modules/helper/error';
import { configValues, endpoints } from 'Config';
import { showNotification } from 'Modules/notification';
import { formatRef } from 'Modules/helper/utility';
import { logout } from 'Modules/auth';

const PROFILE_FETCH_START = 'profile/fetch/start';
const PROFILE_SET = 'profile/set';
const PROFILE_FETCH_STOP = 'profile/fetch/stop';

const CLEAR_PROFILE_STATE = 'profile/clear';

const AGENT_FETCH_START = 'agent/fetch/start';
const AGENT_SET = 'agent/set';
const AGENT_FETCH_STOP = 'agent/fetch/stop';

const AGENT_REGISTER_START = 'agent/register/start';
const AGENT_REGISTER_SUCCESS = 'agent/register/success';
const AGENT_REGISTER_STOP = 'agent/register/stop';

const AGENT_EDIT_START = 'agent/edit/start';
const AGENT_EDIT_SUCCESS = 'agent/edit/success';
const AGENT_EDIT_STOP = 'agent/edit/stop';

const initialState = {
  isFetching: false,
  agentList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_FETCH_START: {
      return {
        ...state,
        isFetching: true,
      };
    }

    case PROFILE_FETCH_STOP: {
      return {
        ...state,
        isFetching: false,
      };
    }

    case PROFILE_SET: {
      return {
        ...state,
        ...action.payload,
        channelId: action.payload.channel
      };
    }

    case CLEAR_PROFILE_STATE: {
      return {
        ...initialState,
      };
    }

    case AGENT_FETCH_START: {
      return {
        ...state,
        isFetching: true,
      };
    }

    case AGENT_FETCH_STOP: {
      return {
        ...state,
        isFetching: false,
      };
    }

    case AGENT_SET: {
      return {
        ...state,
        agentList: action.payload,
      };
    }

    case AGENT_REGISTER_START: {
      return {
        ...state,
        isFetching: true,
      };
    }

    case AGENT_REGISTER_SUCCESS: {
      return {
        ...state,
        agentList: [...state.agentList, action.payload],
      };
    }

    case AGENT_REGISTER_STOP: {
      return {
        ...state,
        isFetching: false,
      };
    }

    case AGENT_EDIT_START: {
      return {
        ...state,
        isFetching: true,
      };
    }

    case AGENT_EDIT_SUCCESS: {
      const agentIndex = state.agentList.findIndex(
        agent => agent.id === action.payload.id
      );
      const updatedAgentList = [...state.agentList];
      updatedAgentList[agentIndex] = action.payload;

      return {
        ...state,
        agentList: updatedAgentList,
      };
    }

    case AGENT_EDIT_STOP: {
      return {
        ...state,
        isFetching: false,
      };
    }

    default:
      return state;
  }
};

const getCompleteProfile = (body, profile) => {
  const profileProps = [
    'id',
    'name',
    'address',
    'subdistrict',
    'city',
    'province',
    'phone',
    'email',
    'image',
  ];
  const updatedBody = body;

  profileProps.forEach(prop => {
    if (!updatedBody[prop]) updatedBody[prop] = profile[prop];
  });

  return updatedBody;
};

const getProfile = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const { token } = getState().userLogged;
    const url = formatRef(endpoints.USER);

    try {
      let response = await fetchGet(url, token, {}, 'v3');

      if (!response.ok) {
        response = await response.json();

        if (
          configValues.EXPIRE_TOKEN_MESSAGES.indexOf(response.message) !== -1
        ) {
          dispatch(logout(true));
          throw new Error('notif.auth.sessionExpire');
        }
        throw new Error('notif.auth.badLogin');
      }

      response = await response.json();

      dispatch({
        type: PROFILE_SET,
        payload: response.data,
      });
    } catch (e) {
      dispatch(errorHandler(e));
    }
  };
  return dispatchFunc;
};

const updateProfile = body => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, profile } = getState();
    const { token } = userLogged;
    const url = formatRef(endpoints.USER);
    const completeProfile = getCompleteProfile(body, profile);

    dispatch({
      type: PROFILE_FETCH_START,
    });

    try {
      let response = await fetchPut(url, token, null, completeProfile, 'v3');

      if (!response.ok) {
        throw new Error('notif.auth.badLogin');
      }

      response = await response.json();

      dispatch({
        type: PROFILE_SET,
        payload: response.data,
      });

      dispatch(
        showNotification({
          message: 'notif.profile.successUpdate',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: PROFILE_FETCH_STOP,
      });
    }
  };
  return dispatchFunc;
};

const getAllAgent = channelId => {
  const dispatchFunc = async (dispatch, getState) => {
    const { token } = getState().userLogged;
    const url = formatRef(endpoints.USER, endpoints.ALL);

    dispatch({
      type: AGENT_FETCH_START,
    });

    try {
      let response = await fetchGet(
        url,
        token,
        {
          channel_id: channelId,
        },
        'v3'
      );

      if (!response.ok) {
        throw new Error('notif.auth.badLogin');
      }

      response = await response.json();

      dispatch({
        type: AGENT_SET,
        payload: response.data,
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: AGENT_FETCH_STOP,
      });
    }
  };
  return dispatchFunc;
};

const addNewAgent = data => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, userChannel } = getState();
    const { token } = userLogged;
    const { id } = userChannel.activeChannel;
    const url = formatRef(endpoints.USER);
    const body = {
      channel: [{ channelId: id, role: data.role }],
      ...data
    };

    dispatch({
      type: AGENT_REGISTER_START,
    });

    try {
      let response = await fetchPost(
        url,
        token,
        {
          ...body,
        },
        null,
        'v3'
      );

      if (!response.ok) {
        throw new Error('notif.auth.badLogin');
      }

      response = await response.json();

      dispatch({
        type: AGENT_REGISTER_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: AGENT_REGISTER_STOP,
      });
    }
  };
  return dispatchFunc;
};

const updateAgent = data => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, userChannel } = getState();
    const { token } = userLogged;
    const { id } = userChannel.activeChannel;
    const url = formatRef(endpoints.USER);
    const body = {
      channel: [{ channelId: id, role: data.role }],
      ...data
    }

    dispatch({
      type: AGENT_EDIT_START,
    });

    try {
      let response = await fetchPut(
        url,
        token,
        '',
        {
          ...body,
        },
        'v3'
      );

      if (!response.ok) {
        throw new Error('notif.auth.badLogin');
      }

      response = await response.json();

      dispatch({
        type: AGENT_EDIT_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: AGENT_EDIT_STOP,
      });
    }
  };
  return dispatchFunc;
};

const clearProfileState = () => {
  const dispatchFunc = async dispatch => {
    dispatch({
      type: CLEAR_PROFILE_STATE,
    });
  };
  return dispatchFunc;
};

export {
  getProfile,
  updateProfile,
  getAllAgent,
  addNewAgent,
  updateAgent,
  clearProfileState,
};
