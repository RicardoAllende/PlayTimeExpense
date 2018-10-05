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

import { session } from './../../../api/session'
import { AsyncStorage } from "react-native"

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
          // console.log(jsonResponse)
          try {
            if(jsonResponse.response.status == 'ok'){
              dispatch({ type: LOGIN_SUCCESS, response: jsonResponse.data });
              session.setUserData(jsonResponse.data);
              onLoginSuccess(jsonResponse.data);
            }else{
              dispatch({ type: LOGIN_ERROR });
            }
          } catch (error) {
            dispatch({type: LOGIN_ERROR});
          }
        }
      ).catch((error) => {
        dispatch({ type: LOGIN_ERROR });
        console.error(error);
      })
    }    
}

export function doLoginByToken(userData, onLoginSuccess){
  dispatch({ type: LOGIN_STARTED });
  session.setUserData(userData);
  onLoginSuccess();
  return dispatch({ type: LOGIN_SUCCESS, response: userData });
}