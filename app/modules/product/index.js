import * as _ from 'lodash';

import fetchPost from 'Modules/fetch/post';
import fetchGet from 'Modules/fetch/get';
import fetchDelete from 'Modules/fetch/delete';
import fetchPut from 'Modules/fetch/put';
import { endpoints, configValues as config } from 'Config';
import { showNotification } from 'Modules/notification';
import {
  cartesianProduct,
  isUnique,
  formatRef,
  urlParams
} from 'Modules/helper/utility';
import { errorHandler } from 'Modules/helper/error';
import { normalizeProductStructure } from 'Modules/helper/product';

const PRODUCT_FETCH_START = 'product/fetch/start';
const PRODUCT_FETCH_END = 'product/fetch/end';
const PRODUCT_PARAM_SET = 'product/param/set';
const PRODUCT_ADD_SUCCESS = 'product/add/success';
const PRODUCT_UPDATE_SUCCESS = 'product/update/success';
const PRODUCT_SET_DEFAULT = 'product/set/default';
const PRODUCT_SET_EDIT = 'product/set/edit';

const initialState = {
  id: '',
  name: '',
  description: '',
  imageHandle: '',
  imageBase64: '',
  imageId: '',
  imageName: '',
  imageType: '',
  code: '',
  categoryId: '',
  category: [],
  price: '',
  weight: '',
  type: 'simple',
  stock: '',
  unlimited: false,
  haveVariant: false,
  variants: [],
  variantValues: [],
  isFetching: false,
  isEditing: false,
  successfullyAdded: false,
  successfullyEdited: false,
  listVariant: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case PRODUCT_FETCH_END: {
      return { ...state, isFetching: false };
    }

    case PRODUCT_PARAM_SET: {
      return { ...state, ...action.payload };
    }

    case PRODUCT_ADD_SUCCESS: {
      return { ...state, successfullyAdded: true };
    }

    case PRODUCT_UPDATE_SUCCESS: {
      return { ...state, successfullyEdited: true };
    }

    case PRODUCT_SET_DEFAULT: {
      return { ...state, ...initialState };
    }

    case PRODUCT_SET_EDIT: {
      return { ...state, ...action.payload, isEditing: true };
    }

    default:
      return state;
  }
};

const setParam = ({ name, value }) => {
  const dispatchFunc = dispatch => {
    dispatch({ type: PRODUCT_PARAM_SET, payload: { [name]: value } });
  };

  return dispatchFunc;
};

const apiCallAddProduct = param => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.PRODUCT);
    if (param.type !== 'simple') {
      param.unlimited = true;
    }

    const body = {
      channelId: id,
      sku: param.code,
      name: param.name,
      type: param.type,
      regular_price: param.price,
      description: param.description,
      short_description: param.description,
      categories: param.category,
      manage_stock: !param.unlimited,
      stock_quantity: !param.unlimited ? Number(param.stock) : 0,
      weight: param.weight,
      attributes: param.variants
    };

    dispatch({ type: PRODUCT_FETCH_START });

    try {
      let response = await fetchPost(url, token, body, null, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }
      response = await response.json();

      if (param.type !== 'simple') {
        await param.variantValues.map(variant => {
          dispatch(
            apiCallAddVariant({
              productId: String(response.data.id),
              regular_price: variant.regular_price,
              manage_stock: !variant.unlimited,
              stock_quantity: !variant.unlimited
                ? Number(variant.stock_quantity)
                : 0,
              sku: variant.sku,
              image: { id: 37 },
              weight: variant.weight,
              attributes: variant.values
            })
          );
        });
      }

      dispatch(
        showNotification({
          type: config.NOTIF_TYPE.SUCCESS,
          message: 'notif.product.added'
        })
      );

      dispatch({ type: PRODUCT_ADD_SUCCESS });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PRODUCT_FETCH_END });
    }
  };

  return dispatchFunc;
};

const apiCallAddVariant = variant => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.VARIANT);
    const body = {
      channelId: id,
      ...variant
    };

    try {
      let response = await fetchPost(url, token, body, null, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }
      response = await response.json();
    } catch (e) {
      dispatch(errorHandler(e));
    }
  };

  return dispatchFunc;
};

