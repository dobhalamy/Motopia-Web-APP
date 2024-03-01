export const FILTER_RANGES = [
  'carPriceRange',
  'yearRange',
  'mileageRange',
  'mpg',
  'monthlyPaymentRange',
  'cashDownPaymentRange',
];

export const FILTER_MONEY_TITLES = [
  'carPriceRange',
  'monthlyPaymentRange',
  'cashDownPaymentRange',
];

export const RECOMMENDED = 'RECOMMENDED';
export const ASCENDING_PRICE = 'ASCENDING PRICE';
export const DESCENDING_PRICE = 'DESCENDING PRICE';
export const NEWEST_YEAR = 'NEWEST YEAR';
export const LOWEST_MILEAGE = 'LOWEST MILEAGE';
// NOTE: This block is related to implementation of sorting with Lowest Downpayment or Lowest Mothly payment
// export const LOWEST_DOWNPAYMENT = 'LOWEST DOWNPAYMENT';
// export const LOWEST_MONTHLY_PAYMENT = 'LOWEST MONTHLY PAYMENT';

export const SORT_PARAMETERS = [
  RECOMMENDED,
  ASCENDING_PRICE,
  DESCENDING_PRICE,
  NEWEST_YEAR,
  LOWEST_MILEAGE,
  // NOTE: This block is related to implementation of sorting with Lowest Downpayment or Lowest Mothly payment
  // LOWEST_DOWNPAYMENT,
  // LOWEST_MONTHLY_PAYMENT,
];

export const COMMON_FILTER_TITLE = {
  carPriceRange: 'price',
  monthlyPaymentRange: 'monPay',
  cashDownPaymentRange: 'cdPay',
  selectedModels: 'models',
  yearRange: 'year',
  mileageRange: 'mileage',
  selectedSeatAmount: 'seat',
  selectedBodyTypes: 'body',
  selectedColors: 'color',
  selectedFuelType: 'fuel',
  mpg: 'mpg',
  selectedTransmission: 'tran',
  selectedCylindersAmount: 'cyl',
  selectedDrivetrainType: 'drTrain',
  selectedRideShareType: 'rideShare',
  selectedLifeStyleType: 'lifeStyle',
  selectedStandardFeatureType: 'standardFeature',
};

export const SHORT_FILTER_TITLE = {
  price: 'carPriceRange',
  monPay: 'monthlyPaymentRange',
  cdPay: 'cashDownPaymentRange',
  models: 'selectedModels',
  year: 'yearRange',
  mileage: 'mileageRange',
  seat: 'selectedSeatAmount',
  body: 'selectedBodyTypes',
  color: 'selectedColors',
  fuel: 'selectedFuelType',
  mpg: 'mpg',
  tran: 'selectedTransmission',
  cyl: 'selectedCylindersAmount',
  drTrain: 'selectedDrivetrainType',
  rideShare: 'selectedRideShareType',
  lifeStyle: 'selectedLifeStyleType',
  standardFeature: 'selectedStandardFeatureType',
};

export const NUMBER_TYPE_FILTER = ['price', 'year', 'mileage', 'mpg', 'monPay', 'cdPay'];
