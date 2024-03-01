import {
  GET_LIST_OF_VEHICLES,
  VEHICLE_LIST_FETCH_ERROR,
  GET_LIST_OF_VEHICLES_FILTERS,
  UPDATE_VECHILES_LOAD_STATUS,
} from '../constants/availableVehicles';

const initialState = {
  listOfVehicles: [],
  vehicleListFetchError: null,
  listOfVehicleFilters: [],
  totalResults: 1,
  shouldUpdateList: false,
  filtersCounted: [],
};

export default function availableVehicles(state = initialState, { type, payload, error }) {
  switch (type) {
    case GET_LIST_OF_VEHICLES:
      return {
        ...state,
        vehicleListFetchError: null,
        listOfVehicles: (payload.reset
          ? payload.data.filter(vehicle => vehicle.picturesUrl.length > 0)
          : state.listOfVehicles.concat(
            payload.data.filter(vehicle => vehicle.picturesUrl.length > 0)
          )) || [],
        totalResults: payload.totalResults,
        filtersCounted: payload.filtersCounted,
        shouldUpdateList: true
      };
    case GET_LIST_OF_VEHICLES_FILTERS:
      return {
        ...state,
        vehicleListFetchError: null,
        listOfVehicleFilters: payload.data || [],
      };
    case VEHICLE_LIST_FETCH_ERROR:
      return {
        ...state,
        listOfVehicles: [],
        vehicleListFetchError: error,
      };
    case UPDATE_VECHILES_LOAD_STATUS:
      return {
        ...state,
        shouldUpdateList: false,
      };
    default:
      return state;
  }
}
