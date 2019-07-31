import { urlParams } from '../helper/utility';
import config from './config';

export default (url, query, version) => {
  const { wsAPI } = config;
  const API_HOST = `${wsAPI}/${version || 'v1'}`;
  return new WebSocket(API_HOST + url + urlParams(query));
};
