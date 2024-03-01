import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { User } from 'src/api';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import CustomInput from 'components/shared/CustomInput';

import { applyAdsQuery } from '@/utils/commonUtils';
import ForgottenPasswordValidationSchema from './ForgottenPasswordValidationSchema';

import { FORGOTTEN_PASSWORD_TEXT } from './constants';

const useStyles = makeStyles(theme => ({
  ForgottenPasswordContainer: {
    minHeight: theme.spacing(48),
  },
  formTitleContainer: {
    marginBottom: theme.spacing(2),
  },
  bigButton: {
    width: '100%',
    height: 110,
  },
}));

function ForgottenPassword(props) {
  const OTP = 'otp';
  const PHONE = 'phone';
  const PASSWORD = 'password';
  const classes = useStyles();
  const Router = useRouter();
  const adsQuery = applyAdsQuery(Router.query);

  const [state, setState] = React.useState({
    password: '',
    passwordConfirmation: '',
    phone: '',
    otp: '',
    showPassword: false,
    formActiveStep: PHONE,
    showErrorBar: false,
    error: '',
    successNewPasswordDialogOpen: false,
  });

  const handleClickShowPassword = () => {
    setState({
      ...state,
      showPassword: !state.showPassword,
    });
  };

  const handleFieldsChange = name => event => {
    event.persist();
    setState({
      ...state,
      [name]: event.target.value,
    });
    props.setFieldValue(name, event.target.value);
  };

  const handleNextFormActiveStep = step =>
    setState({ ...state, formActiveStep: step });

  const handleGenerateOtp = phone => async () => {
    let verifyPhoneNumberResponse;
    let generateOtpResponse;
    try {
      verifyPhoneNumberResponse = await User.VerifyPhoneNumber(phone.replace(/\D+/g, '').slice(1));
      generateOtpResponse = await User.GenerateOtp(phone.replace(/\D+/g, '').slice(1));
    } catch (error) {
      setState({
        ...state,
        showErrorBar: true,
        error:
          verifyPhoneNumberResponse.errorMessage ||
          generateOtpResponse.errorMessage,
      });
    }
    handleNextFormActiveStep(OTP);
  };

  const handleSaveNewPassword = async () => {
    let resetPasswordResponse;
    try {
      resetPasswordResponse = await User.ResetPassword(
        state.otp,
        state.password
      );
    } catch (error) {
      setState({
        ...state,
        showErrorBar: true,
        error: resetPasswordResponse.errorMessage,
      });
    }

    setState({ ...state, successNewPasswordDialogOpen: true });
    setTimeout(Router.push({ pathname: '/', query: { ...adsQuery } }), 3000);
  };

  const handleCloseSuccessNewPasswordDialog = () =>
    setState({ ...state, successNewPasswordDialogOpen: false });

  const renderPhoneInput = () => (
    <CustomInput
      label="PHONE"
      withPhoneMask
      name="phone"
      type="phone"
      onChange={handleFieldsChange('phone')}
      hasError={!!props.errors.phone && props.touched.phone}
      errorMessage={props.errors.phone}
      onBlur={props.handleBlur}
      fullWidth
    />
  );

  const renderOtpInput = () => (
    <CustomInput
      label="ONE TIME PASSWORD"
      name="otp"
      type="otp"
      onChange={handleFieldsChange('otp')}
      hasError={!!props.errors.otp && props.touched.otp}
      errorMessage={props.errors.otp}
      onBlur={props.handleBlur}
      fullWidth
    />
  );

  const renderPasswordInputs = () => (
    <>
      <CustomInput
        label="NEW PASSWORD"
        name="password"
        type={state.showPassword ? 'text' : 'password'}
        onChange={handleFieldsChange('password')}
        hasError={!!props.errors.password && props.touched.password}
        errorMessage={props.errors.password}
        onBlur={props.handleBlur}
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={props.handleMouseDownPassword}
            >
              {state.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      <CustomInput
        label="CONFIRM NEW PASSWORD"
        name="passwordConfirmation"
        type={state.showPassword ? 'text' : 'password'}
        onChange={handleFieldsChange('passwordConfirmation')}
        hasError={
          !!props.errors.passwordConfirmation &&
          props.touched.passwordConfirmation
        }
        errorMessage={props.errors.passwordConfirmation}
        onBlur={props.handleBlur}
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={props.handleMouseDownPassword}
            >
              {state.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
    </>
  );

  return (
    <Grid item container className={classes.ForgottenPasswordContainer}>
      <Grid
        className={classes.formTitleContainer}
        item
        xs={props.gridSize(6)}
        container
        alignItems="flex-start"
        justifyContent="space-between"
        direction="column"
      >
        <Grid item>
          <Typography
            style={{ marginBottom: 10 }}
            variant="h5"
            color="textPrimary"
          >
            {FORGOTTEN_PASSWORD_TEXT[state.formActiveStep].title}
          </Typography>
          <Typography variant="body1" color="textPrimary">
            {FORGOTTEN_PASSWORD_TEXT[state.formActiveStep].subtitle}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        xs={props.gridSize(6)}
        container
        alignItems="flex-start"
        justifyContent="space-between"
        direction="column"
        spacing={props.isMobile ? 2 : 0}
      >
        {state.formActiveStep === PHONE && renderPhoneInput()}
        {state.formActiveStep === OTP && renderOtpInput()}
        {state.formActiveStep === PASSWORD && renderPasswordInputs()}
        <Button
          color="secondary"
          style={{ textTransform: 'none' }}
          variant="text"
          onClick={props.handleDisableForgottenPassword}
        >
          Back to Sign In
        </Button>
        {state.formActiveStep === PHONE && (
          <Button
            className={classes.bigButton}
            variant="contained"
            color="primary"
            onClick={handleGenerateOtp(state.phone)}
          >
            Request password change
          </Button>
        )}
        {state.formActiveStep === OTP && (
          <Button
            className={classes.bigButton}
            variant="contained"
            color="primary"
            onClick={() => handleNextFormActiveStep(PASSWORD)}
          >
            Reset Password
          </Button>
        )}
        {state.formActiveStep === PASSWORD && (
          <Button
            className={classes.bigButton}
            variant="contained"
            color="primary"
            onClick={handleSaveNewPassword}
          >
            Save new password
          </Button>
        )}
      </Grid>
      <Dialog
        open={state.successNewPasswordDialogOpen}
        onClose={handleCloseSuccessNewPasswordDialog}
      >
        <DialogTitle>Password changed successfully</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will be redirected to Sign In page.
            <br />
            Please login with new Password.
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <ErrorSnackbar showErrorBar={state.showErrorBar} error={state.error} />
    </Grid>
  );
}

ForgottenPassword.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  gridSize: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  handleMouseDownPassword: PropTypes.func.isRequired,
  handleDisableForgottenPassword: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default compose(
  withFormik({
    mapPropsToValues: () => ({
      password: '',
      passwordConfirmation: '',
      email: '',
    }),
    validationSchema: ForgottenPasswordValidationSchema,
  })
)(ForgottenPassword);
