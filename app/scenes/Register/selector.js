import { createSelector } from 'reselect';

const getState = state => {
  const { userLogged, profile } = state;
  return { userLogged, profile };
};

export default createSelector([getState], state => {
  const { userLogged, profile } = state;
  const { token, isValid } = userLogged;
  const { id } = profile;
  const data = {
    token,
    isValid,
    userId: id,
  };

  return data;
});
