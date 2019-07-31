import fetch from 'isomorphic-fetch';

import { configValues } from 'Config';
import { urlParams } from 'Modules/helper/utility';
import config from './config';

const PutParams = (token, body) => {
  const request = {
    method: 'put',
    headers: {
      Accept: 'application/json',
      Authorization: token || '',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  };

  return request;
};

export default (url, token, query, body = {}, version) => {
  const { baseUrl } = config;
  const API_HOST = `${baseUrl}/${version || 'v1'}`;

  return fetch(API_HOST + url + urlParams(query), PutParams(token, body)).then(
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
