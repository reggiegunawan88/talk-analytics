import { createSelector } from 'reselect';

const getState = state => {
  const data = state.integration;
  return data;
};

export default createSelector(
  [getState],
  state => state
);
