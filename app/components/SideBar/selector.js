import { createSelector } from 'reselect';

const getState = state => {
  const { userChannel, userMenu, profile } = state;
  return { userChannel, userMenu, profile };
};

export default createSelector([getState], state => state);
