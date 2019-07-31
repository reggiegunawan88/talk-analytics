import { createSelector } from 'reselect';

const getState = ({ loyalty }) => loyalty;

export default createSelector(
  [getState],
  ({ isFetching, loyalities }) => ({
    isFetching,
    loyalities,
  })
);
