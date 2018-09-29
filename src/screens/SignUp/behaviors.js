import api from '@utils/api';

export const SIGNUP_STARTED = 'SIGNUP_STARTED';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';

const initialState = {
  signupStarted: false,
  signupSuccess: false,
  signupError: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SIGNUP_STARTED: {
      return {
        ...state,
        signupStarted: true,
        signupSuccess: false,
        signupError: false,
      };
    }
    case SIGNUP_SUCCESS: {
      return {
        ...state,
        profile: action.response,
        signupStarted: false,
        signupSuccess: true,
        signupError: false,
      };
    }
    case SIGNUP_ERROR: {
      return {
        ...state,
        signupStarted: false,
        signupSuccess: false,
        signupError: true,
      };
    }
    default:
      return state;
  }
}

/**
 * Action creators
 */
export function doSignUp(values, onSuccess) {
  const data = {
    username: values.username,
    email: values.email,
    password: values.password,
  };
  return dispatch => {
    dispatch({ type: SIGNUP_STARTED });
    return api
      .post('/auth', data)
      .then(response => {
        dispatch({ type: SIGNUP_SUCCESS, response: response.data });
        onSuccess();
      })
      .catch(() => {
        dispatch({ type: SIGNUP_ERROR });
      });
  };
}
