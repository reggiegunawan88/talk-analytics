import { combineReducers } from 'redux';

import authReducer from './auth';
import channelReducer from './channel';
import menuReducer from './menu';
import profileReducer from './profile';
import locationReducer from './location';
import notificationReducer from './notification';
import languageReducer from './language';
import orderReducer from './orders';
import conversationsReducer from './conversations';
import websocketReducer from './websocket';
import bankReducer from './bank';
import loyaltyReducer from './loyalty';
import customerReducer from './customers';
import broadcastReducer from './broadcast';
import platformReducer from './platform';
import productReducer from './product';
import categoriesReducer from './categories';
import productsReducer from './products';
import importReducer from './import';
import variantReducer from './variant';
import feedbackReducer from './feedback';
import rajaongkirReducer from './rajaongkir';
import integrationReducer from './integration';
import planReducer from './plan';
import paymentReducer from './payment';
import eventReducer from './webevent';
import botTemplateReducer from './bottemplate';
import formChatReducer from './formChat';

export default combineReducers({
  userLogged: authReducer,
  userChannel: channelReducer,
  profile: profileReducer,
  location: locationReducer,
  bank: bankReducer,
  userMenu: menuReducer,
  notification: notificationReducer,
  lang: languageReducer,
  userOrder: orderReducer,
  conversations: conversationsReducer,
  websocket: websocketReducer,
  loyalty: loyaltyReducer,
  customer: customerReducer,
  broadcast: broadcastReducer,
  platform: platformReducer,
  product: productReducer,
  categories: categoriesReducer,
  products: productsReducer,
  import: importReducer,
  variant: variantReducer,
  feedback: feedbackReducer,
  rajaongkir: rajaongkirReducer,
  integration: integrationReducer,
  plan: planReducer,
  payment: paymentReducer,
  event: eventReducer,
  botTemplate: botTemplateReducer,
  formChat: formChatReducer,
});
