import { createSelector } from 'reselect';

const getState = state => {
  const data = state.userLogged;
  const location = state.location;
  const plan = state.plan;
  const payment = state.payment;
  const profile = state.profile;
  const botTemplate = state.botTemplate;
  return { data, location, plan, payment, profile, botTemplate };
};

export default createSelector([getState], state => {
  const { isFetching } = state.data;
  const data = {
    isFetchingRegister: isFetching,
    plans: state.plan.plans,
    isFetchingPlan: state.plan.isFetching,
    ...state.location,
    payment: state.payment,
    emailUser: state.profile.email,
    isFetchingTemplate: state.botTemplate.isFetching,
    listBotTemplate: state.botTemplate.listTemplate,
    hasMoreData: state.botTemplate.hasMoreData,
  };

  return data;
});
