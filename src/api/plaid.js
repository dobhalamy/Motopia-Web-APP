import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getPlaidLink = () =>
  unifyHandler(ADMIN_API.get('/plaid/create-token'));
export const createAssetReport = params =>
  unifyHandler(ADMIN_API.post('/plaid/create-asset-report', { ...params }));

export const getAssetReport = params =>
  unifyHandler(ADMIN_API.post('/plaid/get-asset-report', { ...params }));

export const getAccessToken = params =>
  unifyHandler(ADMIN_API.post('/plaid/exchange-token', { ...params }));
