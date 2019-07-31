import fetchPost from '../fetch/post';
import { fetchProducts } from '../products';
import { formatRef, urlParams } from '../helper/utility';
import { errorHandler } from 'Modules/helper/error';
import endpoints from 'Config/endpoints';

const IMPORT_PRODUCT_START = 'import/product/start';
const IMPORT_PRODUCT_SUCCEED = 'import/product/succeed';
const IMPORT_PRODUCT_FAILED = 'import/product/failed';

const initialState = {
  isFetching: false,
  isSucceed: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_PRODUCT_START: {
      return Object.assign({}, state, { isFetching: true });
    }

    case IMPORT_PRODUCT_SUCCEED: {
      return Object.assign({}, state, { isFetching: false, isSucceed: true });
    }

    case IMPORT_PRODUCT_FAILED: {
      return Object.assign({}, state, { isFetching: false, isSucceed: false });
    }

    default:
      return state;
  }
};

const importProductList = (file, paginationData, withVariant) => {
  const dispatchFunc = async (dispatch, getState) => {
    const { token, requestId } = getState().userLogged;
    const { AUTH, PRODUCTS, IMPORT_CSV, VARIANTS } = endpoints;
    const body = new FormData();
    let url = formatRef(AUTH, PRODUCTS, IMPORT_CSV) + urlParams({ requestId });

    if (withVariant) {
      url =
        formatRef(AUTH, PRODUCTS, VARIANTS, IMPORT_CSV) +
        urlParams({ requestId });
    }

    body.append('file', file);

    dispatch({ type: IMPORT_PRODUCT_START });

    try {
      let response = await fetchPost(url, token, body, true);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = response.json();
      dispatch(fetchProducts(paginationData));
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: IMPORT_PRODUCT_SUCCEED });
    }
  };

  return dispatchFunc;
};

export { importProductList };
