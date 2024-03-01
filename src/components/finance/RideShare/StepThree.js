/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Badge,
  Box,
  useMediaQuery,
  Switch,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

import { getCookieJSON } from 'utils/cookie';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import CustomPreviousButton from 'components/finance/UserForm/CustomPreviousButton';
import DeliveryBlock from 'components/shared/DeliveryBlock';
import { Delivery } from 'src/api';
import { getNewPriceList } from '@/utils/commonUtils';
import PromoCodeInput from '../../PromoCodeInput';

const PICKUP = 'Pickup';
const DELIVERY = 'Delivery';

const useStyles = makeStyles(theme => ({
  VehiclePaymentWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
  },
  VehiclePaymentContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  VehiclePaymentText: {
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
  },
  VehicleName: {
    fontSize: '1.375rem',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  VehicleSeries: {
    fontSize: '0.875rem',
    opacity: 0.6,
  },
  ChoiceButton: {
    display: 'block',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
    textAlign: 'center',
    textTransform: 'none',
    padding: '29px 0',
    width: '100%',
    borderRadius: 0,
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
  ButtonText: {
    marginBottom: 8,
  },
  ButtonAmount: {
    fontSize: '2.25rem',
  },
  VehiclePaymentLightGrayColor: {
    color: '#a0a0a0',
  },
  textBold: {
    fontWeight: 600,
  },
  promoCodeWrapper: {
    marginTop: theme.spacing(2.5),
  },
}));

const AntSwitch = withStyles(theme => ({
  root: {
    width: 39,
    height: 22,
    padding: 0,
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(18px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
      },
    },
  },
  thumb: {
    width: 15,
    height: 15,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const StepThree = props => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const {
    mvr,
    vehicle,
    handleActiveHint,
    handleGoBack,
    type,
    deposit,
    handleGoNext,
    location,
    deliveryDate,
    pointsCount,
    report,
    handleOpenModal,
    pickupPoints,
  } = props;
  const router = useRouter();
  const { state, plate } = router.query;
  const {
    year,
    make,
    model,
    series,
    shortTermRentalPrice,
    baseRTOPrice,
    rsdStockId,
  } = vehicle;
  const { tierName, totalSurcharge } = mvr;
  const variedPrice = getNewPriceList(vehicle, state);
  const isTierOne = tierName === 'Tier 1';
  const isStr = type === 'str';
  const [pickMethod, setMethod] = useState(PICKUP);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [payDeposit, setPayDeposit] = useState(deposit);
  const [isDeliveryEnabled, setDeliveryEnabled] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const updateDeliveryFee = ({ fee }) => setDeliveryFee(fee);
  const getDeliveryData = async () => {
    const { data } = await Delivery.getDelivery();
    const { isRideShareEnabled } = data;
    setDeliveryEnabled(isRideShareEnabled);
    setDeliveryFee(data.deliveryFee);
    return isRideShareEnabled;
  };

  useEffect(() => {
    const isDeliverable = getDeliveryData();
    const deliveryAddress = getCookieJSON('deliveryAddress');
    if (deliveryAddress && isDeliverable) {
      setMethod(DELIVERY);
    } else setMethod(PICKUP);
  }, []);

  useEffect(() => {
    if (payDeposit > 0 && promoDiscount > 0) {
      setPayDeposit(payDeposit - promoDiscount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoDiscount]);

  const getWeeklyPayment = newPrice => {
    if (isStr) {
      if (newPrice) {
        if (isTierOne) {
          return newPrice?.shortTermRentalPrice;
        } else {
          return newPrice?.shortTermRentalPrice + totalSurcharge;
        }
      } else if (isTierOne) {
        return shortTermRentalPrice;
      } else {
        return shortTermRentalPrice + totalSurcharge;
      }
    } else if (newPrice) {
      if (isTierOne) {
        return newPrice?.baseRTOPrice;
      } else {
        return newPrice?.baseRTOPrice + totalSurcharge;
      }
    } else if (isTierOne) {
      return baseRTOPrice;
    } else {
      return baseRTOPrice + totalSurcharge;
    }
  };

  const handlePickMethod = ({ target }) => setMethod(target.value);

  const renterPickupInfo = () => (
    <>
      <FormControl fullWidth component="fieldset">
        <RadioGroup
          aria-label="method"
          name="method"
          value={pickMethod}
          onChange={handlePickMethod}
        >
          <Grid item xs={12} container>
            <FormControlLabel
              style={{ flex: 6 }}
              value={PICKUP}
              control={<Radio />}
              label={PICKUP}
            />
            {isDeliveryEnabled && (
              <FormControlLabel
                style={{ flex: 6 }}
                value={DELIVERY}
                control={<Radio />}
                label={DELIVERY}
              />
            )}
          </Grid>
        </RadioGroup>
      </FormControl>
      {pickMethod === PICKUP ? (
        <>
          <Grid item xs={12}>
            <Typography style={{ marginBottom: matches && 10 }}>
              Pickup Location:{' '}
              <Typography
                component="span"
                color="secondary"
                className={classes.textBold}
              >
                {location.locationName}
              </Typography>
              {pointsCount > 1 && (
                <Typography
                  component="span"
                  color="error"
                  style={{ cursor: 'pointer' }}
                  onClick={handleOpenModal}
                  className={classes.textBold}
                >
                  {' '}
                  (CHANGE)
                </Typography>
              )}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ marginBottom: matches && 10 }}>
              Estimated Pickup Date:{' '}
              <Typography
                component="span"
                color="secondary"
                className={classes.textBold}
              >
                {deliveryDate.toUpperCase()}
              </Typography>
            </Typography>
          </Grid>
        </>
      ) : (
        <DeliveryBlock
          pickupDate={deliveryDate}
          pickupPoints={pickupPoints}
          flowType="Ride-share"
          vehicleId={rsdStockId}
          setDeliveryData={updateDeliveryFee}
        />
      )}
    </>
  );

  if (isStr) {
    window.dataLayer.push({
      event: 'Rideshare_ST_Deposit_View',
      RSTDV: 'Rideshare_ST_Deposit_View',
    });
  } else {
    window.dataLayer.push({
      event: 'Rideshare_LT_Deposit_View',
      RLTDV: 'Rideshare_LT_Deposit_View',
    });
  }

  return (
    <Box
      component="form"
      id="ride-share-financing-form-step-3"
      onSubmit={e => {
        e.preventDefault();
        handleGoNext(pickMethod, promoDiscount, deliveryFee);
      }}
      className={classes.VehiclePaymentWrapper}
      boxShadow={6}
    >
      <Box className={classes.VehiclePaymentContent}>
        <Grid>
          <Grid item xs={12}>
            <CustomPreviousButton onClick={handleGoBack} />
          </Grid>
          <Grid item container justifyContent="center" xs={12}>
            <Grid item container xs={12} className={classes.VehiclePaymentText}>
              <Grid item xs={12} md={7}>
                <Grid item xs={12}>
                  <Typography
                    style={{
                      marginBottom: matches && 10,
                      color: '#000',
                      fontWeight: 800,
                    }}
                    component="span"
                    className={classes.textBold}
                  >
                    {state.toUpperCase()} &mdash; {plate.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography style={{ marginBottom: matches && 10 }}>
                    Approved program:{' '}
                    <Badge
                      color="error"
                      badgeContent="1"
                      onClick={() => handleActiveHint(3, 1)}
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      <Typography
                        component="span"
                        color="secondary"
                        className={classes.textBold}
                      >
                        {isStr ? 'Short time rent' : 'Rent-to-Own'} &mdash;{' '}
                        {tierName}
                      </Typography>
                    </Badge>
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                container
                justifyContent={matches ? 'flex-start' : 'flex-end'}
                style={{ marginTop: matches && 20 }}
              >
                <Grid item xs={12} style={{ maxHeight: 'min-content' }}>
                  <Typography
                    className={classes.VehicleName}
                    align={matches ? 'left' : 'right'}
                  >
                    {year} {make} {model}
                  </Typography>
                  <Typography
                    className={classes.VehicleSeries}
                    align={matches ? 'left' : 'right'}
                  >
                    {series}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {renterPickupInfo()}
            <Grid
              container
              item
              xs={12}
              md={6}
              className={classes.promoCodeWrapper}
            >
              <PromoCodeInput source="RDS" setDiscount={setPromoDiscount} />
            </Grid>
            <Grid
              item
              xs={12}
              md={10}
              container
              justifyContent="center"
              alignItems="center"
              className={`${classes.ButtonBox} ${classes.VehiclePaymentText}`}
            >
              <Grid item container xs={12} md={6}>
                <Box
                  className={`
                    ${classes.ChoiceButton}
                    ${classes.ButtonLeft}
                    `}
                  style={{
                    paddingBottom: pickMethod === DELIVERY ? '5px' : '29px',
                  }}
                >
                  <Badge
                    color="error"
                    badgeContent="2"
                    onClick={() => handleActiveHint(3, 2)}
                    style={{ cursor: 'pointer' }}
                    className={classes.ButtonText}
                  >
                    <Typography>
                      Initial {isStr ? 'Deposit' : 'Downpayment'}
                    </Typography>
                  </Badge>
                  <Typography className={classes.ButtonAmount}>
                    ${payDeposit}
                  </Typography>
                  {pickMethod === DELIVERY && (
                    <Typography>+ ${deliveryFee} Delivery Fee</Typography>
                  )}
                </Box>
              </Grid>
              <Grid item container xs={12} md={6}>
                <Box
                  className={`
                    ${classes.ChoiceButton}
                    ${classes.ButtonRight}
                    `}
                >
                  <Badge
                    color="error"
                    badgeContent="3"
                    onClick={() => handleActiveHint(3, 3)}
                    style={{ cursor: 'pointer' }}
                    className={classes.ButtonText}
                  >
                    <Typography>Weekly Payment</Typography>
                  </Badge>
                  <Typography className={classes.ButtonAmount}>
                    ${getWeeklyPayment(variedPrice[0])}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography align="center" className={classes.VehiclePaymentText}>
                Download a copy of your MVR for $29:{' '}
                <AntSwitch
                  checked={report}
                  onChange={props.handleCheckReport}
                  name="toggle"
                />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <CustomPrimaryButton isLarge={!matches} fullWidth type="submit">
        Reserve my car
      </CustomPrimaryButton>
    </Box>
  );
};

StepThree.propTypes = {
  mvr: PropTypes.object.isRequired,
  vehicle: PropTypes.object.isRequired,
  handleActiveHint: PropTypes.func.isRequired,
  handleGoBack: PropTypes.func.isRequired,
  handleGoNext: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  deposit: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  deliveryDate: PropTypes.string.isRequired,
  pointsCount: PropTypes.number.isRequired,
  report: PropTypes.bool.isRequired,
  handleOpenModal: PropTypes.func.isRequired,
  handleCheckReport: PropTypes.func.isRequired,
  pickupPoints: PropTypes.array.isRequired,
};

export default StepThree;
