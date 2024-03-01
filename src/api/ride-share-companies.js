import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getRdsCompaniesList = () => unifyHandler(ADMIN_API.get('/ride-share-companies')).then(res => res.data);
