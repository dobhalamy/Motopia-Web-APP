import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  useMediaQuery,
  InputBase,
  Divider,
} from '@material-ui/core';
import TrustBadge from 'assets/finance/trust_badge.png';

import stripeLogo from 'src/assets/finance/stripe_logo.svg';
import { SELECT_OPTIONS_USA_STATES } from 'src/constants';
import { intent } from 'utils/stripe';
import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
import { Prospect, Vehicle } from 'src/api';
import { getCookie, getCookieJSON, setCookie } from 'src/utils/cookie';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import { applyAdsQuery } from '@/utils/commonUtils';
import PaymentRequestForm from './PaymentRequestButton';
import generateProspectSource from '../../../utils/generateProspectSource';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const PICKUP = 'Pickup';
const DELIVERY = 'Delivery';

const CheckoutForm = props => {
  const { router, prospect, listOfRDSVehicles, getListOfRDSVehicles } = props;
  const adsQuery = applyAdsQuery(router.query);
  const { amount } = router.query;
  const [client, setClient] = useState();
  const [picture, setPicture] = useState();
  const [isPaid, setIsPaid] = useState(false);
  const [vehicle, setVehicle] = useState();
  const [checkoutType, setCheckout] = useState('finance');
  const [report, setReport] = useState(false);
  const [isDeal, setDeal] = useState(false);
  const [receiveGoodsInfo, setGoodsInfo] = useState();
  const stripe = useStripe();
  const elements = useElements();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));

  const [cardholder, setCardholder] = useState('');
  const [isFilled, setFilled] = useState(false);

  const handleChage = ({ target }) => {
    const { value } = target;
    setCardholder(value);
  };

  useEffect(() => {
    if (cardholder.length === 0) {
      setFilled(false);
    } else setFilled(true);
  }, [cardholder]);

  const handleAddProspect = async () => {
    const {
      category,
      contactNumber,
      firstName,
      middleName,
      lastName,
      email,
      source } = prospect;
    const { locationName, pickupDate, pickMethod } = receiveGoodsInfo;
    const USER_INFORMATION = {
      firstName,
      middleName,
      lastName,
      email,
      contactNumber,
      source: generateProspectSource(source, router.query),
      category,
      notes: `Chosen method: ${pickMethod}. Address: ${locationName}. Date: ${pickupDate}`,
    };
    let response;
    try {
      response = await Prospect.AddProspect({
        ...USER_INFORMATION,
      });
      props.saveUserData({ prospectId: response.prospectId });
      setCookie('prospectId', response.prospectId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (props.prospect) {
      (async () => {
        try {
          await getListOfRDSVehicles();
          const request = router.query;
          const pickupInfo = getCookieJSON('pickupInfo');
          const pickupData = {
            locationName: pickupInfo.locationName,
            pickupDate: pickupInfo.date,
            pickMethod: PICKUP,
          };
          if (router.query.method && router.query.method === DELIVERY) {
            const jsonAddress = getCookieJSON('deliveryAddress') || getCookieJSON('address');
            // eslint-disable-next-line max-len
            const cookieAddress = `${jsonAddress.address}, ${jsonAddress.city}, ${jsonAddress.state} ${jsonAddress.homeZip}`;
            const estimatedDeliveryDate = moment(pickupInfo.date)
              .add(1, 'day')
              .format('dddd, MMMM DD, YYYY').toUpperCase();
            pickupData.locationName = cookieAddress;
            pickupData.pickupDate = estimatedDeliveryDate;
            pickupData.pickMethod = DELIVERY;
          }
          request.email = prospect.email;
          request.prospectId = prospect.prospectId;
          request.pickupLocation = pickupData.locationName;
          request.pickupDate = pickupData.pickupDate;
          request.pickMethod = pickupData.pickMethod;
          setGoodsInfo(pickupData);
          if (request.stockId) {
            request.type = 'finance';
            let response;
            if (router.query.isRetail === 'true') {
              response = await intent(request);
            } else {
              const dmp = getCookieJSON('dmp');
              request.downPayment = dmp.downPayment;
              request.monthlyPayment = dmp.monthlyPayment;
              request.term = dmp.monthlyPaymentPeriod;
              response = await intent(request);
            }
            setClient(response.paymentIntent.client_secret);
            setPicture(response.picture);
            setVehicle(response.vehicle);
            setCheckout(request.type);
            if (request.flow === 'deal') setDeal(true);
          }
          if (request.rsdStockId) {
            request.type = 'rds';
            const rdsVehicle = listOfRDSVehicles.find(el => el.rsdStockId === request.rsdStockId);
            request.img = rdsVehicle.mainDisplayImageUrl;
            const response = await intent(request);
            setClient(response.paymentIntent.client_secret);
            setPicture(rdsVehicle.mainDisplayImageUrl);
            setVehicle(rdsVehicle);
            setCheckout(request.type);
            setReport(request.report);
          }
        } catch (error) {
          console.error(error);
          router.back();
        }
      })();
    }
    // eslint-disable-next-line
  }, []);

  const useStyles = makeStyles(theme => ({
    root: {
      maxWidth: '100%',
    },
    media: {
      background: `linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
            url(${picture})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      height: !matches ? 420 : 210,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
    },
    gridContainer: {
      padding: '20px',
    },
    desc: {
      fontSize: !matches ? '22px' : '12px'
    },
    divider: {
      margin: '15px 0',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxHeight: 70
    },
    link: {
      display: 'flex',
      maxWidth: 'min-content',
      justifyContent: 'flex-end',
      alignItems: 'center',
      maxHeight: 'inherit',
    },
    icon: {
      maxHeight: 'inherit'
    },
    cardHolderInput: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      '&::placeholder': {
        color: '#aab7c4',
        opacity: 1,
      }
    },
    inputBorder: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    paymentFields: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    cardElementBox: {
      height: '32px',
      padding: '6px 0 7px',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    trustMargin: {
      marginTop: 50,
      marginBottom: 50,
      [theme.breakpoints.down('md')]: {
        width: '100%'
      },
      [theme.breakpoints.up('lg')]: {
        marginLeft: '28%'
      },
    }
  }));

  const classes = useStyles();

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }
    try {
      setIsPaid(true);
      if (router.query.stockId) {
        const { stockId } = router.query;
        const checkStatus = await Vehicle.CheckStatus(stockId);
        const vehicleStatus = checkStatus.status;
        const { prospectId, firstName, lastName, middleName } = prospect;
        const address = getCookieJSON('address');
        const fullState = SELECT_OPTIONS_USA_STATES.find(el => el.value === address.state).text;
        const bankCreditId = getCookie('bankCreditId');
        const numberStockId = +stockId;
        const salesTaxRate = +getCookie('salesTaxRate');
        if (router.query.isRetail) {
          const fees = getCookieJSON('fees');
          const {
            docFee,
            inspectionFee,
            registrationFee,
            electricVehicleFee } = fees;
          const taxAmount = (vehicle.listPrice / 100) * salesTaxRate;
          const result = await stripe.confirmCardPayment(client, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: cardholder
              }
            },
            setup_future_usage: 'off_session',
          });

          if (result.error) {
            router.push({
              pathname: '/finance/payment/fail',
              query: { ...adsQuery },
            });
          } else {
            const ASSIGN_DATA = {
              dealType: 'Retail', // OR "FiledCredit",
              customerId: +getCookie('customerId'),
              creditAppId: +bankCreditId,
              stockId: numberStockId,
              sellingPrice: vehicle.listPrice,
              deliveryDate: new Date(),
              salesTaxRate,
              salesTaxAmount: +taxAmount.toFixed(),
              docFee,
              inspectionFee,
              registrationFee,
              electricVehicleFee,
              county: fullState
            };

            await Vehicle.AssignToPending({
              ...ASSIGN_DATA
            });
            await Vehicle.RemoveVehicle(numberStockId);
            await handleAddProspect();
            router.push({
              pathname: '/finance/payment/success',
              query: { ...adsQuery },
            });
          }
        } else {
          const PROSPECT_DATA_TO_TRANSFER = {
            prospectId,
            address: address.address,
            city: address.city,
            state: address.state,
            zipCode: address.homeZip,
            registFirstName: firstName,
            registMiddleName: middleName,
            registLastName: lastName,
            registAddress: address.address,
            registCity: address.city,
            registState: address.state,
            registZipCode: address.homeZip,
          };

          if (vehicleStatus !== 'S' || vehicleStatus !== 'D') {
            const transfer = await Prospect.Transfer({
              ...PROSPECT_DATA_TO_TRANSFER
            });
            const result = await stripe.confirmCardPayment(client, {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                  name: cardholder
                }
              },
              setup_future_usage: 'off_session',
            });

            if (result.error) {
              router.push({
                pathname: '/finance/payment/fail',
                query: { ...adsQuery },
              });
            } else {
              const ASSIGN_DATA = {
                dealType: 'Retail', // OR "FiledCredit",
                customerId: transfer.customerId,
                creditAppId: +bankCreditId,
                stockId: numberStockId,
                sellingPrice: vehicle.listPrice,
                deliveryDate: new Date(),
              };

              await Vehicle.AssignToPending({
                ...ASSIGN_DATA
              });
              await Vehicle.RemoveVehicle(numberStockId);
              await handleAddProspect();
              router.push({
                pathname: '/finance/payment/success',
                query: { ...adsQuery },
              });
            }
          }
        }
      }
      if (router.query.rsdStockId) {
        const result = await stripe.confirmCardPayment(client, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: cardholder
            }
          },
          setup_future_usage: 'off_session',
        });

        if (result.error) {
          router.push({
            pathname: '/finance/payment/fail',
            query: { ...adsQuery },
          });
        } else {
          router.push({
            pathname: '/finance/payment/success',
            query: { report, ...adsQuery },
          });
        }
      }
    } catch (error) {
      console.error(error);
      router.push({
        pathname: '/finance/payment/fail',
        query: { ...adsQuery },
      });
    }
  };

  const gridSpacing = matches ? 1 : 3;

  const renderFinanceVehicleInfo = () => (
    <>
      <Grid
        container
        spacing={gridSpacing}
        className={classes.gidContainer}
        alignItems="center"
        alignContent="center"
        justifyContent="space-around"
      >
        <Grid item xs={12}>
          <Typography
            variant={!matches ? 'h3' : 'h4'}
            component="p"
            align="center"
          >
            {vehicle && `${vehicle.carYear} ${vehicle.make} ${vehicle.model}` }
          </Typography>
          {isDeal &&
            <Typography
              variant={!matches ? 'h5' : 'h6'}
              component="p"
              align="center"
            >
              OR EQUIVALENT
            </Typography>}
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>List Price:</b> $ {vehicle.listPrice}.00
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>Drive Type:</b> {vehicle.drivetrain ? vehicle.drivetrain : 'No information'}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>Mileage:</b> {vehicle.mileage ? `${vehicle.mileage} miles` : 'No information'}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>Transmission:</b> Automatic
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>Ext. Color:</b> {
              vehicle.exteriorColor
                ? vehicle.exteriorColor
                : 'No information'
                }
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>VIN#:</b> {vehicle.vin ? vehicle.vin : 'No information'}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>Int. Color:</b> {
              vehicle.interiorColor
                ? vehicle.interiorColor
                : 'No information'
                }
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>Stock#:</b> {vehicle && vehicle.stockid}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>Engine:</b> {
              vehicle.fuelType
                ? vehicle.fuelType
                : 'No information'
                }
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography
            className={classes.desc}
          >
            <b>Seating:</b> {
              vehicle.seating
                ? `${vehicle.seating} passengers`
                : 'No information'
                }
          </Typography>
        </Grid>
      </Grid>
    </>);

  const renderRdsVehicleInfo = () => (
    <>
      <Grid
        container
        spacing={gridSpacing}
        className={classes.gidContainer}
        alignItems="center"
        alignContent="center"
        justifyContent="space-around"
      >
        <Grid item xs={12}>
          <Typography
            variant={!matches ? 'h3' : 'h4'}
            align="center"
          >
            {vehicle && `${vehicle.year} ${vehicle.make} ${vehicle.model}` }
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant={!matches ? 'h4' : 'h5'}
            align="center"
          >
            {vehicle && `${vehicle.rsdInventoryType}` }
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {vehicle &&
          <Typography
            variant={!matches ? 'h5' : 'h6'}
            align="center"
          >
            <b>Payment:</b> $ {amount}.00
          </Typography>}
        </Grid>
      </Grid>
    </>);

  return (
    <>
      <Card className={classes.root}>
        <CardContent className={classes.cardHeader}>
          <Typography variant="h5">Checkout form</Typography>
          <a
            href="https://stripe.com/checkout/legal"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            <img src={stripeLogo} alt="stripe logo" className={classes.icon}/>
          </a>
        </CardContent>
        <CardContent className={classes.media} component="div">
          {vehicle &&
            checkoutType === 'finance'
            ? renderFinanceVehicleInfo()
            : renderRdsVehicleInfo()}
        </CardContent>
        <CardContent style={{ paddingLeft: 0, paddingRight: 0 }}>
          {client &&
            <div className={classes.paymentFields}>
              <PaymentRequestForm client={client} setIsPaid={setIsPaid} {...props} />
            </div>}
          <Divider light className={classes.inputBorder} />
          <div className={classes.paymentFields} >
            <InputBase
              name="cardholder"
              classes={{ input: classes.cardHolderInput }}
              fullWidth
              value={cardholder}
              placeholder="Name on card"
              onChange={handleChage}
            />
          </div>
          <Divider light className={classes.inputBorder} />
          <div className={classes.cardElementBox} >
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </CardContent>
        {!isPaid && (
          <>
            <CustomPrimaryButton
              type="submit"
              isLarge={!matches}
              fullWidth
              onClick={() => handleSubmit()}
              disabled={!isFilled}
            >
              <Typography>
                {`Charge ${formatMoneyAmount(amount)}.00 to card`}
              </Typography>
            </CustomPrimaryButton>
            <img src={TrustBadge} className={classes.trustMargin} alt="Warranty"/>
          </>
        )}
      </Card>
    </>
  );
};

CheckoutForm.propTypes = {
  prospect: PropTypes.object.isRequired,
  listOfRDSVehicles: PropTypes.array.isRequired,
  getListOfRDSVehicles: PropTypes.func.isRequired,
  saveUserData: PropTypes.func.isRequired,
  getProspectorProfile: PropTypes.func.isRequired,
};

export default CheckoutForm;
