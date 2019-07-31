import { createSelector } from 'reselect';

const getState = state => {
  const { notification } = state;
  return { notification };
};

export default createSelector([getState], state => {
  const { notification } = state;
  return notification;
});
