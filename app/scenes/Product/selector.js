import { createSelector } from 'reselect';

const getState = state => {
  const { lang, product, categories } = state;
  return { lang, product, categories };
};

export default createSelector(
  [getState],
  state => {
    const { lang, product, categories } = state;
    const { locale } = lang;
    return { locale, product, categories };
  }
);
