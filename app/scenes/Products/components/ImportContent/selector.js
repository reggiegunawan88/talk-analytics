import { createSelector } from 'reselect';

const getState = state => {
  const data = state.import;
  return data;
};

export default createSelector([getState], state => {
  const { isFetching, isSucceed } = state;
  const data = {
    isFetching,
    isSucceed,
  };
  return data;
});
