import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getAll = () =>
  unifyHandler(ADMIN_API.get('/cards'));
