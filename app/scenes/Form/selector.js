import { createSelector } from 'reselect';

const getState = ({ formChat }) => formChat;

export default createSelector([getState], state => {
  const { isFetching, hasMoreData, listForm } = state;

  return { isFetching, hasMoreData, listForm };
});
