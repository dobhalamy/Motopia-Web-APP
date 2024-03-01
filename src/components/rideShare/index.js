/* eslint-disable max-len */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'next/router';
import Head from 'next/head';
import { words, has } from 'lodash';
import { applyAdsQuery, getCreditIdQueryParams } from '@/utils/commonUtils.js';
import { getCookie } from '@/utils/cookie';

import { getListOfRDSVehicles } from 'src/redux/actions/rdsVehicles';
import { withStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';
import Layout from 'components/shared/Layout';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import HeaderSection from 'components/rideShare/HeaderSection';
import VehicleList from 'components/searchCars/VehicleList';
import GetCarForm from 'components/rideShare/GetCarForm';
import RideShareBlackImage from 'assets/rideshare_camry.png';

import {
  isMobileSelector,
  rdsVehiclesSelector,
  rdsVehiclesErrorSelector,
  prospectData,
  stateListSelector,
} from 'src/redux/selectors';

import { FinancePins, RideShare as RideShareApi } from 'src/api';
import { PRIVATE_PLATE } from 'src/constants';
import SeoHeader from '../seoSection';

const RENTAL_PROCESS_STEPS = [
  { number: '01', text: 'Pick a vehicle' },
  { number: '02', text: 'Give us Driver’s Licence/ Ride-sharing info' },
  {
    number: '03',
    text: 'Get instantly approved & make a refundable initial down payment',
  },
  {
    number: '04',
    text:
      'Pick up your ready to drive vehicle at one of our many delivery locations',
  },
];

const styles = theme => ({
  whitePageContainer: {
    background: theme.palette.common.white,
    width: '100%',
  },
  contentContainer: {
    height: '100%',
    padding: `${theme.spacing(6)}px 0px`,
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(3)}px 0px`,
    },
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(1)}px 0px`,
    },
  },
  heroContentContainer: {
    maxWidth: 1138,
    padding: `${theme.spacing(4.5)}px ${theme.spacing(2)}px ${theme.spacing(
      4
    )}px`,
    margin: 'auto',
  },
  rentalProcessImage: {
    maxWidth: 1138,
    height: '100%',
    width: '100%',
    minHeight: 500,
    backgroundImage: `url(${RideShareBlackImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    [theme.breakpoints.down('sm')]: {
      minHeight: 350,
    },
    [theme.breakpoints.down('xs')]: {
      minHeight: 250,
    },
  },
  rentalProcessImageContainer: {
    order: 2,
    [theme.breakpoints.up('sm')]: {
      order: 3,
    },
  },
  rentalProcessStepsContainer: {
    order: 3,
    [theme.breakpoints.up('sm')]: {
      order: 2,
    },
  },
  iconBox: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      margin: 'auto',
      flexBasis: 'auto',
    },
  },
  playIcon: {
    [theme.breakpoints.down('sm')]: {
      width: 65,
      height: 50,
    },
    [theme.breakpoints.up('sm')]: {
      width: 70,
      height: 55,
    },
  },
});

const RideShare = props => {
  const {
    classes,
    listOfRDSVehicles,
    router,
    randomRdsData,
    rdsHomeSeo,
  } = props;
  const mvr = getCookie('mvr');
  const [state, setState] = useState({
    isSearchCars: false,
    selectedState: '',
    plates: '',
    vehicles: [],
    error: null,
    showErrorbar: false,
    isLoading: true,
    pageLimit: 20,
    carFormOpen: false,
    rdsId: null,
  });
  const [financePins, setPins] = useState();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [randomImage, setRandomImage] = useState({});
  const vehicleListRef = useRef();
  const statesList = useSelector(stateListSelector);
  const { query } = router;
  const adsQuery = applyAdsQuery(query);
  const creditIdQuery = getCreditIdQueryParams(query);

  const loadRdsPageData = useCallback(async () => {
    await props.getListOfRDSVehicles();
    const response = await FinancePins.getFinancePins();
    const pins = response.data.filter(el => el.page === 'ride_share_search');
    setPins([...pins]);
  }, [props]);
  const getRandomRdsImage = async () => {
    try {
      const rdsImageData = await RideShareApi.getRandomRdsContent();
      if (has(rdsImageData, 'data')) {
        setRandomImage(rdsImageData.data[0]);
      }
    } catch (error) {
      console.error();
      setState(pre => ({
        ...pre,
        error: error.message || 'unable to get ride share image data',
        showErrorbar: true,
      }));
    }
  };
  useEffect(() => {
    loadRdsPageData();
    if (randomRdsData === null) {
      getRandomRdsImage();
    } else {
      const [randomImageData] = randomRdsData;
      setRandomImage(randomImageData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomRdsData]);

  const handleScroll = () => {
    vehicleListRef.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (state.vehicles.length > 0) {
      handleScroll();
    }
  }, [state.vehicles]);

  const handleSearchCars = async (selectedState, plates, search = false) => {
    if (search) {
      if (!selectedState || !plates) {
        setState({
          ...state,
          error: 'You must select both paramateres for succesfull search',
          showErrorbar: true,
        });
        return;
      } else {
        setState({
          ...state,
          isSearchCars: true,
          selectedState,
          plates,
          isLoading: true,
          vehicles: [],
        });
      }
    }
    if (!search) {
      router.replace({
        pathname: `/ride-share/${selectedState.toLocaleLowerCase()}/${plates
          .replace(' ', '-')
          .toLocaleLowerCase()}`,
        query: { ...adsQuery, ...creditIdQuery },
      });
      return;
    }

    try {
      const isSeoZones = props.seo && props.seo.zone && props.seo.zone.length;
      const selectedZones = isSeoZones
        ? props.seo.zone
        : await RideShareApi.getZonesByState(selectedState, statesList);
      let vehicles = listOfRDSVehicles.filter(vehicle => {
        if (isSeoZones) {
          const vehicleZones = words(vehicle.zones).filter(v => !Number(v));
          return (
            props.seo.zone.some(z => vehicleZones.includes(z)) &&
            vehicle.rsdInventoryType === plates
          );
        }
        return (
          vehicle.workInState.includes(selectedState) &&
          vehicle.rsdInventoryType === plates
        );
      });
      if (plates === PRIVATE_PLATE) {
        vehicles = listOfRDSVehicles.filter(vehicle => {
          const vehicleZones = words(vehicle.zones).filter(v => !Number(v));
          return (
            vehicleZones.some(z => selectedZones.includes(z)) &&
            vehicle.rsdInventoryType === PRIVATE_PLATE
          );
        });
      }
      if (vehicles.length > 0) {
        setState({
          ...state,
          isSearchCars: true,
          selectedState,
          plates,
          vehicles,
          isLoading: false,
        });
      } else {
        setState({
          ...state,
          isSearchCars: false,
          vehicles,
          isLoading: false,
          error: 'No available vehicles for picked state and plate',
          showErrorbar: true,
        });
      }
    } catch (error) {
      setState({
        ...state,
        error: props.rdsVehiclesError,
        showErrorbar: true,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    if (!statesList.length) {
      return;
    }
    if (listOfRDSVehicles.length === 0) {
      setState({
        ...state,
        isSearchCars: true,
        isLoading: true,
        vehicles: [],
      });
    } else if (router.query.state && listOfRDSVehicles.length > 0) {
      const selectedState = query.state.toLocaleUpperCase();
      const plates = query.plates
        ? query.plates.toLocaleUpperCase().replace('-', ' ')
        : '';
      setState({
        ...state,
        selectedState,
        plates,
      });
      handleSearchCars(selectedState, plates, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, listOfRDSVehicles, statesList]);

  const closeErrorBar = () => {
    setState({ ...state, showErrorbar: false });
  };

  const handleError = error => {
    setState({
      ...state,
      showErrorbar: true,
      error,
    });
  };

  // CAR SEARCH PAGINATION
  const handlePageChange = pageLimit => () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    setState({ ...state, pageLimit: pageLimit <= 20 ? 20 : pageLimit });
  };

  const handleOpenCarForm = rdsId => {
    if (mvr) {
      router.push({
        pathname: '/finance/ride-share',
        query: {
          id: rdsId,
          state: state.selectedState,
          plate: state.plates,
          ...adsQuery,
        },
      });
    } else {
      setState({ ...state, rdsId, carFormOpen: true });
    }
  };

  const handleCloseCarForm = () =>
    setState({ ...state, rdsId: null, carFormOpen: false });
  const handleRedirectToFinance = () =>
    router.push({
      pathname: '/finance/ride-share',
      query: {
        id: state.rdsId,
        state: state.selectedState,
        plate: state.plates,
        ...adsQuery,
      },
    });
  const tutorialOpen = path => {
    if (path === '/ride-share/' || path === '/ride-share') {
      setIsTutorialOpen(true);
    }
  };

  return (
    <Layout tutorialOpen={tutorialOpen}>
      {props.seo ? (
        <Head>
          <SeoHeader
            id="rideshare-seo"
            h1Tag={props.seo?.seoTags?.h1}
            h2Tag={props.seo?.seoTags?.h2}
            h3Tag={props.seo?.seoTags?.h3}
          />
          <title>{props.seo.cityName} | Motopia</title>
          <meta name="og:title" content={props.seo.metaTitle} />
          <meta name="description" content={props.seo.metaDescription} />
          <meta name="keywords" content={props.seo.metaKeywords} />
        </Head>
      ) : (
        <Head>
          <SeoHeader
            id="rideshare-seo"
            h1Tag={rdsHomeSeo?.seoTags?.h1}
            h2Tag={rdsHomeSeo?.seoTags?.h2}
            h3Tag={rdsHomeSeo?.seoTags?.h3}
          />
          <title>{rdsHomeSeo?.cityName} | Motopia</title>
          <meta name="og:title" content={rdsHomeSeo?.metaTitle} />
          <meta name="description" content={rdsHomeSeo?.metaDescription} />
          <meta name="keywords" content={rdsHomeSeo?.metaKeywords} />
        </Head>
      )}
      <div className={classes.whitePageContainer}>
        {props.seo ? (
          <HeaderSection
            list={listOfRDSVehicles}
            handleSearchCars={handleSearchCars}
            tutorialOpen={isTutorialOpen}
            backgroundImage={props.seo.img.src}
            textColor={props.seo.textColor}
            citySpecificText={props.seo.citySpecificText}
          />
        ) : (
          <HeaderSection
            list={listOfRDSVehicles}
            handleSearchCars={handleSearchCars}
            tutorialOpen={isTutorialOpen}
          />
        )}

        {state.isSearchCars && (
          <div ref={vehicleListRef}>
            <Grid container item xs={12}>
              <VehicleList
                vehicleList={state.vehicles}
                isLoading={state.isLoading}
                isMobile={props.isMobile}
                pageLimit={state.pageLimit}
                handlePageChange={handlePageChange}
                vehiclesAreSortedBy={state.vehiclesAreSortedBy}
                onVehicleClick={handleOpenCarForm}
                financePins={financePins}
                isRDS
              />
            </Grid>
          </div>
        )}
        <Grid item xs={12} container className={classes.heroContentContainer}>
          <Grid xs={12} item>
            <Typography variant="h3">
              {has(randomImage, 'title') && randomImage.title}
            </Typography>
          </Grid>
          <Grid xs={12} item>
            <Typography
              variant="h4"
              style={{ marginTop: '2rem', letterSpacing: '1px' }}
            >
              Simple rental process:
            </Typography>
          </Grid>
          <Grid
            className={classes.rentalProcessStepsContainer}
            container
            item
            xs={12}
            md={4}
          >
            {RENTAL_PROCESS_STEPS.map(item => (
              <Grid
                key={item.number}
                xs={12}
                item
                container
                alignItems="center"
                direction="row"
                wrap="nowrap"
              >
                <Typography
                  variant="h2"
                  color="error"
                  style={{ marginRight: 25, marginBottom: 25 }}
                >
                  {item.number}
                </Typography>
                <Typography variant="body1">{item.text}</Typography>
              </Grid>
            ))}
          </Grid>
          <Grid
            className={classes.rentalProcessImageContainer}
            container
            item
            xs={12}
            md={8}
          >
            <div
              className={classes.rentalProcessImage}
              style={{
                backgroundImage: `url(${
                  has(randomImage, 'img')
                    ? randomImage.img.src
                    : RideShareBlackImage
                })`,
              }}
            />
          </Grid>
        </Grid>
        <GetCarForm
          open={state.carFormOpen}
          prospect={props.prospect}
          handleClose={handleCloseCarForm}
          handleError={handleError}
          handleRedirectToFinance={handleRedirectToFinance}
        />
        <ErrorSnackbar
          showErrorBar={state.showErrorbar}
          closeErrorBar={closeErrorBar}
          error={state.error}
        />
      </div>
    </Layout>
  );
};

const mapStateToProps = createStructuredSelector({
  isMobile: isMobileSelector,
  listOfRDSVehicles: rdsVehiclesSelector,
  rdsVehiclesError: rdsVehiclesErrorSelector,
  prospect: prospectData,
});

const mapDispatchToProps = {
  getListOfRDSVehicles,
};

RideShare.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  listOfRDSVehicles: PropTypes.array.isRequired,
  rdsVehiclesError: PropTypes.object,
  getListOfRDSVehicles: PropTypes.func.isRequired,
  prospect: PropTypes.object.isRequired,
  seo: PropTypes.object,
  randomRdsData: PropTypes.object,
  rdsHomeSeo: PropTypes.object,
};

RideShare.defaultProps = {
  rdsVehiclesError: null,
  seo: null,
  randomRdsData: null,
  rdsHomeSeo: null,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
  withRouter
)(RideShare);
