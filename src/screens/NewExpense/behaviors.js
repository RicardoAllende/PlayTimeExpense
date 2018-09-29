import api from '@utils/api';

export const CATEGORIES_LOADING = 'CATEGORIES_LOADING';
export const CATEGORIES_LOADED = 'CATEGORIES_LOADED';
export const CATEGORIES_ERROR = 'CATEGORIES_ERROR';
export const EXPENSE_ADD_STARTED = 'EXPENSE_ADD_STARTED';
export const EXPENSE_ADD_SUCCESS = 'EXPENSE_ADD_SUCCESS';
export const EXPENSE_ADD_ERROR = 'EXPENSE_ADD_ERROR';

const initialState = {
  addExpenseStarted: false,
  addExpenseSuccess: false,
  addExpenseError: false,
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
    case EXPENSE_ADD_STARTED: {
      return {
        ...state,
        addExpenseStarted: true,
        addExpenseSuccess: false,
        addExpenseError: false,
      };
    }
    case EXPENSE_ADD_SUCCESS: {
      return {
        ...state,
        addExpenseStarted: false,
        addExpenseSuccess: true,
        addExpenseError: false,
      };
    }
    case EXPENSE_ADD_ERROR: {
      return {
        ...state,
        addExpenseStarted: false,
        addExpenseSuccess: false,
        addExpenseError: true,
      };
    }
    default:
      return state;
  }
}

/**
 * Action creators,
 */
export function doAddExpense(values, onSuccess) {
  const data = {
    amount: Number(values.amount),
    title: values.title,
    category: values.category,
    date: values.date,
    permanent: values.permanent,
  };

  return dispatch => {
    dispatch({ type: EXPENSE_ADD_STARTED });
    return api
      .post('/expenses', data)
      .then(response => {
        dispatch({ type: EXPENSE_ADD_SUCCESS, response: response.data });
        onSuccess();
      })
      .catch(() => {
        dispatch({ type: EXPENSE_ADD_ERROR });
      });
  };
}

export function loadCategories() {
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
