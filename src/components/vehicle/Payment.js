import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';

import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';

import FinancingIcon from 'assets/vehicle/financing.svg';

import CustomHint from 'src/components/finance/CustomComponents/CustomHint';
import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
import { LIGHT_GRAY_BACKGROUND } from 'src/constants';
import { FinancePins, Vehicle } from 'src/api';
import { getCookie, setCookie } from 'src/utils/cookie';
import { checkAdsQueryParams, getAdsQueryParams } from '@/utils/commonUtils';
import { VEHICLE_PAGE_WIDTH } from './constants';

const useStyles = makeStyles(theme => ({
  paymentWrapper: {
    background: LIGHT_GRAY_BACKGROUND,
    minHeight: 410,
    padding: theme.spacing(2),
  },
  paymentSectionTitle: {
    fontSize: theme.typography.pxToRem(28),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  pendingDeal: {
    fontSize: theme.typography.pxToRem(28),
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      fontSize: theme.typography.pxToRem(18),
      paddingRight: 0,
    },
    paddingRight: theme.typography.pxToRem(15),
    color: '#fd151b',
  },
  paymentSectionContent: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  paymentContainer: {
    maxWidth: VEHICLE_PAGE_WIDTH,
  },
  disclaimer: {
    width: '100%',
    paddingTop: theme.spacing(2),
    alignSelf: 'center',
  },
  paymentOptionsSection: {
    width: 'auto',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  paymentOptionContentWrapper: {
    width: 285,
    height: 160,
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      marginBottom: theme.spacing(5),
    },
  },
  paymentOptionsContentContainer: {
    margin: `${theme.spacing(1)}px 0px`,
  },
  monthlyPaymentMoneyValue: {
    background: theme.palette.secondary.main,
    height: '100%',
    color: theme.palette.common.white,
    borderRadius: '5px 5px 0px 0px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      flexWrap: 'nowrap',
    },
  },
  addBorder: {
    borderRight: '1px solid rgba(255,255,255,0.2)',
    [theme.breakpoints.down('sm')]: {
      border: 'none',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
    },
  },
  paymentOptionsIcons: {
    width: 50,
    height: 50,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    margin: 'auto',
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
  },
  monthlyPaymentContainer: {
    width: '100%',
    maxWidth: 570,
    height: 200,
    [theme.breakpoints.down('md')]: {
      alignSelf: 'center',
      maxWidth: '49%',
      minWidth: 400,
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      height: 340,
      maxWidth: 400,
      minWidth: 0,
    },
  },
  getStartedButton: {
    height: 60,
    borderRadius: '0px 0px 5px 5px',
    boxShadow: 'none',
  },
  ChoiceButton: {
    display: 'block',
    backgroundColor: 'rgba(9, 30, 66, 0.04)',
    textAlign: 'center',
    textTransform: 'none',
    padding: '15px 5px',
    width: '100%',
    minHeight: 200,
    borderRadius: 0,
    cursor: 'pointer',
    opacity: 0.7,
  },
  ButtonLeft: {
    borderRight: '1px solid #fff',
    borderBottom: 'none',
    borderRadius: '5px 0 0 5px',
    [theme.breakpoints.only('xs')]: {
      borderBottom: '1px solid #fff',
      borderRadius: '5px 5px 0 0',
      borderRight: 'none',
    },
  },
  ButtonRight: {
    borderRadius: '0 5px 5px 0',
    [theme.breakpoints.only('xs')]: {
      borderRadius: '0 0 5px 5px',
    },
  },
  ButtonActive: {
    opacity: 1,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Payment = props => {
  const classes = useStyles();
  const router = useRouter();
  const [downPayment, setDp] = useState(null);
  const [monthlyPayment, setMp] = useState(null);
  const [monthlyPaymentPeriod, setMpp] = useState(null);
  const [activeHint, setActiveHint] = useState(null);
  const [financePins, setFinancePins] = useState();
  const { savings, prospect, vehicle, deposit } = props;
  const { markForDeletion = null, availabilityStatus } = vehicle;
  const [type, setType] = useState('fin');
  useEffect(() => {
    if (savings) {
      setDp(savings.downPayment);
      setMp(savings.monthlyPayment);
      setMpp(savings.monthlyPaymentPeriod);
      setCookie('dmp', {
        downPayment: Math.floor(parseFloat(savings.downPayment)),
        monthlyPayment: Math.floor(parseFloat(savings.monthlyPayment)),
        monthlyPaymentPeriod: savings.monthlyPaymentPeriod,
      });
    }
    async function getPins() {
      const response = await FinancePins.getFinancePins();
      const pins = response.data.filter(
        el =>
          el.page.includes('vehicle') ||
          el.page === 'finance_confirm_monthly_payment'
      );
      setFinancePins([...pins]);
    }
    getPins();
    // eslint-disable-next-line
  }, []);

  const handleGetStarted = async () => {
    const { email, prospectId } = prospect;
    const { stockid } = vehicle;
    const { query } = router;
    let adsQuery = {};
    if (checkAdsQueryParams(query)) {
      adsQuery = getAdsQueryParams(query);
    }

    const checkStatus = await Vehicle.CheckStatus(stockid);
    if (checkStatus === 'Not found') {
      router.push({
        pathname: '/errors/vehicleError',
        query: { ...adsQuery },
      });
    } else {
      const bankCreditId = getCookie('bankCreditId');
      if (type === 'fin') {
        if (prospectId && bankCreditId && downPayment) {
          setCookie('selectedDownPayment', downPayment);
          router.push({
            pathname: '/finance/method',
            query: {
              email,
              stockId: stockid,
              prospectId,
              ...adsQuery,
            },
          });
        } else if (prospectId && bankCreditId && !downPayment) {
          router.push({
            pathname: '/finance',
            query: {
              stockid,
              ...adsQuery,
            },
          });
        } else {
          router.push({
            pathname: '/finance',
            query: {
              stockid,
              ...adsQuery,
            },
          });
        }
      } else {
        router.push({
          pathname: '/finance/retail',
          query: {
            stockid,
            ...adsQuery,
          },
        });
      }
    }
  };

  const getButtonText = () => {
    if (markForDeletion != null || availabilityStatus === 'D') {
      return 'can not accept payment';
    }
    if (type === 'fin') {
      if (downPayment && monthlyPayment) {
        return 'CONTINUE TO PURCHASE';
      } else return 'GET INSTANT APPROVAL';
    } else return 'GET THIS VEHICLE';
  };

  const getDownPayment = () => {
    if (type === 'fin') {
      if (downPayment || downPayment === 0) {
        return formatMoneyAmount(downPayment);
      } else return '-';
    } else return formatMoneyAmount(deposit);
  };

  const getMonthlyPayment = () => {
    if (type === 'fin') {
      if (monthlyPayment) {
        return `${formatMoneyAmount(
          monthlyPayment
        )} /Mo (${monthlyPaymentPeriod})`;
      } else return '-';
    } else return formatMoneyAmount(vehicle.listPrice - deposit);
  };

  const handleCloseHint = () => setActiveHint(null);
  const handleActiveHint = id => {
    if (activeHint && activeHint.page === id) {
      handleCloseHint();
    } else {
      const pin = [...financePins].find(item => item.page === id);
      if (id === 'finance_confirm_monthly_payment') pin.number = 1;
      if (id === 'vehicle_deposit') pin.number = 2;

      setActiveHint(pin);
    }
  };
  const pickType = name => {
    handleCloseHint();
    setType(name);
  };

  return (
    <Grid className={classes.paymentWrapper} container justifyContent="center">
      <Grid
        item
        xs={12}
        className={classes.paymentContainer}
        container
        direction="column"
      >
        <Box
          sx={{ display: ['block', 'flex'], justifyContent: 'space-between' }}
        >
          <Typography className={classes.paymentSectionTitle} variant="h5">
            PAYMENT OPTIONS
          </Typography>
          {(markForDeletion != null || availabilityStatus === 'D') && (
            <Typography className={classes.pendingDeal} variant="h5">
              ( There is a PENDING deal on this vehicle )
            </Typography>
          )}
        </Box>
        <Grid
          className={classes.paymentSectionContent}
          container
          wrap="nowrap"
          justifyContent="space-between"
        >
          <Grid
            item
            xs={12}
            sm={6}
            container
            justifyContent="center"
            alignItems="center"
            className={classes.monthlyPaymentContainer}
          >
            <Grid item container xs={12} md={6}>
              <Box
                className={`
                  ${classes.ChoiceButton}
                  ${classes.ButtonLeft}
                  ${type === 'fin' && classes.ButtonActive}
                  `}
                onClick={() => pickType('fin')}
              >
                <div
                  className={classes.paymentOptionsIcons}
                  style={{
                    maskImage: `url(${FinancingIcon})`,
                    '-webkit-mask-image': `url(${FinancingIcon})`,
                    backgroundColor: type === 'fin' ? '#fff' : '#4E4E51',
                  }}
                />
                <Typography variant="subtitle2">FINANCING</Typography>
                <Grid
                  container
                  className={classes.paymentOptionsContentContainer}
                  wrap="nowrap"
                >
                  <Typography
                    className={classes.paymentOptionsContent}
                    variant="body2"
                    align="center"
                  >
                    Get an instant approval for a loan in 2 minutes. No impact
                    to your credit score!
                  </Typography>
                </Grid>
              </Box>
            </Grid>
            <Grid item container xs={12} md={6}>
              <Box
                className={`
                  ${classes.ChoiceButton}
                  ${classes.ButtonRight}
                  ${type === 'full' && classes.ButtonActive}
                  `}
                onClick={() => pickType('full')}
              >
                <MonetizationOnRoundedIcon
                  style={{
                    color: type === 'full' ? '#fff' : '#4E4E51',
                    width: 50,
                    height: 50,
                  }}
                />
                <Typography variant="subtitle2">PAY IN FULL</Typography>
                <Grid
                  container
                  className={classes.paymentOptionsContentContainer}
                  wrap="nowrap"
                >
                  <Typography
                    className={classes.paymentOptionsContent}
                    variant="body2"
                  >
                    Pay a nominal, refundable deposit to process your purchase,
                    and pay the rest when you receive your vehicle!
                  </Typography>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Paper className={classes.monthlyPaymentContainer}>
            <Grid
              style={{ height: '100%' }}
              container
              direction="column"
              wrap="nowrap"
            >
              <Grid container className={classes.monthlyPaymentMoneyValue}>
                <Grid
                  className={classes.addBorder}
                  container
                  item
                  xs={12}
                  md={6}
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  {type === 'fin' ? (
                    <Typography variant="body1">Your Down Payment</Typography>
                  ) : (
                    <Badge
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleActiveHint('vehicle_deposit')}
                      color="error"
                      badgeContent={2}
                    >
                      <Typography variant="body1">
                        Your Initial Deposit
                      </Typography>
                    </Badge>
                  )}
                  <Typography variant="h4">{getDownPayment()}</Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  md={6}
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  {type !== 'fin' ? (
                    <Typography variant="body1">
                      Your Payment Upon Vehicle Pickup
                    </Typography>
                  ) : (
                    <Badge
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        handleActiveHint('finance_confirm_monthly_payment')
                      }
                      color="error"
                      badgeContent={1}
                    >
                      <Typography variant="body1">
                        Your Monthly Payment
                      </Typography>
                    </Badge>
                  )}
                  <Typography variant="h4">{getMonthlyPayment()}</Typography>
                </Grid>
              </Grid>
              <Button
                className={classes.getStartedButton}
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGetStarted}
                disabled={markForDeletion != null || availabilityStatus === 'D'}
              >
                {getButtonText()}
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item className={classes.disclaimer}>
          {activeHint && (
            <CustomHint
              activeHint={activeHint}
              handleCloseHint={handleCloseHint}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

Payment.propTypes = {
  savings: PropTypes.object,
  prospect: PropTypes.object.isRequired,
  vehicle: PropTypes.object.isRequired,
  deposit: PropTypes.number.isRequired,
};

Payment.defaultProps = {
  savings: {},
};

export default Payment;
