import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
import { SELECT_OPTIONS_USA_STATES } from 'src/constants';
import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
import { Prospect, Vehicle, Authorize, Promotion, Location } from 'src/api';
import { getCookie, getCookieJSON, setCookie } from 'src/utils/cookie';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import AmericanExpress from 'src/assets/cards/Ame.png';
import DinersClub from 'src/assets/cards/dinCl.png';
import Discover from 'src/assets/cards/discover.png';
import JCB from 'src/assets/cards/jcb.png';
import Maestro from 'src/assets/cards/maestro.png';
import MasterCard from 'src/assets/cards/mastercard.png';
import Visa from 'src/assets/cards/visa.png';
import DefaultCard from 'src/assets/cards/Defaultcard.png';
import { useRouter } from 'next/router';
import { appendQueryParams, applyAdsQuery } from '@/utils/commonUtils';
import generateProspectSource from '../../../utils/generateProspectSource';

const creditCardType = require('credit-card-type');

const PICKUP = 'Pickup';
const DELIVERY = 'Delivery';

const CheckoutForm = props => {
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const { prospect, listOfRDSVehicles, getListOfRDSVehicles } = props;
  const { amount } = router.query;
  const [picture, setPicture] = useState();
  const [isPaid, setIsPaid] = useState(false);
  const [vehicle, setVehicle] = useState();
  const [checkoutType, setCheckout] = useState('finance');
  const [report, setReport] = useState(false);
  const [isDeal, setDeal] = useState(false);
  const [receiveGoodsInfo, setGoodsInfo] = useState();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));

  const [cardholder, setCardholder] = useState('');
  const [cardnumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [CVV, setCVV] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cardType, setCardType] = useState('');
  const [isFilled, setFilled] = useState(false);
  const [pickLoc, setPickLoc] = useState('');

  const checkCreditCardType = value => {
    const cardNameType = creditCardType(value);
    if (cardNameType.length > 0 && value.length > 0) {
      setCardType(cardNameType[0].niceType);
    } else {
      setCardType('');
    }
  };

  const handleChage = ({ target }) => {
    const { name, value } = target;
    switch (name) {
      case 'cardholder':
        setCardholder(value);
        break;
      case 'cardnumber':
        setCardNumber(value);
        checkCreditCardType(value);
        break;
      case 'MM':
        if (value.length < 3) {
          setExpiryMonth(value);
        }
        break;
      case 'YY':
        if (value.length < 3) {
          setExpiryYear(value);
        }
        break;
      case 'CVV':
        if (value.length < 5) {
          setCVV(value);
        }
        break;
      case 'ZipCode':
        setZipCode(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fullYearNow = String(new Date().getFullYear());
    const yearNow = Number(fullYearNow.slice(2, 4));
    const monthNow = new Date().getMonth();
    let isExpired = false;
    if (expiryMonth && expiryYear && Number(expiryMonth) < 13) {
      if (Number(expiryYear) === yearNow) {
        if (Number(expiryMonth) > monthNow && Number(expiryMonth) < 13) {
          isExpired = false;
        } else {
          isExpired = true;
        }
      } else if (Number(expiryYear) < yearNow) {
        isExpired = true;
      } else {
        isExpired = false;
      }
    } else {
      isExpired = true;
    }
    if (
      cardholder.length > 0 &&
      cardnumber.length > 12 &&
      cardnumber.length < 20 &&
      (CVV.length === 3 || CVV.length === 4) &&
      cardType.length > 0 &&
      zipCode.length === 5 &&
      !isExpired &&
      expiryMonth.length === 2 &&
      expiryYear.length === 2 &&
      expiryMonth !== '00'
    ) {
      setFilled(true);
    } else setFilled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardholder, cardnumber, expiryMonth, expiryYear, CVV, zipCode]);

  const handleAddProspect = async () => {
    const {
      category,
      contactNumber,
      firstName,
      middleName,
      lastName,
      email,
      source,
    } = prospect;
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
            const jsonAddress =
              getCookieJSON('deliveryAddress') || getCookieJSON('address');
            // eslint-disable-next-line max-len
            const cookieAddress = `${jsonAddress.address}, ${jsonAddress.city}, ${jsonAddress.state} ${jsonAddress.homeZip}`;
            const estimatedDeliveryDate = moment(pickupInfo.date)
              .add(1, 'day')
              .format('dddd, MMMM DD, YYYY')
              .toUpperCase();
            pickupData.locationName = cookieAddress;
            pickupData.pickupDate = estimatedDeliveryDate;
            pickupData.pickMethod = DELIVERY;
            const pickUpCord = getCookieJSON('pickUpCord');
            // eslint-disable-next-line max-len
            const { closestPickuplocation } = await Location.GetClosestLocation(
              pickUpCord.lat,
              pickUpCord.lng,
              'Sales'
            );
            setPickLoc(closestPickuplocation.locationName);
          }
          request.email = prospect.email;
          request.prospectId = prospect.prospectId;
          request.pickupLocation = pickupData.locationName;
          request.pickupDate = pickupData.pickupDate;
          request.pickMethod = pickupData.pickMethod;
          setGoodsInfo(pickupData);
          if (request.stockId) {
            request.type = 'finance';
            const response = await Vehicle.getVehicleById(request.stockId);
            const vehicleData = response.data.vehicle;
            const dmp = getCookieJSON('dmp');
            if (router.query.isRetail !== 'true' && !!dmp) {
              request.downPayment = dmp.downPayment;
              request.monthlyPayment = dmp.monthlyPayment;
              request.term = dmp.monthlyPaymentPeriod;
            }
            setPicture(vehicleData.picturesUrl[0].picture);
            setVehicle(vehicleData);
            setCheckout(request.type);
            if (request.flow === 'deal') setDeal(true);
          }
          if (request.rsdStockId) {
            request.type = 'rds';
            const rdsVehicle = listOfRDSVehicles.find(
              el => el.rsdStockId === request.rsdStockId
            );
            request.img = rdsVehicle.mainDisplayImageUrl;
            // const customerCreation = await Authorize.createCustomer(request);
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

  const returnCard = () => {
    switch (cardType) {
      case 'Discover':
        return Discover;
      case 'Visa':
        return Visa;
      case 'Mastercard':
        return MasterCard;
      case 'Maestro':
        return Maestro;
      case 'JCB':
        return JCB;
      case 'American Express':
        return AmericanExpress;
      case 'Diners Club':
        return DinersClub;
      default:
        return DefaultCard;
    }
  };
  useEffect(() => {
    returnCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardType]);

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
      fontSize: !matches ? '22px' : '12px',
    },
    divider: {
      margin: '15px 0',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxHeight: 70,
    },
    link: {
      display: 'flex',
      maxWidth: 'min-content',
      justifyContent: 'flex-end',
      alignItems: 'center',
      maxHeight: 'inherit',
    },
    icon: {
      maxHeight: 'inherit',
    },
    cardHolderInput: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      '&::placeholder': {
        color: '#aab7c4',
        opacity: 1,
      },
    },
    inputBorder: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    paymentFields: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    numberField: {
      width: '80%',
    },
    dateFields: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      width: '80%',
    },
    cardElementBox: {
      textAlign: 'center',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    trustMargin: {
      marginTop: 50,
      marginBottom: 50,
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
      [theme.breakpoints.up('lg')]: {
        marginLeft: '28%',
      },
    },
    cardText: {
      width: '10%',
      display: 'inline-flex',
    },
    imageStyle: {
      height: '35px',
      verticalAlign: 'middle',
      padding: 5,
    },
    cardDetails: {
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
      [theme.breakpoints.up('md')]: {
        width: '35%',
      },
      display: 'flex',
    },
    cardNumberDetails: {
      width: '100%',
      [theme.breakpoints.up('md')]: {
        textAlign: 'left',
      },
    },
    cardNumberBox: {
      [theme.breakpoints.down('md')]: {
        width: '75%',
      },
      [theme.breakpoints.up('md')]: {
        width: '85%',
      },
    },
    expiryMonthBox: {
      [theme.breakpoints.down('md')]: {
        width: '10%',
      },
      [theme.breakpoints.up('md')]: {
        width: '40%',
      },
    },
    expiryYearBox: {
      [theme.breakpoints.down('md')]: {
        width: '20%',
      },
      [theme.breakpoints.up('md')]: {
        width: '40%',
      },
    },
    cvvBox: {
      [theme.breakpoints.down('md')]: {
        width: '20%',
      },
    },
    zipCodeBox: {
      [theme.breakpoints.down('md')]: {
        width: '20%',
      },
    },
    slash: {
      [theme.breakpoints.down('md')]: {
        width: '10%',
      },
      [theme.breakpoints.up('md')]: {
        width: '30%',
      },
    },
  }));

  const classes = useStyles();

  const addReferrer = async () => {
    const promoCode = getCookie('promoCode');
    const cellPhone = prospect.contactNumber;
    const parseNumber = cellPhone.startsWith('+1')
      ? cellPhone.replace(/\D+/g, '').slice(1)
      : cellPhone.replace(/\D+/g, '');
    const pickUpInfo = getCookieJSON('pickupInfo');
    const source =
      receiveGoodsInfo.pickMethod === 'Delivery'
        ? pickLoc
        : pickUpInfo.locationName;
    const referrer = {
      prospectId: prospect.prospectId,
      contactNumber: parseNumber,
      firstName: prospect.firstName,
      lastName: prospect.lastName,
      hasPurchased: true,
      source,
      dealType: 'Online',
    };
    if (promoCode) {
      referrer.promoCode = promoCode;
    }
    await Promotion.addReferrer(referrer);
  };
  const sendEventToGTM = () => {
    if (router.query.description.toLowerCase() === 'rent-to-own') {
      window.dataLayer.push({
        event: 'Rideshare_Checkout',
        RC: 'Rideshare_Checkout',
      });
    }
    if (router.query.description === 'Retail') {
      window.dataLayer.push({
        event: 'Car_Sale_Pay_In_Full_Checkout',
        CSPIFC: 'Car_Sale_Pay_In_Full_Checkout',
      });
    }
    if (router.query.description.includes('Financing')) {
      window.dataLayer.push({
        event: 'Car_Sale_Finance_Checkout',
        CSFC: 'Car_Sale_Finance_Checkout',
      });
    }
  };

  const chargeCreditCard = async () => {
    try {
      const request = router.query;
      const pickupInfo = getCookieJSON('pickupInfo');
      const pickupData = {
        locationName: pickupInfo.locationName,
        pickupDate: pickupInfo.date,
        pickMethod: PICKUP,
      };
      if (router.query.method && router.query.method === DELIVERY) {
        const jsonAddress =
          getCookieJSON('deliveryAddress') || getCookieJSON('address');
        // eslint-disable-next-line max-len
        const cookieAddress = `${jsonAddress.address}, ${jsonAddress.city}, ${jsonAddress.state} ${jsonAddress.homeZip}`;
        const estimatedDeliveryDate = moment(pickupInfo.date)
          .add(1, 'day')
          .format('dddd, MMMM DD, YYYY')
          .toUpperCase();
        pickupData.locationName = cookieAddress;
        pickupData.pickupDate = estimatedDeliveryDate;
        pickupData.pickMethod = DELIVERY;
      }
      request.email = prospect.email;
      request.prospectId = prospect.prospectId;
      request.pickupLocation = pickupData.locationName;
      request.pickupDate = pickupData.pickupDate;
      request.pickMethod = pickupData.pickMethod;
      request.infoVehicle = vehicle;
      const cardInfo = {
        cardHolder: cardholder,
        cardNumber: cardnumber,
        expiry: expiryMonth + expiryYear,
        cvv: CVV,
        amountPay: amount,
        email: prospect.email,
        prospect: props.prospect,
        closestSalesPoint: props.prospect.closestSalesPoint || {},
        TypePayment: checkoutType === 'finance' ? 'Finance' : 'RideShare',
        cardZipCode: zipCode,
        description: router.query.description || '',
        brand: cardType,
        vin: vehicle.vin ? vehicle.vin : '',
        stockId: vehicle.stockid ? vehicle.stockid : '',
      };
      request.cardInfo = cardInfo;
      setIsPaid(() => true);
      if (router.query.stockId) {
        // Standard checkout
        request.type = 'finance';
        const { stockId } = router.query;
        const checkStatus = await Vehicle.CheckStatus(stockId);
        const vehicleStatus = checkStatus.status;
        const { prospectId, firstName, lastName, middleName } = prospect;
        const address = getCookieJSON('address');
        const fullState = SELECT_OPTIONS_USA_STATES.find(
          el => el.value === address.state
        ).text;
        const bankCreditId = getCookie('bankCreditId');
        const numberStockId = +stockId;
        const salesTaxRate = +getCookie('salesTaxRate');
        if (router.query.isRetail) {
          const fees = getCookieJSON('fees');
          const {
            docFee,
            inspectionFee,
            registrationFee,
            electricVehicleFee,
          } = fees;
          const taxAmount = (vehicle.listPrice / 100) * salesTaxRate;
          const dmp = getCookieJSON('dmp');
          if (dmp !== undefined) {
            request.downPayment = dmp.downPayment;
            request.monthlyPayment = dmp.monthlyPayment;
            request.term = dmp.monthlyPaymentPeriod;
          }
          const paymentResult = await Authorize.chargeCreditCard(cardInfo);
          if (paymentResult.status !== 'success') {
            const { message } = paymentResult;
            setCookie('paymentErrorMessage', message);
            router.push({
              pathname: '/finance/payment/fail',
              query: { ...adsQuery },
            });
          } else {
            const { transactionResponse } = paymentResult.data.data;
            request.transactionId = transactionResponse.transId;
            await Authorize.sendReceipt(request);
            const ASSIGN_DATA = {
              dealType: 'Retail',
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
              county: fullState,
            };
            await Vehicle.AssignToPending({
              ...ASSIGN_DATA,
            });
            await addReferrer(); // Create referrer
            await Vehicle.AssignToDStatus(numberStockId);
            await handleAddProspect();
            router.push(
              {
                pathname: '/finance/payment/success',
                query: { ...adsQuery },
              },
              `${appendQueryParams(
                '/finance/payment/car-sale/success',
                adsQuery
              )}`
            );
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
              ...PROSPECT_DATA_TO_TRANSFER,
            });
            request.vin = 'To Be Confirmed';
            const dmp = getCookieJSON('dmp');
            if (dmp !== undefined) {
              request.downPayment = dmp.downPayment;
              request.monthlyPayment = dmp.monthlyPayment;
              request.term = dmp.monthlyPaymentPeriod;
            }
            const paymentResult = await Authorize.chargeCreditCard(cardInfo);

            if (paymentResult.status !== 'success') {
              const { message } = paymentResult;
              setCookie('paymentErrorMessage', message);
              router.push({
                pathname: '/finance/payment/fail',
                query: { ...adsQuery },
              });
            } else {
              const ASSIGN_DATA = {
                dealType: 'FiledCredit',
                customerId: transfer.customerId,
                creditAppId: +bankCreditId,
                stockId: numberStockId,
                sellingPrice: vehicle.listPrice,
                deliveryDate: new Date(),
              };
              const { transactionResponse } = paymentResult.data.data;
              request.transactionId = transactionResponse.transId;
              await Authorize.sendReceipt(request);
              await Vehicle.AssignToPending({
                ...ASSIGN_DATA,
              });
              await addReferrer(); // Create referrer
              await Vehicle.AssignToDStatus(numberStockId);
              await handleAddProspect();
              router.push(
                {
                  pathname: '/finance/payment/success',
                  query: { ...adsQuery },
                },
                `${appendQueryParams(
                  '/finance/payment/car-sale/success',
                  adsQuery
                )}`
              );
            }
          }
        }
      }
      if (router.query.rsdStockId) {
        // Rideshare checkout
        request.type = 'rds';
        const rdsVehicle = listOfRDSVehicles.find(
          el => el.rsdStockId === router.query.rsdStockId
        );
        request.img = rdsVehicle.mainDisplayImageUrl;
        request.infoVehicle = rdsVehicle;
        const paymentResult = await Authorize.chargeCreditCard(cardInfo);
        if (paymentResult.status === 'success') {
          sendEventToGTM();
          const { transactionResponse } = paymentResult.data.data;
          request.transactionId = transactionResponse.transId;
          await Authorize.sendReceipt(request);
          await addReferrer(); // Create referrer
          router.push(
            {
              pathname: '/finance/payment/success',
              query: { report, ...adsQuery },
            },
            `${appendQueryParams(
              '/finance/payment/ride-share/success',
              adsQuery
            )}`
          );
        } else {
          const { message } = paymentResult;
          setCookie('paymentErrorMessage', message);
          router.push({
            pathname: '/finance/payment/fail',
            query: { ...adsQuery },
          });
        }
      }
    } catch (error) {
      let message = error.message || error;
      if (error.response && error.response.data) {
        message = error.response.data;
      }
      setCookie('paymentErrorMessage', message);
      console.error(message);
      router.push({
        pathname: '/finance/payment/fail',
        auery: { ...adsQuery },
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
            {vehicle && `${vehicle.carYear} ${vehicle.make} ${vehicle.model}`}
          </Typography>
          {isDeal && (
            <Typography
              variant={!matches ? 'h5' : 'h6'}
              component="p"
              align="center"
            >
              OR EQUIVALENT
            </Typography>
          )}
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>List Price:</b> $ {vehicle.listPrice}.00
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>Drive Type:</b>{' '}
            {vehicle.drivetrain ? vehicle.drivetrain : 'No information'}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>Mileage:</b>{' '}
            {vehicle.mileage ? `${vehicle.mileage} miles` : 'No information'}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>Transmission:</b> Automatic
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>Ext. Color:</b>{' '}
            {vehicle.exteriorColor ? vehicle.exteriorColor : 'No information'}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>VIN#:</b> {vehicle.vin ? vehicle.vin : 'No information'}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>Int. Color:</b>{' '}
            {vehicle.interiorColor ? vehicle.interiorColor : 'No information'}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>Stock#:</b> {vehicle && vehicle.stockid}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>Engine:</b>{' '}
            {vehicle.fuelType ? vehicle.fuelType : 'No information'}
          </Typography>
        </Grid>
        <Grid item xs={6} container justifyContent="center">
          <Typography className={classes.desc}>
            <b>Seating:</b>{' '}
            {vehicle.seating
              ? `${vehicle.seating} passengers`
              : 'No information'}
          </Typography>
        </Grid>
      </Grid>
    </>
  );

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
          <Typography variant={!matches ? 'h3' : 'h4'} align="center">
            {vehicle &&
              `
                ${vehicle.make} ${vehicle.model}
                (${vehicle.yearFrom}-${vehicle.yearTo.toString().slice(-2)})
              `}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={!matches ? 'h4' : 'h5'} align="center">
            {vehicle && `${vehicle.rsdInventoryType}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {vehicle && (
            <Typography variant={!matches ? 'h5' : 'h6'} align="center">
              <b>Payment:</b> $ {amount}.00
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );

  return (
    <>
      <Card className={classes.root}>
        <CardContent className={classes.cardHeader}>
          <Typography variant="h5">Checkout form</Typography>
        </CardContent>
        <CardContent className={classes.media} component="div">
          {vehicle && checkoutType === 'finance'
            ? renderFinanceVehicleInfo()
            : renderRdsVehicleInfo()}
        </CardContent>
        <CardContent style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Divider light className={classes.inputBorder} />
          <div className={classes.paymentFields}>
            <InputBase
              name="cardholder"
              classes={{ input: classes.cardHolderInput }}
              value={cardholder}
              placeholder="Name on card"
              onChange={handleChage}
            />
          </div>
          <Divider light className={classes.inputBorder} />
          <div className={classes.cardElementBox}>
            <div className={classes.cardNumberDetails}>
              <InputBase
                name="cardnumber"
                classes={{ input: classes.cardHolderInput }}
                className={classes.cardNumberBox}
                value={cardnumber}
                placeholder="Enter Your Card Number"
                onChange={handleChage}
              />
              <span style={{ width: '10%' }}>
                <img
                  src={returnCard()}
                  alt="creditcard"
                  className={classes.imageStyle}
                />
              </span>
            </div>
            <div className={classes.cardDetails}>
              <InputBase
                name="MM"
                classes={{ input: classes.cardHolderInput }}
                className={classes.expiryMonthBox}
                value={expiryMonth}
                placeholder="MM"
                onChange={handleChage}
              />
              <Typography className={classes.slash}>/</Typography>
              <InputBase
                name="YY"
                classes={{ input: classes.cardHolderInput }}
                className={classes.expiryYearBox}
                value={expiryYear}
                placeholder="YY"
                onChange={handleChage}
              />
              <InputBase
                name="CVV"
                classes={{ input: classes.cardHolderInput }}
                className={classes.cvvBox}
                value={CVV}
                placeholder="CVV"
                onChange={handleChage}
              />
              <InputBase
                name="ZipCode"
                classes={{ input: classes.cardHolderInput }}
                className={classes.zipCodeBox}
                value={zipCode}
                placeholder="ZipCode"
                onChange={handleChage}
              />
            </div>
          </div>
        </CardContent>
        {!isPaid && (
          <>
            <CustomPrimaryButton
              type="submit"
              isLarge={!matches}
              fullWidth
              onClick={() => chargeCreditCard()}
              disabled={!isFilled}
            >
              <Typography>
                {`Charge ${formatMoneyAmount(amount)}.00 to card`}
              </Typography>
            </CustomPrimaryButton>
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
};

export default CheckoutForm;
