import api from '@utils/api';

export const EXPENSES_SEARCH_START = 'EXPENSES_SEARCH_START';
export const EXPENSES_SEARCH_SUCCESS = 'EXPENSES_SEARCH_SUCCESS';
export const EXPENSES_SEARCH_ERROR = 'EXPENSES_SEARCH_ERROR';

export const EXPENSES_EXPORT_START = 'EXPENSES_EXPORT_START';
export const EXPENSES_EXPORT_SUCCESS = 'EXPENSES_EXPORT_SUCCESS';
export const EXPENSES_EXPORT_ERROR = 'EXPENSES_EXPORT_ERROR';

const initialState = {
  searchResult: [],
  currentPage: 1,
  searching: true,
  searchError: false,
  exporting: true,
  exportSucess: false,
  exportError: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case EXPENSES_SEARCH_START: {
      return { ...state, searching: true, searchError: false };
    }
    case EXPENSES_SEARCH_SUCCESS: {
      return {
        ...state,
        searchResult: [...action.response],
        searching: false,
        searchError: false,
        currentPage: action.page,
      };
    }
    case EXPENSES_SEARCH_ERROR: {
      return { ...state, searching: false, searchError: true };
    }
    case EXPENSES_EXPORT_START: {
      return {
        ...state,
        exporting: true,
        exportSucess: false,
        exportError: false,
      };
    }
    case EXPENSES_EXPORT_SUCCESS: {
      return {
        ...state,
        exporting: false,
        exportSucess: true,
        exportError: false,
      };
    }
    case EXPENSES_EXPORT_ERROR: {
      return {
        ...state,
        exporting: false,
        exportSucess: false,
        exportError: true,
      };
    }
    default:
      return state;
  }
}

/**
 * Action creators
 */
export function doSearch(query, initialize = false) {
  return (dispatch, getState) => {
    dispatch({ type: EXPENSES_SEARCH_START });
    const page = initialize ? 1 : getState().search.currentPage + 1;
    return api
      .get(`/expenses`) //?q=${query}&_page=${page}&_limit=${PAGE_SIZE}
      .then(response => {
        dispatch({
          type: EXPENSES_SEARCH_SUCCESS,
          response: response.data,
          page,
        });
      })
      .catch(() => {
        dispatch({ type: EXPENSES_SEARCH_ERROR });
      });
  };
}

export function doExport(query) {
  return dispatch => {
    dispatch({ type: EXPENSES_EXPORT_START });
    return api
      .get(`/expenses/export`) //?q=${query}
      .then(response => {
        dispatch({ type: EXPENSES_EXPORT_SUCCESS, response: response.data });
      })
      .catch(() => {
        dispatch({ type: EXPENSES_EXPORT_ERROR });
      });
  };
}
