import API, { ADMIN_API, IP_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const AddProspect = params =>
  unifyHandler(
    API.post('/Prospect/AddProspect', {
      ...params,
    })
  ).then(response => {
    window.dataLayer.push({
      event: 'createProspectId',
      createProspectId: response.prospectId,
    });
    return response;
  });

export const UpdateProspect = params =>
  unifyHandler(
    API.post('/Prospect/UpdateProspect', {
      ...params,
    })
  );

export const GetProspect = params =>
  unifyHandler(API.get(`/Prospect/GetProspect/?prospectId=${params}`));

export const GetIpInfo = () => unifyHandler(IP_API.get());

export const SavePayments = params =>
  unifyHandler(
    ADMIN_API.post('/dm-payment', {
      ...params,
    })
  );

export const Transfer = params =>
  unifyHandler(
    API.post('/Prospect/TransferProspectToCustomer', {
      ...params,
    })
  );

export const getVehicles = params =>
  unifyHandler(ADMIN_API.get(`/prospect-vehicles/${params}`));
