import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { flattenDeep } from 'lodash';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import HandleTour from 'components/shared/HandleTour';

import ArrowIcon from '@material-ui/icons/ArrowRightAlt';
import PlusIcon from '@material-ui/icons/Add';
import EqualIcon from '@material-ui/icons/DragHandle';
import ReactPlayer from 'react-player/vimeo';
import ThumbUpIcon from 'assets/thumb_up';
import RideShareHeader from 'assets/tradeIn/tradeInHeader.png';
import CustomSelect from 'components/shared/CustomSelect';
import { VideoUrls, PRIVATE_PLATE, vimeoConfig } from 'src/constants';
import RideShareValidationSchema from './RideShareValidationSchema';
import { stateListSelector } from '../../redux/selectors';

const useStyles = makeStyles(theme => ({
  heroBackground: {
    width: '100%',
    backgroundColor: '#001C5E',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  heroContentContainer: {
    padding: `${theme.spacing(4.5)}px ${theme.spacing(2)}px ${theme.spacing(
      4
    )}px`,
    color: theme.palette.common.white,
  },
  heroContentTitle: {
    margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(8)}px`,
    width: '70%',
    display: 'block',
    verticalAlign: 'middle',
    paddingTop: 80,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 70,
    },
    paddingLeft: 100,
  },
  heroHeaderContentTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(22),
      marginBottom: theme.spacing(2),
    },
    textTransform: 'uppercase',
  },
  headerText: {
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(16),
    },
  },
  heroIcons: {
    width: 50,
    height: 50,
    marginRight: theme.spacing(2.5),
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  heroInputContainer: {
    background: theme.palette.common.white,
    borderRadius: 5,
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      width: '70%',
    },
    marginTop: 25,
  },
  heroInputs: {
    height: 110,
    borderRadius: 0,
  },
  heroInputButton: {
    height: 110,
    borderRadius: '0 5px 5px 0',
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0 0 5px 5px',
      minHeight: 140,
    },
  },
  formRideShare: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    width: '100%',
  },
  player: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    width: '70%',
  },
  playerWidth: {
    margin: 'auto',
    border: '5px solid #FFF',
    [theme.breakpoints.up('md')]: {
      width: '730px !important',
      height: '420px !important',
    },
    [theme.breakpoints.down(450)]: {
      width: '380px !important',
    },
    [theme.breakpoints.down(390)]: {
      width: '335px !important',
    },
    [theme.breakpoints.down(350)]: {
      width: '290px !important',
      height: '175px !important',
    },
    height: '190px !important',
  },
  playerHeader: {
    textAlign: 'center',
    marginBottom: 10,
  },
}));

const HeaderSection = props => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    state: '',
    plates: '',
  });
  const [types, setTypes] = React.useState([]);
  const [isTourOpen, setIsTourOpen] = React.useState(true);
  const [isRideShareOpen, setisRideShareOpen] = React.useState(undefined);
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const [vehicles, setVehicles] = React.useState([]);
  const [paramsState, setParamsState] = useState('');
  const [paramsPlates, setParamsPlates] = useState('');
  // first time loader
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const statesList = useSelector(stateListSelector);

  const { RideShareUrl } = VideoUrls;
  const headerSteps = [
    {
      selector: '[data-tut="Rideshare-state"]',
      content: () => <Typography>Select Your State.</Typography>,
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'top',
    },
    {
      selector: '[data-tut="Rideshare-plate"]',
      content: () => <Typography>Select Your License Plate Type.</Typography>,
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'top',
    },
    {
      selector: '[data-tut="Rideshare-result"]',
      content: () => (
        <Typography>
          And Proceed To See The Available Rental options!
        </Typography>
      ),
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'top',
    },
  ];
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

  React.useEffect(() => {
    if (statesList.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [statesList]);

  React.useEffect(() => {
    if (props.list) {
      let queryState = null;
      if (router.query.state) {
        const { query } = router;
        const selectedState = query.state.toLocaleUpperCase();
        queryState = selectedState;
        const queryPlates = query.plates
          ? query.plates.toLocaleUpperCase().replace('-', ' ')
          : '';
        setParamsState(queryState);
        setParamsPlates(queryPlates);
        setState({
          ...state,
          state: queryState,
          plates: queryPlates,
        });
      }
      const { list } = props;
      filterPlates(list);

      const allVehicles = list.map(el => ({
        rsdInventoryType: el.rsdInventoryType,
        workInState: el.workInState,
        zones: el.zones,
      }));
      setVehicles(allVehicles);
      if (queryState) {
        const availableVehicles = vehicles.filter(
          el =>
            el.workInState === queryState ||
            el.rsdInventoryType === PRIVATE_PLATE
        );
        filterPlates(availableVehicles);
      }
    }
    setisRideShareOpen(localStorage.getItem('rideshareOpen'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.list, router.query]);

  React.useEffect(() => {
    if (props.tutorialOpen === true) {
      setIsTourOpen(true);
      setisRideShareOpen(false);
    }
  }, [props.tutorialOpen]);
  const handleFieldChange = fieldTitle => event => {
    const { value } = event.target;
    if (fieldTitle === 'state') {
      window.dataLayer.push({
        event: 'Rideshare_State_Selection',
        RSS: 'Rideshare_State_Selection',
      });
      const availableVehicles = vehicles.filter(
        el => el.workInState === value || el.rsdInventoryType === PRIVATE_PLATE
      );
      filterPlates(availableVehicles);
      setState({
        ...state,
        [fieldTitle]: value,
        plates: '',
      });
    }
    if (fieldTitle === 'plates') {
      window.dataLayer.push({
        event: 'Rideshare_Plate_Selection',
        RPS: 'Rideshare_Plate_Selection',
      });
      setState({
        ...state,
        [fieldTitle]: value,
      });
    }
    props.setFieldValue(fieldTitle, value);
  };
  const submitSearchCars = async event => {
    event.preventDefault();
    if (
      (paramsState === state.state && paramsPlates === state.plates) ||
      (!state.plates && !state.state)
    ) {
      return;
    }
    props.handleSearchCars(state.state, state.plates);
  };
  const closeTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('rideshareOpen', true);
  };
  return (
    <>
      <Grid
        className={classes.heroBackground}
        container
        justifyContent="center"
        style={{
          backgroundImage: `url(${props.backgroundImage})`,
        }}
      >
        <Grid
          className={classes.heroContentContainer}
          container
          direction="column"
          wrap="nowrap"
        >
          <div style={{ display: 'flex', color: props.textColor }}>
            {!matches && (
              <Grid className={classes.heroContentTitle} container>
                <Grid
                  container
                  item
                  justifyContent="center"
                  xs={12}
                  style={{ marginBottom: 75 }}
                >
                  <Typography
                    className={classes.heroHeaderContentTitle}
                    variant="h4"
                  >
                    {props.citySpecificText}
                  </Typography>
                </Grid>
                <Grid container item xs={12} wrap="nowrap">
                  <Grid container item xs={6} md={7}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" className={classes.headerText}>
                        You work for a ride-sharing company
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      xs={12}
                      md={4}
                    >
                      <PlusIcon />
                    </Grid>
                    <Grid
                      item
                      container
                      xs={12}
                      md={4}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography variant="h6" className={classes.headerText}>
                        you have a valid drivers license
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={3}
                    md={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <EqualIcon />
                  </Grid>
                  <Grid
                    item
                    container
                    xs={3}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ThumbUpIcon
                      className={classes.heroIcons}
                      fill={props.textColor}
                    />
                    <Typography variant="h6" className={classes.headerText}>
                      you are approved
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid className={classes.player}>
              <Typography className={classes.playerHeader} variant="h4">
                How It Works?
              </Typography>
              <ReactPlayer
                className={classes.playerWidth}
                url={RideShareUrl}
                config={vimeoConfig}
              />
            </Grid>
          </div>
          <Grid className={classes.heroInputContainer} container>
            <form
              id="ride-share-form"
              className={classes.formRideShare}
              onSubmit={submitSearchCars}
            >
              <Grid item xs={12} md={4} container data-tut="Rideshare-state">
                <CustomSelect
                  className={classes.heroInputs}
                  options={statesList}
                  fullWidth
                  label="Where do you plan to work?"
                  name="state"
                  hasError={!!props.errors.state && props.touched.state}
                  errorMessage={props.errors.state}
                  onBlur={props.handleBlur}
                  onChange={handleFieldChange('state')}
                  value={state.state}
                  placeholder="Select State"
                  useLoading
                  loading={loading}
                  clearBorder
                />
              </Grid>
              <Grid item xs={12} md={4} container data-tut="Rideshare-plate">
                <CustomSelect
                  className={classes.heroInputs}
                  options={types}
                  fullWidth
                  label="License plate type"
                  name="plates"
                  hasError={!!props.errors.plates && props.touched.plates}
                  errorMessage={props.errors.plates}
                  onBlur={props.handleBlur}
                  onChange={handleFieldChange('plates')}
                  value={state.plates}
                  placeholder="Select Type"
                  clearBorder
                />
              </Grid>
              <Grid item xs={12} md={4} container data-tut="Rideshare-result">
                <Button
                  id="ride-share-search"
                  className={classes.heroInputButton}
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Show me Ride-share ready cars{' '}
                  <ArrowIcon style={{ marginLeft: 8 }} />
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
      {!isRideShareOpen && (
        <HandleTour
          isOpen={isTourOpen}
          steps={headerSteps}
          handleClose={closeTour}
        />
      )}
    </>
  );
};

HeaderSection.defaultProps = {
  backgroundImage: RideShareHeader,
  textColor: '#fff',
  citySpecificText: 'No credit necessary!',
};

HeaderSection.propTypes = {
  handleSearchCars: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  tutorialOpen: PropTypes.bool.isRequired,
  backgroundImage: PropTypes.string,
  textColor: PropTypes.string,
  citySpecificText: PropTypes.string,
};

export default withFormik({
  mapPropsToValues: () => ({
    state: '',
    plates: '',
  }),
  validationSchema: RideShareValidationSchema,
})(HeaderSection);
