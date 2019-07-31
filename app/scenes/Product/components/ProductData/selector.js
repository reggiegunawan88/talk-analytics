import { createSelector } from 'reselect';

const getState = state => {
  const { product, categories } = state;
  return {
    product,
    categories: categories.categories,
    categoryFetching: categories.isFetching
  };
};

export default createSelector(
  [getState],
  state => {
    const { product, categories, categoryFetching } = state;
    const { category, isFetching } = product;

    let valueCategory = null;
    if (category.length > 0) {
      valueCategory = _.map(category, list => {
        return list.id;
      }).join(',');
    }
    return {
      isFetching,
      valueCategory,
      categories,
      categoryFetching
    };
  }
);
