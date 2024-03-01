import axios from 'axios';
import { ADMIN_BASE_URL } from '../constants';
// NOTE: uncomment if you will need stripe
// import { loadStripe } from '@stripe/stripe-js';
// const key = 'pk_test_Z7MZzDd8PMr0G0iqe3zzgcp900bCM6amSG';

const intent = async payment => {
  try {
    const response = await axios.post(`${ADMIN_BASE_URL}stripe/intent`, {
      payment,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export { intent };
