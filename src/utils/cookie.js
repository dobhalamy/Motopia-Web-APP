import Cookie from 'js-cookie';

const domain =
  process.env.NODE_ENV === 'development' ? 'localhost' : 'gomotopia.com';
const saveConfig = {
  expires: 30, // days to store cookies
  domain,
};

export const getCookie = name => Cookie.get(name);

export const getCookieJSON = name => Cookie.getJSON(name);

export const setCookie = (name, value) => Cookie.set(name, value, saveConfig);

export const removeCookie = name => Cookie.remove(name, { path: '', domain });

const cookies = [
  'dmp',
  'fees',
  'token',
  'ipInfo',
  'address',
  'rdsData',
  'rentInfo',
  'creditId',
  'pullCredit',
  'prospectId',
  'pickupInfo',
  'customerId',
  'salesTaxRate',
  'bankCreditId',
  'vehicleChosenInfo',
  'selectedDownPayment',
  'bankAnalysisResponse',
  'updateCreditResponse',
  'GetBankAnalysisWithCar',
  'isSendedSavings',
  'userInfo',
];

export const clearAppCookies = () =>
  cookies.forEach(cookie => removeCookie(cookie));
