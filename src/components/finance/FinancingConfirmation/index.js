import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  FormControlLabel,
  Typography,
  Container,
  Grid,
  Divider,
  Box,
  useMediaQuery,
  Button,
  Badge,
  Radio,
  RadioGroup,
} from '@material-ui/core';

import { Location } from 'src/api';
import { formatMoneyAmount, formatNumber } from 'utils/formatNumbersToLocale';
import { getCookieJSON, setCookie } from 'src/utils/cookie';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import LocationModal from 'components/finance/RideShare/LocationModal';
import LocationErrorDialog from 'components/shared/LocationErrorDialog';
import CustomHint from 'components/finance/CustomComponents/CustomHint';
import DeliveryBlock from 'components/shared/DeliveryBlock';
import PointInspection from 'assets/vehicle/Point_Inspection.png';
import { checkAdsQueryParams, getAdsQueryParams } from '@/utils/commonUtils';
import PromoCodeInput from '../../PromoCodeInput';

const PICKUP = 'Pickup';
const DELIVERY = 'Delivery';

const useStyles = makeStyles(theme => ({
  retailConfiramtionContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  retailConfiramtionTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  retailConfiramtionWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
  },
  retailConfiramtionContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  headerWrapper: {
    marginBottom: theme.spacing(0.7),
  },
  divider: {
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
  },
  infoText: {
    padding: '0px 15px 0 0',
    [theme.breakpoints.down('md')]: {
      padding: 0,
    },
  },
  textBold: {
    fontWeight: 600,
  },
  badge: {
    minWidth: 15,
    height: 15,
  },
  ancor: {
    top: '50%',
  },
  greyColor: {
    color: '#a0a0a0',
  },
  trustMargin: {
    marginTop: 50,
  },
  warranty: {
    marginTop: 70,
    marginLeft: -6,
  },
}));

