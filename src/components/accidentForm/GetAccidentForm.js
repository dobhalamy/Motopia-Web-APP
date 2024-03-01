/* eslint-disable prefer-destructuring */
/* eslint-disable quotes */
import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  makeStyles,
  useMediaQuery,
} from '@material-ui/core';
import { Formik } from 'formik';
import Skeleton from '@material-ui/lab/Skeleton';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import {
  stepOneValidationSchema,
  stepTwoValidationSchema,
} from '@/components/accidentForm/Steps/ValidationSchema';
import { CloseOutlined } from '@material-ui/icons';
import { format } from 'date-fns';

import axios from 'axios';
import { Accident } from '@/api';

import { DMS_MEDIA_UPLOAD } from '@/constants';
import { useRouter } from 'next/router';
import { isArray } from 'lodash';
import CustomPreviousButton from '../finance/UserForm/CustomPreviousButton';
import AccidentFormSuccess from './AccidentFormSuccess';
import ErrorSnackbar from '../shared/ErrorSnackbar';

let StepOne = dynamic(() => import('./Steps/StepOne'), { ssr: false });
let StepTwo = dynamic(() => import('./Steps/StepTwo'), { ssr: false });
const StepThree = dynamic(() => import('./Steps/StepThree'), { ssr: false });

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

const INITIAL_VALUES = {
  stepOneValues: {
    incidentDate: null,
    incidentTime: null,
    incidentIntersection: '',
    incidentHappened: '',
    fault: '',
    policeReport: 'No',
    policeReportFootage: '',
  },
  stepTwoValues: {
    vehiclesInvolved: '',
    numberInjured: '',
    doingRideShareJob: 'No',
    rideSharePlatform: '',
    videoFootage: '',
    photoFootage: '',
  },
  stepThreeValues: {
    odLicenseID: '',
    odFirstName: '',
    odMiddleName: '',
    odLastName: '',
    odAdress: '',
    odZip: null,
    odCity: '',
    odState: '',
    odPlateNumber: '',
    odStateOfReg: '',
  },
};

