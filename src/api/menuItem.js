import unifyHandler from './unifyHandler';
import { ADMIN_API } from './API_Base';

export const getMenuItems = () => unifyHandler(ADMIN_API.get('/menuItems'));
