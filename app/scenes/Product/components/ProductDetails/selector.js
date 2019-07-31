import { createSelector } from 'reselect';

const getState = state => {
  const data = state.product;
  return data;
};

export default createSelector(
  [getState],
  state => {
    const { isFetching } = state;
    return { code, price, weight, stock, unlimited, isFetching, haveVariant };
  }
);
