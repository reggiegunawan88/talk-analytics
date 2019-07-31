import fetchGet from 'Modules/fetch/get';
import errorHandler from 'Modules/helper/error';
import { endpoints } from 'Config';
import { formatRef } from 'Modules/helper/utility';

const MENU_FETCH_START = 'menu/fetch/start';
const MENU_FETCH_STOP = 'menu/fetch/stop';
const MENU_LIST_SET = 'menu/list/set';

const initialState = {
  menus: [],
  pages: [],
  isFetching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MENU_FETCH_START: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }

    case MENU_FETCH_STOP: {
      return Object.assign({}, state, {
        isFetching: false,
      });
    }

    case MENU_LIST_SET: {
      return Object.assign({}, state, { ...action.payload });
    }

    default:
      return state;
  }
};

const getMenuList = () => {
  const dispatchFunc = async (dispatch, getState) => {
    const { userLogged, userChannel, profile } = getState();
    const { token } = userLogged;
    const url = formatRef(endpoints.MENU);
    const urlPage = formatRef(endpoints.PAGE);
    const { plan: planChannel } = userChannel.activeChannel;
    const roleChannel = profile.channel.find(c => c.channelId === userChannel.activeChannel.id ).role;
    const query = { plan: planChannel, type: roleChannel };

    dispatch({ type: MENU_FETCH_START });

    try {
      let response = await fetchGet(url, token, query, 'v2');

      if (!response.ok) {
        throw new Error('notif.somethingWentWrong');
      }

      response = await response.json();
      const menus = response.data.menu;
      
      let pagesResponse = await fetchGet(urlPage, token, query);
      pagesResponse = await pagesResponse.json();
      const pages = pagesResponse.data.listPage;
      const getIndex = pages.findIndex(p => p === "form" );
      pages[getIndex] = "forms";

      await dispatch({
        type: MENU_LIST_SET,
        payload: { menus, pages },
      });
    } catch (e) {
      dispatch(errorHandler(e));
    } finally {
      dispatch({ type: MENU_FETCH_STOP });
    }
  };

  return dispatchFunc;
};

export { getMenuList };