const GetAccidentForm = ({ setShowForm, activeAccident, setDisplaySucess }) => {
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const [step, setStep] = useState(1);
  const [isShowSkeleton, setShowSkeleton] = useState(false);
  const [accidentError, setAccidentError] = useState('');
  const [recordId, setRecordId] = useState(null);
  const classes = useStyles();
  const { query } = useRouter();
  const [accidentData, setAccidentData] = useState(INITIAL_VALUES);

  const setEditData = useCallback(async () => {
    setShowSkeleton(pre => !pre);
    const res = await Accident.GetAccidentReportById(activeAccident.id);
    if (res.data && res.data) {
      const activeAccidents = res.data;
      setAccidentData(() => ({
        stepOneValues: {
          incidentDate: activeAccidents.incidentDate || null,
          incidentTime:
            new Date(`2022-01-12 ${activeAccidents.incidentTime}`) || null,
          incidentIntersection: activeAccidents.incidentIntersection || '',
          incidentHappened: activeAccidents.accidentDesc || '',
          fault: activeAccidents.fault || '',
          policeReport: activeAccidents.policeReportFiled ? 'Yes' : 'No',
          policeReportFootage: activeAccidents.policeReportName || [],
        },
        stepTwoValues: {
          vehiclesInvolved: Number(activeAccidents.vehiclesInvovled || 0),
          numberInjured: Number(activeAccidents.numberInjured || 0),
          doingRideShareJob: activeAccidents.rideshareJobs ? 'Yes' : 'No',
          rideSharePlatform: activeAccidents.ridesharePlatform || '',
          videoFootage: activeAccidents.videoFootage || '',
          photoFootage: [...activeAccidents.photoFootage] || [],
        },
        stepThreeValues: {
          odLicenseID: activeAccidents.odLicenseId || '',
          odFirstName: activeAccidents.odFirstName || '',
          odMiddleName: activeAccidents.odMiddleName || '',
          odLastName: activeAccidents.odLastName || '',
          odAdress: activeAccidents.odAddress || '',
          odZip: activeAccidents.odZip || '',
          odCity: activeAccidents.odCity || '',
          odState: activeAccidents.odState || '',
          odPlateNumber: activeAccidents.odPlateNumber || '',
          odStateOfReg: activeAccidents.odRegState || '',
        },
      }));
      setShowSkeleton(pre => !pre);
    }
  }, [activeAccident.id]);

  // set data to accident form
  useEffect(() => {
    if (activeAccident.id) {
      setEditData();
    }
  }, [activeAccident, setEditData]);

  const handleGoNext = useCallback(() => {
    if (step === 3) {
      setShowSkeleton(() => false);
      setShowForm(() => false);
      setDisplaySucess(() => true);
    } else {
      setStep(step + 1);
    }
    setShowSkeleton(() => false);
  }, [setDisplaySucess, setShowForm, step]);

  // post form data
  const postFormData = useCallback(
    async dataToPost => {
      setShowSkeleton(() => true);
      try {
        const response = await Accident.addUpdateAccidentReport(dataToPost);
        if (response.data && response.data.accidentId) {
          setRecordId(response.data.accidentId);
        }
        handleGoNext();
      } catch (error) {
        console.error(error);
      }
    },
    [handleGoNext]
  );

  // managing the form data and sending with api
  const postData = useCallback(
    async (values, { resetForm }) => {
      let val = {};
      let error = false;

      if (step === 1) {
        val = {
          AccountId: Number(activeAccident.accidentId || query.accountId),
          IncidentDate: values.incidentDate,
          IncidentTime: format(values.incidentTime, 'HH:mm:ss'),
          AccidentDesc: values.incidentHappened,
          IncidentIntersection: values.incidentIntersection,
          Fault: values.fault === 'My fault' ? 'Our driver' : 'Other driver',
          policeReportFiled: values.policeReport === 'Yes' || false,
        };
      }
      if (activeAccident.id) {
        val.Id = Number(activeAccident.id);
      }
      if (step === 2) {
        val = {
          Id: Number(activeAccident.id) || Number(recordId),
          VehiclesInvovled: Number(values.vehiclesInvolved),
          NumberInjured: Number(values.numberInjured),
          RideShareJobs: true,
          RideSharePlatform: values.rideSharePlatform,
        };
      }
      if (step === 3) {
        val = {
          Id: Number(activeAccident.id) || Number(recordId),
          ODLicenseId: values.odLicenseID,
          ODFirstName: values.odFirstName,
          ODMiddleName: values.odMiddleName,
          ODLastName: values.odLastName,
          ODAddress: values.odAdress,
          ODZip: Number(values.odZip),
          ODCity: values.odCity,
          ODState: values.odState,
          ODPlateNumber: values.odPlateNumber,
          ODRegState: values.odStateOfReg,
        };
      }

      if (isArray(values.photoFootage) && values.photoFootage.length > 0) {
        const photoFormData = new FormData();
        values.photoFootage.forEach((item, index) => {
          if (item.path) {
            const extension = item.path.split('.')[1];
            let pathName = `FALSE_${query.accountId}_${activeAccident.id}_PHOTOFOOTAGE_${index}.${extension}`;
            if (
              accidentData.stepTwoValues.photoFootage[0] !== '' &&
              index < accidentData.stepTwoValues.photoFootage.length
            ) {
              pathName = `TRUE_${accidentData.stepTwoValues.photoFootage[index]}`;
            }
            photoFormData.append('PhotoFootage', item, pathName);
          }
        });
        if (photoFormData.has('PhotoFootage')) {
          try {
            const response = await axios.post(DMS_MEDIA_UPLOAD, photoFormData);
            val.PhotoFootage = response.data.path;
          } catch (err) {
            console.error(error);
          }
        }
      }
      if (isArray(values.policeReportFootage)) {
        const policeReportFormData = new FormData();
        const policeReoprtFootage = values.policeReportFootage[0];
        if (policeReoprtFootage && policeReoprtFootage.name) {
          const extension = policeReoprtFootage.name.split('.')[1];
          let pathName = `FALSE_${query.accountId}_${activeAccident.id}_POLICEREPORT.${extension}`;
          if (accidentData.stepOneValues.policeReportFootage[0] !== '') {
            pathName = `TRUE_${accidentData.stepOneValues.policeReportFootage[0]}`;
          }
          policeReportFormData.append(
            'PoliceReport',
            policeReoprtFootage,
            pathName
          );
        }

        if (policeReportFormData.has('PoliceReport')) {
          try {
            const response = await axios.post(
              DMS_MEDIA_UPLOAD,
              policeReportFormData
            );
            if (response.data.path) {
              val.policeReportName = response.data.path;
            } else {
              error = true;
              setAccidentError('Error uploading media. Please try again');
            }
          } catch (err) {
            resetForm();
          }
        }
      }
      if (isArray(values.videoFootage)) {
        const videoFormData = new FormData();
        const extension = values.videoFootage[0].path.split('.')[1];
        let pathName = `FALSE_${query.accountId}_${activeAccident.id}_VIDEOFOOTAGE.${extension}`;
        if (accidentData.stepTwoValues.videoFootage) {
          pathName = `TRUE_${accidentData.stepTwoValues.videoFootage}`;
        }
        // append videoFootage to form data
        videoFormData.append('VideoFootage', values.videoFootage[0], pathName);
        try {
          const response = await axios.post(DMS_MEDIA_UPLOAD, videoFormData);
          val.VideoFootage = response.data.path;
        } catch (err) {
          resetForm();
        }
      }
      if (!error) {
        error = false;
        postFormData(val);
      }
      resetForm();
    },
    [
      accidentData.stepOneValues.policeReportFootage,
      accidentData.stepTwoValues.photoFootage,
      accidentData.stepTwoValues.videoFootage,
      activeAccident.accidentId,
      activeAccident.id,
      postFormData,
      query.accountId,
      recordId,
      step,
    ]
  );

  const handleGoPrevious = useCallback(() => {
    switch (step) {
      case 2:
        StepOne = dynamic(() => import('./Steps/StepOne'), { ssr: false });
        setStep(1);
        break;
      case 3:
        StepTwo = dynamic(() => import('./Steps/StepTwo'), { ssr: false });
        setStep(pre => pre - 1);
        break;
      default:
        StepOne = dynamic(() => import('./Steps/StepOne'), { ssr: false });
        setStep(1);
        break;
    }
  }, [step]);

  const handleSubmitFormik = useCallback(
    async (values, { resetForm }) => {
      setShowSkeleton(true);
      if (step === 1) {
        await postData(values, { resetForm });
      }
      if (step === 2) {
        await postData(values, { resetForm });
      }
      if (step === 3) {
        await postData(values, { resetForm });
      }
      setShowSkeleton(false);
    },
    [postData, step]
  );

  return (
    <>
      {step > 3 ? (
        <AccidentFormSuccess />
      ) : (
        <>
          <Formik
            validationSchema={
              (step === 1 && stepOneValidationSchema) ||
              (step === 2 && stepTwoValidationSchema)
            }
            onSubmit={handleSubmitFormik}
            enableReinitialize
            initialValues={
              (step === 1 && accidentData.stepOneValues) ||
              (step === 2 && accidentData.stepTwoValues) ||
              (step === 3 && accidentData.stepThreeValues)
            }
            render={formik => (
              <form
                id={`accident-form-${step}`}
                onSubmit={e => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
              >
                {isShowSkeleton ? (
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {[1, 2, 3, 4].map(_ => (
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
                        style={{
                          flexWrap: 'nowrap',
                        }}
                      >
                        <Grid item>
                          <Typography className={classes.formTitle}>
                            {step === 3
                              ? "Please fill in the Other Driver (OD) vehicle information (skip whatever you don't have)"
                              : 'FILL IN THE FORM FOR ACCIDENT DETAILS'}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          onClick={() => {
                            setShowForm(false);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <CloseOutlined />
                        </Grid>
                      </Grid>
                    </DialogTitle>
                    <DialogContent>
                      {step === 1 && <StepOne formik={formik} />}
                      {step === 2 && <StepTwo formik={formik} />}
                      {step === 3 && <StepThree formik={formik} />}
                    </DialogContent>
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
                          justifyContent="flex-start"
                          alignItems="center"
                          style={{ marginBottom: matches && 10 }}
                        >
                          <Typography align="left">{step}/3</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          container
                          spacing={1}
                          justifyContent="flex-end"
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
                                  <CustomPreviousButton
                                    onClick={handleGoPrevious}
                                  />
                                </Grid>
                              )}
                              <Grid
                                item
                                xs={6}
                                container
                                justifyContent="flex-end"
                              >
                                <CustomPrimaryButton
                                  withIcon
                                  type="submit"
                                  // onClick={handleSubmitFormik}
                                >
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
                                  disabled={!!isShowSkeleton}
                                  // onClick={handleSubmitFormik}
                                >
                                  {step === 3 ? 'Submit' : 'Next'}
                                </CustomPrimaryButton>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <ErrorSnackbar
                      showErrorBar={!!accidentError}
                      error={accidentError}
                      closeErrorBar={() => setAccidentError(null)}
                    />
                  </>
                )}
              </form>
            )}
          />
        </>
      )}
    </>
  );
};
GetAccidentForm.propTypes = {
  setShowForm: PropTypes.func,
  setDisplaySucess: PropTypes.func,
  activeAccident: PropTypes.object,
};
GetAccidentForm.defaultProps = {
  setShowForm: () => {},
  setDisplaySucess: () => {},
  activeAccident: {},
};
export default GetAccidentForm;
