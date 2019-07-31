import fetchPost from 'Modules/fetch/post';
import fetchPut from 'Modules/fetch/put';
import fetchGet from 'Modules/fetch/get';
import errorHandler from 'Modules/helper/error';
import { configValues, endpoints } from 'Config';
import { formatRef } from 'Modules/helper/utility';
import { showNotification, hideNotification } from 'Modules/notification';
import { getChannelList } from 'Modules/channel';
import { upgradePlan } from 'Modules/payment';
import { clearConversationState } from 'Modules/conversations';
import { clearProfileState } from 'Modules/profile';
import { googleAuth, googleLogout } from '../../lib/googleSignIn';

const AUTH_REGISTER_START = 'auth/register/start';
const AUTH_REGISTER_FINISH = 'auth/register/success';
const AUTH_LOGIN_START = 'auth/login/start';
const AUTH_LOGIN_SUCCESS = 'auth/login/success';
const AUTH_LOGIN_STOP = 'auth/login/stop';
const AUTH_STORE_PROFILE = 'auth/store/profile';
const STORE_PLAN_TEMP = 'auth/store/plan/temp';
const SET_GOOGLE_USER_DATA = 'auth/set/google-user-data';
const AUTH_LOGOUT_SUCCESS = 'auth/logout/success';

const initialState = {
  token: localStorage.talklogicToken,
  isValid: Boolean(localStorage.talklogicToken),
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN_START: {
      localStorage.clear();
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case AUTH_LOGOUT_SUCCESS: {
      return Object.assign(
        {},
        {
          isFetching: false,
          isValid: false,
          token: null,
          googleUser: null,
        }
      );
    }

    case AUTH_LOGIN_SUCCESS: {
      const { token } = action.payload;
      localStorage.talklogicToken = token;

      return Object.assign({}, state, {
        isFetching: false,
        ...action.payload
      });
    }

    case AUTH_STORE_PROFILE: {
      return Object.assign({}, state, action.payload);
    }

    case AUTH_LOGIN_STOP: {
      return Object.assign({}, state, {
        isFetching: false,
      });
    }

    case AUTH_REGISTER_START: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case AUTH_REGISTER_FINISH: {
      return Object.assign({}, state, {
        isFetching: false,
      });
    }

    case STORE_PLAN_TEMP: {
      return Object.assign({}, state, action.payload);
    }

    case SET_GOOGLE_USER_DATA: {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
};

const login = body => {
  const dispatchFunc = async dispatch => {
    const url = formatRef(endpoints.AUTH);

    dispatch({
      type: AUTH_LOGIN_START,
    });

    try {
      let response = await fetchPost(url, null, body);

      if (!response.ok) {
        response = await response.json();
        throw new Error(response.message);
      }

      response = await response.json();

      const token = response.data;

      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: {
          token,
          isValid: true
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: AUTH_LOGIN_STOP,
      });
    }
  };
  return dispatchFunc;
};

const storeGoogleUser = body => {
  const dispatchFunc = async dispatch => {
    try {
      await dispatch({
        type: SET_GOOGLE_USER_DATA,
        payload: {
          googleUser: body,
        },
      });
    } catch (e) {
      dispatch(
        showNotification({
          message: 'notif.somethingWentWrong',
          type: configValues.NOTIF_TYPE.DANGER,
        })
      );
    }
  };
  return dispatchFunc;
};

const registerAccount = user => {
  const dispatchFunc = async (dispatch) => {
    const registerUserUrl = formatRef(endpoints.REGISTER);
    const idToken = user.idToken;
    const data = { ...user, role: 'super-admin' }

    dispatch({
      type: AUTH_LOGIN_START,
    });

    try {
      const response = await fetchPost(
        registerUserUrl,
        idToken,
        data,
        null,
        'v3'
      );

      if (!response.ok) {
        throw new Error(
          (await response.json()).message || 'notif.somethingWentWrong'
        );
      }

      await dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: {
          token: idToken,
          googleUser: user,
          isValid: true
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: AUTH_LOGIN_STOP,
      });
    }
  };

  return dispatchFunc;
};

