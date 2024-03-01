import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  listOfVehiclesSelector,
  prospectData,
  isMobileSelector,
  salePoints,
  priceListSelector,
} from 'src/redux/selectors';

import { withStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

import { Vehicle as VehicleRoute, Location, Prospect } from 'src/api';
import { getCookie, getCookieJSON, setCookie } from 'src/utils/cookie';
import Link from 'next/link';

import NoVehicleIm from 'src/assets/noVehicle.png';
import Layout from 'components/shared/Layout';
import DamageMap from 'components/vehicle/DamageMap';
import MainInfo from 'components/vehicle/MainInfo';
import Payment from 'components/vehicle/Payment';
import Delivery from 'components/vehicle/Delivery';
import SimilarVehicles from 'components/vehicle/SimilarVehicles';
import Footer from 'components/vehicle/Footer';
import ProspectDialog from 'components/vehicle/ProspectDialog';
import ThankyouDialog from 'components/shared/ThankyouDialog';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import LocationModal from 'components/finance/RideShare/LocationModal';
import MainVehicleTabs from 'components/vehicle/MainVehicleTabs';
import VehicleDetailsTab from 'components/vehicle/MainTabs/VehicleDetailsTab';
import UseTextTab from 'components/vehicle/MainTabs/UseTextTab';
import SeoHeader from '@/components/seoSection';

const ADDITIONAL_INFO = 'Additional Info';

const styles = theme => ({
  vehiclePageContainer: {
    background: theme.palette.common.white,
  },
  noVehiclePageContainer: {
    background: theme.palette.common.white,
    width: '80%',
    margin: 'auto',
    fontFamily: 'Campton SemiBold',
  },
  noVehileText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    height: '100%',
    textAlign: 'center',
    padding: '50px 25px',
    margin: 'auto',
  },
  noVehileTextElab: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    padding: '50px 25px',
  },
  noVehicleImg: {
    width: '50%',
    margin: 'auto',
  },
  searchBtn: {
    fontFamily: 'Campton SemiBold',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  searchBtnParent: {
    margin: 'auto',
    marginBottom: 10,
    color: 'black',
  },
  textNoVehicle: {
    color: '#3c3b3b',
    fontSize: '24pt',
    fontWeight: 600,
  },
});

