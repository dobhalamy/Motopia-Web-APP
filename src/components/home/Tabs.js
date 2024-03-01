/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import { flattenDeep } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { applyAdsQuery } from '@/utils/commonUtils.js';

import { rdsVehiclesSelector } from 'src/redux/selectors';
import { getListOfRDSVehicles } from 'src/redux/actions/rdsVehicles';
import { PRIVATE_PLATE } from 'src/constants';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import CustomSelect from 'components/shared/CustomSelect';
import BodyTypeCards from 'components/home/BodyTypeCards';
import SearchCarsFeatureSection from 'components/home/SearchCarsFeatureSection';
import RideShareValidationSchema from 'components/rideShare/RideShareValidationSchema';
import TradeInTab from './TradeInTab';
import { stateListSelector } from '../../redux/selectors';

import { TABS, MAX_UI_WIDTH } from './constants';

const useStyles = makeStyles(theme => ({
  homeContainer: {
    width: '100%',
    maxWidth: '100%',
    position: 'relative',
    // NOTE: there are a hack with the height for tabs
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
  tabsContainer: {
    maxWidth: `calc(${MAX_UI_WIDTH}px + 10px)`,
    margin: '0 auto',
    zIndex: 100,
  },
  homeTab: {
    backgroundColor: theme.palette.secondary.main,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    color: theme.palette.primary.contrastText,
    fontSize: theme.typography.pxToRem(15),
    marginRight: 8,
    opacity: 1,
    '&:last-child': {
      marginRight: 0,
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
      fontSize: theme.typography.pxToRem(9),
    },
  },
  homeSelectedTab: {
    color: '#3C3B4A',
    background: theme.palette.primary.contrastText,
    boxShadow: theme.shadows[2],
  },
  homeTabInput: {
    height: 110,
    fontSize: 24,
    padding: `0px ${theme.spacing(3.75)}px`,
    [theme.breakpoints.only('xs')]: {
      fontSize: 20,
      paddingLeft: theme.spacing(1.85),
    },
  },
  homeSecondTab: {
    minHeight: 148,
    padding: `0px ${theme.spacing(5)}px`,
    [theme.breakpoints.only('xs')]: {
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
  },
  homeBoxShadowWrapper: {
    maxWidth: MAX_UI_WIDTH,
    width: 'calc(100% - 10px)',
    boxShadow: theme.shadows[5],
    zIndex: 101,
  },
  homeTabGridBorderBottom: {
    borderRight: '1px solid lightgray',
    [theme.breakpoints.only('xs')]: {
      borderRight: 0,
      borderBottom: '1px solid lightgray',
    },
  },
  homeTabRideShareInputs: {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
  },
  pseudoContainer: {
    height: 635,
    position: 'relative',
  },
  flexContainer: {
    padding: '20px 5px 0',
  },
}));

const TabsComponent = props => {
  const {
    bodyTypeCardsCarouselSetting,
    bodyTypeCardsCarousel,
    vehicleList,
    promoBanners,
  } = props;
  const classes = useStyles();
  const Router = useRouter();
  const adsQuery = applyAdsQuery(Router.query);

  const [activeTab, setActiveTab] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [rideShare, setRideShare] = useState({
    state: '',
    plates: '',
  });
  const [types, setTypes] = useState([]);
  const statesList = useSelector(stateListSelector);

  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));

  useEffect(() => {
    (async () => {
      await props.getListOfRDSVehicles();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterPlates = array => {
    const allTypes = [
      ...new Set(flattenDeep([...array].map(el => el.rsdInventoryType))),
    ];
    const newTypes = allTypes.map(el => ({
      text: el,
      value: el,
    }));
    setTypes(newTypes);
  };

  useEffect(() => {
    if (props.list) {
      const { list } = props;
      filterPlates(list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.list]);

  // const onChangeSelectValue = e => setSelectValue(e.target.value);

  const onChangeTabIndex = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchInput = event => setSearchInput(event.target.value);
  const handleFieldChange = formik => ({ target }) => {
    const { name, value } = target;
    if (name === 'state') {
      window.dataLayer.push({
        event: 'Rideshare_State_Selection',
        RSS: 'Rideshare_State_Selection',
      });
      const availableVehicles = props.list.filter(
        el => el.workInState === value || el.rsdInventoryType === PRIVATE_PLATE
      );
      filterPlates(availableVehicles);
    }
    if (name === 'plates') {
      window.dataLayer.push({
        event: 'Rideshare_Plate_Selection',
        RPS: 'Rideshare_Plate_Selection',
      });
    }
    setRideShare({
      ...rideShare,
      [name]: value,
    });
    formik.setFieldValue(name, value);
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter' && activeTab === 0) {
      Router.push({
        pathname: '/search-cars',
        query: { search: searchInput, ...adsQuery },
      });
    } else if (event.key === 'Enter' && activeTab === 3) {
      // TODO: add action for Ride Share button
    }
  };

  const handleRideShare = values => {
    Router.push({
      pathname: '/ride-share',
      query: { ...values, ...adsQuery },
    });
  };

  const renderSearchCarsTab = () => (
    <>
      <Box className={classes.homeBoxShadowWrapper} onKeyPress={handleKeyPress}>
        <Grid container>
          <Grid item xs={12} sm={8}>
            <TextField
              value={searchInput}
              onChange={handleSearchInput}
              placeholder="Enter Make, Model or Keyword"
              InputProps={{
                className: classes.homeTabInput,
                disableUnderline: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomPrimaryButton
              id="search-cars"
              isLarge
              fullWidth
              onClick={() =>
                Router.push({
                  pathname: '/search-cars',
                  query: { search: searchInput, ...adsQuery },
                })
              }
            >
              Search
            </CustomPrimaryButton>
          </Grid>
        </Grid>
      </Box>
      <BodyTypeCards
        bodyTypeCardsCarouselSetting={bodyTypeCardsCarouselSetting}
        bodyTypeCardsCarousel={bodyTypeCardsCarousel}
        vehicleList={vehicleList}
      />
      <SearchCarsFeatureSection promoBanners={promoBanners} />
    </>
  );

  const renderFinanceTab = () => (
    <Box className={classes.homeBoxShadowWrapper}>
      <Grid container className={classes.homeSecondTab} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography variant={matches ? 'h5' : 'h4'}>
            GET PRE-QUALIFIED
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            Get pre-qualified and see personalized terms and actual monthly
            payments for every car in our inventory.
          </Typography>
        </Grid>
      </Grid>
      <CustomPrimaryButton
        isLarge
        fullWidth
        onClick={() =>
          Router.push({ pathname: '/finance', query: { ...adsQuery } })
        }
      >
        Get financing
      </CustomPrimaryButton>
    </Box>
  );

  const renderRentTab = () => (
    <Box className={classes.homeBoxShadowWrapper} onKeyPress={handleKeyPress}>
      <Formik
        enableReinitialize
        validationSchema={RideShareValidationSchema}
        validateOnBlur
        onSubmit={values => handleRideShare(values)}
        initialValues={{ ...rideShare }}
        render={formik => (
          <>
            <Grid container>
              <Grid item xs={12} md={6} container>
                <CustomSelect
                  className={classes.heroInputs}
                  options={statesList}
                  fullWidth
                  label="Where do you plan to work?"
                  name="state"
                  hasError={!!formik.errors.state && formik.touched.state}
                  errorMessage={formik.errors.state}
                  onBlur={formik.handleBlur}
                  onChange={handleFieldChange(formik)}
                  value={rideShare.state}
                  placeholder="Select State"
                  clearBorder
                />
              </Grid>
              <Grid item xs={12} md={6} container>
                <CustomSelect
                  className={classes.heroInputs}
                  options={types}
                  fullWidth
                  label="License plate type"
                  name="plates"
                  hasError={!!formik.errors.plates && formik.touched.plates}
                  errorMessage={formik.errors.plates}
                  onBlur={formik.handleBlur}
                  onChange={handleFieldChange(formik)}
                  value={rideShare.plates}
                  placeholder="Select Type"
                  clearBorder
                />
              </Grid>
            </Grid>
            <CustomPrimaryButton
              fullWidth
              isLarge
              withIcon
              onClick={formik.handleSubmit} // {() => handleSearchCars(state.state, state.plates)}
            >
              Show me Ride-share ready cars
            </CustomPrimaryButton>
          </>
        )}
      />
    </Box>
  );

  return (
    <>
      <Container className={classes.homeContainer}>
        <Tabs
          value={activeTab}
          onChange={onChangeTabIndex}
          TabIndicatorProps={{ style: { backgroundColor: 'transparent' } }}
          variant="fullWidth"
          className={classes.tabsContainer}
          classes={{ flexContainer: classes.flexContainer }}
        >
          {TABS.map(tab => (
            <Tab
              key={tab}
              label={tab}
              classes={{
                root: classes.homeTab,
                selected: classes.homeSelectedTab,
              }}
            />
          ))}
        </Tabs>
        <Grid container direction="column" alignItems="center">
          {activeTab === 0 && renderSearchCarsTab()}
          {activeTab === 1 && renderFinanceTab()}
          {activeTab === 2 && <TradeInTab />}
          {activeTab === 3 && renderRentTab()}
        </Grid>
      </Container>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  list: rdsVehiclesSelector,
});

const mapDispatchToProps = {
  getListOfRDSVehicles,
};

TabsComponent.propTypes = {
  list: PropTypes.array.isRequired,
  getListOfRDSVehicles: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(TabsComponent);
