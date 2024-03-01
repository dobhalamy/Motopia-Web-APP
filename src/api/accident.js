import API from './API_Base';
import unifyHandler from './unifyHandler';

export const getAccidentReportById = id =>
  unifyHandler(API.get('/api/Account/GetAccidentReportById', { id }));
export const addUpdateAccidentReport = data =>
  unifyHandler(API.post('/Account/AddUpdateAccidentReport', data));

export const checkOpenAccidentReportByAccountId = id =>
  unifyHandler(API.get(`/Account/CheckOpenAccidentReportByAccountId/${id}`));

export const getAccidentReportTotleCountByAccountId = accountId =>
  unifyHandler(
    API.get(`/Account/GetAccidentReportTotleCountByAccountId/${accountId}`)
  );

export const GetAccidentReportById = id =>
  unifyHandler(API.get(`/Account/GetAccidentReportById/${id}`));
