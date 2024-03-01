/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Link from 'next/link';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getDistanceFromLatLonInMiles } from 'src/utils/math';
import Typography from '@material-ui/core/Typography';
import Footer from 'components/vehicle/Footer';
import Layout from 'components/shared/Layout';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import LocationModal from 'components/finance/RideShare/LocationModal';
import CustomInput from 'components/shared/CustomInput';
import CustomSelect from 'components/shared/CustomSelect';
import { SELECT_OPTIONS_USA_STATES } from 'src/constants';
import { Vehicle, Location, Delivery, RideShare } from 'src/api';
import CopyIcon from 'assets/copy.png';
import getStateByZip from 'src/utils/getStateByZip';
import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
// eslint-disable-next-line max-len
import stockVerificationValidationSchema from '../../src/components/shared/stockVerificationValidationSchema';
import AddressAutocomplete from '../../src/components/finance/UserForm/AddressAutocomplete';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const useStyles = makeStyles(theme => ({
  heroContentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    margin: '20px auto',
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0
    },
    color: '#000'
  },
  mainTitle: {
    backgroundColor: '#001B5D',
    color: '#F5F5F5',
    width: '100%',
    minHeight: 80,
    margin: 'auto',
    padding: 12,
    fontWeight: 100,
    letterSpacing: 3
  },
  verificationForm: {
    margin: 20
  },
  sectionHeader: {
    width: '100%',
    padding: '10px 0'
  },
  mainHeader: {
    width: '100%',
    padding: 10
  },
  customGrid: {
    display: 'flex',
    margin: '20px 0',
    border: '2px solid transparent',
    borderRadius: 8,
    padding: 14,
    boxShadow: '0 4px 8px 0 rgb(0 0 0 / 20%)',
    flexDirection: 'column'

  },
  headerFirst: {
    display: 'flex',
    marginLeft: 3
  },
  customTypo: {
    maxWidth: '5%',
    flexBasis: '5%',
  },
  customTyp: {
    maxWidth: '5%',
    flexBasis: '5%',
    margin: '12% 10%',
    paddingBottom: 20,
    [theme.breakpoints.up('lg')]: {
      margin: '2% 10%'
    },
  },
  carCon: {
    display: 'flex'
  },
  carContainer: {
    margin: 15
  },
  text: {
    margin: '0 15px'
  },
  noVehicle: {
    color: 'red'
  },
  noPad: {
    padding: '0 !important'
  },
  icon: {
    width: 25,
    verticalAlign: 'middle',
    padding: 1,
    cursor: 'pointer',
    height: 25
  },
  imgBtn: {
    padding: '0px !important'
  },
  addressBox: {
    paddingLeft: 10
  }
}));
const NO_DELIVERY =
  'Unfortunately your location is out of our delivery zone. Please consider Pick-Up instead.';