const apiCallUpdateProduct = param => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      },
      product: { variantValues }
    } = getState();
    const url = formatRef(endpoints.PRODUCT);
    const query = { channel_id: id, id: param.id };
    const body = {
      id: param.id,
      sku: param.code,
      name: param.name,
      type: param.type,
      price: param.price,
      regular_price: param.price,
      description: param.description,
      short_description: param.description,
      categories: param.category,
      manage_stock: !param.unlimited,
      stock_quantity: !param.unlimited ? Number(param.stock) : 0,
      weight: param.weight,
      attributes: param.variants
    };

    dispatch({ type: PRODUCT_FETCH_START });

    try {
      let response = await fetchPut(url, token, query, body, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }
      response = await response.json();

      await param.variantValues.map(variant => {
        const bodyVariant = {
          productId: String(param.id),
          regular_price: variant.regular_price,
          manage_stock: !variant.unlimited,
          stock_quantity: !variant.unlimited
            ? Number(variant.stock_quantity)
            : 0,
          sku: variant.sku,
          image: { id: 37 },
          weight: variant.weight,
          attributes: variant.values
        };

        if (variant.id) {
          _.remove(variantValues, { id: variant.id });
          dispatch(apiCallUpdateVariant({ id: variant.id, ...bodyVariant }));
        } else {
          dispatch(apiCallAddVariant(bodyVariant));
        }
      });

      await variantValues.map(variant => {
        dispatch(deleteVariantProduct(String(param.id), variant.id));
      });

      dispatch(
        showNotification({
          type: config.NOTIF_TYPE.SUCCESS,
          message: 'notif.product.updated'
        })
      );

      dispatch({ type: PRODUCT_UPDATE_SUCCESS });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PRODUCT_FETCH_END });
    }
  };

  return dispatchFunc;
};

const setInitialState = () => {
  const dispatchFunc = dispatch => {
    dispatch({ type: PRODUCT_SET_DEFAULT });
  };

  return dispatchFunc;
};

const validateProduct = productPost => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    // const url = formatRef(endpoints.MEDIA);
    // const body = {
    //   channelId: id,
    //   filename: product.imageName,
    //   content_type: product.imageType,
    //   data: product.imageBase64
    // }

    // dispatch({ type: PRODUCT_FETCH_START });

    // try {
    //   let response = await fetchPost(url, token, body, null, 'v2');

    //   if (!response.ok) {
    //     throw new Error('notif.somethingWentWrong');
    //   }
    //   response = await response.json();
    //   product.imageId = response.data.id;
    const param = _.cloneDeep(productPost);
    if (param.isEditing) {
      dispatch(apiCallUpdateProduct(param));
    } else {
      dispatch(apiCallAddProduct(param));
    }
    // } catch (e) {
    //   dispatch(errorHandler(e));
    // }
  };

  return dispatchFunc;
};

const getProductDetail = productId => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.PRODUCT);
    const query = { channel_id: id, id: productId };

    dispatch({ type: PRODUCT_FETCH_START });

    try {
      let response = await fetchGet(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      await dispatch(getProductVariant(response.data.id));
      await dispatch({
        type: PRODUCT_SET_EDIT,
        payload: normalizeProductStructure(
          response.data,
          getState().product.listVariant
        )
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PRODUCT_FETCH_END });
    }
  };

  return dispatchFunc;
};

const apiCallUpdateVariant = param => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.VARIANT);
    const query = { channel_id: id, id: param.productId, variant_id: param.id };
    const body = {
      channelId: id,
      ...param
    };

    try {
      let response = await fetchPut(url, token, query, body, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }
      response = await response.json();

      dispatch(
        showNotification({
          type: config.NOTIF_TYPE.SUCCESS,
          message: 'notif.product.added'
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    }
  };

  return dispatchFunc;
};

const getProductVariant = productId => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.VARIANTS);
    const query = { channel_id: id, id: productId };

    dispatch({ type: PRODUCT_FETCH_START });

    try {
      let response = await fetchGet(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      dispatch({
        type: PRODUCT_PARAM_SET,
        payload: { listVariant: response.data }
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PRODUCT_FETCH_END });
    }
  };

  return dispatchFunc;
};

const deleteProduct = productId => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.PRODUCT);
    const query = { channel_id: id, id: productId };

    dispatch({ type: PRODUCT_FETCH_START });
    try {
      const response = await fetchDelete(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      dispatch(
        showNotification({
          message: 'notif.products.successDelete',
          type: config.NOTIF_TYPE.SUCCESS
        })
      );
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PRODUCT_FETCH_END });
    }
  };

  return dispatchFunc;
};

const deleteVariantProduct = (productId, variantId) => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id }
      }
    } = getState();
    const url = formatRef(endpoints.VARIANT);
    const query = { channel_id: id, id: productId, variant_id: variantId };

    dispatch({ type: PRODUCT_FETCH_START });
    try {
      const response = await fetchDelete(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: PRODUCT_FETCH_END });
    }
  };

  return dispatchFunc;
};

export {
  setParam,
  validateProduct,
  setInitialState,
  getProductDetail,
  getProductVariant,
  deleteProduct,
  deleteVariantProduct
};
