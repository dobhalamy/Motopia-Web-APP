import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

// eslint-disable-next-line max-len
export const getSeoTagsByStateAndPlate = params =>
  unifyHandler(ADMIN_API.get('/ride-share-seo/byPlateAndState', { params }));
export const getAllPagesRoutes = () =>
  unifyHandler(ADMIN_API.get('/ride-share-seo/pages'));
export const getSeo = () =>
  unifyHandler(ADMIN_API.get('/ride-share-seo/seo-list'));

export const getRideSharesLocation = () =>
  unifyHandler(ADMIN_API.get('/ride-share-seo'));
