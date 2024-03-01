import API, { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getAvailableVehicleList = () =>
  unifyHandler(API.get('/Inventory/AvailableVehicleList'));

export const getAll = queryParams =>
  unifyHandler(ADMIN_API.get('/vehicles/pagination', { params: queryParams }));

export const getFinanceCarCount = price =>
  unifyHandler(ADMIN_API.get(`/vehicles/financeCarCount/${price}`));

export const getVehicleFilters = queryParams =>
  unifyHandler(ADMIN_API.get('/vehicles/filters', { params: queryParams }));

export const getAllRds = () =>
  unifyHandler(API.get('/Inventory/RSDVehicleList'));

export const getVehicleById = (id, prospectId) =>
  unifyHandler(ADMIN_API.get(`/vehicles/${id}`, { params: { prospectId } }));

export const getVehiclePins = () =>
  unifyHandler(ADMIN_API.get('/vehicle-pins'));

export const getVehiclePinsById = id =>
  unifyHandler(ADMIN_API.get(`/vehicle-pins/${id}`));

export const CheckStatus = StockId =>
  unifyHandler(
    API.get('/Inventory/CheckInventoryStatus', {
      params: { StockId },
    })
  );

export const AssignToPending = params =>
  unifyHandler(
    API.post('/Inventory/AssignToPending', {
      ...params,
    })
  );

export const RemoveVehicle = stockid =>
  unifyHandler(
    ADMIN_API.delete('/vehicles', {
      params: { stockid },
    })
  );

export const AssignToDStatus = stockid =>
  unifyHandler(
    ADMIN_API.put(`/vehicles/assignToDStatus/${stockid}`)
  );

export const getAllRdsCategoryList = () =>
  unifyHandler(ADMIN_API.get('/vehicles/rdsCategoris'));

export const getRDSDescription = selectedCategory =>
  unifyHandler(ADMIN_API.get(`/category/getDesc/${selectedCategory}`));

export const getLifeStyleDescription = selectedCategory =>
  unifyHandler(ADMIN_API.get(`/lifeStyle/getDesc/${selectedCategory}`));

export const getInfoByStockIdOrVin = vehicleNum =>
  unifyHandler(ADMIN_API.post('/vehicles/getInfoByStockIdOrVin', { ...vehicleNum }));
