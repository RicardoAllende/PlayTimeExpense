import api from '@utils/api';

export const CATEGORIES_STATS_LOADING = 'CATEGORIES_STATS_LOADING';
export const CATEGORIES_STATS_LOADED = 'CATEGORIES_STATS_LOADED';
export const CATEGORIES_STATS_ERROR = 'CATEGORIES_STATS_ERROR';

const initialState = {
  categories: [],
  categoriesLoading: true,
  categoriesError: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CATEGORIES_STATS_LOADING: {
      return { ...state, categoriesLoading: true, categoriesError: false };
    }
    case CATEGORIES_STATS_ERROR: {
      return { ...state, categoriesLoading: false, categoriesError: true };
    }
    case CATEGORIES_STATS_LOADED: {
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
    dispatch({ type: CATEGORIES_STATS_LOADING });
    return api
      .get('/categories')
      .then(response => {
        dispatch({ type: CATEGORIES_STATS_LOADED, response: response.data });
      })
      .catch(() => {
        dispatch({ type: CATEGORIES_STATS_ERROR });
      });
  };
}
