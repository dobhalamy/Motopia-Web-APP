import { TEMPORARY_ADMIN_TOKEN } from 'src/constants';
import { ADMIN_API } from './API_Base';

const setTemporaryAdminToken = () => {
  ADMIN_API.defaults.headers.common.Authorization = `Bearer ${TEMPORARY_ADMIN_TOKEN}`;
};

export default setTemporaryAdminToken;
