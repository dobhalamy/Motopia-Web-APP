import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import subYears from 'date-fns/subYears';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
  makeStyles,
  useMediaQuery,
  withStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Formik } from 'formik';
import Skeleton from '@material-ui/lab/Skeleton';
import { Prospect, Bank, MVR, Hubspot } from 'src/api';
import { getCookie, getCookieJSON, setCookie } from 'src/utils/cookie';
import { saveUserData, getProspectorProfile } from 'src/redux/actions/user';
import {
  informationValidationSchema,
  rdsValidationSchema,
  rdsAddressValidationSchema,
} from 'src/components/rideShare/GetCarForm/validationSchema';

import { PROSPECT_SOURCE } from 'src/constants';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import CustomPreviousButton from '../../finance/UserForm/CustomPreviousButton';
import generateProspectSource from '../../../utils/generateProspectSource';

let StepOne = dynamic(() => import('./StepOne'), { ssr: false });
let StepTwo = dynamic(() => import('./StepTwo'), { ssr: false });
const StepThree = dynamic(() => import('./StepThree'), { ssr: false });

const useStyles = makeStyles(theme => ({
  formTitle: {
    fontSize: '1.375rem',
    letterSpacing: '0.03em',
  },
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  skeletonMessage: {
    textAlign: 'center',
    fontSize: '1.375rem',
    width: '80%',
  },
}));

const MAX_AVAILABLE_DATE = subYears(new Date(), 16);

const MyDialog = withStyles(theme => ({
  paperWidthMd: {
    [theme.breakpoints.only('xs')]: {
      margin: '20px 15px',
      maxWidth: 'calc(100% - 30px) !important',
    },
  },
  paperFullWidth: {
    [theme.breakpoints.only('xs')]: {
      width: 'calc(100% - 30px) !important',
    },
  },
  paperScrollBody: {
    [theme.breakpoints.only('xs')]: {
      maxWidth: 'calc(100% - 30px) !important',
    },
    maxHeight: 'calc(100% - 40px)',
  },
}))(Dialog);

