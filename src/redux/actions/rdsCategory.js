import { Vehicle } from 'src/api';
import {
  GET_RDS_CATEGORY_LIST,
  RDS_CATEGORY_LIST_ERROR,
} from '../constants/rdsCategory';

export const getListOfRdsCategory = () => async dispatch => {
  try {
    const response = await Vehicle.getAllRdsCategoryList();
    dispatch({ type: GET_RDS_CATEGORY_LIST, payload: response.data });
  } catch (error) {
    dispatch({ type: RDS_CATEGORY_LIST_ERROR, error });
  }
};
