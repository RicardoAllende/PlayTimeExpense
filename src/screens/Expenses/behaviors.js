import api from '@utils/api';

export const EXPENSES_LOADING = 'EXPENSES_LOADING';
export const EXPENSES_LOADED = 'EXPENSES_LOADED';
export const EXPENSES_ERROR = 'EXPENSES_ERROR';

export const EXPENSE_DELETE_STARTED = 'EXPENSE_DELETE_STARTED';
export const EXPENSE_DELETE_SUCESS = 'EXPENSE_DELETE_SUCESS';
export const EXPENSE_DELETE_ERROR = 'EXPENSE_DELETE_ERROR';

const initialState = {
  expenses: [],
  expensesLoading: true,
  expensesError: false,
  expenseDeleting: false,
  expenseDeleted: false,
  expenseDeletingError: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case EXPENSES_LOADING: {
      return { ...state, expensesLoading: true, expensesError: false };
    }
    case EXPENSES_ERROR: {
      return { ...state, expensesLoading: false, expensesError: true };
    }
    case EXPENSES_LOADED: {
      return {
        ...state,
        expenses: [...action.response],
        expensesLoading: false,
        expensesError: false,
      };
    }
    case EXPENSE_DELETE_STARTED: {
      return {
        ...state,
        expenseDeleting: true,
        expenseDeleted: false,
        expenseDeletingError: false,
      };
    }
    case EXPENSE_DELETE_SUCESS: {
      return {
        ...state,
        expenseDeleting: false,
        expenseDeleted: true,
        expenseDeletingError: false,
      };
    }
    case EXPENSE_DELETE_ERROR: {
      return {
        ...state,
        expenseDeleting: false,
        expenseDeleted: false,
        expenseDeletingError: true,
      };
    }
    default:
      return state;
  }
}

/**
 * Action creators
 */
export function getExpenses() {
  return dispatch => {
    dispatch({ type: EXPENSES_LOADING });
    return api
      .get('/expenses')
      .then(response => {
        dispatch({ type: EXPENSES_LOADED, response: response.data });
      })
      .catch(() => {
        dispatch({ type: EXPENSES_ERROR });
      });
  };
}

export function deleteExpense(id) {
  return dispatch => {
    dispatch({ type: EXPENSE_DELETE_STARTED });
    return api
      .delete('/expenses/' + id)
      .then(response => {
        dispatch({ type: EXPENSE_DELETE_SUCESS, response: response.data });
      })
      .catch(() => {
        dispatch({ type: EXPENSE_DELETE_ERROR });
      });
  };
}
