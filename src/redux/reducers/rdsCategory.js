import {
  GET_RDS_CATEGORY_LIST,
  RDS_CATEGORY_LIST_ERROR,
} from '../constants/rdsCategory';

const initialState = {
  listOfRDSCategory: [],
  RDSCategoryListError: null,
};

export default function rdsCategory(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_RDS_CATEGORY_LIST:
      return {
        ...state,
        RDSCategoryListError: null,
        listOfRDSCategory: payload || [],
      };
    case RDS_CATEGORY_LIST_ERROR:
      return {
        ...state,
        listOfRDSCategory: [],
        RDSCategoryListError: error,
      };
    default:
      return state;
  }
}
