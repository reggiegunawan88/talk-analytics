import * as _ from 'lodash';

import fetchGet from 'Modules/fetch/get';
import fetchPost from 'Modules/fetch/post';
import { configValues, endpoints } from 'Config';
import { showNotification } from 'Modules/notification';
import { formatRef } from 'Modules/helper/utility';
import { errorHandler } from 'Modules/helper/error';

const VARIANT_FETCH_START = 'variant/fetch/start';
const VARIANT_SET = 'variant/set';
const VARIANT_FETCH_STOP = 'variant/fetch/stop';

const initialState = {
  isFetching: false,
  variantList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VARIANT_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case VARIANT_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case VARIANT_SET: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};

const getVariants = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.ATTRIBUTES);
    const body = { channel_id: id };

    dispatch({ type: VARIANT_FETCH_START });

    try {
      let response = await fetchGet(url, token, body, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      const variantList = response.data;

      await dispatch({
        type: VARIANT_SET,
        payload: { variantList }
      });

      await variantList.map(variant => {
        dispatch(
          getVariantTerms({
            id: variant.id
          })
        );
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: VARIANT_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const addVariants = variant => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.ATTRIBUTE);
    const body = { channelId: id, ...variant };

    dispatch({ type: VARIANT_FETCH_START });

    try {
      const response = await fetchPost(url, token, body, null, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(
        showNotification({
          message: 'notif.variant.successAdd',
          type: configValues.NOTIF_TYPE.SUCCESS
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: VARIANT_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const getVariantTerms = variantDetail => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.ATTRIBUTES, endpoints.TERMS);
    try {
      const body = { channel_id: id, ...variantDetail };

      let response = await fetchGet(url, token, body, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }
      response = await response.json();
      const terms = response.data;

      const {
        variant: { variantList }
      } = getState();
      let newValue = _.cloneDeep(variantList);
      const keyValue = _.findIndex(newValue, ['id', variantDetail.id]);
      newValue[keyValue]['terms'] = terms;

      await dispatch({
        type: VARIANT_SET,
        payload: { variantList: newValue }
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: VARIANT_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const addVariantsValues = dataDetail => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.ATTRIBUTE, endpoints.TERM);
    const body = {
      channelId: id,
      name: dataDetail.name,
      attributeId: dataDetail.id.toString()
    };

    dispatch({ type: VARIANT_FETCH_START });

    try {
      const response = await fetchPost(url, token, body, null, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(
        showNotification({
          message: 'notif.variantValues.successAdd',
          type: configValues.NOTIF_TYPE.SUCCESS
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: VARIANT_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

export { getVariants, addVariants, getVariantTerms, addVariantsValues };
