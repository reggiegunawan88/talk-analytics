import { createSelector } from 'reselect';

const getState = state => {
  const { customer, rajaongkir, location, products, categories, userOrder } = state;
  return {  customer, rajaongkir, location, products, categories, userOrder };
}

export default createSelector([getState], state => {
  const { customer, rajaongkir, location, products, categories, userOrder } = state;
  return { customer, rajaongkir, location, products, categories, userOrder };
});