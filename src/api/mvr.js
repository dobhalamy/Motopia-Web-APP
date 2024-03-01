import API, { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getMVRAnalysis = (creditId, jobsAmount) =>
  unifyHandler(
    API.get(
      `/MVR/GetMVRAnalysis?CreditId=${creditId}&RideshareJobs=${jobsAmount}`
    )
  );

export const getMVRReport = (creditId, jobsAmount) =>
  unifyHandler(
    API.get(
      `/MVR/CreateMVRPDF?CreditId=${creditId}&RideshareJobs=${jobsAmount}`
    )
  );

export const saveReport = params =>
  unifyHandler(ADMIN_API.post('/mvr', { ...params }));

export const getReport = id => unifyHandler(ADMIN_API.get(`/mvr/${id}`));

export const getPlaidMvr = params =>
  unifyHandler(API.post('/MVR/AddPlaidInfo', { ...params }));
