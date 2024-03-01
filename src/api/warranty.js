import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getWarrantyImages = () => unifyHandler(ADMIN_API.get('/warranty'));
