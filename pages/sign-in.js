import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isMobileSelector } from 'src/redux/selectors';
import { useRouter } from 'next/router';

import { Button, Grid, Icon, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { GoogleLogin } from 'react-google-login';
import SignInBackground from 'assets/signIn.jpg';
import GoogleIcon from 'assets/google-button.svg';
import { User } from 'src/api';

import Layout from 'components/shared/Layout';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import SignInForm from 'components/signIn/SignInForm';
import RegistrationForm from 'components/signIn/RegistrationForm';
import ForgottenPassword from 'components/signIn/ForgottenPassword';
import { LIGHT_GRAY_BACKGROUND } from 'src/constants';
import { saveUserData } from 'src/redux/actions/user';
import { setCookie } from 'src/utils/cookie';

import { applyAdsQuery } from '@/utils/commonUtils';
import googleConfig from '../google-creds.json';

const TABS = {
  signIn: 'sign-in',
  registration: 'registration',
};

const useStyles = makeStyles(theme => ({
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    padding: `${theme.spacing(15)}px 0px ${theme.spacing(10)}px ${theme.spacing(
      6
    )}px`,
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(9)}px ${theme.spacing(2)}px`,
    },
  },
  formContainer: {
    width: 950,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(9)}px ${theme.spacing(2)}px`,
    },
  },
  formTabs: {
    position: 'absolute',
    left: 0,
    top: -55,
    width: '100%',
    height: 60,
  },
  formTab: {
    width: '100%',
    height: '100%',
    background: '#001C5E',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    cursor: 'pointer',
    color: theme.palette.common.white,
  },
  formTabDivider: {
    height: 60,
    width: theme.spacing(2),
    background: LIGHT_GRAY_BACKGROUND,
    borderRadius: 5,
  },
  formActiveTab: {
    background: theme.palette.common.white,
    color: '#3C3B4A',
  },
  signInContainer: {
    padding: `${theme.spacing(9)}px ${theme.spacing(6)}px`,
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    },
  },
  backgroundSide: {
    height: '100%',
  },
  tabTitles: {
    fontSize: theme.typography.pxToRem(16),
  },
  carBackground: {
    backgroundImage: `url(${SignInBackground})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: theme.spacing(60),
    width: '100%',
    [theme.breakpoints.only('lg')]: {
      height: theme.spacing(85),
    },
    [theme.breakpoints.only('md')]: {
      height: theme.spacing(45),
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(25),
    },
  },
  socialMediaBlock: {
    marginTop: theme.spacing(6),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  socialMediaButton: {
    margin: '20px 10px',
    backgroundColor: theme.palette.common.white,
    minWidth: theme.spacing(28),
    textTransform: 'none',
  },
  iconButton: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    marginRight: theme.spacing(2),
  },
  registrationFormContainer: {
    padding: `${theme.spacing(4)}px ${theme.spacing(6)}px ${theme.spacing(
      9
    )}px`,
    [theme.breakpoints.down('xs')]: {
      padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    },
  },
}));

function SignIn(props) {
  const classes = useStyles();
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const [state, setState] = React.useState({
    activeTab: TABS.signIn,
    staySignedIn: false,
    isForgottenPasswordActive: false,
    googleUser: false,
    googleObj: null,
    error: null,
    showError: false,
    isGoogleBlock: false,
  });

  const closeErrorBar = () =>
    setState({ ...state, showError: false, error: null });

  const handleTabChange = tabTitle => () =>
    setState({ ...state, activeTab: tabTitle });

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const responseGoogle = async res => {
    const { profileObj } = res;
    if (res.error && res.error !== 'popup_closed_by_user') {
      setState({
        ...state,
        googleUser: false,
        error: res.error,
        showError: true,
      });
    } else {
      setState({ ...state, googleObj: profileObj, googleUser: true });
      try {
        const { googleId } = profileObj;
        const loginResponse = await User.GoogleSignIn(googleId);
        props.saveUserData(loginResponse);
        setCookie('token',
          loginResponse.token, { expires: 30, domain: 'localhost' });
        setCookie('prospectId',
          loginResponse.prospectId, { expires: 30, domain: 'localhost' });
        router.push({ pathname: '/', query: { ...adsQuery } });
      } catch (error) {
        const message =
          error.response.data === 'User not found'
            ? 'We need your contact number to create an account'
            : error.response.data;
        setState({
          ...state,
          error: error.response ? message : error,
          googleObj: profileObj,
          googleUser: true,
          showError: true,
          activeTab: TABS.registration,
          isGoogleBlock: true,
        });
      }
    }
  };

  const gridSize = regularSize => (props.isMobile ? 12 : regularSize);

  const handleEnableForgottenPassword = () =>
    setState({ ...state, isForgottenPasswordActive: true });

  const handleDisableForgottenPassword = () =>
    setState({ ...state, isForgottenPasswordActive: false });

  const renderSocialMedialButtons = () => (
    <Grid
      item
      xs={12}
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      className={classes.socialMediaBlock}
    >
      <Typography
        style={{ marginBottom: 10 }}
        variant="body1"
        color="textPrimary"
      >
        or
      </Typography>
      <Typography
        style={{ textAlign: 'center' }}
        variant="h5"
        color="textPrimary"
      >
        SIGN IN WITH YOUR SOCIAL MEDIA ACCOUNT
      </Typography>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="center"
        direction={props.isMobile ? 'column' : 'row'}
      >
        <GoogleLogin
          clientId={googleConfig.web.client_id}
          buttonText="Sign In with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy="single_host_origin"
          render={renderProps => (
            <Button
              onClick={renderProps.onClick}
              className={classes.socialMediaButton}
              variant="contained"
              disabled={state.isGoogleBlock}
            >
              <Icon
                className={classes.iconButton}
                style={{ backgroundImage: `url(${GoogleIcon})` }}
              />
              Sign In with Google
            </Button>
          )}
        />
      </Grid>
    </Grid>
  );

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };
  return (
    <Layout tutorialOpen={tutorialOpen} backgroundColor={LIGHT_GRAY_BACKGROUND}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        className={classes.mainContainer}
      >
        <Grid item xs={12} container alignItems="center" justifyContent="center">
          <Paper elevation={3} className={classes.formContainer}>
            <Grid
              className={classes.formTabs}
              container
              alignItems="center"
              justifyContent="center"
              wrap="nowrap"
            >
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                className={classNames(
                  classes.formTab,
                  state.activeTab === TABS.signIn && classes.formActiveTab
                )}
                onClick={handleTabChange(TABS.signIn)}
              >
                <Typography
                  className={classes.tabTitles}
                  color="inherit"
                  variant="subtitle2"
                >
                  Sign In
                </Typography>
              </Grid>
              <Grid className={classes.formTabDivider} />
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                className={classNames(
                  classes.formTab,
                  state.activeTab === TABS.registration && classes.formActiveTab
                )}
                onClick={handleTabChange(TABS.registration)}
              >
                <Typography
                  className={classes.tabTitles}
                  color="inherit"
                  variant="subtitle2"
                >
                  Registration
                </Typography>
              </Grid>
            </Grid>
            {state.activeTab === TABS.signIn && (
              <Grid
                container
                className={classes.signInContainer}
                item
                xs={12}
                alignItems="center"
                justifyContent="center"
                wrap="wrap"
              >
                {state.isForgottenPasswordActive ? (
                  <ForgottenPassword
                    gridSize={gridSize}
                    isMobile={props.isMobile}
                    handleMouseDownPassword={handleMouseDownPassword}
                    handleDisableForgottenPassword={
                      handleDisableForgottenPassword
                    }
                  />
                ) : (
                  <SignInForm
                    gridSize={gridSize}
                    isMobile={props.isMobile}
                    handleMouseDownPassword={handleMouseDownPassword}
                    handleEnableForgottenPassword={
                      handleEnableForgottenPassword
                    }
                  />
                )}
                {renderSocialMedialButtons()}
              </Grid>
            )}
            {state.activeTab === TABS.registration && (
              <Grid
                container
                className={classes.registrationFormContainer}
                item
                xs={12}
                alignItems="flex-start"
                justifyContent="center"
                direction="column"
              >
                <RegistrationForm
                  isMobile={props.isMobile}
                  gridSize={gridSize}
                  handleMouseDownPassword={handleMouseDownPassword}
                  googleObj={state.googleObj}
                  googleUser={state.googleUser}
                />
                {renderSocialMedialButtons()}
              </Grid>
            )}
          </Paper>
        </Grid>
        <Grid
          className={classes.backgroundSide}
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
          wrap="nowrap"
          direction="column"
        >
          <div className={classes.carBackground} />
          <Typography
            variant={props.isMobile ? 'caption' : 'body1'}
            style={{ margin: '32px 0px' }}
          >
            BUY ONLINE. GET IT DELIVERED. LOVE IT OR RETURN IT.
          </Typography>
          <Typography
            variant={props.isMobile ? 'h4' : 'h1'}
            style={{ textAlign: 'center' }}
          >
            THE NEW WAY TO <br /> BUY A CAR
          </Typography>
        </Grid>
      </Grid>
      <ErrorSnackbar
        showErrorBar={state.showError}
        error={state.error}
        closeErrorBar={closeErrorBar}
      />
    </Layout>
  );
}

const mapStateToProps = createStructuredSelector({
  isMobile: isMobileSelector,
});

const mapDispatchProps = {
  saveUserData
};

SignIn.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  saveUserData: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchProps)(SignIn);
