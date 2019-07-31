import fetchGet from 'Modules/fetch/get';
import { errorHandler } from 'Modules/helper/error';
import { formatRef, formatCurr } from 'Modules/helper/utility/index';
import { endpoints } from 'Config';

const RAJAONGKIR_FETCH_START = 'rajaongkir/fetch/start';
const RAJAONGKIR_FETCH_END = 'rajaongkir/fetch/end';
const RAJAONGKIR_SET = 'rajaongkir/set';

const initialState = {
  isFetching: false,
  listShipping: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RAJAONGKIR_FETCH_START: {
      return { ...state, isFetchingOngkir: true, listShipping: [] };
    }

    case RAJAONGKIR_FETCH_END: {
      return { ...state, isFetchingOngkir: false };
    }

    case RAJAONGKIR_SET: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }

  
};

const getShipping = destination => {
  const dispatchFunc = async (dispatch, getState) => {
    const { 
      userLogged: { token },
      userChannel: { 
        activeChannel: {
          location: { subdistrict, city },
        }  
      },
   } = getState();
    const url = formatRef(endpoints.COST);
    let origin = city.id;
    let origintype = 'city';
    if(subdistrict.id){
      origin = subdistrict.id;
      origintype = 'subdistrict';
    }
    const query = { 
      origin, 
      origin_type: origintype, 
      destination,
      destination_type: 'subdistrict',
      weight: 1000,
      courier: '',
    }

    try {
      dispatch({ type: RAJAONGKIR_FETCH_START });

      let response = await fetchGet(url, token, query);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      const listShipping = [];
      if(response.data.length > 0){
        response.data.map(data => {
          const codeCourier = data.code.toUpperCase();
          data.costs.map(dtcost => {
            const shippingCost = dtcost.cost[0].value;
            let shippingTime = dtcost.cost[0].etd.toLowerCase().replace(' hari','');
            shippingTime = `( ${shippingTime} hari )`;
            const serviceCourier = dtcost.service.toUpperCase();
            listShipping.push({ 
              label: `${codeCourier} - ${serviceCourier} ${formatCurr(shippingCost)} ${shippingTime}`,
              value: `${codeCourier}-${serviceCourier}`,
              cost: shippingCost
            });
          })
        });
      }

      dispatch({
        type: RAJAONGKIR_SET,
        payload: { listShipping },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: RAJAONGKIR_FETCH_END });
    }
  };

  return dispatchFunc;
};

export { getShipping };