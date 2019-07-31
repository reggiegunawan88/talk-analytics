import fetchGet from 'Modules/fetch/get';
import errorHandler from 'Modules/helper/error';
import { endpoints } from 'Config';
import { formatRef, formatCurr } from 'Modules/helper/utility';

const PLAN_FETCH_START = 'plan/fetch/start';
const PLAN_SET = 'plan/set';
const PLAN_FETCH_STOP = 'plan/fetch/stop';

const initialState = {
  plans: [],
  isFetching: false,
};

const sortPlan = {
  enterprise: "0",
  business: "1",
  starter: "2",
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PLAN_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case PLAN_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case PLAN_SET: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};

const getPlan = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
    } = getState();
    const url = formatRef(endpoints.PLANS);

    dispatch({ type: PLAN_FETCH_START });

    try {
      let response = await fetchGet(url, token, null, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      const plans = [];
      response.data.plan.map( (data) => {
        if (sortPlan[data.name]) {
          const price = data.price === '10' ? '0' : data.price;
          const dprice = price/1000;
          plans[sortPlan[data.name]] = {
            id: data.name,
            name: data.name.toUpperCase(),
            priceComplete: parseInt(data.price),
            price: parseInt(dprice),
            idrPrice: price>0 ? formatCurr(price) : 'IDR 0',
            description: data.description,
            size: '3 GB',
            features: data.feature,
          }
        }
      });

      await dispatch({
        type: PLAN_SET,
        payload: { plans },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PLAN_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

export { getPlan };
