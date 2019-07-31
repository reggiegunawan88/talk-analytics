import fetch from 'isomorphic-fetch';

import { configValues } from 'Config';
import config from './config';

const PostParams = (body, token, multipart) => {
  const request = {};
  request.method = 'post';
  request.headers = {
    Accept: 'application/json',
    Authorization: token || '',
  };
  if (!multipart) {
    request.headers['Content-Type'] = 'application/json';
  }
  request.body = multipart ? body : JSON.stringify(body);

  return request;
};

export default (url, token, body = {}, multipart, version) => {
  const { baseUrl } = config;
  const API_HOST = `${baseUrl}/${version || 'v1'}`;
  return fetch(API_HOST + url, PostParams(body, token, multipart)).then(
    async response => {
      const respJson = await response.clone().json();
      if (
        response.status === configValues.HTTP_STATUS.BAD_REQUEST
      ) {
        if (respJson.message === configValues.EXPIRE_TOKEN_MESSAGES[2]) {
          localStorage.clear();
          window.location.href = '/login';
        } else if (configValues.EXPIRE_TOKEN_MESSAGES.indexOf(respJson.message) !== -1) {
          window.location.reload();
        }
      }
      return response;
    }
  );
};
