import fetch from 'isomorphic-fetch';

import config from './config';
import { configValues } from '../../config';

const PostParams = (body, token, multipart) => {
  const request = {};
  request.method = 'post';
  request.headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token || ''}`,
  };
  if (!multipart) {
    request.headers['Content-Type'] = 'application/json';
  }
  request.body = multipart ? body : JSON.stringify(body);

  return request;
};

export default (url, token, body = {}, multipart) => {
  const { botUrl } = config;

  return fetch(
    botUrl + url,
    PostParams(body, token, multipart)
  ).then(response => {
    if (response.status === configValues.HTTP_STATUS.UNAUTH) {
      window.location.href = '/login';
    }
    return response;
  });
};
