import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';

import appReducer from '../modules/reducer';

const rootReducer = (state, action) => {
  if(action.type === "auth/logout/success"){
    state = undefined; // eslint-disable-line no-param-reassign
  }

  return appReducer(state, action)
}

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...[thunk]))
);

export default store;