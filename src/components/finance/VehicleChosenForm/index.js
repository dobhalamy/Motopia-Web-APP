import React from 'react';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { useRouter, withRouter } from 'next/router';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import HandleTour from 'components/shared/HandleTour';

import CustomInput from 'components/shared/CustomInput';
// import CustomSelect from 'components/shared/CustomSelect';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
// import { SELECT_OPTIONS_USA_STATES } from 'src/constants';
import { getCookieJSON, setCookie } from 'src/utils/cookie';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import FormDescription from '../FormDescription';

import validationSchema from './validationSchema';

const useStyles = makeStyles(theme => ({
  financeFormWrapper: {
    backgroundColor: theme.palette.common.white,
    padding: `${theme.spacing(5)}px ${theme.spacing(3.75)}px ${theme.spacing(
      2
    )}px`,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
    [theme.breakpoints.only('xs')]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 850,
      margin: 'auto',
    },
  },
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  dataTut: {
    [theme.breakpoints.up('md')]: {
      width: '22%',
    },
  },
}));

const VehicleChosenForm = props => {
  const classes = useStyles();
  const router = useRouter();
  const [state, setState] = React.useState({
    initialValues: {
      employerName: '',
      employerZip: '',
      employerPhone: '',
      annualIncome: '',
      workExperience: '',
      vehicleStock: '',
      employerAddress: '',
      employerCity: '',
      employerState: '',
      employerPosition: '',
      manager: '',
      totalMonthlyDebt: 0,
    },
    showErrorBar: false,
    error: null,
  });
  const [isTourOpen, setIsTourOpen] = React.useState(true);
  const [IsEmployerOpen, setIsEmployerOpen] = React.useState(true);
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const headerSteps = [
    {
      selector: '[data-tut="Employee-Info"]',
      content: () => <Typography>Add Employment Information</Typography>,
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'top',
    },
    {
      selector: '[data-tut="Employer-Submit"]',
      content: () => (
        <Typography>
          And proceed to get your PERSONALIZED payment plans!
        </Typography>
      ),
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'top',
    },
  ];

  const gridSpacing = matches ? 1 : 3;

  const closeErrorBar = () =>
    setState({ ...state, showErrorBar: false, error: null });

  React.useEffect(() => {
    const pullCredit = getCookieJSON('pullCredit');
    const winLocation = window.location.href.toString();
    if (pullCredit) {
      const { totalMonthlyDebt } = pullCredit;

      if (totalMonthlyDebt) {
        setState({
          ...state,
          initialValues: {
            ...state.initialValues,
            totalMonthlyDebt,
          },
        });
      }
    }
    setIsEmployerOpen(localStorage.getItem('employeropen'));
    if (
      winLocation.includes('finance/?stockid') &&
      router.query.gte !== 'Loan-Level-4'
    ) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, gte: 'Loan-Level-4' },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const vehicleChosenInfo = getCookieJSON('vehicleChosenInfo');
    if (vehicleChosenInfo) {
      setState({
        ...state,
        initialValues: {
          ...state.initialValues,
          ...vehicleChosenInfo,
          employerPhone: vehicleChosenInfo.employerPhone,
        },
      });
    }
    // eslint-disable-next-line
  }, [props, props.addressData]);

  React.useEffect(() => {
    if (props.tutorialOpen === true) {
      setIsTourOpen(true);
      setIsEmployerOpen(false);
    }
  }, [props.tutorialOpen]);
  const handleGetLoan = async formik => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      await formik.submitForm();
      setState({
        ...state,
        showErrorBar: true,
        error: 'Please check the form values',
      });
    } else {
      const { values } = formik;
      setCookie('vehicleChosenInfo', values);
      props.handleNextForm();
    }
  };

  const closeTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('employeropen', true);
  };
  return (
    <Container maxWidth="lg">
      <FormDescription title="GET FULL APPROVAL  FOR AN AUTO LOAN IN 2 MINUTES" />
      <Formik
        validationSchema={validationSchema}
        initialValues={{ ...state.initialValues }}
        enableReinitialize
        render={formik => (
          <Box boxShadow={6} className={classes.financeFormWrapper}>
            <Form>
              <Typography gutterBottom variant="body1">
                <div className={classes.dataTut} data-tut="Employee-Info">
                  Employer information
                </div>
              </Typography>
              <Grid
                container
                spacing={gridSpacing}
                className={classes.financeGridMarginBottom}
              >
                <Grid item xs={12} md={6}>
                  <CustomInput
                    fullWidth
                    label="EMPLOYER NAME"
                    name="employerName"
                    hasError={
                      !!formik.errors.employerName &&
                      formik.touched.employerName
                    }
                    errorMessage={formik.errors.employerName}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.employerName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    fullWidth
                    label="EMPLOYER PHONE"
                    withPhoneMask
                    name="employerPhone"
                    hasError={
                      !!formik.errors.employerPhone &&
                      formik.touched.employerPhone
                    }
                    errorMessage={formik.errors.employerPhone}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.employerPhone}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    fullWidth
                    label="POSITION"
                    name="employerPosition"
                    hasError={
                      !!formik.errors.employerPosition &&
                      formik.touched.employerPosition
                    }
                    errorMessage={formik.errors.employerPosition}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.employerPosition}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    fullWidth
                    label="ANNUAL INCOME "
                    name="annualIncome"
                    hasError={
                      !!formik.errors.annualIncome &&
                      formik.touched.annualIncome
                    }
                    errorMessage={formik.errors.annualIncome}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.annualIncome}
                    startAdornment={
                      formik.values.annualIncome && (
                        <InputAdornment position="start">$</InputAdornment>
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    fullWidth
                    label="EMPLOYER CITY"
                    name="employerCity"
                    hasError={
                      !!formik.errors.employerCity &&
                      formik.touched.employerCity
                    }
                    errorMessage={formik.errors.employerCity}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.employerCity}
                  />
                </Grid>
                {/* NOTE: uncomment after getting instructions */}
                {/* <Grid item xs={12} md={6}/>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    fullWidth
                    label="EMPLOYER ADDRESS"
                    name="employerAddress"
                    hasError={
                      !!formik.errors.employerAddress &&
                      formik.touched.employerAddress
                    }
                    errorMessage={formik.errors.employerAddress}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.employerAddress}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomSelect
                    options={SELECT_OPTIONS_USA_STATES}
                    fullWidth
                    label="STATE"
                    name="employerState"
                    hasError={
                      !!formik.errors.employerState &&
                      formik.touched.employerState
                    }
                    errorMessage={formik.errors.employerState}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.employerState}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    fullWidth
                    label="EMPLOYER ZIP"
                    name="employerZip"
                    hasError={
                      !!formik.errors.employerZip && formik.touched.employerZip
                    }
                    errorMessage={formik.errors.employerZip}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.employerZip}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomInput
                    fullWidth
                    label="MANAGER NAME"
                    name="manager"
                    hasError={!!formik.errors.manager && formik.touched.manager}
                    errorMessage={formik.errors.manager}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.manager}
                  />
                </Grid> */}
              </Grid>
              <Grid
                container
                item
                style={{ marginBottom: 20, justifyContent: 'flex-end' }}
              >
                <div data-tut="Employer-Submit">
                  <CustomPrimaryButton
                    withIcon
                    onClick={() => handleGetLoan(formik)}
                    disabled={!formik.dirty || !formik.isValid}
                  >
                    Get a loan
                  </CustomPrimaryButton>
                </div>
              </Grid>
            </Form>
          </Box>
        )}
      />
      <ErrorSnackbar
        showErrorBar={state.showErrorBar}
        error={state.error}
        closeErrorBar={closeErrorBar}
      />
      {!IsEmployerOpen && (
        <HandleTour
          isOpen={isTourOpen}
          steps={headerSteps}
          handleClose={closeTour}
        />
      )}
    </Container>
  );
};

VehicleChosenForm.propTypes = {
  handleNextForm: PropTypes.func.isRequired,
  tutorialOpen: PropTypes.bool.isRequired,
};

export default withRouter(VehicleChosenForm);
