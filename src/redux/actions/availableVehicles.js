import { Vehicle } from 'src/api';
import {
  GET_LIST_OF_VEHICLES,
  VEHICLE_LIST_FETCH_ERROR,
  GET_LIST_OF_VEHICLES_FILTERS,
  UPDATE_VECHILES_LOAD_STATUS,
} from '../constants/availableVehicles';

export const getListOfVehicles = params => async dispatch => {
  try {
    const response = await Vehicle.getAll(params);
    const resData = response.data;
    dispatch({
      type: GET_LIST_OF_VEHICLES,
      payload: {
        data: resData,
        totalResults: response.totalResults,
        reset: params.reset,
        filtersCounted: response.filtersCounted,
      }
    });
  } catch (error) {
    dispatch({ type: VEHICLE_LIST_FETCH_ERROR, error });
  }
};

export const getListOfVehicleFilters = params => async dispatch => {
  try {
    const response = await Vehicle.getVehicleFilters(params);
    const resData = response.data;
    dispatch({ type: GET_LIST_OF_VEHICLES_FILTERS, payload: { data: resData } });
  } catch (error) {
    dispatch({ type: VEHICLE_LIST_FETCH_ERROR, error });
  }
};

export const updateVehiclesLoadStatus = (params) => async dispatch => {
  dispatch({ type: UPDATE_VECHILES_LOAD_STATUS, payload: { data: params } });
};
