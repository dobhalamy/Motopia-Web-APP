import {
  GET_LIST_OF_PICKUP,
  LIST_OF_PICKUP_FETCH_ERROR,
} from '../constants/pickupLocations';

const initialState = {
  sales: [],
  rds: [],
  pickUpFetchError: null,
};

export default function pickupLocations(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_LIST_OF_PICKUP:
      return {
        ...state,
        pickUpFetchError: null,
        sales: payload.sales,
        rds: payload.rds,
      };
    case LIST_OF_PICKUP_FETCH_ERROR:
      return {
        ...state,
        sales: [],
        rds: [],
        pickUpFetchError: error,
      };
    default:
      return state;
  }
}
