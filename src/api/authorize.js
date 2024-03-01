import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const createCustomer = body => {
  unifyHandler(ADMIN_API.post('/chargeCards/createCustomer', { body }));
};

export const chargeCreditCard = params =>
  unifyHandler(
    ADMIN_API.post('/chargeCards/chargeCreditCard', { params })
  ).then(response => {
    if (response.status === 'success') {
      window.dataLayer.push({
        event: 'chargeCreditCard',
        chargeCreditCard: response,
      });
    }
    return response;
  });

export const sendReceipt = params =>
  unifyHandler(ADMIN_API.post('/chargeCards/sendReceipt', { params }));
