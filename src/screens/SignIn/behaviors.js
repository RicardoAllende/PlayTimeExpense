// import api from '@utils/api';

export const LOGIN_STARTED = 'LOGIN_STARTED';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

import {api} from './../../../api/playTimeApi'

const initialState = {
  loginStarted: false,
  loginSuccess: false,
  loginError: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_STARTED: {
      return {
        ...state,
        loginStarted: true,
        loginSuccess: false,
        loginError: false,
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        profile: action.response,
        loginStarted: false,
        loginSuccess: true,
        loginError: false,
      };
    }
    case LOGIN_ERROR: {
      return {
        ...state,
        loginStarted: false,
        loginSuccess: false,
        loginError: true,
      };
    }
    default:
      return state;
  }
}

/**
 * Action creators
 */
export function doLogin(username, password, onLoginSuccess) {
  credentials = JSON.stringify({
      email: username,
      password: password
  })
  return dispatch => {
    dispatch({ type: LOGIN_STARTED });
    console.warn(api.auth)
    return fetch(api.auth, { 
          method: 'POST', 
          headers: {
          // "Authorization": 'Bearer ' + bearerToken ,
              Accept: 'application/json',
              "Content-Type": "application/json"
          }, 
          body: credentials
      })
      .then((response) => response.json() )
      .then((jsonResponse) => {
          console.log(jsonResponse)
          if(jsonResponse.response.status == 'ok'){
            dispatch({ type: LOGIN_SUCCESS, response: jsonResponse.data.profile_data });
            onLoginSuccess(jsonResponse.data);
          }
        }
      ).catch((error) => {
        dispatch({ type: LOGIN_ERROR });
        console.error(error);
      })
    }    
}

// export function doLogin(username, password, onLoginSuccess) {
//   return dispatch => {
//     dispatch({ type: LOGIN_STARTED });
//     return api
//       .get('/auth', { username: username, password: password })
//       .then(response => {
//         dispatch({ type: LOGIN_SUCCESS, response: response.data });
//         onLoginSuccess();
//       })
//       .catch(() => {
//         dispatch({ type: LOGIN_ERROR });
//       });
//   };
// }