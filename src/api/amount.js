import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const setAmount = (params) =>
  unifyHandler(ADMIN_API.post('/amount', { ...params }));

export const getAmount = (id) =>
  unifyHandler(ADMIN_API.get(`/amount/${id}`));
