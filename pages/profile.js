import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { withStyles } from '@material-ui/styles';
import { useMediaQuery, Grid, Paper } from '@material-ui/core';
import Layout from 'components/shared/Layout';

import { prospectData } from 'src/redux/selectors';
import { getCookie, setCookie } from 'src/utils/cookie';
import { Prospect, MVR, User } from 'src/api';
import setAuthToken from 'src/api/setAuthToken';
import HeaderSection from 'src/components/profile/HeaderSection';
import AccountSection from 'src/components/profile/AccountSection';
import PasswordSection from 'src/components/profile/PasswordSection';
import VehicleSection from 'src/components/profile/VehicleSection';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
// NOTE: Uncomment, if need to show connected social
// import ConnectedSection from 'src/components/profile/ConnectedSection';

const styles = theme => ({
  profileHeader: {
    width: '100%',
    height: 220,
  },
  profileMainContent: {
    backgroundColor: '#E5E5E5',
  },
  AccountPaper: {
    position: 'relative',
    maxWidth: 1138,
    width: '100%',
    margin: `${theme.spacing(2.5)}px auto`,
    padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
  },
});

const UserProfile = props => {
  const { theme, classes } = props;
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const [state, setState] = React.useState({
    userData: {},
    vehicles: [],
    isLoading: true,
    activeSection: 0,
    showErrorBar: false,
    error: '',
    typeSnack: 'error',
  });
  const [file, setFile] = React.useState('');
  const [link, setLink] = React.useState('');

  const accountSectionRef = React.createRef();
  const passwordSectionRef = React.createRef();
  // NOTE: Uncomment, if need to show connected social
  // const connectedSectionRef = React.createRef();

  React.useEffect(() => {
    const { prospect } = props;
    if (prospect && prospect.prospectId) {
      (async () => {
        try {
          let token = getCookie('token');
          if (!token) {
            token = sessionStorage.getItem('token');
          }
          setAuthToken(token);
          const response = await Prospect.getVehicles(prospect.prospectId);
          const { accSettings } = await User.GetAccountDetails();
          setCookie('bankCreditId', accSettings.creditAppId);
          setState({
            ...state,
            userData: { ...prospect, ...accSettings },
            vehicles: response.data,
            isLoading: false,
          });
          const report = await MVR.getReport(prospect.prospectId);
          if (report.data) {
            const fileArr = report.data.file.split('/');
            const filename = fileArr[fileArr.length - 1];
            setFile(filename);
            fetch(report.data.file)
              .then(res => res.blob())
              .then(pdf => {
                const url = window.URL.createObjectURL(pdf);
                setLink(url);
              });
          }
        } catch (error) {
          console.error(error);
          setState({
            ...state,
            showErrorBar: true,
            error: error.message
          });
        }
      })();
    }
    // eslint-disable-next-line
  }, [props.prospect]);

  const closeErrorBar = () => {
    setState({ ...state, showErrorBar: false });
  };

  const handleMoveToSection = section => {
    if (section.current) {
      section.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const handleChangeActiveSection = event => {
    setState({
      ...state,
      activeSection: event.target.value,
    });
  };

  const handleError = error =>
    setState({
      ...state,
      showErrorBar: true,
      error: error.message
    });

  const handleSuccess = error =>
    setState({
      ...state,
      showErrorBar: true,
      error,
      typeSnack: 'success',
    });

  const handleOutOfStockClick = () =>
    setState({
      ...state,
      showErrorBar: true,
      error: 'This vehicle no longer available'
    });

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <HeaderSection
        userData={state.userData}
        file={file}
        link={link}
        handleMoveToSection={handleMoveToSection}
        accountSectionRef={accountSectionRef}
        passwordSectionRef={passwordSectionRef}
        // NOTE: Uncomment, if need to show connected social
        // connectedSectionRef={connectedSectionRef}
        handleChangeActiveSection={handleChangeActiveSection}
        activeSection={state.activeSection}
      />
      {matches ? (
        <Grid
          container
          direction="column"
          className={classes.profileMainContent}
        >
          {state.activeSection === 0 && (
            <Paper className={classes.AccountPaper}>
              <AccountSection
                userData={state.userData}
                handleError={handleError}
                handleSuccess={handleSuccess}
              />
            </Paper>
          )}
          {state.activeSection === 1 && (
            <Paper className={classes.AccountPaper}>
              <PasswordSection passwordSectionRef={passwordSectionRef} />
            </Paper>
          )}
          {/* NOTE: Uncomment, if need to show connected social */}
          {/* {state.activeSection === 2 && (
            <Paper className={classes.AccountPaper}>
              <ConnectedSection connectedSectionRef={connectedSectionRef} />
            </Paper>
          )} */}
        </Grid>
      ) : (
        <Grid
          container
          direction="column"
          className={classes.profileMainContent}
          justifyContent="center"
          alignContent="center"
        >
          <Paper ref={accountSectionRef} className={classes.AccountPaper}>
            <AccountSection
              userData={state.userData}
              handleError={handleError}
              handleSuccess={handleSuccess}
            />
          </Paper>
          <Paper ref={passwordSectionRef} className={classes.AccountPaper}>
            <PasswordSection />
          </Paper>
          {/* NOTE: Uncomment, if need to show connected social */}
          {/* <Paper ref={connectedSectionRef} className={classes.AccountPaper}>
              <ConnectedSection />
            </Paper> */}
          <VehicleSection
            vehicles={state.vehicles}
            isLoading={state.isLoading}
            handleOutOfStockClick={handleOutOfStockClick}
          />
        </Grid>
      )}
      <ErrorSnackbar
        showErrorBar={state.showErrorBar}
        error={state.error}
        closeErrorBar={closeErrorBar}
        type={state.typeSnack}
      />
    </Layout>
  );
};

const mapStateToProps = createStructuredSelector({
  prospect: prospectData,
});

UserProfile.propTypes = {
  prospect: PropTypes.shape({
    prospectId: PropTypes.string.isRequired,
  }).isRequired,
};

export default compose(
  connect(mapStateToProps),
  withStyles(styles, { withTheme: true })
)(UserProfile);
