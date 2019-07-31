import fetchGet from 'Modules/fetch/get';
import errorHandler from 'Modules/helper/error';
import { endpoints } from 'Config';
import { formatRef, splitCapitalize } from 'Modules/helper/utility';

const FORM_FETCH_START = 'form/fetch/start';
const FORM_SET = 'form/set';
const FORM_FETCH_STOP = 'form/fetch/stop';

const initialState = { 
  listForm: [],
  isFetching: false,
  hasMoreData: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FORM_FETCH_START: {
      return { ...state, isFetching: true };
    }

    case FORM_FETCH_STOP: {
      return { ...state, isFetching: false };
    }

    case FORM_SET: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
}

const getFormData = (type, currentPage, payload) => {
  const dispatchFunc = async (dispatch, getState) => {
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id },
      },
      formChat: { listForm },
    } = getState();
    const url = formatRef(endpoints.FORMTYPECHANNEL);
    const query = { channel_id: id, type, ...payload };

    dispatch({ type: FORM_FETCH_START });

    try {
      let response = await fetchGet(url, token, query);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      let findForm = listForm.find(f => f.id === type);
      const indexForm = listForm.findIndex(f => f.id === type);
      let datanew = findForm.data;

      if (payload.page === 1) {
        datanew = response.data;
      } else {
        response.data.map(form => datanew.push(form));
      }

      findForm = {
        ...findForm,
        data: datanew,
        totalData: datanew.length,
        currentPage,
        formPagination: payload,
        hasMoreData: response.data.length === payload.size,
      }
      listForm[indexForm] = findForm;
      await dispatch({
        type: FORM_SET,
        payload: { 
          listForm,
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: FORM_FETCH_STOP });
    }
  }

  return dispatchFunc;
}

const getForm = payload => {
  const dispatchFunc = async (dispatch, getState) => {
    dispatch({ type: FORM_FETCH_START });
    if (payload.page === 1 || !payload.page){
      await dispatch({
        type: FORM_SET,
        payload: { 
          listForm: [],
          hasMoreData: false,
        },
      });
    }
    const {
      userLogged: { token },
      userChannel: {
        activeChannel: { id },
      },
      formChat: { listForm },
    } = getState();
    const url = formatRef(endpoints.FORMCHANNELGROUPING);
    const query = { channel_id: id, ...payload };

    try {
      let response = await fetchGet(url, token, query);

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();

      const listnew = listForm;
      response.data.map(form => {
        const idForm = form._id;

        const columnForm = [];
        const columnNotAllowed = [ '_id', 'channelId', 'createdat', 'customerId', 'type', 'usertag' ];
        if (form.forms.length) {
          Object.keys(form.forms[0]).map(column => columnNotAllowed.indexOf(column) === -1 && columnForm.push({ 
            name: splitCapitalize(column),
            value: column,
          }));
        }
        
        listnew.push({ 
          id: idForm,
          title: splitCapitalize(idForm.replace('form-','')),
          totalData: form.forms.length,
          column: columnForm,
          data: form.forms,
          currentPage: 1,
          formPagination: {
            page: 1,
            size: 20,
          }
        })
      });

      await dispatch({
        type: FORM_SET,
        payload: { 
          listForm: listnew, 
          hasMoreData: response.data.length === payload.size
        },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: FORM_FETCH_STOP });
    }
  }

  return dispatchFunc;
}

export { getForm, getFormData };
