import { createSelector } from 'reselect';

const selectMain = state => state.main;
const selectAvailableVehicle = state => state.availableVehicles;
const selectRdsVehicles = state => state.rdsVehicles;
const selectProspect = state => state.user;
const selectRdsCategory = state => state.rdsCategory;
const selectLocations = state => state.pickupPoints;
const slectPrices = state => state.pricelist;
const selectStatesList = state => state.statesList;
export const isMobileSelector = createSelector(
  selectMain,
  state => state.isMobile
);

export const listOfVehiclesSelector = createSelector(
  selectAvailableVehicle,
  state => state.listOfVehicles
);

export const listOfVehicleFiltersSelector = createSelector(
  selectAvailableVehicle,
  state => state.listOfVehicleFilters
);

export const totalVehcilesCountSelector = createSelector(
  selectAvailableVehicle,
  state => state.totalResults
);

export const filtersCountedSelector = createSelector(
  selectAvailableVehicle,
  state => state.filtersCounted
);

export const updateVehcilesLoadSelector = createSelector(
  selectAvailableVehicle,
  state => state.shouldUpdateList
);

export const listOfVehiclesErrorSelector = createSelector(
  selectAvailableVehicle,
  state => state.vehicleListFetchError
);

export const rdsVehiclesSelector = createSelector(
  selectRdsVehicles,
  state => state.listOfRDSVehicles
);

export const rdsVehiclesErrorSelector = createSelector(
  selectRdsVehicles,
  state => state.RDSListFetchError
);

export const prospectData = createSelector(
  selectProspect,
  state => state
);

export const isRDSCategorySelector = createSelector(
  selectRdsCategory,
  state => state.listOfRDSCategory
);

export const salePoints = createSelector(
  selectLocations,
  state => state.sales
);

export const rdsPoints = createSelector(
  selectLocations,
  state => state.rds
);

export const priceListSelector = createSelector(
  slectPrices,
  state => state.prices
);

export const stateListSelector = createSelector(
  selectStatesList,
  state => state.list
);
