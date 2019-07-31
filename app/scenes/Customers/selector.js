import { createSelector } from 'reselect';

const getState = ({ customer }) => customer;

export default createSelector([getState], ({ isFetching, customers, hasMoreData }) => ({
	isFetching,
	customers,
	hasMoreData
}));
