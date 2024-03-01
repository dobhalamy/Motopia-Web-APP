/* eslint-disable no-plusplus */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import CustomInput from 'components/shared/CustomInput';
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers';
import CustomSelect from '@/components/shared/CustomSelect';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import {
  generatePdfFromImages,
  mapImageToState,
  mediaLengthValidator,
} from '@/utils/commonUtils';
import { isArray, isEmpty } from 'lodash';
import ErrorSnackbar from '@/components/shared/ErrorSnackbar';
import { DMS_POLICE_REPORT_BASE_URL } from '@/constants';
import { PictureAsPdfOutlined } from '@material-ui/icons';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  mediaUploadButton: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  },
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  financeButtonGroup: {
    marginTop: theme.spacing(1.5),
  },
  root: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.secondary.main,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: theme.palette.common.white,
    transition: theme.transitions.create(['border-color']),
    '&:hover': {
      backgroundColor: theme.palette.common.white,
      borderColor: theme.palette.secondary.main,
    },
    '&$focused': {
      backgroundColor: theme.palette.common.white,
      borderColor: theme.palette.secondary.main,
    },
  },
  input: {
    boxSizing: 'border-box',
    padding: `${theme.spacing(5)}px ${theme.spacing(1.5)}px ${theme.spacing(
      1.25
    )}px`,
  },
  picker: {
    '& p': {
      color: '#FD151B !important',
      marginLeft: '14px',
      marginRight: '14px',
    },
  },
  lableError: {
    '& label': {
      color: '#FD151B !important',
    },
  },

  mediaUpload: {
    cursor: 'pointer',
    '& video': {
      marginTop: '2rem',
      aspectRatio: '16/9',
      width: '60%',
      height: '60%',
      maxHeight: '80%',
      maxWidth: '80%',
      [theme.breakpoints.down('md')]: {
        margin: '1rem auto',
        width: 'auto',
        height: 'auto',
      },
    },
  },
  pdfIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageCard: {
    border: '3px solid #ffae02',
    borderRadius: '5%',
    marginRight: '1rem',
  },
  mobileView: {
    textAlign: 'center',
  },
}));

