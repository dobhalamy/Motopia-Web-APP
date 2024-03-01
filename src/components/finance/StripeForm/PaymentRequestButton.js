import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  useStripe,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';

import { makeStyles } from '@material-ui/core/styles';
import { applyAdsQuery } from '@/utils/commonUtils';

const useOptions = paymentRequest => {
  const options = useMemo(
    () => ({
      paymentRequest,
      style: {
        paymentRequestButton: {
          height: '20px',
          theme: 'dark',
        },
      },
    }),
    [paymentRequest]
  );

  return options;
};

const useStyles = makeStyles({
  divider: {
    marginTop: '14px',
    marginBottom: '25px',
    textAlign: 'center',
    borderBottom: '1px solid rgb(231, 231, 231)',
    height: '20px',
    width: '100%',
  },
  dividerText: {
    position: 'relative',
    bottom: '-10px',
    padding: '0 10px',
    background: 'rgb(255, 255, 255)',
    color: '#aab7c4',
    fontSize: '14px',
    fontWeight: '400',
  },
});

const usePaymentRequest = ({ options, onPaymentMethod }) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest(options);
      setPaymentRequest(pr);
    }
  }, [stripe, options, paymentRequest]);

  useEffect(() => {
    let subscribed = true;
    if (paymentRequest) {
      paymentRequest.canMakePayment().then(res => {
        if (res && subscribed) {
          setCanMakePayment(true);
        }
      });
    }

    return () => {
      subscribed = false;
    };
  }, [paymentRequest]);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.on('paymentmethod', onPaymentMethod);
    }
    return () => {
      if (paymentRequest) {
        paymentRequest.off('paymentmethod', onPaymentMethod);
      }
    };
  }, [paymentRequest, onPaymentMethod]);

  return canMakePayment ? paymentRequest : null;
};

const PaymentRequestForm = props => {
  const stripe = useStripe();
  const { router, client, setIsPaid } = props;
  const { amount, description } = router.query;
  const adsQuery = applyAdsQuery(router.query);

  const paymentRequest = usePaymentRequest({
    options: {
      country: 'US',
      currency: 'usd',
      total: {
        label: description,
        amount: amount * 100,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    },
    onPaymentMethod: async ({ complete, paymentMethod }) => {
      setIsPaid(true);
      const { error: confirmError } = await stripe.confirmCardPayment(
        client,
        { payment_method: paymentMethod.id, setup_future_usage: 'off_session' },
        { handleActions: false }
      );
      if (confirmError) {
        setIsPaid(false);
        complete('fail');
        router.push({
          pathname: '/finance/payment/fail',
          query: { ...adsQuery },
        });
      } else {
        const { error } = await stripe.confirmCardPayment(client);
        if (error) {
          router.push({
            pathname: '/finance/payment/fail',
            query: { ...adsQuery },
          });
        } else {
          complete('success');
          router.push({
            pathname: '/finance/payment/success',
            query: { ...adsQuery },
          });
        }
      }
    },
  });
  const options = useOptions(paymentRequest);
  const classes = useStyles();
  if (!paymentRequest) {
    return null;
  }

  return (
    <>
      <PaymentRequestButtonElement options={options} />
      <div className={classes.divider}>
        <span className={classes.dividerText}>Or pay with card</span>
      </div>
    </>
  );
};

PaymentRequestForm.propTypes = {
  client: PropTypes.string.isRequired,
  setIsPaid: PropTypes.func.isRequired,
};

export default PaymentRequestForm;
