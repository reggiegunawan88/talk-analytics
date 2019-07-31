import { languages } from '../../config';

const LANGUAGE_SET = 'language/set';
const supportedLocale = ['id', 'en-US'];
const clientLocale =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage ||
  languages.ENGLISH;
const locale = supportedLocale.indexOf(clientLocale) !== -1 ? clientLocale : languages.ENGLISH;

const initialState = {
  locale,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LANGUAGE_SET: {
      return Object.assign({}, state, { locale: action.payload });
    }

    default:
      return state;
  }
};

const changeToID = () => {
  const dispatchFunc = dispatch => {
    dispatch({ type: LANGUAGE_SET, payload: languages.INDONESIA });
  };

  return dispatchFunc;
};

const changeToEN = () => {
  const dispatchFunc = dispatch => {
    dispatch({ type: LANGUAGE_SET, payload: languages.ENGLISH });
  };

  return dispatchFunc;
};

export { changeToID, changeToEN };