const Stockverify = () => {
  const classes = useStyles();
  const [stockId, setStockId] = useState('');
  const defState = {
    stockId: '',
    vin: '',
    address: '',
    homeZip: '',
    city: '',
    state: ''
  };
  const [zip, setZip] = useState('');
  const [vehicle, setVehicle] = useState({
    carYear: '',
    make: '',
    model: '',
    availabilityStatus: '',
    purchaseDate: ''
  });
  const [isVehicle, setIsVehicle] = useState(false);
  const [isCopied1, setIsCopied1] = useState(false);
  const [isCopied2, setIsCopied2] = useState(false);
  const [isCopied3, setIsCopied3] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [location, setLocation] = useState();
  const [vehicleLink, setVehicleLink] = useState('');
  const [pointsCount, setCount] = useState(1);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const deliveryAvailable = true;
  const [deliveryMile, setDeliveryMile] = useState(0);
  const [deliveryDay, setDeliveryDay] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const theme = useTheme();
  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);
  const matches = useMediaQuery(theme.breakpoints.only('xs'));

  const gridSpacing = matches ? 1 : 3;

  React.useEffect(() => {
    (async () => {
      try {
        const { customerPickuplocations } = await Location.GetAllLocations('Sales');
        setCount(customerPickuplocations.length);
        setPickupPoints(customerPickuplocations);
        const { data } = await Delivery.getDelivery();
        const { deliveryMiles, deliveryDays } = data;
        setDeliveryMile(deliveryMiles);
        setDeliveryDay(deliveryDays);
        setDeliveryFee(data.deliveryFee);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  React.useEffect(() => {
    setVehicleLink(`https://www.gomotopia.com/vehicle/?id=${stockId}`);
  }, [stockId]);

  const getAddressLatLng = async addressString => {
    const locationGeoCode = await geocodeByAddress(addressString);
    const latLng = await getLatLng(locationGeoCode[0]);
    return latLng;
  };

  const handlePickLocation = async value => {
    const dDate = await Location.CalculatePickupDate(
      value.locationName,
      stockId
    );
    setLocation(value.locationName);
    setPickupDate(dDate.customerPickupDate);
    handleCloseModal();
    return dDate.customerPickupDate;
  };
  const handleTransfer = async (val) => {
    const { address, city, homeZip } = val;
    const state = val.state ?? getStateByZip(homeZip).stateAbbr;
    setZip(homeZip);
    let userLocation;
    if (address) {
      const userAddress = `${address}, ${city}, ${state}`;
      userLocation = await getAddressLatLng(userAddress);
    } else {
      userLocation = await getAddressLatLng(homeZip);
    }
    // eslint-disable-next-line max-len
    const { closestPickuplocation } = await Location.GetClosestLocation(userLocation.lat, userLocation.lng, 'Sales');
    const pickDate = await handlePickLocation(closestPickuplocation);
    // eslint-disable-next-line max-len
    const pickupAddress = `${closestPickuplocation.address}, ${closestPickuplocation.city}, ${closestPickuplocation.state}`;
    const closestPickupLocationCord = await getAddressLatLng(pickupAddress);
    const distance = getDistanceFromLatLonInMiles(
      userLocation.lat,
      userLocation.lng,
      closestPickupLocationCord.lat,
      closestPickupLocationCord.lng
    );
    const isInnerRadius = distance <= deliveryMile;
    const stateList = await RideShare.getAllStates();
    const [userDeliveryZone] = await RideShare.getZonesByState(state, stateList);
    const params = {
      ServiceType: 'Sales',
      StockId: stockId,
      CustomerDeliveryZONE: userDeliveryZone,
    };
    const externalDelivery = await Delivery.getExternalDeliveryFee(params);
    const baseDate = new Date(isInnerRadius ? pickDate : externalDelivery.deliveryDate);
    baseDate.setDate(baseDate.getDate() + deliveryDay);
    const isSunday = baseDate.getDay() === 0;
    if (isSunday) {
      baseDate.setDate(baseDate.getDate() + 1);
    }
    const estimatedDeliveryDate = baseDate.toLocaleString('en-US', dateOptions);
    setDeliveryDate(estimatedDeliveryDate);
    const { data } = await Delivery.getDelivery();
    setDeliveryFee(isInnerRadius ? data.deliveryFee : externalDelivery.deliveryFee);
  };

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {};
  const handleStock = async (info, formik, isStock) => {
    const vehicleNum = info;
    if (isStock) {
      formik.setFieldValue('stockId', info);
      setStockId(info);
    } else {
      formik.setFieldValue('vin', info);
    }
    formik.setFieldValue('city', '');
    formik.setFieldValue('state', '');
    formik.setFieldValue('homeZip', '');
    formik.setFieldValue('address', '');
    try {
      if (!formik.errors.stockId) {
        const infoData = {
          vehicleNum, isStock
        };
        const { data } = await Vehicle.getInfoByStockIdOrVin(infoData);
        if (data != null) {
          const { carYear, make, model, availabilityStatus } = data;
          setStockId(data.stockid);
          const newDate = new Date(data.purchaseDate);
          const purchaseDate = new Date(newDate.getTime() + newDate.getTimezoneOffset() * 60000)
            .toLocaleString('en-US', dateOptions).toUpperCase();

          setVehicle({ carYear, make, model, availabilityStatus, purchaseDate });
          setIsVehicle(true);
        } else {
          setIsVehicle(false);
        }
        setShowInfo(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const copyLink = (text, num) => {
    let copyText;
    if (num === 1) {
      copyText = `Pickup Location: ${location} Estimated Pickup Date: ${pickupDate}`;
      setIsCopied1(true);
      setTimeout(() => {
        setIsCopied1(false);
      }, 1000);
    } else if (num === 2) {
      copyText = `Delivery Zip: ${zip} Estimated Delivery Date: ${deliveryDate}`;
      setIsCopied2(true);
      setTimeout(() => {
        setIsCopied2(false);
      }, 1000);
    } else if (num === 3) {
      copyText = text;
      setIsCopied3(true);
      setTimeout(() => {
        setIsCopied3(false);
      }, 1000);
    }
    navigator.clipboard.writeText(copyText);
  };
  const handleAddressAutocompleteData = (data, formik) => {
    formik.setFieldValue('city', data.city || '');
    formik.setFieldValue('state', data.state || '');
    formik.setFieldValue('homeZip', data.homeZip || '');
    formik.setFieldValue('address', data.address || '');
    const formData = {
      city: data.city,
      state: data.state,
      homeZip: data.homeZip,
      address: data.address
    };
    if (data.homeZip && data.homeZip.length === 5) {
      handleTransfer(formData);
    }
  };
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Typography
        variant="h3"
        align="center"
        className={classes.mainTitle}
      >
        STOCK VERIFICATION FORM
      </Typography>
      <Box
        className={classes.heroContentContainer}
      >
        <Typography
          variant="h5"
          align="left"
          className={classes.mainHeader}
        >
          Vehicle Availability and Verification:
        </Typography>
        <Formik
          enableReinitialize
          validationSchema={stockVerificationValidationSchema}
          validateOnBlur
          onSubmit={(values) => handleTransfer(values)}
          initialValues={{ ...defState }}
          render={formik => (
            <Form onSubmit={formik.handleSubmit} className={classes.verificationForm}>
              <Grid
                container
                spacing={gridSpacing}
                className={classes.financeGridMarginBottom}
              >
                <Typography
                  variant="h6"
                  align="left"
                  className={classes.sectionHeader}
                >
                  1. Enter Vehicle to lookup:
                </Typography>
                <Grid item xs={12} md={12} classes={{ root: classes.headerFirst }}>
                  <Grid item xs={12} md={3} classes={{ root: classes.noPad }}>
                    <CustomInput
                      fullWidth
                      label="Stock Id"
                      name="stockId"
                      hasError={!!formik.errors.stockId && formik.touched.stockId}
                      errorMessage={formik.errors.stockId}
                      onBlur={formik.handleBlur}
                      onChange={(event) => handleStock(event.target.value, formik, true)}
                      value={formik.values.stockId}
                    />
                  </Grid>
                  <Grid item xs={3} md={2} classes={{ root: classes.customTypo }}>
                    <Typography
                      variant="h6"
                      align="center"
                      style={{ marginTop: '50%' }}
                    >
                      OR
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3} classes={{ root: classes.noPad }}>
                    <CustomInput
                      fullWidth
                      label="VIN"
                      name="vin"
                      hasError={!!formik.errors.vin && formik.touched.vin}
                      errorMessage={formik.errors.vin}
                      onBlur={formik.handleBlur}
                      onChange={(event) => handleStock(event.target.value, formik, false)}
                      value={formik.values.vin}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {showInfo &&
                <Grid
                  item
                  xs={6}
                  md={12}
                  classes={{ root: classes.noPad }}
                  style={{ color: 'blue' }}
                >
                  {isVehicle ?
                    <>
                      <Typography variant="h6" className={classes.text}>
                        Vehicle Found!
                      </Typography>
                      <Grid item xs={6} md={12} className={classes.carCon}>
                        <Typography variant="h6" className={classes.carContainer}>
                          {vehicle.carYear}
                        </Typography>
                        <Typography variant="h6" className={classes.carContainer}>
                          {vehicle.make}
                        </ Typography>
                        <Typography variant="h6" className={classes.carContainer}>
                          {vehicle.model}
                        </Typography>
                        <Typography variant="h6" className={classes.carContainer}>
                          Availability Status: {vehicle.availabilityStatus}
                        </Typography>
                        <Typography variant="h6" className={classes.carContainer}>
                          Purchase Date: {vehicle.purchaseDate}
                        </Typography>
                      </Grid>
                    </> :
                    <Typography variant="h6" className={classes.noVehicle}>
                      No Vehicle Found!
                    </Typography>}
                </Grid>}
              <Grid
                container
                spacing={gridSpacing}
                className={classes.financeGridMarginBottom}
              >
                <Typography
                  variant="h6"
                  align="left"
                  className={classes.sectionHeader}
                >
                  2. Enter Customer&apos;s Delivery Address:
                </Typography>
                <Grid item xs={6} md={12} style={{ display: 'flex' }}>
                  <Grid item xs={12} md={3}>
                    <CustomInput
                      fullWidth
                      disabled={!stockId}
                      label="Delivery ZIP"
                      name="homeZip"
                      hasError={!!formik.errors.homeZip && formik.touched.homeZip}
                      errorMessage={formik.errors.homeZip}
                      onBlur={formik.handleBlur}
                      onChange={(event) =>
                        handleAddressAutocompleteData({ homeZip: event.target.value }, formik)}
                      value={formik.values.homeZip}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} >
                  <Typography
                    variant="h6"
                    align="center"
                  >
                    OR
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} classes={{ root: classes.carCon }}>
                  <AddressAutocomplete
                    label="ADDRESS"
                    handleAddressData={(data) => handleAddressAutocompleteData(data, formik)}
                    name="address"
                    disabled={!stockId}
                    hasError={!!formik.errors.address && formik.touched.address}
                    errorMessage={formik.errors.address}
                    onBlur={formik.handleBlur}
                    handleChangeAddress={formik.setFieldValue}
                    value={formik.values.address}
                    formik={formik}
                  />
                  <Grid item xs={12} md={3} className={classes.addressBox}>
                    <CustomInput
                      fullWidth
                      label="CITY"
                      name="city"
                      disabled={!stockId}
                      hasError={!!formik.errors.city && formik.touched.city}
                      errorMessage={formik.errors.city}
                      onBlur={formik.handleBlur}
                      onChange={(event) =>
                        handleAddressAutocompleteData({ city: event.target.value }, formik)}
                      value={formik.values.city}
                    />
                  </Grid>
                  <Grid item xs={12} md={1} className={classes.addressBox}>
                    <CustomSelect
                      options={SELECT_OPTIONS_USA_STATES}
                      fullWidth
                      label="STATE"
                      name="state"
                      disabled={!stockId}
                      hasError={!!formik.errors.state && formik.touched.state}
                      errorMessage={formik.errors.state}
                      onBlur={formik.handleBlur}
                      onChange={(event) =>
                        handleAddressAutocompleteData({ state: event.target.value }, formik)}
                      value={formik.values.state}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12} className={classes.customGrid}>
                <Grid item xs={12} md={12} style={{ marginBottom: 12 }}>
                  <Grid item xs={12} container alignItems="center">
                    <Typography>
                      Pickup Location:{' '}
                      <Typography
                        component="span"
                        color="secondary"
                        className={classes.textBold}
                      >
                        {location}
                      </Typography>
                      {pointsCount > 1 && (
                        <Typography
                          component="span"
                          color="error"
                          style={{ cursor: 'pointer' }}
                          onClick={handleOpenModal}
                          className={classes.textBold}
                        >
                          {' '}(CHANGE)
                        </Typography>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container alignItems="center">
                    <Typography style={{ display: 'flex' }}>
                      Estimated Pickup Date:
                      <Typography
                        component="span"
                        color="secondary"
                        className={classes.textBold}
                      >
                        &nbsp;{pickupDate}
                      </Typography>
                      {pickupDate &&
                        <Button
                          classes={{ root: classes.imgBtn }}
                          onClick={() => copyLink(pickupDate, 1)}
                        >
                          <img
                            src={CopyIcon}
                            className={classes.icon}
                            alt="contact icon"
                          />
                        </Button>}
                      {isCopied1 &&
                        <Typography variant="h6" align="center" style={{ color: 'red' }}>
                          Copied!
                        </Typography>}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid item xs={12} container alignItems="center">
                    <Typography>
                      Delivery Zip:{' '}
                      <Typography
                        component="span"
                        color="secondary"
                        className={classes.textBold}
                      >
                        {zip}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container alignItems="center">
                    <Typography style={{ display: 'flex' }}>
                      Estimated Delivery Date:
                      {zip &&
                        <Typography
                          component="span"
                          color="secondary"
                          className={classes.textBold}
                        >
                          &nbsp;{deliveryAvailable ? deliveryDate : NO_DELIVERY}
                        </Typography>}
                      {deliveryAvailable &&
                        <Button
                          classes={{ root: classes.imgBtn }}
                          onClick={() => copyLink(deliveryDate, 2)}
                        >
                          <img
                            src={CopyIcon}
                            className={classes.icon}
                            alt="contact icon"
                          />
                        </Button>}
                      {isCopied2 &&
                        <Typography variant="h6" align="center" style={{ color: 'red' }}>
                          Copied!
                        </Typography>}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container alignItems="center">
                    <Typography style={{ display: 'flex' }}>
                      Delivery Fee:
                      {zip &&
                        <Typography
                          component="span"
                          color="secondary"
                          className={classes.textBold}
                        >
                          &nbsp; {formatMoneyAmount(deliveryFee)}
                        </Typography>}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {showInfo &&
                <>
                  <Grid item xs={12} container alignItems="center">
                    <Typography variant="h6" align="left" className={classes.noPad}>
                      Front End Vehicle Details Page:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} container alignItems="center">
                    <Link href={vehicleLink}>
                      <a target="_blank">
                        <Typography
                          variant="h6"
                          align="left"
                          className={classes.noPad}
                          style={{ color: '#001C5E' }}
                        >
                          {vehicleLink}
                        </Typography>
                      </a>
                    </Link>
                    <Button
                      classes={{ root: classes.imgBtn }}
                      onClick={() => copyLink(vehicleLink, 3)}
                    >
                      <img
                        src={CopyIcon}
                        className={classes.icon}
                        alt="contact icon"
                      />
                    </Button>
                    {isCopied3 &&
                      <Typography variant="h6" align="center" style={{ color: 'red' }}>
                        Copied!
                      </Typography>}
                  </Grid>
                </>}
            </Form>
          )}
        />
        <LocationModal
          open={isOpenModal}
          pickupPoints={pickupPoints}
          handleClose={handleCloseModal}
          handlePickLocation={handlePickLocation}
        />
      </Box>
      <Footer />
    </Layout>
  );
};

export default Stockverify;
