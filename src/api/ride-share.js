import { flattenDeep } from 'lodash';
import API, { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

const getAllZones = () => unifyHandler(API.get('/Inventory/RSDZoneCount'));

export const getAvailableZones = () =>
  getAllZones().then(({ rsdZoneList }) => {
    if (rsdZoneList && rsdZoneList.length) {
      return rsdZoneList
        .filter(zone => zone.count > 0)
        .map(zone => zone.zoneName);
    } else {
      console.error('There is no zones.');
      return [];
    }
  });

export const getStatesByZone = Zone =>
  unifyHandler(API.get('/Inventory/GetStateByZone', { params: { Zone } })).then(
    ({ response: { data } }) => {
      if (data && data.length) {
        return data.map(({ state, stateAbbrevation }) => ({
          text: state,
          value: stateAbbrevation,
        }));
      } else {
        console.error('There is no states.');
        return [];
      }
    }
  );

export const getZonesByState = (state, statesList, isAbbriv = true) => {
  let stateName = state;
  if (isAbbriv && statesList.length) {
    stateName = statesList.find(el => el.value === state)?.text;
  }
  return unifyHandler(
    API.get('/Inventory/GetZoneByState', { params: { State: stateName } })
  ).then(({ response: { data } }) => {
    if (data && data.length) {
      return data.map(({ zone }) => zone);
    } else {
      console.error('There is no zones.');
      return null;
    }
  });
};

export const getStatesByZoneList = zoneArray => {
  const ZoneList = zoneArray.join(',');
  return unifyHandler(
    API.get('/Inventory/GetStateByMultipleZones', { params: { ZoneList } })
  ).then(({ response }) => {
    if (response) {
      return flattenDeep(response.map(el => el.statelist)).map(
        ({ state, stateAbbrevation }) => ({
          text: state,
          value: stateAbbrevation,
        })
      );
    } else {
      console.error('There are no states for multiple zones');
      return [];
    }
  });
};
export const getRandomRdsContent = async () =>
  unifyHandler(ADMIN_API.get('/rds-list/random-content')).then(rdsData => {
    if (rdsData.data) {
      return rdsData;
    }
    return null;
  });

export const getAllStates = () =>
  getAllZones()
    .then(({ rsdZoneList }) => {
      if (rsdZoneList && rsdZoneList.length) {
        return rsdZoneList.map(zone => zone.zoneName);
      } else {
        return [];
      }
    })
    .then(zones => (zones.length ? getStatesByZoneList(zones) : zones));
