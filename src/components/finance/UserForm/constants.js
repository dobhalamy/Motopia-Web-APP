import UserIcon from 'assets/finance/user.svg';
import HomeIcon from 'assets/finance/home.svg';
import RentIcon from 'assets/finance/rent.svg';

export const STEPS = [
  { label: 'INFORMATION', icon: UserIcon },
  { label: 'ADDRESS', icon: HomeIcon },
  { label: 'HOUSING', icon: RentIcon },
];

export const SELECT_OPTIONS_TIME_TO_TRAVEL = Array(13)
  .fill(0)
  .map((previous, current) => ({
    text: String(previous + current),
    value: Number(previous + current),
  }));

export const SELECT_OPTIONS_MONTHS = Array(12)
  .fill(0)
  .map((previous, current) => ({
    text: String(previous + current),
    value: Number(previous + current),
  }));

export const SELECT_OPTIONS_RENT_OR_OWN = [
  { text: 'RENT', value: 'rent' },
  { text: 'OWN', value: 'own' },
];

export const SELECT_OPTIONS_TIME_TO_PRIOR_ADDRESS = [
  { text: '1-3 months', value: 0.2 },
  { text: '4-6 months', value: 0.5 },
  { text: '6+ month', value: 1 },
];

export const SELECT_WISH_TO_TRANSFER = [
  { text: 'No', value: 'No' },
  { text: 'Yes', value: 'Yes' },
];
