import { createSelector } from 'reselect';

const getState = state => {
  const data = state.userLogged;
  return data;
};

export default createSelector([getState], state => {
  const { isFetching, isValid, token } = state;
  const data = {
    token,
    isFetching,
    isValid: !isFetching && isValid,
  };

  return data;
});
