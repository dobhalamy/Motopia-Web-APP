import { Vehicle } from 'src/api';
import {
  GET_LIST_OF_RDS_VEHICLES,
  VEHICLE_RDS_LIST_FETCH_ERROR,
} from '../constants/rdsVehicles';

export const getListOfRDSVehicles = () => async dispatch => {
  try {
    const response = await Vehicle.getAllRds();
    const pardsedVehicles = response.rsdVehicleList.map(el =>
      ({ ...el, rsdInventoryType: el.rsdInventoryType.toUpperCase() }))
      .sort((a, b) => a.tier1Down - b.tier1Down);
    dispatch({ type: GET_LIST_OF_RDS_VEHICLES, payload: pardsedVehicles });
  } catch (error) {
    dispatch({ type: VEHICLE_RDS_LIST_FETCH_ERROR, error });
  }
};
