import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

const PROMOTION_REFERRER = '/promotion/referrer';

export const checkPromoCode = data =>
  unifyHandler(ADMIN_API.post('/promotion', { ...data }));

export const addReferrer = data =>
  unifyHandler(ADMIN_API.post(`${PROMOTION_REFERRER}`, { ...data }));
