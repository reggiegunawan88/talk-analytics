import fetch from 'isomorphic-fetch';

import config from './config';

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

export default (url, token, body = {}, multipart, version) => {
  const { qiscusUrl } = config;
  const API_HOST = `${qiscusUrl}/${version || 'v1'}`;

  return fetch(API_HOST + url, PostParams(body, token, multipart)).then(
    response => response
  );
};