const Vehicle = props => {
  const [state, setState] = useState({
    vehicleInformation: null,
    vehicleId: null,
    error: null,
    showErrorBar: false,
    similarVehicles: [],
    showProspectForm: false,
    requestType: ADDITIONAL_INFO,
    prospectFormValues: {
      firstName: '',
      lastName: '',
      email: '',
      cellPhone: '',
      notes: '',
    },
    isGalleryOpen: false,
    savings: null,
  });
  const [location, setLocation] = useState();
  const [availablePoinst, setPoints] = useState();
  const [seoTags, setSeoTags] = useState();
  const [pointsCount, setCount] = useState(1);
  const [pickupDate, setPickupDate] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenThanks, setThanks] = useState(false);
  const [isVehicle, setIsVehicle] = useState(true);
  const [tab, setActiveTab] = React.useState(0);
  const [lifeStyleDesc, setLifeStyle] = React.useState({
    meta: '',
    desc: '',
  });
  const [RDSDesc, setRDSDesc] = React.useState({
    meta: '',
    desc: '',
  });
  const myRef = useRef();

  const handleTab = (event, activeTab) => {
    setActiveTab(activeTab);
  };

  const getSimilarVehicles = () => {
    const {
      vehicleInformation: {
        // https://github.com/eslint/eslint/issues/9259
        // eslint-disable-next-line
        carBody,
        mileage,
        fuelType,
        listPrice,
        carYear,
      },
      vehicleId,
    } = state;

    const filteredList = props.listOfVehicles.filter(
      vehicle =>
        vehicle.stockid !== vehicleId &&
        vehicle.carBody === carBody &&
        vehicle.fuelType === fuelType &&
        vehicle.carYear >= carYear - 1 &&
        vehicle.carYear <= carYear + 1 &&
        +vehicle.listPrice >= +listPrice - 5000 &&
        +vehicle.listPrice <= +listPrice + 5000 &&
        vehicle.mileage >= +mileage - 5000 &&
        vehicle.mileage <= +mileage + 5000
    );

    const amountOfVehicles = filteredList.length;
    const randomIndexes = [];

    const getRandomIndex = () => {
      const index = Math.floor(Math.random() * Math.floor(amountOfVehicles));
      if (randomIndexes.includes(index)) {
        getRandomIndex();
      } else randomIndexes.push(index);
    };

    if (amountOfVehicles > 6) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 6; i++) {
        getRandomIndex();
      }
    }

    setState({
      ...state,
      similarVehicles:
        amountOfVehicles > 6
          ? randomIndexes.map(index => filteredList[index])
          : filteredList,
    });
  };

  const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

  const getVehicleData = async id => {
    let response;
    const prospect = getCookie('prospectId');
    try {
      response = await VehicleRoute.getVehicleById(id, prospect);
      const { vehicle } = response.data;
      setSeoTags(vehicle?.seoTags);
      const { make, model } = vehicle;
      setIsVehicle(true);

      const defaultPersonalText = `Whether you're a solo-driver, a couple,
      or driving as a small group, the ${make} ${model} might very much be
      your perfect accompaniment for your light to moderate driving needs.
      Conquer local commutes, errands, grocery-runs, or whatever suits your
      schedule or commuting needs.`;
      const defaultRDSText =
        'This Vehicle does not qualify for any Rideshare Platforms';

      // NOTE: Geting the lifestyle info from CMS
      if (vehicle.lifeStyleCategory) {
        const lifeStyleCat = vehicle.lifeStyleCategory.split(',');
        const getLifeStyle = await VehicleRoute.getLifeStyleDescription(
          lifeStyleCat[0]
        );
        const lifeStyleArr = getLifeStyle.data.map(meta =>
          meta.description.replace('[model]', `${make} ${model}`)
        );
        const lifeStyleMeta = lifeStyleArr.join(' ');
        const lifeStyleText = lifeStyleArr[getRandomInt(lifeStyleArr.length)];
        setLifeStyle({
          meta: lifeStyleMeta,
          desc: lifeStyleText,
        });
      } else {
        setLifeStyle({
          meta: defaultPersonalText,
          desc: defaultPersonalText,
        });
      }

      // NOTE: Geting the RDS info from CMS
      if (vehicle.rideShareCategory) {
        const getRDS = await VehicleRoute.getRDSDescription(
          vehicle.rideShareCategory
        );
        const RDSText = getRDS.data.replace('[model]', `${make} ${model}`);
        setRDSDesc({
          meta: RDSText,
          desc: RDSText,
        });
      } else {
        setRDSDesc({
          meta: defaultRDSText,
          desc: defaultRDSText,
        });
      }

      setState({
        ...state,
        vehicleId: id,
        vehicleInformation: {
          ...vehicle,
          chromeFeatures: response.data.chromeFeatures,
        },
        error: null,
        showErrorBar: false,
        savings: response.data.savings,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.response.data.message,
        showErrorBar: true,
        vehicleInformation: null,
        vehicleId: null,
      });
      setIsVehicle(false);
    }
  };

  const getDeliveryData = async (ipInfo, stockid) => {
    try {
      const lat = ipInfo.latitude;
      const lon = ipInfo.longitude;
      const { closestPickuplocation } = await Location.GetClosestLocation(
        lat,
        lon,
        'Sales'
      );
      const { customerPickuplocations } = await Location.GetAllLocations(
        'Sales'
      );
      setLocation(closestPickuplocation);
      if (props.pickupPoints.length > 0) {
        setCount(props.pickupPoints.length);
        setPoints(props.pickupPoints);
      } else {
        setCount(customerPickuplocations.length);
        setPoints(customerPickuplocations);
      }
      const dDate = await Location.CalculatePickupDate(
        closestPickuplocation.locationName,
        stockid
      );
      setPickupDate(dDate.customerPickupDate);
      const pickupInfo = {
        locationName: closestPickuplocation.locationName,
        date: dDate.customerPickupDate,
      };
      setCookie('pickupInfo', pickupInfo);
    } catch (error) {
      setState({
        ...state,
        error: error.message,
        showErrorBar: true,
        vehicleInformation: null,
        vehicleId: null,
      });
    }
  };

  useEffect(() => {
    const {
      router: { query },
    } = props;
    let ipInfo = getCookieJSON('ipInfo');
    if (query.id) {
      getVehicleData(+query.id);
      window.scrollTo(0, 0);

      if (props.prospect.closestSalesPoint) {
        const { prospect } = props;
        (async () => {
          const cookiePickupInfo = getCookieJSON('pickupInfo');
          if (cookiePickupInfo && props.pickupPoints) {
            const loc = props.pickupPoints.find(
              el => el.locationName === cookiePickupInfo.locationName
            );
            setLocation(loc);
            setPickupDate(cookiePickupInfo.date);
            setCount(props.pickupPoints.length);
            setPoints(props.pickupPoints);
          } else {
            setLocation(prospect.closestSalesPoint);
            if (props.pickupPoints) {
              setCount(props.pickupPoints.length);
            }
            try {
              const dDate = await Location.CalculatePickupDate(
                prospect.closestSalesPoint.locationName,
                +query.id
              );
              setPickupDate(dDate.customerPickupDate);
              const pickupInfo = {
                locationName: prospect.closestSalesPoint.locationName,
                date: dDate.customerPickupDate,
              };
              setCookie('pickupInfo', pickupInfo);
            } catch (error) {
              setState({
                ...state,
                error: error.message,
                showErrorBar: true,
                vehicleInformation: null,
                vehicleId: null,
              });
            }
          }
        })();
      }
      if (!ipInfo && !props.prospect.closestSalesPoint) {
        (async () => {
          try {
            ipInfo = await Prospect.GetIpInfo();
            setCookie('ipInfo', ipInfo);
            await getDeliveryData(ipInfo, +query.id);
          } catch (error) {
            setState({
              ...state,
              error: error.message,
              showErrorBar: true,
              vehicleInformation: null,
              vehicleId: null,
            });
          }
        })();
      }
      if (ipInfo && !props.prospect.closestSalesPoint) {
        getDeliveryData(ipInfo, +query.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { vehicleInformation, vehicleId } = state;
    if (vehicleInformation && vehicleId) {
      getSimilarVehicles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.vehicleInformation, state.vehicleId]);

  useEffect(() => {
    const {
      router: { query },
      prospect,
    } = props;

    if (query.id) {
      getVehicleData(+query.id);
    }

    if (prospect.firstName) {
      setState({
        ...state,
        prospectFormValues: {
          ...state.prospectFormValues,
          firstName: props.prospect.firstName,
          lastName: props.prospect.lastName,
          email: props.prospect.email,
          cellPhone: props.prospect.contactNumber,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.router.query.id, props.prospect.firstName]);

  const closeErrorBar = () => {
    setState({ ...state, showErrorBar: false, error: null });
  };

  const handleOpenThanksDialog = requestType => {
    let paramData = '';
    if (requestType === 'Additional Info') {
      paramData = 'more-info';
    } else if (requestType === 'CarFax request') {
      paramData = 'carfax-report';
    }
    const { router } = props;
    router.push({
      pathname: '/confirmation',
      query: paramData,
    });
  };
  const handleHideThanksDialog = () => setThanks(false);

  const handleOpenProspectForm = type =>
    setState({ ...state, showProspectForm: true, requestType: type });

  const handleCloseProspectForm = () => {
    setState({ ...state, showProspectForm: false });
  };

  const handleShowProspectError = errorMessage =>
    setState({
      ...state,
      error: errorMessage,
      showErrorBar: true,
    });

  const handleOpenGallery = () => setState({ ...state, isGalleryOpen: true });

  const handleCloseGallery = () => setState({ ...state, isGalleryOpen: false });

  const {
    vehicleInformation,
    showErrorBar,
    error,
    similarVehicles,
    showProspectForm,
    prospectFormValues,
    requestType,
    isGalleryOpen,
    savings,
  } = state;

  const { classes, isMobile } = props;

  const handleGoToPayment = () =>
    myRef.current.scrollIntoView({
      block: isMobile ? 'start' : 'end',
      behavior: 'smooth',
    });

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);
  const handlePickLocation = async value => {
    const dDate = await Location.CalculatePickupDate(
      value.locationName,
      +state.vehicleId
    );
    setLocation(value);
    setPickupDate(dDate.customerPickupDate);
    const pickupInfo = {
      locationName: value.locationName,
      date: dDate.customerPickupDate,
    };
    setCookie('pickupInfo', pickupInfo);
    handleCloseModal();
  };

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {};
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <SeoHeader
        id="vehicle-seo"
        h1Tag={seoTags?.h1}
        h2Tag={seoTags?.h2}
        h3Tag={seoTags?.h3}
      />
      {!isVehicle ? (
        <Grid
          container
          alignItems="flex-start"
          direction="column"
          wrap="nowrap"
          className={classes.noVehiclePageContainer}
        >
          <div className={classes.noVehileText}>
            <Typography variant="h4" className={classes.textNoVehicle}>
              Oops, the vehicle you are requesting is no longer in our inventory
            </Typography>
          </div>
          <div className={classes.noVehicleImg}>
            <img src={NoVehicleIm} width="100%" alt="No vehicle" />
          </div>
          <div className={classes.noVehileTextElab}>
            <Typography variant="h4" className={classes.textNoVehicle}>
              No worries, we have access to an extensive inventory of vehicles
              across the continental USA and we LOVE finding our customers their
              dream car! Give it another try here:
            </Typography>
          </div>
          <div className={classes.searchBtnParent}>
            <Link href="/search-cars">
              <Typography variant="h4" className={classes.searchBtn}>
                SEARCH CAR
              </Typography>
            </Link>
          </div>
        </Grid>
      ) : (
        <Grid
          container
          alignItems="flex-start"
          direction="column"
          wrap="nowrap"
          className={classes.vehiclePageContainer}
        >
          {vehicleInformation && (
            <>
              <DamageMap
                vehicleInformation={vehicleInformation}
                isGalleryOpen={isGalleryOpen}
                isMobile={isMobile}
                handleOpenGallery={handleOpenGallery}
                handleCloseGallery={handleCloseGallery}
                handleOpenProspectForm={() =>
                  handleOpenProspectForm(ADDITIONAL_INFO)
                }
                handleGoToPayment={handleGoToPayment}
              />
              <MainInfo
                vehicleInformation={vehicleInformation}
                handleOpenProspectForm={() =>
                  handleOpenProspectForm(ADDITIONAL_INFO)
                }
              />
              <MainVehicleTabs tab={tab} handleChangeTab={handleTab} />
              {tab === 0 && (
                <VehicleDetailsTab vehicleInformation={vehicleInformation} />
              )}
              {tab === 1 && (
                <UseTextTab title="Personal use details" text={lifeStyleDesc} />
              )}
              {tab === 2 && (
                <UseTextTab title="Rideshare use details" text={RDSDesc} />
              )}
            </>
          )}
          {/* Note: Uncomment when we need to handle carfax block */}
          {/* <VehicleHistory
            handleOpenProspectForm={() =>
              handleOpenProspectForm(CARFAX_REQUEST)}
          /> */}
          {vehicleInformation && (
            <div style={{ width: 'inherit' }} ref={myRef}>
              <Payment
                deposit={props.prices.retailDeposit}
                savings={savings}
                prospect={props.prospect}
                vehicle={vehicleInformation}
              />
            </div>
          )}
          {location && pointsCount && pickupDate && (
            <Delivery
              handleOpenModal={handleOpenModal}
              location={location}
              pointsCount={pointsCount}
              pickupDate={pickupDate}
              pickupPoints={availablePoinst}
            />
          )}
          {similarVehicles.length > 0 && (
            <SimilarVehicles similarVehicles={similarVehicles} />
          )}
          <Footer />
        </Grid>
      )}
      <ErrorSnackbar
        showErrorBar={showErrorBar}
        error={error}
        closeErrorBar={closeErrorBar}
      />
      <ProspectDialog
        handleShowError={handleShowProspectError}
        handleCloseProspectForm={handleCloseProspectForm}
        handleOpenThanksDialog={() => handleOpenThanksDialog(requestType)}
        isOpen={showProspectForm}
        prospectFormValues={prospectFormValues}
        requestType={requestType}
        vehicleInformation={vehicleInformation}
      />
      <ThankyouDialog
        open={isOpenThanks}
        handleClose={handleHideThanksDialog}
      />
      {availablePoinst && (
        <LocationModal
          open={isOpenModal}
          pickupPoints={availablePoinst}
          handleClose={handleCloseModal}
          handlePickLocation={handlePickLocation}
        />
      )}
    </Layout>
  );
};

const mapStateToProps = createStructuredSelector({
  listOfVehicles: listOfVehiclesSelector,
  prospect: prospectData,
  isMobile: isMobileSelector,
  pickupPoints: salePoints,
  prices: priceListSelector,
});

Vehicle.propTypes = {
  listOfVehicles: PropTypes.array.isRequired,
  prospect: PropTypes.object.isRequired,
  isMobile: PropTypes.bool,
  pickupPoints: PropTypes.array.isRequired,
  prices: PropTypes.object.isRequired,
};

Vehicle.defaultProps = {
  isMobile: false,
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles, { withTheme: true }),
  withRouter
)(Vehicle);
