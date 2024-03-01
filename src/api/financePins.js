import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getFinancePins = () =>
  unifyHandler(ADMIN_API.get('/finance-pins'));
