import { createSelector } from 'reselect';

const getState = state => {
  const { products, product } = state;
  const { isEditing, isFetching, listVariant } = product;
  const data = {
    import: state.import,
    products,
    isEditing,
    listVariant,
    fetchingProduct: isFetching
  };
  return data;
};

export default createSelector(
  [getState],
  state => {
    const { products, isEditing, listVariant, fetchingProduct } = state;
    const data = {
      import: {
        isFetching: state.import.isFetching,
        isSucceed: state.import.isSucceed
      },
      products,
      isEditing,
      fetchingProduct,
      listVariant
    };
    return data;
  }
);