const StepOne = props => {
  const { formik } = props;
  const [mediaError, setMediaError] = useState(null);
  const [policeReportMedia, setPoliceReportMedia] = useState([]);
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const gridSpacing = matches ? 1 : 3;

  useEffect(() => {
    if (
      isArray(formik.initialValues.policeReportFootage) &&
      formik.initialValues.policeReportFootage.length > 0 &&
      formik.initialValues.policeReportFootage[0] !== ''
    ) {
      setPoliceReportMedia(() =>
        mapImageToState(
          formik.initialValues.policeReportFootage,
          DMS_POLICE_REPORT_BASE_URL
        )
      );
    }
  }, [
    formik.initialValues.photoFootage,
    formik.initialValues.policeReportFootage,
  ]);
  const setMedia = useCallback(acceptedFiles => {
    setPoliceReportMedia(() =>
      acceptedFiles.map(file => ({
        preview: URL.createObjectURL(file),
        type: file.type,
      }))
    );
  }, []);
  const handleErrorMessage = useCallback(errorMsg => {
    if (errorMsg !== null) {
      setMediaError(() => errorMsg);
    } else {
      setMediaError(() => null);
    }
  }, []);
  const getBase64 = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const pdfFile = [await generatePdfFromImages(reader.result, file.type)];
      formik.setFieldValue('policeReportFootage', pdfFile);
      setMedia(pdfFile);
    };
    reader.onerror = error => {
      console.error('Error: ', error);
    };
  };
  const {
    getRootProps: getRootPhotoProps,
    getInputProps: getInputPhotoProps,
  } = useDropzone({
    accept: {
      'application/pdf': [],
      'image/png': [],
      'image/jpg': [],
      'image/jpeg': [],
      'image/webp': [],
    },
    validator: mediaLengthValidator,
    multiple: false,
    onDrop: (acceptedFiles, fileRejections) => {
      if (!isEmpty(fileRejections)) {
        handleErrorMessage(fileRejections[0].errors[0].message);
      } else if (acceptedFiles[0].type !== 'application/pdf') {
        getBase64(acceptedFiles[0]);
      } else {
        formik.setFieldValue('policeReportFootage', acceptedFiles);
        setMedia(acceptedFiles);
      }
    },
  });

  const handlePdfDownload = useCallback(preview => {
    window.open(preview);
  }, []);
  const renderPoliceReportMedia = useCallback(
    () =>
      policeReportMedia &&
      policeReportMedia.length > 0 &&
      policeReportMedia.map((item, index) => (
        <Button
          color="primary"
          onClick={() => handlePdfDownload(item.preview)}
          key={`${item.preview || item}_${Number(index)}`}
        >
          <PictureAsPdfOutlined fontSize="large" />
        </Button>
      )),
    [handlePdfDownload, policeReportMedia]
  );
  return (
    <>
      <Grid
        container
        spacing={gridSpacing}
        className={classes.financeGridMarginBottom}
      >
        <Grid
          item
          xs={12}
          md={4}
          className={classNames(classes.picker, {
            [classes.lableError]:
              formik.errors.incidentDate && formik.touched.incidentDate,
          })}
        >
          <KeyboardDatePicker
            autoOk
            fullWidth
            disableFuture
            allowKeyboardControl
            label="Incident Date"
            format="MM/dd/yyyy"
            value={formik.values.incidentDate}
            error={!!formik.errors.incidentDate && formik.touched.incidentDate}
            helperText={formik.errors.incidentDate}
            onBlur={formik.handleBlur}
            onChange={value => {
              formik.setFieldValue('incidentDate', value);
            }}
            InputAdornmentProps={{ position: 'end' }}
            variant="filled"
            name="IncidentDate"
            InputProps={{
              classes: {
                root: classes.root,
                input: classes.input,
              },
              disableUnderline: true,
              style: {
                height: 90,
                marginTop: 0,
                borderColor: formik.errors.incidentDate ? '#FD151B' : '#001C5E',
              },
            }}
            InputLabelProps={{
              shrink: false,
              style: {
                zIndex: 1,
                transform: 'translate(12px, 20px) scale(1)',
                color: formik.errors.incidentDate ? '#FD151B' : '#001C5E',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TimePicker
            fullWidth
            label="Incident time"
            name="incidentTime"
            value={formik.values.incidentTime}
            onChange={time => {
              formik.setFieldValue('incidentTime', time);
            }}
            error={!!formik.errors.incidentTime && formik.touched.incidentTime}
            helperText={formik.errors.incidentTime}
            InputProps={{
              classes: {
                root: classes.root,
                input: classes.input,
              },
              style: {
                height: 90,
                marginTop: 0,
                borderColor: formik.errors.incidentTime ? '#FD151B' : '#001C5E',
              },
              disableUnderline: true,
            }}
            InputLabelProps={{
              shrink: false,
              style: {
                zIndex: 1,
                transform: 'translate(12px, 20px) scale(1)',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomInput
            fullWidth
            label="Incident intersection"
            placeholder="Corner of 47th street and 2nd ave"
            name="incidentIntersection"
            hasError={
              !!formik.errors.incidentIntersection &&
              formik.touched.incidentIntersection
            }
            errorMessage={formik.errors.incidentIntersection}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.incidentIntersection}
          />
        </Grid>
      </Grid>
      <Grid container spacing={gridSpacing} style={{ marginBottom: 0 }}>
        <Grid item xs={12} md={4}>
          <CustomInput
            fullWidth
            label="How incident happened?"
            name="incidentHappened"
            placeholder="How incident happened?"
            hasError={
              !!formik.errors.incidentHappened &&
              formik.touched.incidentHappened
            }
            errorMessage={formik.errors.incidentHappened}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.incidentHappened}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomSelect
            fullWidth
            options={[
              { text: 'Undecided', value: 'Undecided' },
              { text: 'My fault', value: 'My fault' },
              { text: 'Other driver fault', value: 'Other driver fault' },
            ]}
            label="Fault"
            name="fault"
            placeholder="Fault"
            hasError={!!formik.errors.fault && formik.touched.fault}
            errorMessage={formik.errors.fault}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.fault}
          />
          {matches === false && formik.values.policeReport === 'Yes' && (
            <div className={classes.pdfIcon}>{renderPoliceReportMedia()}</div>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomSelect
            fullWidth
            options={[
              { text: 'Yes', value: 'Yes' },
              { text: 'No', value: 'No' },
            ]}
            label="Police report filed ?"
            name="policeReport"
            placeholder="Police report filed ?"
            hasError={
              !!formik.errors.policeReport && formik.touched.policeReport
            }
            errorMessage={formik.errors.policeReport}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.policeReport}
          />
          {formik.values.policeReport === 'Yes' && (
            <Grid item xs={12} md={12} className={classes.mediaUpload}>
              <section className={classes.mediaUploadButton}>
                <div {...getRootPhotoProps()}>
                  <input {...getInputPhotoProps()} />
                  <p>Have police report? (click to upload)</p>
                </div>
              </section>
              {matches && formik.values.policeReport === 'Yes' && (
                <div className={classes.mobileView}>
                  {renderPoliceReportMedia()}
                </div>
              )}
            </Grid>
          )}
        </Grid>
        <ErrorSnackbar
          showErrorBar={!!mediaError}
          error={mediaError}
          closeErrorBar={() => handleErrorMessage(null)}
        />
      </Grid>
    </>
  );
};

StepOne.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default StepOne;
