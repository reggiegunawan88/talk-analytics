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
      'Access-Control-Allow-Origin': '*',
    },
  };

  return request;
};

export default (url, token, query, version) => {
  const { qiscusUrl } = config;
  const API_HOST = `${qiscusUrl}/${version || 'v1'}`;

  return fetch(API_HOST + url + urlParams(query), GetParams(token)).then(
    response => response
  );
};
