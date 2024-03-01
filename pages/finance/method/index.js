import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  Typography,
  Button,
  Container,
  Grid,
  Box,
  useMediaQuery,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
import { Vehicle } from 'src/api';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import Layout from 'components/shared/Layout';
import { priceListSelector } from 'src/redux/selectors';
import { getCookie } from 'src/utils/cookie';
import FinanceHero from 'assets/finance_hero.jpg';
import { checkAdsQueryParams, getAdsQueryParams } from '@/utils/commonUtils';

const useStyles = makeStyles(theme => ({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  VehiclePaymentContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  VehiclePaymentTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  VehiclePaymentWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
  },
  VehiclePaymentContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  VehiclePaymentBoxContent: {
    padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
    color: '#3C3B4A',
    border: '1px solid #D9D9DA',
    borderRadius: 5,
    width: 285,
    height: 154,
    fontSize: 36,
    fontWeight: 'normal',
    '&:focus,&:hover,&$active': {
      background: theme.palette.secondary.main,
      color: theme.palette.common.white,
    },
    textTransform: 'none',
  },
  VehiclePaymentBlueBoxContent: {
    background: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  VehiclePaymentGrayBoxContent: {
    background: 'rgba(9, 30, 66, 0.04) !important',
    color: '#4E4E51 !important',
    borderColor: 'rgba(9, 30, 66, 0.04) !important',
    opacity: 0.7,
  },
  VehiclePaymentText: {
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
  },
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
  },
}));

const VehiclePaymentForm = props => {
  const { router, prices } = props;
  const { lockDown, downPayment } = prices;
  const { stockId } = router.query;
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const [state, setState] = React.useState({
    reserveCar: true,
    selectedDownPayment: null,
  });
  const [isLoading, setLoading] = React.useState(true);
  const [isAvailable, setStatus] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const selectedDownPayment = getCookie('selectedDownPayment');
      const minDownPayment = downPayment;
      const acutalPayment =
        selectedDownPayment > 0 ? selectedDownPayment : minDownPayment;
      setState({
        ...state,
        price: acutalPayment,
      });
      const checkStatus = await Vehicle.CheckStatus(stockId);
      const vehicleStatus = checkStatus.status;
      if (vehicleStatus === 'S' || vehicleStatus === 'D') {
        setStatus(false);
        setState({
          ...state,
          reserveCar: false,
          price: acutalPayment,
        });
      }
      setLoading(false);
    })();
    // eslint-disable-next-line
  }, []);

  const callStripe = async () => {
    const amount = state.reserveCar ? state.price : lockDown;
    const description = state.reserveCar
      ? 'Financing (Car)'
      : 'Financing (Deal)';
    const flow = state.reserveCar ? 'car' : 'deal';
    const { query: queryParam } = router;
    let adsQuery = {};
    if (checkAdsQueryParams(queryParam)) {
      adsQuery = getAdsQueryParams(queryParam);
    }
    const payment = {
      amount,
      description,
      stockId,
      flow,
      ...adsQuery,
    };
    router.push({
      pathname: '/finance/confirm',
      query: payment,
    });
  };

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {};
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.financeMainWrapper}>
        <Container maxWidth="md" className={classes.VehiclePaymentContainer}>
          {isLoading ? (
            <LinearProgress color="secondary" className={classes.loader} />
          ) : (
            <>
              <Typography
                variant="h4"
                align="center"
                className={classes.VehiclePaymentTitle}
              >
                MAKE A CHOICE
              </Typography>
              <Box className={classes.VehiclePaymentWrapper} boxShadow={6}>
                <Box className={classes.VehiclePaymentContent}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid
                      style={{
                        display: state.price >= 1 ? 'flex' : 'none',
                      }}
                      item
                      xs={12}
                      container
                      justifyContent="center"
                      sm={6}
                    >
                      <Button
                        onClick={() => setState({ ...state, reserveCar: true })}
                        className={classNames(
                          classes.VehiclePaymentBoxContent,
                          state.reserveCar &&
                            classes.VehiclePaymentBlueBoxContent
                        )}
                        disabled={!isAvailable}
                        classes={{
                          disabled: classes.VehiclePaymentGrayBoxContent,
                        }}
                      >
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item xs={12}>
                            {formatMoneyAmount(state.price)}
                          </Grid>
                          <Grid item xs={12}>
                            <Typography style={{ fontSize: 18 }}>
                              Lock down this Car
                              {!isAvailable && (
                                <Typography component="span">
                                  <br />
                                  (Vehicle Unavailable)
                                </Typography>
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Button>
                    </Grid>
                    <Grid item container justifyContent="center" xs={12} sm={6}>
                      <Button
                        onClick={() =>
                          setState({ ...state, reserveCar: false })
                        }
                        className={classNames(
                          classes.VehiclePaymentBoxContent,
                          !state.reserveCar &&
                            classes.VehiclePaymentBlueBoxContent
                        )}
                      >
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item xs={12}>
                            {formatMoneyAmount(lockDown)}
                          </Grid>
                          <Grid item xs={12}>
                            <Typography style={{ fontSize: 18 }}>
                              Lock down this Deal
                            </Typography>
                          </Grid>
                        </Grid>
                      </Button>
                    </Grid>
                  </Grid>
                  <Typography
                    variant="body1"
                    align="center"
                    className={classes.VehiclePaymentText}
                  >
                    {!state.reserveCar ? (
                      <>
                        Pay a refundable {formatMoneyAmount(lockDown)} deposit
                        and reserve this financing deal for 30 days. <br /> You
                        can get the same exact deal on a similar vehicle with
                        same <br /> Year, Make, Model and Mileage
                      </>
                    ) : (
                      `Pay the ${formatMoneyAmount(
                        state.price
                      )} down payment, and reserve this
                    car with your financing terms. Once you process the down payment, we will
                    contact you to complete the financing process and confirm pickup details.`
                    )}
                  </Typography>
                </Box>
                <CustomPrimaryButton
                  withIcon
                  isLarge={!matches}
                  fullWidth
                  onClick={() => callStripe()}
                  id="proceed-with-reservation"
                >
                  Proceed with reservation
                </CustomPrimaryButton>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

const mapStateToProps = createStructuredSelector({
  prices: priceListSelector,
});

VehiclePaymentForm.propTypes = {
  prices: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(VehiclePaymentForm));
