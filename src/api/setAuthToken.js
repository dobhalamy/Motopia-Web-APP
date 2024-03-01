import { TEMPORARY_ADMIN_TOKEN } from 'src/constants';
import axios, { ADMIN_API } from './API_Base';

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    ADMIN_API.defaults.headers.common.Authorization = `Bearer ${TEMPORARY_ADMIN_TOKEN}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
    delete ADMIN_API.defaults.headers.common.Authorization;
  }
};

export default setAuthToken;
