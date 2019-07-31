import { createSelector } from 'reselect';

const getState = state => {
  const { product, variant } = state;
  return { product, variant };
};

export default createSelector(
  [getState],
  state => ({
    isFetching: state.product.isFetching,
    variantValues: state.product.variantValues,
    variantFetching: state.variant.isFetching,
    variantMaster: state.variant.variantList
  })
);
