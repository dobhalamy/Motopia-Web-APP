import API from './API_Base';
import unifyHandler from './unifyHandler';

export const GetAllLocations = params =>
  unifyHandler(API.get(`/PickupLocation/GetAllPickupLocations?serviceType=${params}`));

export const GetClosestLocation = (lat, lng, serviceType) =>
  unifyHandler(API.get('/PickupLocation/GetClosestCustomerPickup', {
    params: {
      lat,
      lng,
      serviceType,
    }
  }));

export const CalculatePickupDate = (name, stockId, serviceType) =>
  unifyHandler(API.get('/PickupLocation/CalculateCustomerPickupDate', {
    params: {
      customerPickupLocationName: name,
      stockId,
      serviceType,
    }
  }));
