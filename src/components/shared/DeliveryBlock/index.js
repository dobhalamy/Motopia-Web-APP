/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import PlacesAutocomplete, {
  geocodeByPlaceId,
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';

import { getCookieJSON, setCookie } from 'src/utils/cookie';
import WithAddressIcon from 'assets/vehicle/withAddress.svg';
import AddressPinIcon from 'assets/vehicle/addressPin.svg';
import { Delivery, RideShare } from 'src/api';

import CustomInput from 'components/shared/CustomInput';
import { BORDER_COLOR } from 'src/constants';
import { getDistanceFromLatLonInMiles } from 'src/utils/math';
import { VEHICLE_PAGE_WIDTH } from '../../vehicle/constants';
import { stateListSelector } from '../../../redux/selectors';

const NO_DELIVERY =
  'Unfortunately your location is out of our delivery zone. Please consider Pick-Up instead.';

const useStyles = makeStyles(theme => ({
  dealerWrapper: {
    padding: theme.spacing(2),
  },
  dealerContainer: {
    maxWidth: VEHICLE_PAGE_WIDTH,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(5),
    },
  },
  dealerTitle: {
    fontSize: theme.typography.pxToRem(28),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  dealerInfoContainer: {
    border: '1px solid rgba(45, 55, 69, 0.2)',
    height: 190,
    borderRadius: 5,
    padding: `${theme.spacing(3.75)}px ${theme.spacing(6.25)}px`,
    [theme.breakpoints.down('md')]: {
      padding: `${theme.spacing(3.75)}px ${theme.spacing(4.25)}px`,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      height: 270,
      maxWidth: 380,
      flexWrap: 'wrap',
    },
  },
  dealerPhoneNumber: {
    fontSize: theme.typography.pxToRem(28),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(22),
    },
  },
  icon: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  addressIcon: {
    width: 295,
    height: 85,
    backgroundImage: `url(${WithAddressIcon})`,
    position: 'relative',
    [theme.breakpoints.only('sm')]: {
      marginLeft: theme.spacing(2),
    },
  },
  pinIcon: {
    width: 24,
    height: 35,
    backgroundImage: `url(${AddressPinIcon})`,
    position: 'absolute',
    top: 20,
    left: 28,
  },
  textBold: {
    fontWeight: 600,
  },
  suggestionActive: {
    color: theme.palette.common.white,
    background: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  suggestionInactive: {
    background: theme.palette.common.white,
  },
  googleSuggestionListContainer: {
    position: 'absolute',
    background: theme.palette.common.white,
    zIndex: 1000,
    maxWidth: 900,
    border: `2px solid ${BORDER_COLOR}`,
    borderRadius: 5,
    padding: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      maxWidth: 600,
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 330,
    },
  },
}));

