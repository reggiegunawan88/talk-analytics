import { createSelector } from 'reselect';

const getState = ({ bank }) => bank;

export default createSelector([getState], ({ isFetching, banks }) => ({
  isFetching,
  banks,
}));
