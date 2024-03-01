import {
  GET_PRICE_LIST,
  PRICE_LIST_FETCH_ERROR,
} from '../constants/prices';

const initialState = {
  blogPosts: {},
  pricesListFetchError: null
};

export default function blogPosts(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_PRICE_LIST:
      return {
        ...state,
        pricesListFetchError: null,
        prices: payload.data || {}
      };
    case PRICE_LIST_FETCH_ERROR:
      return {
        ...state,
        prices: {},
        pricesListFetchError: error
      };
    default:
      return state;
  }
}
