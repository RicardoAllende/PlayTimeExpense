import api from '@utils/api';

export const CALENDAR_LOADING = 'CALENDAR_LOADING';
export const CALENDAR_LOADED = 'CALENDAR_LOADED';
export const CALENDAR_ERROR = 'CALENDAR_ERROR';

const initialState = {
  events: [],
  eventsLoading: true,
  eventsError: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CALENDAR_LOADING: {
      return { ...state, eventsLoading: true, eventsError: false };
    }
    case CALENDAR_ERROR: {
      return { ...state, eventsLoading: false, eventsError: true };
    }
    case CALENDAR_LOADED: {
      return {
        ...state,
        events: [...action.response],
        eventsLoading: false,
        eventsError: false,
      };
    }
    default:
      return state;
  }
}

/**
 * Action creators
 */
export function getEvents() {
  return dispatch => {
    dispatch({ type: CALENDAR_LOADING });
    return api
      .get('/expenses')
      .then(response => {
        dispatch({ type: CALENDAR_LOADED, response: response.data });
      })
      .catch(() => {
        dispatch({ type: CALENDAR_ERROR });
      });
  };
}
