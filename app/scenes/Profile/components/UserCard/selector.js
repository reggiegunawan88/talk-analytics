import { createSelector } from 'reselect';
import { getFirstName, getLastName } from '../../../../modules/helper/user';

const getState = state => {
  const data = state.profile;
  return data;
};

export default createSelector([getState], state => {
  const { name } = state;
  return {
    ...state,
    fname: getFirstName(name || ''),
    lname: getLastName(name || ''),
  };
});
