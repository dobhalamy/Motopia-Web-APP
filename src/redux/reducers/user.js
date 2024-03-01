import { SAVE_USER_DATA, LOGOUT_USER } from '../constants/user';

const userData = {
  prospectId: null,
  firstName: '',
  lastName: '',
  email: '',
  zip: '',
  contactNumber: '',
  dob: '',
  annualIncome: null,
  homeAddress: '',
  username: null,
  password: null,
  middleName: null,
  token: null,
};

const initialState = {
  ...userData,
};

export default function user(state = initialState, { type, payload }) {
  switch (type) {
    case SAVE_USER_DATA:
      return {
        ...state,
        ...payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        ...userData,
      };
    default:
      return state;
  }
}
