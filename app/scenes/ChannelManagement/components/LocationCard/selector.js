import { createSelector } from 'reselect';

const getState = ({ location }) => ({
  location
});

export default createSelector([getState], ({ location }) => ({ ...location }));
