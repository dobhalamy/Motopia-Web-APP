import { getCookie, getCookieJSON, setCookie, clearAppCookies } from 'src/utils/cookie';
import { SAVE_USER_DATA, LOGOUT_USER } from '../constants/user';
import { Prospect, User, Amount, Location } from '../../api';
import {
  GET_LIST_OF_PICKUP,
  LIST_OF_PICKUP_FETCH_ERROR,
} from '../constants/pickupLocations';

import setAuthToken from '../../api/setAuthToken';

export const saveUserData = payload => ({
  type: SAVE_USER_DATA,
  payload,
});

export const deleteUserData = () => ({
  type: LOGOUT_USER,
});

export const getProspectorProfile = prospectId => async dispatch => {
  let prospector;
  let additionalData = {};
  let amountData = {};
  let ipInfo = getCookieJSON('ipInfo');
  let closestSalesPoint = {};
  let closestRDSPoint = {};

  try {
    prospector = await Prospect.GetProspect(prospectId);
  } catch (error) {
    console.error('PROSPECTOR_ERROR', error);
  }

  if (!ipInfo) {
    try {
      ipInfo = await Prospect.GetIpInfo();
      setCookie('ipInfo', ipInfo);
    } catch (error) {
      console.error('IP_ERROR', error);
    }
  }

  try {
    additionalData = await User.GetAccountDetails();
  } catch (error) {
    console.error('ACCOUNT_DETAILS_ERROR', error);
  }

  try {
    amountData = await Amount.getAmount(prospectId);
  } catch (error) {
    console.error('AMOUNT_ERROR', error);
  }

  if (ipInfo) {
    const lat = ipInfo.latitude;
    const lon = ipInfo.longitude;
    try {
      const closeSale = await Location.GetClosestLocation(lat, lon, 'Sales');
      closestSalesPoint = closeSale.closestPickuplocation;
      const closeRds = await Location.GetClosestLocation(lat, lon, 'Ride-share');
      closestRDSPoint = closeRds.closestPickuplocation;
      const sales = await Location.GetAllLocations('Sales');
      const rds = await Location.GetAllLocations('Ride-share');
      dispatch({ type: GET_LIST_OF_PICKUP,
        payload: {
          sales: sales.customerPickuplocations,
          rds: rds.customerPickuplocations,
        }
      });
    } catch (error) {
      console.error('LOCATION_ERROR', error);
      dispatch({ type: LIST_OF_PICKUP_FETCH_ERROR, error });
    }
  }
  const cookieToken = getCookie('token');
  dispatch(saveUserData({
    ...prospector,
    ...amountData.data,
    ...additionalData.accSettings,
    location: ipInfo,
    closestSalesPoint,
    closestRDSPoint,
    token: cookieToken || sessionStorage.token
  }));

  return prospector;
};

export const logoutUser = () => dispatch => {
  clearAppCookies();
  sessionStorage.clear();
  setAuthToken(false);
  dispatch(deleteUserData());
};
