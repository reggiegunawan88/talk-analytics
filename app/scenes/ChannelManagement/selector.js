import {
  createSelector
} from 'reselect';

const getState = state => {
  const {
    userChannel,
    profile,
    userMenu
  } = state;
  return {
    userChannel,
    profile,
    userMenu
  };
};

export default createSelector([getState], state => ({
  isFetching: state.userChannel.isFetching,
  bot: {
    ...state.userChannel.activeChannel
  },
  agentList: state.profile.agentList,
  pages: state.userMenu.pages
}));
