const NOTIFICATION_SHOW = 'notification/show';
const NOTIFICATION_HIDE = 'notification/hide';

const initialState = {
  isVisible: false,
  type: 'info',
  message: '',
  options: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_SHOW: {
      const { type, message, options } = action.payload;
      return Object.assign({}, state, {
        isVisible: true,
        type,
        message,
        options,
      });
    }

    case NOTIFICATION_HIDE: {
      return Object.assign({}, state, initialState);
    }

    default:
      return state;
  }
};

const hideNotification = () => {
  const dispatchFunc = dispatch => {
    dispatch({ type: NOTIFICATION_HIDE });
  };

  return dispatchFunc;
};

const showNotification = ({ type, message, options }) => {
  const dispatchFunc = dispatch => {
    dispatch(hideNotification());
    dispatch({ type: NOTIFICATION_SHOW, payload: { type, message, options } });
  };

  return dispatchFunc;
};

export { showNotification, hideNotification };
