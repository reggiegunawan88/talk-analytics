import fetchGet from '../fetch/get';
import errorHandler from '../helper/error';
import { formatRef } from '../helper/utility';
import { endpoints } from '../../config';

const LOCATION_FETCH_START = 'location/fetch/start';
const LOCATION_FETCH_STOP = 'location/fetch/stop';
const LOCATION_SET = 'location/set';

const initialState = {
  isFetching: false,
  provinces: [],
  cities: [],
  subDistricts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_FETCH_START: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case LOCATION_FETCH_STOP: {
      return Object.assign({}, state, {
        isFetching: false,
      });
    }

    case LOCATION_SET: {
      return Object.assign({}, state, action.payload);
    }

    default:
      return state;
  }
};

const provinceKeyNameAdjustment = options =>
  Array.map(options, opt => {
    const newOpt = {};
    newOpt.value = opt.province_id;
    newOpt.label = opt.province;
    return newOpt;
  });

const cityKeyNameAdjustment = options =>
  Array.map(options, opt => {
    const newOpt = {};
    newOpt.value = opt.city_id;
    newOpt.label = `${opt.type} ${opt.city_name}`;
    return newOpt;
  });

const subDistKeyNameAdjustment = options =>
  Array.map(options, opt => {
    const newOpt = {};
    newOpt.value = opt.subdistrict_id;
    newOpt.label = opt.subdistrict_name;
    return newOpt;
  });

const getProvinces = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const { token } = getState().userLogged;
    const url = formatRef(endpoints.PROVINCES);

    try {
      dispatch({ type: LOCATION_FETCH_START });

      let response = await fetchGet(url, token);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      dispatch({
        type: LOCATION_SET,
        payload: { provinces: provinceKeyNameAdjustment(response.data) },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: LOCATION_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const getCities = (id, update) => {
  const dispatchFunc = async (dispatch, getState) => {
    const { token } = getState().userLogged;
    const url = formatRef(endpoints.CITIES);

    if (update) {
      dispatch({ type: LOCATION_SET, payload: { subDistricts: [] } });
    }

    try {
      dispatch({ type: LOCATION_FETCH_START });

      let response = await fetchGet(url, token, { id });

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      dispatch({
        type: LOCATION_SET,
        payload: { cities: cityKeyNameAdjustment(response.data) },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: LOCATION_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

const getSubDistricts = id => {
  const dispatchFunc = async (dispatch, getState) => {
    const { token } = getState().userLogged;
    const url = formatRef(endpoints.SUBDISTRICTS);

    try {
      dispatch({ type: LOCATION_FETCH_START });

      let response = await fetchGet(url, token, { id });

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      dispatch({
        type: LOCATION_SET,
        payload: { subDistricts: subDistKeyNameAdjustment(response.data) },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: LOCATION_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

export { getProvinces, getCities, getSubDistricts };
