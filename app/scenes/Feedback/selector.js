import { createSelector } from 'reselect';

const getState = ({ feedback }) => feedback;

export default createSelector([getState], state => {
 const { isFetching, feedbacks, hasMoreData } = state;
 const feedbackSortDate = [];
 
 feedbacks.map(data => {
   const createdAt = data.createdat.split('T')[0];
   if (!feedbackSortDate.includes(createdAt)) {
    feedbackSortDate.push(createdAt);
   }
 });
 feedbackSortDate.sort();
 feedbackSortDate.reverse();

 return { isFetching, feedbacks, feedbackSortDate, hasMoreData };
});
