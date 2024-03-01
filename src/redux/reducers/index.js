import { combineReducers } from 'redux';
import main from './main';
import availableVehicles from './availableVehicles';
import rdsVehicles from './rdsVehicles';
import user from './user';
import rdsCategory from './rdsCategory';
import pickupPoints from './pickupLocations';
import pricelist from './prices';
import statesList from './statesList';

export default combineReducers({
  main,
  availableVehicles,
  rdsVehicles,
  user,
  rdsCategory,
  pickupPoints,
  pricelist,
  statesList,
});
