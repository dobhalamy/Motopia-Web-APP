import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import FinanceHero from 'assets/finance_hero.jpg';

const useStyles = makeStyles(theme => ({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  SuccessPaymentContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  SuccessPaymentTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  SuccessPaymentWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
    marginTop: theme.spacing(2),
  },
  SuccessPaymentContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  SuccessPaymentLightGrayColor: {
    color: '#a0a0a0',
  },
  SuccessPaymentIcon: {
    color: 'green',
    width: 40,
    height: 'auto',
  },
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxWidth: 960,
  },
}));

const AccidentFormSuccess = () => {
  const classes = useStyles();

  return (
    <Box className={classes.financeMainWrapper}>
      <Box className={classes.SuccessPaymentWrapper} boxShadow={6}>
        <Box className={classes.SuccessPaymentContent}>
          <Box marginTop={2} marginBottom={2}>
            <Typography align="center">
              <CheckCircleIcon className={classes.SuccessPaymentIcon} />
            </Typography>
          </Box>
          <Box marginTop={2} marginBottom={4}>
            <Typography align="center" variant="h5">
              Thank you for submitting your accident information.
              <br />
              We will reach out to you if we need additional information.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AccidentFormSuccess;
