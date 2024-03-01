import {
  GET_LIST_OF_USA_STATES,
  LIST_OF_USA_STATES_FETCH_ERROR,
} from '../constants/statesList';

const initialState = {
  list: [],
  statesListFetchError: null,
};

export default function statesList(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_LIST_OF_USA_STATES:
      return {
        ...state,
        statesListFetchError: null,
        list: payload
      };
    case LIST_OF_USA_STATES_FETCH_ERROR:
      return {
        ...state,
        list: [],
        statesListFetchError: error,
      };
    default:
      return state;
  }
}
