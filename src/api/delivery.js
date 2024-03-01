import API, { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getDelivery = () => unifyHandler(ADMIN_API.get('/delivery'));

export const setDelivery = (delivery) => unifyHandler(ADMIN_API.post('/delivery', delivery));

export const getExternalDeliveryFee = (params) =>
  unifyHandler(API.get('/PickupLocation/GetDeliveryFee', { params }));