const registerChannel = channel => {
  const dispatchFunc = async (dispatch, getState) => {
    const { 
      userLogged: { token: idToken },
      profile: { id: userId },
      plan: { plans },
    } = getState();
    const registerChannelUrl = formatRef(endpoints.CHANNEL);
    const registerBankUrl = formatRef(endpoints.BANK);
    const updatedChannelData = {
      userId: [userId],
      ...channel,
      inactive: !channel.inactive,
    };

    dispatch({
      type: AUTH_REGISTER_START,
    });

    try {

      let response = await fetchPost(
        registerChannelUrl,
        idToken,
        updatedChannelData,
        null,
        'v3'
      );

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      if (channel.bank && ( channel.bank.label || channel.bank.bank_name || channel.bank.bank_number || channel.bank.bank_account )) {
        const createBankData = {
          channelId: response.data.id,
          ...channel.bank,
        };
        const createBank = await fetchPost(
          registerBankUrl,
          idToken,
          createBankData,
          null,
          'v2'
        );

        if (!createBank.ok) {
          throw new Error('notif.somethingWentWrong');
        }
      }

      if (channel.plan) {
        const planChoosen = plans.find((p) => p.id === channel.plan);
        const payloadPlan = {
          channelId: response.data.id,
          plan: channel.plan,
          amount: planChoosen.priceComplete,
          email: channel.email,
        };
        await dispatch(upgradePlan(payloadPlan, 'register'));
      }

      await dispatch(
        showNotification({
          message: 'notif.register.success',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
      
      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: {
          token: idToken,
          isValid: true,
          googleUser: null
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: AUTH_LOGIN_STOP,
      });
    }
  };

  return dispatchFunc;
};

const loginWithGoogle = (idToken, profile) => {
  const dispatchFunc = async dispatch => {
    const url = formatRef(endpoints.LOGIN, endpoints.VERIFY);

    dispatch({
      type: AUTH_LOGIN_START,
    });

    try {
      let response = await fetchGet(url, idToken);

      if (!response.ok) {
        response = await response.json();
        if (response.status === configValues.HTTP_STATUS.UNAUTH) {
          await dispatch(
            registerAccount({
              name: `${profile.fname}${profile.lname ? ` ${profile.lname}` : ''}`,
              email: profile.email,
              idToken,
            })
          );
        } else {
          throw new Error(response.message);
        }
      }

      await dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: {
          token: googleAuth().id_token,
          isValid: true
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({
        type: AUTH_LOGIN_STOP,
      });
    }
  };
  return dispatchFunc;
};

const getProfile = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const { token } = getState().userLogged;
    const url = formatRef(endpoints.USER);

    try {
      let response = await fetchGet(url, token, null, 'v3');

      if (!response.ok) {
        throw new Error('notif.auth.badLogin');
      }

      response = await response.json();

      dispatch({
        type: AUTH_STORE_PROFILE,
        payload: response.data,
      });
    } catch (e) {
      dispatch(errorHandler(e));
    }
  };
  return dispatchFunc;
};

const updatePlan = plan => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, userChannel } = getState();
    const { token } = userLogged;
    const { id } = userChannel.activeChannel;
    const url = formatRef(endpoints.SHOPPING, endpoints.UPGRADE);
    const query = {
      channel_id: id,
      plan,
    };

    try {
      const response = await fetchPut(url, token, query);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(getChannelList());

      dispatch(
        showNotification({
          message: 'notif.shopping.successRequest',
          type: configValues.NOTIF_TYPE.SUCCESS,
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    }
  };

  return dispatchFunc;
};

const logout = force => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged } = getState();
    const { token } = userLogged;
    dispatch(hideNotification());

    googleLogout();

    const url = formatRef(endpoints.LOGOUT);

    try {
      if (!force) {
        const response = await fetchGet(url, token, null, 'v2');

        if (!response.ok) {
          throw new Error('notif.somethingWentWrong');
        }
      }
      localStorage.clear();
      dispatch(clearConversationState());
      dispatch(clearProfileState());

      dispatch({
        type: AUTH_LOGOUT_SUCCESS,
      });
    } catch (e) {
      dispatch(errorHandler(e));
    }
  };

  return dispatchFunc;
};

export {
  login,
  loginWithGoogle,
  registerAccount,
  storeGoogleUser,
  getProfile,
  updatePlan,
  logout,
  registerChannel,
};
