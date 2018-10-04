import api from '@utils/api';

export const CATEGORIES_LOADING = 'CATEGORIES_LOADING';
export const CATEGORIES_LOADED = 'CATEGORIES_LOADED';
export const CATEGORIES_ERROR = 'CATEGORIES_ERROR';

const initialState = {
  categories: [],
  categoriesLoading: false,
  categoriesError: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CATEGORIES_LOADING: {
      return { ...state, categoriesLoading: true, categoriesError: false };
    }
    case CATEGORIES_ERROR: {
      return { ...state, categoriesLoading: false, categoriesError: true };
    }
    case CATEGORIES_LOADED: {
      return {
        ...state,
        categories: [...action.response],
        categoriesLoading: false,
        categoriesError: false,
      };
    }
    default:
      return state;
  }
}

/**
 * Action creators
 */

export function getCategories() {
  return dispatch => {
    dispatch({ type: CATEGORIES_LOADING });
    return api
      .get('/categories')
      .then(response => {
        dispatch({ type: CATEGORIES_LOADED, response: response.data });
      })
      .catch(() => {
        dispatch({ type: CATEGORIES_ERROR });
      });
  };
}
