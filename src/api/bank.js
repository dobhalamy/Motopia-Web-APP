import API from './API_Base';
import unifyHandler from './unifyHandler';

export const CreateCreditApplicationVehicleSale = params =>
  unifyHandler(
    API.post('/Bank/CreateCreditApplication_VehicleSale', {
      ...params,
    })
  );

export const UpdateCreditApplicationVehicleSale = params =>
  unifyHandler(
    API.post('/Bank/UpdateCreditApplication_VehicleSale', {
      ...params,
    })
  );

export const CreateCreditApplicationVehicleRent = params =>
  unifyHandler(
    API.post('/Bank/CreateCreditApplication_VehicleRent', {
      ...params,
    })
  ).then(response => {
    window.dataLayer.push({
      event: 'createCreditAppId',
      createCreditAppId: response.creditAppId,
    });
    return response;
  });
export const UpdateCreditAppWithDetailsVehicleSale = params =>
  unifyHandler(
    API.post('/Bank/UpdateCreditAppWithDetails_VehicleSale', {
      ...params,
    })
  ).then(response => response);

export const GetBankAnalysisWithCar = (
  creditAppId,
  stockId,
  aprovedTerm,
  downPayment
) =>
  unifyHandler(
    API.get(
      // eslint-disable-next-line max-len
      '/Bank/GetBankAnalysis',
      {
        params: {
          CreditId: creditAppId,
          StockId: stockId,
          AprovedTerm: aprovedTerm,
          DownPayment: downPayment,
        },
      }
    )
  );

export const GetBankAnalysisWithoutCar = params =>
  unifyHandler(
    API.get(`/Bank/GetBankAnalysisWithoutCar?CreditAppId=${params}`)
  );

export const PullCredit = params =>
  unifyHandler(API.get(`/Bank/PullCredit?CreditAppId=${params}`));
