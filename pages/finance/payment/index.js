import React from 'react';
import PropTypes from 'prop-types';
import AuthorizeNetForm from 'components/finance/AuthorizeNetForm';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { prospectData, rdsVehiclesSelector } from 'src/redux/selectors';
import { getListOfRDSVehicles } from 'src/redux/actions/rdsVehicles';
import { saveUserData, getProspectorProfile } from 'src/redux/actions/user';

import { Container, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'components/shared/Layout';
import FinanceHero from 'assets/finance_hero.jpg';

const useStyles = makeStyles(theme => ({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  PaymentContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  PaymentTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  PaymentWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
    marginTop: theme.spacing(2),
  },
  PaymentContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  PaymentLightGrayColor: {
    color: '#a0a0a0',
  },
  PaymentIcon: {
    color: 'red',
    width: 40,
    height: 'auto',
  },
}));

const Payment = props => {
  const classes = useStyles();
  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.financeMainWrapper}>
        <Container maxWidth="md" className={classes.PaymentContainer}>
          <AuthorizeNetForm {...props} />
        </Container>
      </Box>
    </Layout>
  );
};

const mapStateToProps = createStructuredSelector({
  prospect: prospectData,
  listOfRDSVehicles: rdsVehiclesSelector,
});

const mapDispatchToProps = {
  getListOfRDSVehicles,
  saveUserData,
  getProspectorProfile,
};

Payment.propTypes = {
  prospect: PropTypes.object.isRequired,
  listOfRDSVehicles: PropTypes.array.isRequired,
  getListOfRDSVehicles: PropTypes.func.isRequired,
  saveUserData: PropTypes.func.isRequired,
  getProspectorProfile: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
