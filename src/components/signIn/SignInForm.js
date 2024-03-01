import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import CustomInput from 'components/shared/CustomInput';
import { saveUserData } from 'src/redux/actions/user';
import { User } from 'src/api';
import { setCookie } from 'src/utils/cookie';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import { applyAdsQuery } from '@/utils/commonUtils';
import SignInValidationSchema from './SignInValidationSchema';

const useStyles = makeStyles(theme => ({
  signInFormSide: {
    minHeight: theme.spacing(48),
  },
  bigButton: {
    width: '100%',
    height: 110,
  },
  socialMediaButton: {
    margin: '20px 10px',
    backgroundColor: theme.palette.common.white,
    minWidth: theme.spacing(28),
    textTransform: 'none',
  },
}));

function SignInForm(props) {
  const Router = useRouter();
  const adsQuery = applyAdsQuery(Router.query);

  const classes = useStyles();

  const [state, setState] = React.useState({
    staySignedIn: false,
    showPassword: false,
    signInError: null,
    showErrorBar: false,
    contactNumber: '',
    password: '',
  });

  React.useEffect(() => {
    document.querySelector('input[name="contactNumber"]').focus();
  }, []);

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

  const handleSignIn = async () => {
    await props.validateForm();
    const hasErrors = !!Object.values(props.errors).length;
    if (hasErrors) return;

    const { contactNumber, password } = state;

    try {
      const response = await User.Login({
        username: contactNumber.replace(/\D+/g, '').slice(1),
        password,
      });
      if (response.errorMessage) {
        setState({
          ...state,
          showErrorBar: true,
          signInError: response.errorMessage,
        });
      } else {
        props.saveUserData(response);
        if (state.staySignedIn) {
          setCookie('token', response.token);
          setCookie('prospectId', response.prospectId);
          Router.push({ pathname: '/', query: { ...adsQuery } });
        } else {
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('prospectId', response.prospectId);
          Router.push({ pathname: '/', query: { ...adsQuery } });
        }
      }
    } catch (error) {
      setState({
        ...state,
        showErrorBar: true,
        signInError: error.response.data,
      });
    }
  };

  const handleChangeSignedIn = event => {
    setState({ ...state, staySignedIn: event.target.checked });
  };

  const closeErrorBar = () =>
    setState({ ...state, showErrorBar: false, signInError: null });
  return (
    <Grid item container className={classes.signInFormSide}>
      <Grid
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
            HEY THERE, <br /> WELCOME TO MOTOPIA.
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Please sign in to get back to buying <br /> a car in a whole new
            way.
          </Typography>
        </Grid>
        <Grid item container alignItems="center" justifyContent="flex-start">
          <FormControlLabel
            className={classes.bigButton}
            control={
              <Checkbox
                checked={state.staySignedIn}
                onChange={handleChangeSignedIn}
              />
            }
            label="Stay signed in"
          />
        </Grid>
      </Grid>
      <Grid
        item
        xs={props.gridSize(6)}
        container
        alignItems="flex-start"
        justifyContent="space-between"
        direction="column"
        className={classes.signInFormSide}
        spacing={props.isMobile ? 2 : 0}
      >
        <CustomInput
          label="CONTACT NUMBER"
          autoFocus
          value={state.contactNumber}
          onChange={handleFieldsChange('contactNumber')}
          onBlur={props.handleBlur}
          hasError={!!props.errors.contactNumber && props.touched.contactNumber}
          errorMessage={props.errors.contactNumber}
          name="contactNumber"
          fullWidth
          withPhoneMask
        />
        <CustomInput
          label="PASSWORD"
          name="password"
          type={state.showPassword ? 'text' : 'password'}
          value={state.password}
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
        <Button
          color="secondary"
          style={{ textTransform: 'none' }}
          variant="text"
          onClick={props.handleEnableForgottenPassword}
        >
          I forgot my password
        </Button>
        <Button
          className={classes.bigButton}
          variant="contained"
          color="primary"
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      </Grid>
      <ErrorSnackbar
        showErrorBar={state.showErrorBar}
        error={state.signInError}
        closeErrorBar={closeErrorBar}
      />
    </Grid>
  );
}

SignInForm.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  gridSize: PropTypes.func.isRequired,
  saveUserData: PropTypes.func.isRequired,
  handleMouseDownPassword: PropTypes.func.isRequired,
  handleEnableForgottenPassword: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  saveUserData,
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withFormik({
    mapPropsToValues: () => ({
      contactNumber: '',
      password: '',
    }),
    validationSchema: SignInValidationSchema,
  })
)(SignInForm);