const GetCarForm = props => {
  const { query } = useRouter();
  const { open, handleClose, handleError, handleRedirectToFinance } = props;
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const [step, setStep] = useState(1);
  const [isShowSkeleton, setShowSkeleton] = useState(false);

  const [state, setState] = useState({
    stepOneValues: {
      firstName: '',
      lastName: '',
      email: '',
      cellPhone: '',
      middleName: '',
    },
    stepTwoValues: {
      socialSecurity: '',
      dateOfBirth: MAX_AVAILABLE_DATE,
      licenseState: '',
      licenseNumber: '',
      rdsCompany: '',
      jobsAmount: null,
    },
    stepThreeValues: {
      address: '',
      homeZip: '',
      city: '',
      state: '',
    },
  });
  const classes = useStyles();

  useEffect(() => {
    const { prospect } = props;
    const rdsData = getCookieJSON('rdsData');
    if (prospect.firstName && prospect.contactNumber) {
      setState({
        ...state,
        stepOneValues: {
          ...state.stepOneValues,
          firstName: prospect.firstName,
          lastName: prospect.lastName,
          email: prospect.email,
          cellPhone: prospect.contactNumber,
        },
        stepTwoValues: {
          ...state.stepTwoValues,
          dateOfBirth: prospect.dob || MAX_AVAILABLE_DATE,
        },
      });
    }
    if (rdsData) {
      const {
        socialSecurity,
        dateOfBirth,
        licenseState,
        jobsAmount,
        licenseNumber,
        rdsCompany,
      } = rdsData;
      setState({
        ...state,
        stepOneValues: {
          firstName: prospect.firstName,
          lastName: prospect.lastName,
          email: prospect.email,
          cellPhone: prospect.contactNumber,
        },
        stepTwoValues: {
          socialSecurity,
          dateOfBirth,
          licenseState,
          licenseNumber,
          rdsCompany,
          jobsAmount,
        },
      });
    }
    // eslint-disable-next-line
  }, [props.prospect]);

  const handleGoNext = () => {
    StepTwo = dynamic(() => import('./StepTwo'), { ssr: false });
    if (step === 1) setStep(step + 1);
  };
  const handleGoPrevious = () => {
    switch (step) {
      case 2:
        StepOne = dynamic(() => import('./StepOne'), { ssr: false });
        setStep(1);
        break;
      case 3:
        StepTwo = dynamic(() => import('./StepTwo'), { ssr: false });
        setStep(pre => pre - 1);
        break;
      default:
        StepOne = dynamic(() => import('./StepOne'), { ssr: false });
        setStep(1);
        break;
    }
  };

  const handleAddProspect = async values => {
    window.dataLayer.push({
      event: 'Rideshare_Level_1',
      RL1: 'Rideshare_Level_1',
    });
    const { firstName, middleName, lastName, email, cellPhone } = values;
    const source = generateProspectSource(PROSPECT_SOURCE.rideShare, query);
    const parseNumber = cellPhone.startsWith('+1')
      ? cellPhone.replace(/\D+/g, '').slice(1)
      : cellPhone.replace(/\D+/g, '');

    const USER_INFORMATION = {
      firstName,
      lastName,
      middleName,
      email,
      contactNumber: parseNumber,
      source,
      category: 'Motopia-RDS',
      referrer: null,
      referrerContactNumber: null,
      promoCode: null,
      password: '',
    };
    let response;
    try {
      response = await Prospect.AddProspect({
        ...USER_INFORMATION,
      });
      props.saveUserData({ prospectId: response.prospectId });
      setCookie('prospectId', response.prospectId);
      props.getProspectorProfile(response.prospectId);
    } catch (error) {
      handleError(error);
    }
    handleGoNext();
  };

  const handleVehicleRentCredit = async values => {
    const {
      socialSecurity,
      dateOfBirth,
      licenseState,
      jobsAmount,
      licenseNumber,
      rdsCompany,
    } = values;
    window.dataLayer.push({
      event: 'Rideshare_Level_2',
      RL2: 'Rideshare_Level_2',
    });

    const prospectId = getCookie('prospectId');

    const RENT_INFORMATION = {
      prospectId: Number(prospectId),
      dob: String(new Date(dateOfBirth).toISOString()),
      ssn: socialSecurity.split('-').join(''),
      drivingLicense: licenseNumber,
      issuedState: licenseState,
      empName: rdsCompany,
      empCity: null,
    };

    try {
      const response = await Bank.CreateCreditApplicationVehicleRent({
        ...RENT_INFORMATION,
      });
      if (response?.status === 'Success') {
        setStep(pre => pre + 1);
        const rdsData = {
          socialSecurity,
          dateOfBirth,
          licenseState,
          licenseNumber,
          rdsCompany,
          jobsAmount,
        };
        setCookie('rdsData', rdsData);
        setCookie('creditId', response.creditId);
        setCookie('jobsAmount', jobsAmount);
      }
    } catch (error) {
      handleError(error.message || error);
    }
  };
  const handleAddressUpdate = useCallback(
    async values => {
      const updatedInfo = {
        creditId: Number(getCookie('creditId')),
        address: values.address,
        zipcode: values?.homeZip,
        state: values?.state,
        city: values?.city,
        ssn: getCookieJSON('rdsData')?.socialSecurity,
        dob: getCookieJSON('rdsData')?.dateOfBirth,
      };
      setShowSkeleton(pre => !pre);
      try {
        const resultInfo = await Bank?.UpdateCreditAppWithDetailsVehicleSale(
          updatedInfo
        );

        if (resultInfo === 'Updated Successfully') {
          const data = {
            creditId: getCookie('creditId'),
            jobsAmount: getCookie('jobsAmount'),
          };

          const mvr = await MVR.getMVRAnalysis(
            data?.creditId,
            data?.jobsAmount
          );
          if (mvr.status !== 'OK') throw new Error(mvr.status);
          else {
            const prospectId = getCookie('prospectId');
            props.getProspectorProfile(+prospectId);
            handleRedirectToFinance();
          }
        }
        setShowSkeleton(pre => !pre);
      } catch (error) {
        handleError(error.message || error);
        setShowSkeleton(pre => !pre);
      }
    },
    [handleError, handleRedirectToFinance, props]
  );

  const handleSubmitFormik = async values => {
    if (step === 1) {
      await handleAddProspect(values);
      await Hubspot.formv3('Ride-share', values);
    }
    if (step === 2) {
      await handleVehicleRentCredit(values);
    }
    if (step === 3) {
      await handleAddressUpdate(values);
    }
  };

  return (
    <>
      <Formik
        validationSchema={
          (step === 1 && informationValidationSchema) ||
          (step === 2 && rdsValidationSchema) ||
          (step === 3 && rdsAddressValidationSchema)
        }
        onSubmit={values => handleSubmitFormik(values)}
        enableReinitialize
        initialValues={
          (step === 1 && { ...state.stepOneValues }) ||
          (step === 2 && { ...state.stepTwoValues }) ||
          (step === 3 && { ...state.stepThreeValues })
        }
        render={formik => (
          <MyDialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="form-dialog-title"
            scroll="body"
          >
            <form
              id={`ride-share-get-car-form-step-${step}`}
              onSubmit={e => formik.handleSubmit(e.preventDefault())}
              style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
            >
              {isShowSkeleton ? (
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <p className={classes.skeletonMessage}>
                    Please bare with us a few moments, while we run your drivers
                    license history. You can download a copy of your MVR in
                    coming screens.
                  </p>
                  {[...Array(4)].map(_ => (
                    <Skeleton
                      key={`index-${_}`}
                      variant="text"
                      width="80%"
                      animation="wave"
                      height={60}
                    />
                  ))}
                </Grid>
              ) : (
                <>
                  <DialogTitle>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={9}>
                        <Typography className={classes.formTitle}>
                          FILL IN THE FORM TO GET YOUR CAR
                        </Typography>
                      </Grid>
                      <Grid item>
                        <IconButton aria-label="delete" onClick={handleClose}>
                          <CloseIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </DialogTitle>
                  <DialogContent>
                    {step === 1 && <StepOne formik={formik} />}
                    {step === 2 && <StepTwo formik={formik} />}
                    {step === 3 && <StepThree formik={formik} />}
                  </DialogContent>
                </>
              )}

              <DialogContent className={classes.financeGridMarginBottom}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid
                    item
                    xs={12}
                    md={6}
                    container
                    justifyContent={matches ? 'center' : 'flex-start'}
                    alignItems="center"
                    style={{ marginBottom: matches && 10 }}
                  >
                    <Typography align={matches ? 'center' : 'left'}>
                      {step}/3
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    container
                    spacing={1}
                    justifyContent={matches ? 'space-between' : 'flex-end'}
                  >
                    {matches ? (
                      <>
                        {step > 1 && (
                          <Grid
                            item
                            xs={6}
                            container
                            justifyContent="flex-start"
                          >
                            <CustomPreviousButton onClick={handleGoPrevious} />
                          </Grid>
                        )}
                        <Grid item xs={6} container justifyContent="flex-end">
                          <CustomPrimaryButton withIcon type="submit">
                            Next
                          </CustomPrimaryButton>
                        </Grid>
                      </>
                    ) : (
                      <>
                        {step > 1 && (
                          <Grid item>
                            <CustomPreviousButton
                              onClick={handleGoPrevious}
                              disabled={!!isShowSkeleton}
                            />
                          </Grid>
                        )}
                        <Grid item>
                          <CustomPrimaryButton
                            withIcon={step !== 3}
                            type="submit"
                            disabled={
                              !!isShowSkeleton ||
                              !formik.dirty ||
                              !formik.isValid
                            }
                          >
                            {step === 3 ? 'SUBMIT' : 'Next'}
                          </CustomPrimaryButton>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </DialogContent>
            </form>
          </MyDialog>
        )}
      />
    </>
  );
};

GetCarForm.propTypes = {
  saveUserData: PropTypes.func.isRequired,
  getProspectorProfile: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  prospect: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
  handleRedirectToFinance: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  saveUserData,
  getProspectorProfile,
};

export default compose(connect(null, mapDispatchToProps)(GetCarForm));