const DeliveryBlock = props => {
  const [state, setState] = useState({
    address: '',
  });
  const [showEdit, setEdit] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const isDelivery = true;
  const [allPointsGeoLoc, setAllPoints] = useState([]);
  const [displayAddressText, setAddressText] = useState('Address');
  const statesList = useSelector(stateListSelector);

  const classes = useStyles();
  const {
    pickupDate,
    pickupPoints,
    vehicleId,
    flowType,
    setDeliveryData,
  } = props;
  const handleAddressAutocompleteData = (data, formik) => {
    const { city, homeZip, address } = data;
    const fullAddress = `${address}, ${city}, ${data.state} ${homeZip}`;
    const cookieAddress = {
      homeZip,
      address,
      city,
      state: data.state,
    };
    formik.setFieldValue('address', fullAddress);
    setState({ ...state, address: fullAddress });
    setCookie('deliveryAddress', cookieAddress);
    setEdit(false);
  };

  const checkDilveryAvailability = async (points, deliveryState) => {
    const {
      data: { deliveryMiles, deliveryDays, deliveryFee },
    } = await Delivery.getDelivery();
    const isInnerRadius = points.some(distance => distance <= deliveryMiles);
    const [userDeliveryZone] = await RideShare.getZonesByState(
      deliveryState,
      statesList
    );
    const params = {
      ServiceType: flowType,
      StockId: vehicleId,
      CustomerDeliveryZONE: userDeliveryZone,
    };
    const externalDelivery = await Delivery.getExternalDeliveryFee(params);
    const baseDate = new Date(
      isInnerRadius ? pickupDate : externalDelivery.deliveryDate
    );
    const fee = isInnerRadius ? deliveryFee : externalDelivery.deliveryFee;
    baseDate.setDate(baseDate.getDate() + deliveryDays);
    const isSunday = baseDate.getDay() === 0;
    if (isSunday) {
      baseDate.setDate(baseDate.getDate() + 1);
    }
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const estimatedDeliveryDate = baseDate
      .toLocaleString('en-US', dateOptions)
      .toUpperCase();
    setDeliveryDate(estimatedDeliveryDate);
    setDeliveryData({ fee, days: deliveryDays });
  };

  const getAddressLatLng = async addressString => {
    const locationGeoCode = await geocodeByAddress(addressString);
    const latLng = await getLatLng(locationGeoCode[0]);
    setCookie('pickUpCord', latLng);
    return latLng;
  };

  const calculateDelivery = useCallback(async () => {
    const jsonAddress =
      getCookieJSON('deliveryAddress') || getCookieJSON('address');
    const ipInfo = getCookieJSON('ipInfo');
    let deliveryState;
    const pointsLocArray = [];
    const pointsDistance = await Promise.all(
      pickupPoints.map(async point => {
        const pointAddress = `${point.address}, ${point.city}, ${point.state}`;
        const pointLatLng = await getAddressLatLng(pointAddress);
        pointsLocArray.push(pointLatLng);
        if (jsonAddress) {
          // eslint-disable-next-line max-len
          const cookieAddress = `${jsonAddress.address}, ${jsonAddress.city}, ${jsonAddress.state} ${jsonAddress.homeZip}`;
          deliveryState = jsonAddress.state;
          setState({ ...state, address: cookieAddress });
          const currentLatLng = await getAddressLatLng(cookieAddress);
          const distance = getDistanceFromLatLonInMiles(
            pointLatLng.lat,
            pointLatLng.lng,
            currentLatLng.lat,
            currentLatLng.lng
          );
          return distance;
        } else {
          const { latitude, longitude } = ipInfo;
          setState({ ...state, address: ipInfo.zipcode });
          setAddressText('Zip');
          const distance = getDistanceFromLatLonInMiles(
            pointLatLng.lat,
            pointLatLng.lng,
            parseFloat(latitude),
            parseFloat(longitude)
          );
          return distance;
        }
      })
    );
    setAllPoints(pointsLocArray);
    checkDilveryAvailability(pointsDistance, deliveryState);
  }, [pickupPoints]);

  useEffect(() => {
    if (pickupPoints) {
      calculateDelivery();
    }
  }, []);

  const handleSelect = async (addressValue, placeId, formik) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );
    const placeGeoCode = await geocodeByPlaceId(placeId);
    const latLng = await getLatLng(placeGeoCode[0]);
    const pointsDistance = allPointsGeoLoc.map(point =>
      getDistanceFromLatLonInMiles(latLng.lat, latLng.lng, point.lat, point.lng)
    );

    function detailsCallback(place, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const retrieveAddressDetails = place.address_components.reduce(
          (prevDetails, detail) => {
            if (detail.types.includes('administrative_area_level_1')) {
              return { ...prevDetails, state: detail.short_name };
            }
            if (
              detail.types.includes('locality') ||
              detail.types.includes('sublocality')
            ) {
              return { ...prevDetails, city: detail.long_name };
            }
            if (detail.types.includes('postal_code')) {
              return { ...prevDetails, homeZip: detail.long_name };
            }
            return prevDetails;
          },
          {}
        );

        handleAddressAutocompleteData(
          { ...retrieveAddressDetails, address: place.name },
          formik
        );
        checkDilveryAvailability(pointsDistance, retrieveAddressDetails.state);
      }
    }
    service.getDetails({ placeId }, detailsCallback);
  };

  const handleChangeFormik = (addressData, formik) => {
    setState({ ...state, address: addressData });
    setAddressText('Address');
    formik.setFieldValue('address', addressData, true);
  };

  return (
    <>
      <Grid item xs={12} container alignItems="center">
        <Typography style={{ width: '100%' }}>
          Delivery {displayAddressText}:{' '}
          {!showEdit ? (
            <>
              <Typography
                component="span"
                color="secondary"
                className={classes.textBold}
              >
                {state.address}
              </Typography>
              <Typography
                component="span"
                color="error"
                style={{ cursor: 'pointer' }}
                onClick={() => setEdit(!showEdit)}
                className={classes.textBold}
              >
                {' '}
                (CHANGE)
              </Typography>
            </>
          ) : (
            <Formik
              initialValues={{ ...state }}
              render={formik => (
                <Box
                  style={{ display: 'inline-block', height: 25, width: '50%' }}
                >
                  <PlacesAutocomplete
                    value={state.address}
                    onChange={data => handleChangeFormik(data, formik)}
                    onSelect={(addressValue, placeId) =>
                      handleSelect(addressValue, placeId, formik)
                    }
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <>
                        <CustomInput
                          fullWidth
                          name="address"
                          color="primary"
                          onChange={data => handleChangeFormik(data, formik)}
                          value={state.address}
                          variant="standard"
                          height={25}
                          placeholder="enter your address..."
                          {...getInputProps()}
                        />
                        {suggestions.length > 0 && (
                          <Grid
                            container
                            direction="column"
                            className={classes.googleSuggestionListContainer}
                          >
                            {loading ? <div>...loading</div> : null}
                            {suggestions.map(suggestion => {
                              const className = suggestion.active
                                ? classes.suggestionActive
                                : classes.suggestionInactive;
                              return (
                                <div
                                  key={`index-${suggestion.id}`}
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                  })}
                                >
                                  {suggestion.description}
                                </div>
                              );
                            })}
                          </Grid>
                        )}
                      </>
                    )}
                  </PlacesAutocomplete>
                </Box>
              )}
            />
          )}
        </Typography>
      </Grid>
      <Grid item xs={12} container alignItems="center">
        <Typography>
          Estimated Delivery Date:{' '}
          <Typography
            component="span"
            color="secondary"
            className={classes.textBold}
          >
            {isDelivery ? deliveryDate : NO_DELIVERY}
          </Typography>
        </Typography>
      </Grid>
    </>
  );
};

DeliveryBlock.defaultProps = {
  setDeliveryData: () => {},
};

DeliveryBlock.propTypes = {
  pickupDate: PropTypes.string.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  vehicleId: PropTypes.string.isRequired,
  flowType: PropTypes.string.isRequired,
  setDeliveryData: PropTypes.func,
};

export default DeliveryBlock;
