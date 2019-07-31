import { createSelector } from 'reselect';

const getState = state => {
  const data = state.userChannel.activeChannel;
  const plan = state.plan;
  const payment = state.payment;
  return { data, plan, payment };
};

export default createSelector([getState], state => {
  const { plan, id: channelId, name: channelName, email: channelEmail } = state.data;
  const { plans } = state.plan;
  const payment = state.payment;

  return { plan, plans, payment, channelId, channelName, channelEmail };
});
