import API from './API_Base';
import unifyHandler from './unifyHandler';

export const GetFeeByState = ({ registeringState, registrationTransfer, fuelType }) =>
  unifyHandler(
    API.get('/Fee/GetFeeByState', {
      params: {
        registeringState,
        registrationTransfer,
        fuelType,
      }
    }));

export const GetSalesTax = ({ registeringState, zipcode }) =>
  unifyHandler(
    API.get('/SalesTax/GetSalesTax', {
      params: {
        registeringState,
        zipcode,
      }
    }));
