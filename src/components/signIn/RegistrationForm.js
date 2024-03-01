import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withFormik } from 'formik';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import CustomInput from 'components/shared/CustomInput';
import { PROSPECT_SOURCE } from 'src/constants';
import { User } from 'src/api';
import { setCookie, getCookieJSON, removeCookie } from 'src/utils/cookie';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import { saveUserData } from 'src/redux/actions/user';
import { applyAdsQuery } from '@/utils/commonUtils';
import {
  googleValidation,
  simpleRegistration,
} from './RegistrationValidationSchema';

const useStyles = makeStyles(theme => ({
  bigButton: {
    width: '100%',
    height: 110,
  },
  registrationFormTitle: {
    margin: `${theme.spacing(1.25)}px 0px`,
  },
  policyLink: {
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacing(1.5),
  },
}));

function RegistrationForm(props) {
  const classes = useStyles();
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);

  const [state, setState] = React.useState({
    showPassword: false,
    createAccountError: null,
    showErrorBar: false,
    firstName: '',
    lastName: '',
    middleName: null,
    email: '',
    phone: '',
    password: '',
    googleId: '',
    passwordConfirmation: '',
    source: PROSPECT_SOURCE.login,
    category: 'Sale',
  });
  React.useEffect(() => {
    if (Object.values(router.query).length > 0) {
      setState({
        ...state,
        source: router.query.source
          ? PROSPECT_SOURCE[router.query.source]
          : PROSPECT_SOURCE.login,
        category: router.query.category ? 'Rental' : 'Sale',
      });
    }
    if (getCookieJSON('userInfo')) {
      const userInfo = getCookieJSON('userInfo');
      props.setFieldValue('firstName', userInfo.firstName);
      props.setFieldValue('lastName', userInfo.lastName);
      props.setFieldValue('email', userInfo.email);
      props.setFieldValue('phone', userInfo.cellPhone);
      setState(pre => ({ ...pre, ...userInfo, phone: userInfo.cellPhone }));
    }
    if (props.googleUser && props.googleObj) {
      const phone = props.googleObj.phone || '';
      const { givenName, familyName, email, googleId } = props.googleObj;
      const trimmedFirstName = givenName.trim();
      setState({
        ...state,
        firstName: trimmedFirstName,
        lastName: familyName,
        email,
        googleId,
        phone,
      });
      props.setFieldValue('firstName', trimmedFirstName);
      props.setFieldValue('lastName', familyName);
      props.setFieldValue('email', email);
      props.setFieldValue('phone', phone);
      document.querySelector('input[name=phone]').focus();
    }
    // need to do that only once
    // eslint-disable-next-line
  }, [props.googleUser]);

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const gridDirection = () => (props.isMobile ? 'column' : 'row');

  const handleFieldsChange = name => event => {
    event.persist();
    setState({
      ...state,
      [name]: event.target.value,
    });
    props.setFieldValue(name, event.target.value);
  };

  const handleCreateUserAccount = async () => {
    const {
      firstName,
      lastName,
      middleName,
      email,
      phone,
      password,
      source,
      category,
    } = state;

    await props.validateForm();
    const hasErrors = !!Object.values(props.errors).length;
    if (hasErrors) return;

    const USER_DATA = {
      firstName,
      middleName,
      lastName,
      email,
      contactNumber: phone.replace(/\D+/g, '').slice(1),
      source,
      category,
      referrer: null,
      referrerContactNumber: null,
      promoCode: null,
    };

    try {
      const response = await User.SignUp({ ...USER_DATA, password });
      const loginResponse = await User.Login({
        username: phone.replace(/\D+/g, '').slice(1),
        password,
      });
      if (response.errorMessage) {
        setState({
          ...state,
          showErrorBar: true,
          createAccountError:
            response.errorMessage || loginResponse.errorMessage,
        });
      } else {
        props.saveUserData(loginResponse);
        setCookie('token', loginResponse.token);
        setCookie('prospectId', loginResponse.prospectId);
        removeCookie('userInfo');
        router.push({ pathname: '/', query: { ...adsQuery } });
      }
    } catch (error) {
      setState({
        ...state,
        showErrorBar: true,
        createAccountError: error.response.data,
      });
    }
  };

  const handleCreateGoogleAccount = async () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      source,
      category,
      googleId,
    } = state;

    await props.validateForm();
    const hasErrors = !!Object.values(props.errors).length;
    if (hasErrors) return;

    const USER_DATA = {
      firstName,
      lastName,
      email,
      contactNumber: phone.replace(/\D+/g, '').slice(1),
      googleUserId: googleId,
      source,
      category,
    };

    try {
      const signResponse = await User.GoogleSignUp(USER_DATA);
      if (signResponse.errorMessage) {
        setState({
          ...state,
          showErrorBar: true,
          createAccountError: signResponse.errorMessage,
        });
      } else {
        props.saveUserData(signResponse);
        setCookie('token', signResponse.token);
        setCookie('prospectId', signResponse.prospectId);
        removeCookie('userInfo');
        router.push({ pathname: '/', query: { ...adsQuery } });
      }
    } catch (error) {
      setState({
        ...state,
        showErrorBar: true,
        createAccountError: error.response.data,
      });
    }
  };

  const closeErrorBar = () =>
    setState({ ...state, showErrorBar: false, createAccountError: null });

  return (
    <>
      <Typography variant="h5">CREATE AN ACCOUNT</Typography>
      <Typography className={classes.registrationFormTitle} variant="body1">
        Primary information
      </Typography>
      <Grid
        item
        container
        spacing={2}
        justifyContent="center"
        wrap="nowrap"
        direction={gridDirection()}
      >
        <Grid item xs={props.gridSize(6)}>
          <CustomInput
            value={state.firstName}
            label="FIRST NAME"
            autoFocus
            fullWidth
            name="firstName"
            hasError={!!props.errors.firstName && props.touched.firstName}
            errorMessage={props.errors.firstName}
            onBlur={props.handleBlur}
            onChange={handleFieldsChange('firstName')}
          />
        </Grid>
        <Grid item xs={props.gridSize(6)}>
          <CustomInput
            value={state.lastName}
            label="LAST NAME"
            fullWidth
            name="lastName"
            hasError={!!props.errors.lastName && props.touched.lastName}
            errorMessage={props.errors.lastName}
            onBlur={props.handleBlur}
            onChange={handleFieldsChange('lastName')}
          />
        </Grid>
      </Grid>
      <Typography className={classes.registrationFormTitle} variant="body1">
        Contacts
      </Typography>
      <Grid
        item
        container
        spacing={2}
        justifyContent="center"
        wrap="nowrap"
        direction={gridDirection()}
      >
        <Grid item xs={props.gridSize(6)}>
          <CustomInput
            value={state.email}
            label="EMAIL"
            fullWidth
            name="email"
            hasError={!!props.errors.email && props.touched.email}
            errorMessage={props.errors.email}
            onBlur={props.handleBlur}
            onChange={handleFieldsChange('email')}
          />
        </Grid>
        <Grid item xs={props.gridSize(6)}>
          <CustomInput
            value={state.phone}
            label="CELL PHONE"
            onChange={handleFieldsChange('phone')}
            onBlur={props.handleBlur}
            hasError={!!props.errors.phone && props.touched.phone}
            errorMessage={props.errors.phone}
            name="phone"
            fullWidth
            withPhoneMask
          />
        </Grid>
        {/*
          NOTE: we temporary hide this field

        <Grid item xs={props.gridSize(3)}>
          <CustomInput
            label="ZIP"
            fullWidth
            name="zip"
            hasError={!!props.errors.zip && props.touched.zip}
            errorMessage={props.errors.zip}
            onBlur={props.handleBlur}
            onChange={handleFieldsChange('zip')}
          />
        </Grid> */}
      </Grid>
      {!props.googleUser && (
        <>
          <Typography className={classes.registrationFormTitle} variant="body1">
            Password
          </Typography>
          <Grid
            item
            container
            spacing={2}
            justifyContent="center"
            wrap="nowrap"
            direction={gridDirection()}
          >
            <Grid item xs={props.gridSize(6)}>
              <CustomInput
                value={state.password}
                label="PASSWORD"
                fullWidth
                name="password"
                type={state.showPassword ? 'text' : 'password'}
                hasError={!!props.errors.password && props.touched.password}
                errorMessage={props.errors.password}
                onBlur={props.handleBlur}
                onChange={handleFieldsChange('password')}
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
            </Grid>
            <Grid item xs={props.gridSize(6)}>
              <CustomInput
                value={state.passwordConfirmation}
                label="CONFIRM PASSWORD"
                fullWidth
                name="passwordConfirmation"
                type={state.showPassword ? 'text' : 'password'}
                hasError={
                  !!props.errors.passwordConfirmation &&
                  props.touched.passwordConfirmation
                }
                errorMessage={props.errors.passwordConfirmation}
                onBlur={props.handleBlur}
                onChange={handleFieldsChange('passwordConfirmation')}
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
            </Grid>
          </Grid>
        </>
      )}
      <Button
        style={{ marginTop: 40 }}
        className={classes.bigButton}
        variant="contained"
        color="primary"
        onClick={
          props.googleUser ? handleCreateGoogleAccount : handleCreateUserAccount
        }
      >
        Create my account
      </Button>
      <Typography
        className={classes.policyLink}
        variant="body2"
        color="textSecondary"
      >
        By clicking the &quot;Create My Account&quot; button you agree to our
        <Link href="/privacy-policy">
          <Button
            variant="text"
            color="secondary"
            style={{ textTransform: 'none' }}
          >
            Privacy Policy
          </Button>
        </Link>
      </Typography>
      <ErrorSnackbar
        showErrorBar={state.showErrorBar}
        error={state.createAccountError}
        closeErrorBar={closeErrorBar}
      />
    </>
  );
}

RegistrationForm.defaultProps = {
  googleObj: null,
};

RegistrationForm.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  gridSize: PropTypes.func.isRequired,
  handleMouseDownPassword: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  saveUserData: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  googleObj: PropTypes.object,
  googleUser: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  saveUserData,
};

export default compose(
  connect(null, mapDispatchToProps),
  withFormik({
    mapPropsToValues: () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
    }),
    validationSchema: props =>
      props.googleUser ? googleValidation : simpleRegistration,
  })
)(RegistrationForm);
