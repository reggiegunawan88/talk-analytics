import { createSelector } from 'reselect';

const getState = state => {
  const data = state.userLogged;
  return data;
};

export default createSelector([getState], state => {
  const { isFetching, googleUser } = state;
  const data = {
    isFetching,
    googleUser,
  };

  return data;
});
