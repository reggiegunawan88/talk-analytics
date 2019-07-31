import { createSelector } from 'reselect';

const getState = ({ broadcast }) => broadcast;

export default createSelector(
  [getState],
  ({ isFetching }) => ({
    isFetching,
  })
);
