import React from 'react';
import moment from 'moment';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import map from 'lodash/map';
import toArray from 'lodash/toArray';
import valuesIn from 'lodash/valuesIn';
import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import startCase from 'lodash/startCase';

import { paths } from 'Config';

export const IsArray = val =>
  Object.prototype.toString.call(val) === Object.prototype.toString.call([]);

export const UrlParam = (key, vals) => {
  if (IsArray(vals)) {
    return map(vals, val => `${key}=${val.toString()}`).join('&');
  }
  return `${key}=${vals}`;
};

export const urlParams = queries =>
  `?${map(queries, (vals, key) => UrlParam(key, vals)).join('&')}`;

export const PostParams = body => {
  const request = {};
  request.method = 'post';
  request.headers = {
    Accept: 'application/json',
  };
  request.body = JSON.stringify(body);

  return request;
};

export function formatRef(...args) {
  return `/${toArray(args).join('/')}`;
}

export function formatCurr(amount) {
  if (typeof amount !== 'string') {
    amount = String(amount);
  }
  return `IDR ${amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export function isPrivatePath(path) {
  const publicPaths = valuesIn(paths.public);
  return publicPaths.indexOf(path) < 0;
}

export function flattenMessages(nestedMessages = {}, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

export function formattedMessageHelper(id) {
  return <FormattedMessage id={id} />;
}

export function formattedHtmlMessageHelper(id) {
  return <FormattedHTMLMessage id={id} />;
}

export const cartesianProduct = (...args) =>
  args.reduce(
    (a, b) =>
      a
        .map(x => b.map(y => x.concat([y])))
        .reduce((acc, t) => acc.concat(t), []),
    [[]]
  );

export const isUnique = (arr, prop) => uniqBy(arr, prop).length === arr.length;

export const camelize = str =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '');

export const splitCapitalize = str => startCase(str.split(/(?=[A-Z])/).join(" "));

export const inputOnlyNumber = (e, oldValue) => {
  const validateNumber = /^[0-9\b]+$/igm;

  let fillPhone = oldValue;
  if (validateNumber.test(e.value) ||  e.value === "") {
    fillPhone = e.value;
  }

  return fillPhone;
}

export const completeProp = (sample, incomplete) => {
  const falsy = [undefined, null];
  const properties = Object.keys(sample);
  const completed = cloneDeep(incomplete);

  properties.forEach(prop => {
    if (falsy.indexOf(incomplete[prop]) !== -1) completed[prop] = sample[prop];
  });

  return completed;
};

export function removeHtmlTag(text) {
  if (text !== undefined) {
    const regex = /(<([^>]+)>)/gi;

    return text.replace(regex, '');
  }
  return '';
}

export function dateDefaultFormat(date, formatDate) {
  return moment(date).format(formatDate);
}

export function handleEmptyString(str) {
  const falsy = ['', undefined, null];

  return falsy.indexOf(str) === -1 ? str : '-';
}

export function getDiffDate(firstDate, lastDate) {
  const diff = moment(lastDate).diff(moment(firstDate));
  let diffDuration = moment.duration(diff);
  diffDuration = diffDuration.seconds();

  return diffDuration;
}
