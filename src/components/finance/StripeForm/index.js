import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { STRIPE_LIVE_KEY } from '../../../constants';

//  NOTE: this is for test purpose only
//  const stripe = loadStripe('pk_test_Z7MZzDd8PMr0G0iqe3zzgcp900bCM6amSG');
const stripe = loadStripe(STRIPE_LIVE_KEY);
const StripeForm = props => (
  <Elements stripe={stripe}>
    <CheckoutForm {...props} />
  </Elements>
);

export default StripeForm;
