// import { RideShare } from 'src/api';
import {
  GET_LIST_OF_USA_STATES,
  LIST_OF_USA_STATES_FETCH_ERROR,
} from '../constants/statesList';

export const getListOfUsaStates = rdsVehicleList => async dispatch => {
  try {
    dispatch({ type: GET_LIST_OF_USA_STATES, payload: rdsVehicleList });
  } catch (error) {
    dispatch({ type: LIST_OF_USA_STATES_FETCH_ERROR, error });
  }
};