const PurchaseConfirm = props => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const router = useRouter();
  const { vehicle, prices } = props;
  const {
    make,
    model,
    carYear,
    series,
    stockid,
    vin,
    picturesUrl,
    drivetrain,
    exteriorColor,
    interiorColor,
    mileage,
    seating,
    fuelType,
    cylinder,
    listPrice,
  } = vehicle;
  const image = picturesUrl[0].picture;

  const [location, setLocation] = useState();
  const [activeHint, setActiveHint] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [pointsCount, setCount] = useState(1);
  const [flow, setFlow] = useState();
  const [isZeroFlow, setZeroFlow] = useState(true);
  const [backLink, setLink] = useState();
  const [dmp, setDmp] = useState();
  const [finBal, setFinBal] = useState(0);
  const [financePins, setPins] = useState();
  const [pickMethod, setMethod] = useState();
  const [openError, setOpenError] = useState(false);
  const [deliveryDay, setDeliveryDay] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [fees, setFees] = useState({
    registrationFee: 0,
    inspectionFee: 0,
    docFee: 0,
    electricVehicleFee: 0,
  });
  const [taxRate, setTaxRate] = useState();
  const [deposit, setDeposit] = useState();
  const [promoDiscount, setPromoDiscount] = useState(0);

  const { docFee, electricVehicleFee, inspectionFee, registrationFee } = fees;

  const hintRef = useRef();

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);
  const handleCloseHint = () => setActiveHint(null);

  const getTaxAmount = () => {
    const amount = (listPrice / 100) * taxRate;
    return amount;
  };

  const getPaymentAmount = () => {
    const base = listPrice - deposit;
    const taxAmout = getTaxAmount();
    let price =
      base +
      taxAmout +
      docFee +
      electricVehicleFee +
      inspectionFee +
      registrationFee -
      promoDiscount;
    if (pickMethod === DELIVERY) {
      price += deliveryFee;
    }
    return price;
  };

  const getDeliveryData = async dataFromDeliveryBlock => {
    const { fee, days } = dataFromDeliveryBlock;
    setDeliveryDay(days);
    setDeliveryFee(fee);
  };
  // eslint-disable-next-line consistent-return
  const getBadgeNumber = name => {
    if (flow === 'retail') {
      const feesArr = Object.entries(fees);
      const filter = [...feesArr].filter(el => el[1] > 0);
      if (name === 'Registration') {
        return filter.findIndex(value => value[0] === 'registrationFee') + 1;
      } else if (name === 'Doc' && docFee > 0) {
        return filter.findIndex(value => value[0] === 'docFee') + 1;
      } else if (name === 'Electric' && electricVehicleFee > 0) {
        return filter.findIndex(value => value[0] === 'electricVehicleFee') + 1;
      } else if (name === 'Inspection' && inspectionFee > 0) {
        return filter.findIndex(value => value[0] === 'inspectionFee') + 1;
      } else if (name === 'Tax') {
        return filter.length + 1;
      } else return filter.length + 2;
    }

    if (flow === 'deal') {
      if (name === 'Balance') return 3;
      if (name === 'Month') return 5;
    }

    if (flow === 'car') {
      if (name === 'Balance') return 1;
      if (name === 'Month') return 3;
    }
  };

  const handleActiveHint = id => {
    if (flow === 'retail') {
      const pin = [...financePins].find(
        item => item.number === id || item.id === id
      );
      if (id === 0 && pin) pin.number = getBadgeNumber('Deposit');
      if (id === 1.1 && pin) pin.number = getBadgeNumber('Registration');
      if (id === 1.2 && pin) pin.number = getBadgeNumber('Inspection');
      if (id === 1.3 && pin) pin.number = getBadgeNumber('Doc');
      if (id === 1.4 && pin) pin.number = getBadgeNumber('Electric');
      if (id === 2.1 && pin) pin.number = getBadgeNumber('Tax');
      pin.id = id;
      setActiveHint(pin);
    } else {
      const pin = [...financePins].find(item => item.page === id);
      if (id === 'finance_confirm_balance') {
        pin.number = getBadgeNumber('Balance');
      }
      if (id === 'finance_confirm_monthly_payment') {
        pin.number = getBadgeNumber('Month');
      }
      setActiveHint(pin);
    }
  };

  const handlePickLocation = async value => {
    const dDate = await Location.CalculatePickupDate(
      value.locationName,
      stockid
    );
    setLocation(value);

    if (router.query.flow === 'deal') {
      let delDate = moment()
        .add(deliveryDay, 'days')
        .format('dddd, MMMM D, YYYY')
        .toUpperCase();
      if (delDate.includes('SUNDAY')) {
        delDate = moment(delDate)
          .add(1, 'day')
          .format('dddd, MMMM DD, YYYY')
          .toUpperCase();
      }
      setDeliveryDate(delDate);
    } else setDeliveryDate(dDate.customerPickupDate);
    const pickupInfo = {
      locationName: value.locationName,
      date: dDate.customerPickupDate,
    };
    setCookie('pickupInfo', pickupInfo);
    handleCloseModal();
  };

  const handleProceed = () => {
    let isDelivering = true;
    const { query: queryParam } = router;
    let adsQuery = {};
    if (checkAdsQueryParams(queryParam)) {
      adsQuery = getAdsQueryParams(queryParam);
    }
    if (pickMethod === 'Delivery') {
      isDelivering = getCookieJSON('isDelivering');
    }
    if (isDelivering) {
      setOpenError(false);
      let { amount } = router.query;
      if (flow === 'retail') {
        amount = deposit;
      }
      if (promoDiscount > 0) {
        amount -= promoDiscount;
      }
      if (flow === 'retail') {
        const description = 'Retail';
        const payment = {
          amount,
          description,
          stockId: stockid,
          isRetail: true,
          type: 'retail',
          method: pickMethod,
          ...adsQuery,
        };
        router.push({
          pathname: '/finance/payment',
          query: payment,
        });
      } else {
        router.push({
          pathname: '/finance/payment',
          query: {
            ...router.query,
            amount,
            method: pickMethod,
            ...adsQuery,
          },
        });
      }
    } else {
      setOpenError(true);
    }
  };

  const handleHideThanksDialog = () => setOpenError(false);

  // eslint-disable-next-line
  const goToOfflinePaymeent = () => {
    router.push({
      pathname: '/finance/paymentOfflineError',
    });
  };

  useEffect(() => {
    if (props.prospect) {
      const { prospect } = props;
      const { query } = router;
      setLink({ pathname: '/vehicle', query: { id: stockid } });
      if (router.pathname.includes('retail')) {
        setFlow('retail');
        setDeposit(prices.retailDeposit);
      } else {
        if (query.flow === 'car') {
          setFlow('car');
        }
        if (query.flow === 'deal') {
          setFlow('deal');
        }
        const dmpLs = getCookieJSON('dmp');
        const { downPayment } = dmpLs;
        if (downPayment > 0) setZeroFlow(false);
        setFinBal(listPrice - downPayment);
        setDmp(dmpLs);
      }
      (async () => {
        const cookiePickupInfo = getCookieJSON('pickupInfo');
        if (cookiePickupInfo && props.pickupPoints) {
          const loc = props.pickupPoints.find(
            el => el.locationName === cookiePickupInfo.locationName
          );
          setLocation(loc);
          setCount(props.pickupPoints.length);
          if (query.flow === 'deal') {
            let delDate = moment()
              .add(deliveryDay, 'days')
              .format('dddd, MMMM D, YYYY')
              .toUpperCase();
            if (delDate.includes('SUNDAY')) {
              delDate = moment(delDate)
                .add(1, 'day')
                .format('dddd, MMMM DD, YYYY')
                .toUpperCase();
            }
            setDeliveryDate(delDate);
          } else setDeliveryDate(cookiePickupInfo.date);
        } else {
          setLocation(prospect.closestSalesPoint);
          if (props.pickupPoints) {
            setCount(props.pickupPoints.length);
          }
          try {
            let pickDate;
            if (query.flow === 'deal') {
              pickDate = moment()
                .add(deliveryDay, 'days')
                .format('dddd, MMMM D, YYYY')
                .toUpperCase();
              if (pickDate.includes('SUNDAY')) {
                pickDate = moment(pickDate)
                  .add(1, 'day')
                  .format('dddd, MMMM DD, YYYY')
                  .toUpperCase();
              }
            } else {
              const dDate = await Location.CalculatePickupDate(
                prospect.closestSalesPoint.locationName,
                stockid
              );
              pickDate = dDate.customerPickupDate;
            }
            setDeliveryDate(pickDate);
            const pickupInfo = {
              locationName: prospect.closestSalesPoint.locationName,
              date: pickDate,
            };
            setCookie('pickupInfo', pickupInfo);
          } catch (error) {
            console.error(error);
          }
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.flow, props.pickupPoints]);

  useEffect(() => {
    if (props.taxFees) {
      setFees(props.taxFees.fees);
      setTaxRate(props.taxFees.taxRate);
    }
  }, [props.taxFees]);

  useEffect(() => {
    if (props.financePins) {
      setPins(props.financePins);
    }
  }, [props.financePins]);

  useEffect(() => {
    if (activeHint) {
      hintRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }, [activeHint]);

  useEffect(() => {
    const deliveryAddress = getCookieJSON('deliveryAddress');
    if (deliveryAddress) {
      setMethod(DELIVERY);
    } else setMethod(PICKUP);
  }, []);

  useEffect(() => {
    if (promoDiscount > 0) {
      setFinBal(finBal - promoDiscount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoDiscount]);

  const handlePickMethod = ({ target }) => setMethod(target.value);

  const renderFinancingTopPrice = () => (
    <>
      <Grid container justifyContent="space-between">
        <Typography variant="body1">Total Downpayment</Typography>
        <Typography variant="body1">
          {!isZeroFlow && '-'} {formatMoneyAmount(dmp.downPayment)}
        </Typography>
      </Grid>
      {promoDiscount > 0 && (
        <Grid container justifyContent="space-between">
          <Typography variant="body1">Promo Discount</Typography>
          <Typography variant="body1">
            - {formatMoneyAmount(promoDiscount)}
          </Typography>
        </Grid>
      )}
      <Grid container justifyContent="space-between">
        <Badge
          style={{ cursor: 'pointer' }}
          onClick={() => handleActiveHint('finance_confirm_balance')}
          color="error"
          badgeContent={getBadgeNumber('Balance')}
          classes={{
            badge: classes.badge,
            anchorOriginTopRightRectangular: classes.ancor,
          }}
        >
          <Typography variant="body1" className={classes.textBold}>
            Financing Balance
          </Typography>
        </Badge>
        <Typography variant="body1" className={classes.textBold}>
          {formatMoneyAmount(finBal)}
        </Typography>
      </Grid>
    </>
  );

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
            <FormControlLabel
              style={{ flex: 6 }}
              value={DELIVERY}
              control={<Radio />}
              label={DELIVERY}
            />
          </Grid>
        </RadioGroup>
      </FormControl>
      {pickMethod === PICKUP ? (
        <>
          <Grid item xs={12} container alignItems="center">
            <Typography>
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
          <Grid item xs={12} container alignItems="center">
            <Typography>
              Estimated Pickup Date:{' '}
              {flow === 'deal' ? (
                <Badge
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    handleActiveHint('finance_confirm_deal_pickup')
                  }
                  color="error"
                  classes={{
                    badge: classes.badge,
                    anchorOriginTopRightRectangular: classes.ancor,
                  }}
                  badgeContent={6}
                >
                  <Typography
                    component="span"
                    color="secondary"
                    className={classes.textBold}
                  >
                    {deliveryDate.toUpperCase()}
                  </Typography>
                </Badge>
              ) : (
                <Typography
                  component="span"
                  color="secondary"
                  className={classes.textBold}
                >
                  {deliveryDate.toUpperCase()}
                </Typography>
              )}
            </Typography>
          </Grid>
        </>
      ) : (
        <DeliveryBlock
          pickupDate={deliveryDate}
          pickupPoints={props.pickupPoints}
          vehicleId={String(stockid)}
          flowType="Sales"
          setDeliveryData={getDeliveryData}
        />
      )}
    </>
  );

  const renderDealZeroDownPayment = () => (
    <>
      <Grid container justifyContent="space-between">
        <Badge
          style={{ cursor: 'pointer' }}
          onClick={() => handleActiveHint('finance_confirm_refdep_deal_zero')}
          color="error"
          classes={{
            badge: classes.badge,
            anchorOriginTopRightRectangular: classes.ancor,
          }}
          badgeContent={4}
        >
          <Typography variant="body1">
            Refundable Deposit Payable Now
          </Typography>
        </Badge>
        <Typography variant="body1" color="error">
          {formatMoneyAmount(prices.lockDown)}
        </Typography>
      </Grid>
    </>
  );

  const randerDealDownPayment = () => (
    <>
      <Grid container justifyContent="space-between">
        <Badge
          style={{ cursor: 'pointer', maxWidth: '60%' }}
          onClick={() => handleActiveHint('finance_confirm_refdep_deal')}
          color="error"
          badgeContent={4}
          classes={{
            badge: classes.badge,
            anchorOriginTopRightRectangular: classes.ancor,
          }}
        >
          <Typography
            variant="body1"
            gutterBottom={matches}
            className={classes.textBold}
          >
            Refundable Deposit Payable Now
          </Typography>
        </Badge>
        <Typography variant="body1" className={classes.textBold} color="error">
          {formatMoneyAmount(prices.lockDown)}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between">
        <Typography variant="body1" className={classes.textBold}>
          Downpayment Balance Due Pickup
        </Typography>
        <Typography variant="body1" className={classes.textBold}>
          {formatMoneyAmount(dmp.downPayment - prices.lockDown)}
        </Typography>
      </Grid>
    </>
  );
  const randerCarZeroDownPayment = () => (
    <>
      <Grid container justifyContent="space-between">
        <Badge
          style={{ cursor: 'pointer' }}
          onClick={() => handleActiveHint('finance_confirm_refdep_car_zero')}
          color="error"
          badgeContent={2}
          classes={{
            badge: classes.badge,
            anchorOriginTopRightRectangular: classes.ancor,
          }}
        >
          <Typography variant="body1">
            Refundable Deposit Payable Now
          </Typography>
        </Badge>
        <Typography variant="body1" color="error">
          {formatMoneyAmount(prices.downPayment)}
        </Typography>
      </Grid>
    </>
  );
  const randerCarDownPayment = () => (
    <>
      <Grid container justifyContent="space-between">
        <Badge
          style={{ cursor: 'pointer' }}
          onClick={() => handleActiveHint('finance_confirm_refdep_car')}
          color="error"
          badgeContent={2}
          classes={{
            badge: classes.badge,
            anchorOriginTopRightRectangular: classes.ancor,
          }}
        >
          <Typography variant="body1">Downpayment Due Now</Typography>
        </Badge>
        <Typography variant="body1" color="error">
          {formatMoneyAmount(dmp.downPayment)}
        </Typography>
      </Grid>
    </>
  );

  const renderFinTerms = () => (
    <>
      <Grid container justifyContent="space-between">
        <Typography variant="body1">Total Downpayment</Typography>
        <Typography variant="body1">
          {formatMoneyAmount(dmp.downPayment)}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between">
        <Badge
          style={{ cursor: 'pointer' }}
          onClick={() => handleActiveHint('finance_confirm_monthly_payment')}
          color="error"
          badgeContent={getBadgeNumber('Month')}
          classes={{
            badge: classes.badge,
            anchorOriginTopRightRectangular: classes.ancor,
          }}
        >
          <Typography variant="body1">Monthly Payment</Typography>
        </Badge>
        <Typography variant="body1">
          {`${formatMoneyAmount(dmp.monthlyPayment)}/Mo`}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between">
        <Typography variant="body1">Term</Typography>
        <Typography variant="body1">
          {`${dmp.monthlyPaymentPeriod} Months`}
        </Typography>
      </Grid>
    </>
  );

  const renderStateFeeInfo = () => (
    <>
      <Typography variant="body1" className={classes.textBold}>
        State Fee Information
      </Typography>
      {registrationFee > 0 && (
        <Grid container justifyContent="space-between">
          <Badge
            style={{ cursor: 'pointer' }}
            onClick={() => handleActiveHint(1.1)}
            color="error"
            classes={{
              badge: classes.badge,
              anchorOriginTopRightRectangular: classes.ancor,
            }}
            badgeContent={getBadgeNumber('Registration')}
          >
            <Typography variant="body1">Registration Fee</Typography>
          </Badge>
          <Typography variant="body1">
            {formatMoneyAmount(registrationFee)}
          </Typography>
        </Grid>
      )}
      {inspectionFee > 0 && (
        <Grid container justifyContent="space-between">
          <Badge
            style={{ cursor: 'pointer' }}
            onClick={() => handleActiveHint(1.2)}
            color="error"
            classes={{
              badge: classes.badge,
              anchorOriginTopRightRectangular: classes.ancor,
            }}
            badgeContent={getBadgeNumber('Inspection')}
          >
            <Typography variant="body1">Inspection Fee</Typography>
          </Badge>
          <Typography variant="body1">
            {formatMoneyAmount(inspectionFee)}
          </Typography>
        </Grid>
      )}
      {docFee > 0 && (
        <Grid container justifyContent="space-between">
          <Badge
            style={{ cursor: 'pointer' }}
            onClick={() => handleActiveHint(1.3)}
            color="error"
            classes={{
              badge: classes.badge,
              anchorOriginTopRightRectangular: classes.ancor,
            }}
            badgeContent={getBadgeNumber('Doc')}
          >
            <Typography variant="body1">Doc Fee</Typography>
          </Badge>
          <Typography variant="body1">{formatMoneyAmount(docFee)}</Typography>
        </Grid>
      )}
      {electricVehicleFee > 0 && (
        <Grid container justifyContent="space-between">
          <Badge
            style={{ cursor: 'pointer' }}
            onClick={() => handleActiveHint(1.4)}
            color="error"
            classes={{
              badge: classes.badge,
              anchorOriginTopRightRectangular: classes.ancor,
            }}
            badgeContent={getBadgeNumber('Electric')}
          >
            <Typography variant="body1">Electric Vehicle Fee</Typography>
          </Badge>
          <Typography variant="body1">
            {formatMoneyAmount(electricVehicleFee)}
          </Typography>
        </Grid>
      )}
      {taxRate > 0 && (
        <Grid container justifyContent="space-between">
          <Badge
            style={{ cursor: 'pointer' }}
            onClick={() => handleActiveHint(2.1)}
            color="error"
            classes={{
              badge: classes.badge,
              anchorOriginTopRightRectangular: classes.ancor,
            }}
            badgeContent={getBadgeNumber('Tax')}
          >
            <Typography variant="body1">{`Sales Tax (Rate: ${taxRate}%)`}</Typography>
          </Badge>
          <Typography variant="body1">
            {formatMoneyAmount(getTaxAmount())}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <Divider light className={classes.divider} />
      </Grid>
      <Grid container justifyContent="space-between">
        <Typography variant="body1" className={classes.textBold}>
          Total Balance
        </Typography>
        <Typography variant="body1">
          {formatMoneyAmount(getPaymentAmount() + deposit)}
        </Typography>
      </Grid>
    </>
  );

  const renderRetailDepositInfo = () => (
    <>
      <Grid container justifyContent="space-between">
        <Badge
          style={{ cursor: 'pointer' }}
          onClick={() => handleActiveHint(0)}
          color="error"
          classes={{
            badge: classes.badge,
            anchorOriginTopRightRectangular: classes.ancor,
          }}
          badgeContent={getBadgeNumber('Deposit') || 6}
        >
          <Typography variant="body1">Initial deposit (due now)</Typography>
        </Badge>
        <Typography variant="body1">{formatMoneyAmount(deposit)}</Typography>
      </Grid>
      {promoDiscount > 0 && (
        <Grid container justifyContent="space-between">
          <Typography variant="body1">Promo Discount</Typography>
          <Typography variant="body1">
            - {formatMoneyAmount(promoDiscount)}
          </Typography>
        </Grid>
      )}
      <Grid container justifyContent="space-between">
        <Typography variant="body1">Balance at Pickup</Typography>
        <Typography variant="body1">
          {formatMoneyAmount(getPaymentAmount())}
        </Typography>
      </Grid>
    </>
  );

  return (
    <>
      <Container maxWidth="lg" className={classes.retailConfiramtionContainer}>
        <Typography
          variant="h4"
          align="center"
          className={classes.retailConfiramtionTitle}
        >
          PURCHASE REVIEW
        </Typography>
        <Box className={classes.retailConfiramtionWrapper} boxShadow={6}>
          <Box className={classes.retailConfiramtionContent}>
            {/* NOTE: Header */}
            <Grid container className={classes.headerWrapper}>
              <Grid
                item
                xs={12}
                md={7}
                container
                justifyContent={matches ? 'center' : 'flex-start'}
              >
                <Typography variant="h5">
                  {`${make} ${model} ${carYear}`}
                </Typography>
              </Grid>
              <Grid item xs={12} md={5} container justifyContent="center">
                <Typography variant="h5" className={classes.greyColor}>
                  {series}
                </Typography>
              </Grid>
            </Grid>
            {/* NOTE: Main container */}
            <Grid container justifyContent="space-between">
              <Grid container spacing={!matches ? 3 : 0} item xs={12} md={7}>
                <Grid item xs={12} md={8}>
                  <img width="100%" src={image} alt={make} />
                  {flow === 'deal' ? (
                    <Typography component="div">
                      <Badge
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          handleActiveHint('finance_confirm_deal_vin')
                        }
                        color="error"
                        badgeContent={1}
                        classes={{
                          badge: classes.badge,
                          anchorOriginTopRightRectangular: classes.ancor,
                        }}
                      >
                        <Typography>VIN: To be confirmed</Typography>
                      </Badge>
                    </Typography>
                  ) : (
                    <Typography>VIN: {vin}</Typography>
                  )}
                  {flow === 'deal' ? (
                    <Typography component="div">
                      <Badge
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          handleActiveHint('finance_confirm_deal_mileage')
                        }
                        color="error"
                        badgeContent={2}
                        classes={{
                          badge: classes.badge,
                          anchorOriginTopRightRectangular: classes.ancor,
                        }}
                      >
                        <Typography>Mileage: To be confirmed</Typography>
                      </Badge>
                    </Typography>
                  ) : (
                    <Typography>Mileage: {formatNumber(mileage)}</Typography>
                  )}
                  <Typography>
                    Exterior: {vehicle.oemExt || exteriorColor}
                  </Typography>
                  <Typography>
                    Interior: {vehicle.oemInt || interiorColor}
                  </Typography>
                  <Typography>
                    Engine: {fuelType} {cylinder}
                  </Typography>
                  <Typography>Drivetrain: {drivetrain}</Typography>
                  <Typography gutterBottom={matches}>
                    Seating: {seating}
                  </Typography>
                  <div className={classes.warranty}>
                    <img src={PointInspection} width="100%" alt="Warranty" />
                  </div>
                </Grid>
                <Grid item xs={12} md={4}>
                  {backLink && (
                    <Link href={{ ...backLink }}>
                      <a style={{ textDecoration: 'none' }}>
                        <Button
                          variant="outlined"
                          style={{ textTransform: 'none' }}
                        >
                          <Typography>edit purchase</Typography>
                        </Button>
                      </a>
                    </Link>
                  )}
                </Grid>
              </Grid>
              {matches && (
                <Grid item xs={12}>
                  <Divider light className={classes.divider} />
                </Grid>
              )}
              <Grid
                item
                xs={12}
                md={5}
                style={{ minHeight: 500 }}
                container
                direction="column"
                justifyContent="space-between"
              >
                <Grid
                  container
                  style={{ flexGrow: 1, paddingBottom: !matches ? '20%' : 25 }}
                  alignContent="space-between"
                >
                  <Grid container>
                    <Typography variant="body1" className={classes.textBold}>
                      Payment information:
                    </Typography>
                    <Grid item container justifyContent="space-between">
                      <Typography variant="body1">Selling price</Typography>
                      <Typography variant="body1">
                        {formatMoneyAmount(listPrice)}
                      </Typography>
                      {flow !== 'retail' && dmp && renderFinancingTopPrice()}
                    </Grid>
                  </Grid>
                  <Grid container>
                    {flow === 'deal' &&
                      isZeroFlow &&
                      renderDealZeroDownPayment()}
                    {flow === 'deal' && !isZeroFlow && randerDealDownPayment()}
                    {flow === 'car' && isZeroFlow && randerCarZeroDownPayment()}
                    {flow === 'car' && !isZeroFlow && randerCarDownPayment()}
                    {flow === 'retail' && props.taxFees && renderStateFeeInfo()}
                  </Grid>
                  <Grid container>
                    <>
                      {dmp && flow !== 'retail' ? (
                        <>
                          <Typography
                            variant="body1"
                            className={classes.textBold}
                          >
                            Financing Terms:
                          </Typography>
                          {renderFinTerms()}
                        </>
                      ) : (
                        renderRetailDepositInfo()
                      )}
                      {pickMethod === DELIVERY && (
                        <Grid container justifyContent="space-between">
                          <Typography variant="body1">Delivery fee</Typography>
                          <Typography variant="body1">
                            {formatMoneyAmount(deliveryFee)}
                          </Typography>
                        </Grid>
                      )}
                    </>
                  </Grid>
                </Grid>
                <Grid item container>
                  <PromoCodeInput
                    source="Finance"
                    setDiscount={setPromoDiscount}
                  />
                </Grid>
                <Grid item container>
                  {location && deliveryDate && renterPickupInfo()}
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <CustomPrimaryButton
            withIcon
            isLarge={!matches}
            fullWidth
            onClick={handleProceed}
            id="proceed-to-checkout"
          >
            Proceed to checkout
          </CustomPrimaryButton>
        </Box>
        {props.pickupPoints && (
          <LocationModal
            open={isOpenModal}
            pickupPoints={props.pickupPoints}
            handleClose={handleCloseModal}
            handlePickLocation={handlePickLocation}
          />
        )}
        {openError && (
          <LocationErrorDialog
            open={openError}
            handleClose={handleHideThanksDialog}
          />
        )}
      </Container>
      <div ref={hintRef}>
        {activeHint && (
          <Container maxWidth="md">
            <CustomHint
              activeHint={activeHint}
              handleCloseHint={handleCloseHint}
            />
          </Container>
        )}
      </div>
    </>
  );
};

PurchaseConfirm.propTypes = {
  vehicle: PropTypes.object.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  prospect: PropTypes.object.isRequired,
  prices: PropTypes.object.isRequired,
  taxFees: PropTypes.object,
  financePins: PropTypes.array.isRequired,
};

PurchaseConfirm.defaultProps = {
  taxFees: null,
};

export default PurchaseConfirm;
