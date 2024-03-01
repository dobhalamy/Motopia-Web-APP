import {
  GET_LIST_OF_RDS_VEHICLES,
  VEHICLE_RDS_LIST_FETCH_ERROR,
} from '../constants/rdsVehicles';

const initialState = {
  listOfRDSVehicles: [],
  RDSListFetchError: null,
};

export default function rdsVehicles(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_LIST_OF_RDS_VEHICLES:
      return {
        ...state,
        RDSListFetchError: null,
        listOfRDSVehicles: payload.filter(vehicle => vehicle.pictureURLs.length > 0) || [],
      };
    case VEHICLE_RDS_LIST_FETCH_ERROR:
      return {
        ...state,
        listOfRDSVehicles: [],
        RDSListFetchError: error,
      };
    default:
      return state;
  }
}
