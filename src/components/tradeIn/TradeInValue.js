/* eslint-disable react/prop-types */
import React from 'react';
import { Form, withFormik } from 'formik';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import BarcodeIcon from 'assets/tradeIn/barcode.svg';
import CarfaxIcon from 'assets/tradeIn/carfax';
import TradeInIcon from 'assets/tradeIn/tradeIn.svg';
import { Prospect, Hubspot } from 'src/api';
import CustomInput from 'components/shared/CustomInput';
import { BORDER_COLOR, PROSPECT_SOURCE } from 'src/constants';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import TradeInValidationSchema from 'components/shared/TradeInValidationSchema';
import ThankyouDialog from 'components/shared/ThankyouDialog';
import TradeInHero from 'assets/tradeIn/tradeInHeader.png';
import RideShareBackImage from 'assets/ride_share_back_image.png';
import generateProspectSource from '../../utils/generateProspectSource';

const useStyles = makeStyles(theme => ({
  heroBackground: {
    width: '100%',
    backgroundImage: `url(${TradeInHero})`,
    backgroundColor: '#001C5E',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  heroContentContainer: {
    maxWidth: 1138,
    padding: `${theme.spacing(4.5)}px ${theme.spacing(2)}px ${theme.spacing(
      4
    )}px`,
    color: theme.palette.common.white,
  },
  heroContentTitle: {
    margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(8)}px`,
  },
  heroContentTitleVin: {
    fontSize: theme.typography.pxToRem(34),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(22),
      marginBottom: theme.spacing(2),
    },
  },
  heroContentSubtitle: {
    fontSize: theme.typography.pxToRem(17),
  },
  heroIconsContainer: {
    marginTop: theme.spacing(2.5),
  },
  heroIcons: {
    width: 50,
    height: 50,
    marginRight: theme.spacing(2.5),
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  heroInputVinTitle: {
    marginLeft: theme.spacing(1.5),
  },
  heroInputContainer: {
    background: theme.palette.common.white,
    borderRadius: 5,
    margin: `${theme.spacing(1.5)}px 0px`,
  },
  heroInputs: {
    height: 110,
    borderRadius: 0,
  },
  heroInputDivider: {
    borderRight: `1px solid ${BORDER_COLOR}`,
  },
  heroInputPadding: {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(1)}px`
  },
  heroInputButton: {
    height: 110,
    borderRadius: '0 5px 5px 0',
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0 0 5px 5px',
    },
  },
  contentContainer: {
    // NOTE: Remove this if vin
    // number image is not showing
    // height: '100%',
    padding: `${theme.spacing(6)}px 0px`,
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(3)}px 0px`,
    },
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(1)}px 0px`,
    },
  },
  findVinImage: {
    maxWidth: 1138,
    height: '100%',
    width: '100%',
    minHeight: 500,
    backgroundImage: `url(${RideShareBackImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    [theme.breakpoints.down('sm')]: {
      minHeight: 350,
    },
    [theme.breakpoints.down('xs')]: {
      minHeight: 250,
    },
  },
  tradeInPrimaryInformationWrapper: {
    [theme.breakpoints.down('sm')]: {
      padding: `0px ${theme.spacing(2)}px`,
    },
  },
  tradeInPrimaryInformationContainer: {
    maxWidth: 1106,
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

const TradeInValue = props => {
  const { query } = useRouter();
  const classes = useStyles();
  const theme = useTheme();
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
    props.setFieldValue(fieldTitle, fieldTitle === 'mileage' ? numberWithCommas(value) : value);
  };

  const closeErrorBar = () => {
    setState({ showErrorBar: false });
  };

  const handleShowThanksDialog = async event => {
    event.preventDefault();
    if (props.isValid) {
      const {
        firstName, lastName, vin, mileage, email, contactNumber
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
        // eslint-disable-next-line max-len
        notes: `Additional Info: [trade-in vin]:${vin}, [trade-in mileage]:${parseMileAge}, Customer Comments: ${state.description}`,
      };
      try {
        const response = await Prospect.AddProspect({
          ...INFORMATION_DATA,
        });
        if (response.status === 'Failed') {
          throw new Error();
        }
        await Hubspot.formv3('TradeIn', INFORMATION_DATA);
        setState({ ...state, showThanksDialog: true, showHelperText: false });
      } catch (error) {
        setState({
          ...state, showHelperText: true, showErrorBar: true, error
        });
      }
    } else {
      setState({ ...state, showHelperText: true });
    }
  };

  const handleHideThanksDialog = () =>
    // eslint-disable-next-line max-len
    setState({ ...state, firstName: '', lastName: '', vin: '', mileage: '', contactNumber: '', description: '', email: '', showThanksDialog: false });

  return (
    <Grid container direction="column" wrap="nowrap">
      <Form onSubmit={handleShowThanksDialog}>
        <Grid className={classes.heroBackground} container justifyContent="center">
          <Grid
            className={classes.heroContentContainer}
            container
            direction="column"
            wrap="nowrap"
          >
            <Typography variant="body1">Home / Trade-in value</Typography>
            <Grid className={classes.heroContentTitle} container>
              <Grid container item xs={12} md={6}>
                <Typography className={classes.heroContentTitleVin} variant="h1">
                  ENTER YOUR VIN TO GET AN ACTUAL OFFER
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                md={6}
                direction="column"
                wrap="nowrap"
              >
                <Typography
                  className={classes.heroContentSubtitle}
                  variant="body1"
                >
                  Get a real offer in 2 minutes. We pick up your car. You get paid
                  on the spot.
                </Typography>
                <Grid
                  className={classes.heroIconsContainer}
                  item
                  xs={12}
                  container
                >
                  <Grid xs={6} item container>
                    <img
                      className={classes.heroIcons}
                      src={TradeInIcon}
                      alt="trade in icon"
                    />
                    <Typography variant="body1">
                      Get exact <br /> trade-in value
                    </Typography>
                  </Grid>
                  <Grid xs={6} item container>
                    <span className={classes.heroIcons}>
                      <Icon
                        component={CarfaxIcon}
                        fill={theme.palette.common.white}
                      />
                    </span>
                    <Typography variant="body1">
                      Download your <br /> Carfax report
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <img src={BarcodeIcon} alt="barcode icon" />
              <Typography variant="body2" className={classes.heroInputVinTitle}>
                Where is my VIN?
              </Typography>
              <Grid className={classes.heroInputContainer} container>
                <Grid
                  className={classNames(classes.heroInputDivider, classes.heroInputPadding)}
                  item
                  xs={12}
                  md={6}
                  container
                >
                  <CustomInput
                    className={classes.heroInputs}
                    fullWidth
                    label="VIN"
                    name="vin"
                    value={state.vin}
                    onChange={handleFieldChange('vin')}
                    onBlur={props.handleBlur}
                    hasError={!!props.errors.vin && props.touched.vin}
                    errorMessage={props.errors.vin}
                  />
                </Grid>
                <Grid item xs={12} md={6} container className={classes.heroInputPadding}>
                  <CustomInput
                    className={classes.heroInputs}
                    fullWidth
                    label="MILEAGE"
                    name="mileage"
                    value={state.mileage}
                    onChange={handleFieldChange('mileage')}
                    onBlur={props.handleBlur}
                    hasError={!!props.errors.mileage && props.touched.mileage}
                    errorMessage={props.errors.mileage}
                  />
                </Grid>
              </Grid>
              <Typography style={{ opacity: 0.6 }} variant="body2">
                VIN is 17 characters long (digits & letters only)
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.contentContainer} container justifyContent="center">
          <div className={classes.findVinImage} />
        </Grid>
        <Grid className={classes.tradeInPrimaryInformationWrapper} justifyContent="center" container>
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
                    !!props.errors.contactNumber && !!props.touched.contactNumber
                  }
                  errorMessage={props.errors.contactNumber}
                  name="contactNumber"
                  fullWidth
                  withPhoneMask
                />
              </Grid>
            </Grid>
            <Grid className={classes.descriptionContainer} container item xs={12}>
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Get an offer
              </Button>
              {state.showHelperText &&
                <Typography style={{ marginTop: 10 }} variant="body2" color="error">
                  Please fill up fields above
                </Typography>}
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
      </Form>
    </Grid>
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
})(TradeInValue);
