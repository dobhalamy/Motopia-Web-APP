import React, { useEffect, useState } from 'react';
import { withRouter } from 'next/router';

import { Typography, Container, Box, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import { getCookie } from 'src/utils/cookie';

import Layout from 'components/shared/Layout';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import FinanceHero from 'assets/finance_hero.jpg';

const useStyles = makeStyles(theme => ({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  RejectPaymentContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  RejectPaymentTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  RejectPaymentWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
    marginTop: theme.spacing(2),
  },
  RejectPaymentContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  RejectPaymentLightGrayColor: {
    color: '#a0a0a0',
  },
  RejectPaymentIcon: {
    color: 'red',
    width: 40,
    height: 'auto',
  },
}));

const Reject = props => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    setErrorMessage(getCookie('paymentErrorMessage'));
  }, []);
  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {};
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.financeMainWrapper}>
        <Container maxWidth="md" className={classes.RejectPaymentContainer}>
          <Typography
            variant="h4"
            align="center"
            className={classes.RejectPaymentTitle}
          >
            PAYMENT FAILURE
          </Typography>
          <Box className={classes.RejectPaymentWrapper} boxShadow={6}>
            <Box className={classes.RejectPaymentContent}>
              <Box marginTop={2} marginBottom={2}>
                <Typography align="center">
                  <CancelIcon className={classes.RejectPaymentIcon} />
                </Typography>
              </Box>
              <Box marginTop={2} marginBottom={4}>
                <Typography align="center" variant="h5">
                  {errorMessage}.
                  <br />
                  Please verify your payment details and try again, or contact{' '}
                  your bank for assistance.
                </Typography>
              </Box>
            </Box>
            <CustomPrimaryButton
              withIcon
              isLarge={!matches}
              fullWidth
              onClick={() => props.router.back()}
            >
              Back to checkout
            </CustomPrimaryButton>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default withRouter(Reject);
