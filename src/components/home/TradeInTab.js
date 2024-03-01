/* eslint-disable react/prop-types */
import React from 'react';
import { withFormik } from 'formik';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import BarCodeCards from 'assets/homepage/barCode_cards.svg';
import CustomInput from 'components/shared/CustomInput';
import { PROSPECT_SOURCE } from 'src/constants';
import RideShareBackImage from 'assets/ride_share_back_image.png';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import { Prospect } from 'src/api';
import TradeInValidationSchema from 'components/shared/TradeInValidationSchema';
import ThankyouDialog from 'components/shared/ThankyouDialog';
import { MAX_UI_WIDTH } from './constants';
import generateProspectSource from '../../utils/generateProspectSource';

const useStyles = makeStyles(theme => ({
  homeBoxShadowWrapper: {
    borderRadius: 5,
    position: 'relative',
    boxShadow: theme.shadows[5],
    backgroundColor: theme.palette.common.white,
  },
  homeVinText: {
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(6.25),
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
  homeVinImage: {
    display: 'block',
    width: '60%',
    height: 'auto',
    margin: '0 auto',
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
  tradeInGeneralInputsContainer: {
    minHeight: 120,
    [theme.breakpoints.down('sm')]: {
      padding: `0px ${theme.spacing(2)}px`,
    },
  },
  tradeInVINContainer: {
    borderRight: '1px solid lightgray',
    padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
    [theme.breakpoints.down('sm')]: {
      borderRight: 'none',
      borderBottom: '1px solid lightgray',
    },
  },
  tradeInMileageContainer: {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`,
  },
  tradeInPrimaryInformationWrapper: {
    [theme.breakpoints.down('sm')]: {
      padding: `0px ${theme.spacing(2)}px`,
    },
  },
  tradeInPrimaryInformationContainer: {
    boxShadow: theme.shadows[3],
    borderRadius: 5,
    margin: `${theme.spacing(8)}px 0px`,
    padding: `${theme.spacing(5)}px ${theme.spacing(3.5)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(4)}px 0px`,
      padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
    },
  },
  descriptionContainer: {
    marginTop: theme.spacing(1.5),
  },
}));

const TradeInTab = props => {
  const { query } = useRouter();
  const classes = useStyles();
  const [state, setState] = React.useState({
    vin: '',
    mileage: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    description: '',
    showThanksDialog: false,
    showErrorBar: false,
    error: null,
    showHelperText: false,
  });

  const closeErrorBar = () => {
    setState({ showErrorBar: false });
  };

  const numberWithCommas = x => {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(',', '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const handleFieldChange = fieldTitle => event => {
    const { value } = event.target;
    setState({
      ...state,
      [fieldTitle]: fieldTitle === 'mileage' ? numberWithCommas(value) : value,
    });
    props.setFieldValue(
      fieldTitle,
      fieldTitle === 'mileage' ? numberWithCommas(value) : value
    );
  };

  const handleShowThanksDialog = async event => {
    event.preventDefault();
    if (props.isValid) {
      const {
        firstName,
        lastName,
        vin,
        mileage,
        email,
        contactNumber,
      } = props.values;
      const source = generateProspectSource(PROSPECT_SOURCE.tradin, query);
      const parseNumber = contactNumber.startsWith('+1')
        ? contactNumber.replace(/\D+/g, '').slice(1)
        : contactNumber.replace(/\D+/g, '');
      const parseMileAge = mileage.replace(',', '');
      const INFORMATION_DATA = {
        firstName,
        lastName,
        category: 'Sale',
        email,
        contactNumber: parseNumber,
        source,
        notes: `Additional Info: [vin]:${vin}, [mileage]:${parseMileAge}, Customer Comments: ${state.description}`,
      };
      try {
        const response = await Prospect.AddProspect({
          ...INFORMATION_DATA,
        });
        if (response.status === 'Failed') {
          throw new Error();
        }
        setState({ ...state, showThanksDialog: true, showHelperText: false });
      } catch (error) {
        setState({
          ...state,
          showHelperText: true,
          showErrorBar: true,
          error,
        });
      }
    } else {
      setState({ ...state, showHelperText: true });
    }
  };

  const handleHideThanksDialog = () =>
    /* eslint-disable max-len */
    setState({
      ...state,
      vin: '',
      contactNumber: '',
      description: '',
      firstName: '',
      lastName: '',
      mileage: '',
      email: '',
      showThanksDialog: false,
    });

  return (
    <Box style={{ maxWidth: MAX_UI_WIDTH }}>
      <form onSubmit={handleShowThanksDialog}>
        <Box className={classes.homeBoxShadowWrapper}>
          <Grid container className={classes.tradeInGeneralInputsContainer}>
            <Grid className={classes.tradeInVINContainer} item xs={12} md={6}>
              <CustomInput
                label="VIN"
                name="vin"
                placeholder="2FMZA5344XBB82984"
                height={85}
                value={state.vin}
                onChange={handleFieldChange('vin')}
                onBlur={props.handleBlur}
                hasError={!!props.errors.vin && props.touched.vin}
                errorMessage={props.errors.vin}
                fullWidth
              />
            </Grid>
            <Grid
              className={classes.tradeInMileageContainer}
              item
              xs={12}
              md={6}
            >
              <CustomInput
                label="MILEAGE"
                name="mileage"
                height={85}
                placeholder="69000"
                value={state.mileage}
                onChange={handleFieldChange('mileage')}
                onBlur={props.handleBlur}
                hasError={!!props.errors.mileage && props.touched.mileage}
                errorMessage={props.errors.mileage}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
        <Box style={{ paddingTop: 20 }}>
          <Typography variant="body2" className={classes.homeVinText}>
            <img src={BarCodeCards} alt="barCode_cards" /> Where is my VIN?
          </Typography>
          <img
            src={`${RideShareBackImage}`}
            alt="tab_trade_car"
            className={classes.homeVinImage}
          />
        </Box>
        <Grid className={classes.tradeInPrimaryInformationWrapper} container>
          <Grid
            className={classes.tradeInPrimaryInformationContainer}
            container
            justifyContent="space-around"
            direction="column"
            wrap="nowrap"
          >
            <Typography variant="body1">Primary information</Typography>
            <Grid container justifyContent="space-between" spacing={2}>
              <Grid item xs={12} md={6} container>
                <CustomInput
                  label="FIRST NAME"
                  value={state.firstName}
                  onChange={handleFieldChange('firstName')}
                  onBlur={props.handleBlur}
                  hasError={!!props.errors.firstName && props.touched.firstName}
                  errorMessage={props.errors.firstName}
                  name="firstName"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} container>
                <CustomInput
                  label="LAST NAME"
                  value={state.lastName}
                  onChange={handleFieldChange('lastName')}
                  onBlur={props.handleBlur}
                  hasError={!!props.errors.lastName && props.touched.lastName}
                  errorMessage={props.errors.lastName}
                  name="lastName"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} container>
                <CustomInput
                  label="EMAIL"
                  value={state.email}
                  onChange={handleFieldChange('email')}
                  onBlur={props.handleBlur}
                  hasError={!!props.errors.email && props.touched.email}
                  errorMessage={props.errors.email}
                  name="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} container>
                <CustomInput
                  label="CONTACT NUMBER"
                  value={state.contactNumber}
                  onChange={handleFieldChange('contactNumber')}
                  onBlur={props.handleBlur}
                  hasError={
                    !!props.errors.contactNumber &&
                    !!props.touched.contactNumber
                  }
                  errorMessage={props.errors.contactNumber}
                  name="contactNumber"
                  fullWidth
                  withPhoneMask
                />
              </Grid>
            </Grid>
            <Grid
              className={classes.descriptionContainer}
              container
              item
              xs={12}
            >
              <CustomInput
                label="DESCRIPTION"
                name="Description"
                value={state.description}
                onChange={handleFieldChange('description')}
                fullWidth
                multiline
                height={180}
              />
            </Grid>
            <Grid container alignItems="flex-end" direction="column">
              <Button type="submit" variant="contained" color="primary">
                Get an offer
              </Button>
              {state.showHelperText && (
                <Typography
                  style={{ marginTop: 10 }}
                  variant="body2"
                  color="error"
                >
                  Please fill up fields above
                </Typography>
              )}
            </Grid>
          </Grid>
          <ThankyouDialog
            open={state.showThanksDialog}
            handleClose={handleHideThanksDialog}
          />
          <ErrorSnackbar
            showErrorBar={state.showErrorBar}
            error={state.error}
            closeErrorBar={closeErrorBar}
          />
        </Grid>
      </form>
    </Box>
  );
};

export default withFormik({
  mapPropsToValues: () => ({
    vin: '',
    mileage: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
  }),
  validationSchema: TradeInValidationSchema,
})(TradeInTab);
