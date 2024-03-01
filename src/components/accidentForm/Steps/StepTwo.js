import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CustomInput from 'components/shared/CustomInput';
import CustomSelect from 'components/shared/CustomSelect';
import { useDropzone } from 'react-dropzone';
import { Box, CardMedia } from '@material-ui/core';
import ErrorSnackbar from '@/components/shared/ErrorSnackbar';
import { isEmpty } from 'lodash';
import { DMS_VIDEO_BASE_URL, DMS_PHOTO_BASE_URL } from '@/constants';
import { mapImageToState, mediaLengthValidator } from '@/utils/commonUtils';

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
  errorBorder: {
    borderColor: theme.palette.error.main,
  },
  input: {
    boxSizing: 'border-box',
    padding: `${theme.spacing(5)}px ${theme.spacing(1.5)}px ${theme.spacing(
      1.25
    )}px`,
  },
  toggleFont: {
    margin: 0,
    fontWeight: 500,
  },
  pinContainer: {
    marginBottom: '2rem',
    width: '100%',
  },
  socialSecurity: {
    position: 'relative',
  },
  socialSecurityPin: {
    position: 'absolute',
    bottom: '9rem',
    [theme.breakpoints.down('md')]: {
      bottom: '4.5rem',
      right: '3.2rem',
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
  imageCard: {
    border: '3px solid #ffae02',
    borderRadius: '5%',
    marginTop: '2rem',
    marginRight: '1rem',
  },
}));

const StepTwo = props => {
  const { formik } = props;
  const classes = useStyles();
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState({
    videoURL: '',
  });

  const [mediaError, setMediaError] = useState('');
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const gridSpacing = matches ? 1 : 3;
  const isRideShareSelected = formik.values.doingRideShareJob === 'Yes';

  useEffect(() => {
    if (
      formik.initialValues.photoFootage &&
      formik.initialValues.photoFootage[0] !== ''
    ) {
      setImageFiles(() =>
        mapImageToState(formik.initialValues.photoFootage, DMS_PHOTO_BASE_URL)
      );
    }
    if (formik.initialValues.videoFootage) {
      setVideoFiles(() => ({
        videoURL: DMS_VIDEO_BASE_URL + formik.initialValues.videoFootage,
      }));
    }
  }, [formik.initialValues.photoFootage, formik.initialValues.videoFootage]);
  const handleErrorMessage = errorMsg => {
    if (errorMsg) {
      setMediaError(() => errorMsg);
    } else {
      setMediaError(() => null);
    }
  };
  const {
    getRootProps: getRootPhotoProps,
    getInputProps: getInputPhotoProps,
  } = useDropzone({
    accept: {
      'image/png': [],
      'image/jpg': [],
      'image/jpeg': [],
      'image/webp': [],
    },
    validator: mediaLengthValidator,
    multiple: true,
    onDrop: (acceptedFiles, fileRejections) => {
      if (!isEmpty(fileRejections)) {
        handleErrorMessage(fileRejections[0].errors[0].message);
      } else {
        formik.setFieldValue('photoFootage', acceptedFiles);
        setImageFiles(() =>
          acceptedFiles.map(file => ({
            preview: URL.createObjectURL(file),
          }))
        );
      }
    },
  });

  const {
    getRootProps: getRootVideoProps,
    getInputProps: getInputVideoProps,
  } = useDropzone({
    accept: {
      'video/*': [],
    },
    multiple: false,
    maxFiles: 1,
    validator: mediaLengthValidator,
    onDrop: (acceptedFiles, fileRejections) => {
      if (!isEmpty(fileRejections)) {
        handleErrorMessage(fileRejections[0].errors[0].message);
      } else {
        formik.setFieldValue('videoFootage', [acceptedFiles[0]]);
        setVideoFiles(pre => ({
          ...pre,
          videoURL: URL.createObjectURL(acceptedFiles[0]),
        }));
      }
    },
  });

  const renderImagePreview = useMemo(
    () =>
      imageFiles &&
      imageFiles.map((item, index) => (
        <Box
          key={`${item.preview || item}_${Number(index)}`}
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          className={classes.imageCard}
          alt={item.preview || 'accident-image'}
          src={item.preview}
        />
      )),
    [classes.imageCard, imageFiles]
  );

  return (
    <>
      <Typography gutterBottom variant="body1">
        Driver information
      </Typography>
      <Grid
        container
        spacing={gridSpacing}
        className={classes.financeGridMarginBottom}
        style={{ marginBottom: 0 }}
      >
        <Grid item xs={12} md={6}>
          <CustomInput
            fullWidth
            label="Number of vehicles involved"
            name="vehiclesInvolved"
            type="number"
            placeholder="Number of vehicles involved"
            hasError={
              !!formik.errors.vehiclesInvolved &&
              formik.touched.vehiclesInvolved
            }
            errorMessage={formik.errors.vehiclesInvolved}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.vehiclesInvolved}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            label="Number injured"
            name="numberInjured"
            placeholder="Number of Injured"
            type="number"
            fullWidth
            hasError={
              !!formik.errors.numberInjured && formik.touched.numberInjured
            }
            errorMessage={formik.errors.numberInjured}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.numberInjured}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomSelect
            fullWidth
            options={[
              { text: 'Yes', value: 'Yes' },
              { text: 'No', value: 'No' },
            ]}
            label="Was doing ride share job ?"
            name="doingRideShareJob"
            placeholder="Selet an option "
            hasError={
              !!formik.errors.doingRideShareJob &&
              formik.touched.doingRideShareJob
            }
            errorMessage={formik.errors.doingRideShareJob}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.doingRideShareJob}
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.socialSecurity}>
          <CustomInput
            label="Rideshare Platform"
            name="rideSharePlatform"
            placeholder="Rideshare Platform"
            fullWidth
            hasError={
              isRideShareSelected &&
              !!formik.errors.rideSharePlatform &&
              formik.touched.rideSharePlatform
            }
            errorMessage={
              isRideShareSelected && formik.errors.rideSharePlatform
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={isRideShareSelected ? formik.values.rideSharePlatform : ''}
            disabled={!isRideShareSelected}
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.mediaUpload}>
          <section className={classes.mediaUploadButton}>
            <div {...getRootVideoProps()}>
              <input {...getInputVideoProps()} />
              <p>Have Video footage? (click to upload)</p>
            </div>
          </section>
          {formik.values.videoFootage !== '' && (
            <CardMedia
              component="video"
              src={videoFiles.videoURL}
              title={
                formik.values.videoFootage
                  ? formik.values.videoFootage.name
                  : ''
              }
              controls
            />
          )}
        </Grid>
        <Grid item xs={12} md={6} className={classes.mediaUpload}>
          <section className={classes.mediaUploadButton}>
            <div {...getRootPhotoProps()}>
              <input {...getInputPhotoProps()} />
              <p>Have photo footage? (click to upload)</p>
            </div>
          </section>
          {formik.values.photoFootage !== '' && renderImagePreview}
        </Grid>
      </Grid>
      <ErrorSnackbar
        showErrorBar={!!mediaError}
        error={mediaError}
        closeErrorBar={() => handleErrorMessage(null)}
      />
    </>
  );
};

StepTwo.propTypes = {
  formik: PropTypes.object.isRequired,
};
export default StepTwo;
