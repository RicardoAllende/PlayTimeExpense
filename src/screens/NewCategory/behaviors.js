import api from '@utils/api';

export const CATEGORY_ADD_STARTED = 'CATEGORY_ADD_STARTED';
export const CATEGORY_ADD_SUCCESS = 'CATEGORY_ADD_SUCCESS';
export const CATEGORY_ADD_ERROR = 'CATEGORY_ADD_ERROR';

const initialState = {
  addCategoryStarted: false,
  addCategorySuccess: false,
  addCategoryError: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CATEGORY_ADD_STARTED: {
      return {
        ...state,
        addCategoryStarted: true,
        addCategorySuccess: false,
        addCategoryError: false,
      };
    }
    case CATEGORY_ADD_SUCCESS: {
      return {
        ...state,
        addCategoryStarted: false,
        addCategorySuccess: true,
        addCategoryError: false,
      };
    }
    case CATEGORY_ADD_ERROR: {
      return {
        ...state,
        addCategoryStarted: false,
        addCategorySuccess: false,
        addCategoryError: true,
      };
    }
    default:
      return state;
  }
}

/**
 * Action creators
 */
export function doAddCategory(values, onSuccess) {
  const data = {
    name: values.name,
    iconName: values.iconName,
    percent: 0,
    amount: 0,
  };
  return dispatch => {
    dispatch({ type: CATEGORY_ADD_STARTED });
    return api
      .post('/categories', data)
      .then(response => {
        dispatch({ type: CATEGORY_ADD_SUCCESS, response: response.data });
        onSuccess();
      })
      .catch(() => {
        dispatch({ type: CATEGORY_ADD_ERROR });
      });
  };
}
