import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getPriceList = () => unifyHandler(ADMIN_API.get('/prices'));

export const setPriceList = prices => unifyHandler(ADMIN_API.post('/prices', { ...prices }));
