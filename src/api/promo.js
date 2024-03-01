import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getHomeBanners = () =>
  unifyHandler(ADMIN_API.get('/hero/primary'));

export const getBanners = () =>
  unifyHandler(ADMIN_API.get('/promo/primary'));
