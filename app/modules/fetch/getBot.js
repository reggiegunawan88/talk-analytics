import fetch from 'isomorphic-fetch';

import { urlParams } from '../helper/utility';
import config from './config';

const GetParams = token => {
  const request = {
    method: 'get',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
    },
  };

  return request;
};

export default (url, token, query) => {
  const { botUrl } = config;

  return fetch(botUrl + url + urlParams(query), GetParams(token)).then(
    response => response
  );
};
