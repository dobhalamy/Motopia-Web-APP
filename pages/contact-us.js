/* eslint-disable max-len */
import React, { useState } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { prospectData } from 'src/redux/selectors';

import { Typography, Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ContactUsBackgroud from 'assets/contact-us/contact-us-background.png';
import Layout from 'components/shared/Layout';
import ContactUsForm from 'components/contactUs/ContactUsForm';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import ThankyouDialog from 'components/shared/ThankyouDialog';

const useStyles = makeStyles(theme => ({
  contactUsWrapper: {
    padding: 40,
    backgroundImage: `url(${ContactUsBackgroud})`,
    backgroundSize: 'cover',
    width: '100%',
  },
  contactUsContainer: {
    maxWidth: 1138,
    padding: '0px 20px',
    margin: '0 auto',
  },
  contactUsTitleContainer: {
    margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(4)}px`,
  },
  contactUsTitle: {
    fontWeight: theme.typography.fontWeightLight,
    fontSize: theme.typography.pxToRem(34),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(22),
      marginBottom: theme.spacing(2),
    },
  },
  contactUsSubtitle: {
    fontSize: theme.typography.pxToRem(17),
  },
  contactUsSubtitle2: {
    fontSize: theme.typography.pxToRem(25),
  },
}));

const ContactUs = (props) => {
  const { router } = props;
  const classes = useStyles();
  const [state, setState] = useState({
    showErrorBar: false,
    error: '',
  });
  const [isOpenThanks, setThanks] = useState(false);

  const handleOpenThanksDialog = () => router.push({
    pathname: '/confirmation',
    query: 'contact-us'
  });
  const handleHideThanksDialog = () => setThanks(false);

  const closeErrorBar = () => {
    setState({ showErrorBar: false });
  };
  const handleError = error => {
    setState({
      showErrorBar: true,
      error
    });
  };
  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };
  return (
    <>
      <Head>
        <meta name="description" content="Got questions about the car rentals or rent-to-own cars? Fill out the form in contact us page & get in touch with us to resolve all of your queries. Contact us now" />
        <title>Contact Us - GoMotopia | Lowest prices on Quality Used cars with Nationwide Delivery /  Instant Rideshare Approval - No Credit Necessary</title>
      </Head>
      <Layout tutorialOpen={tutorialOpen}>
        <Box className={classes.contactUsWrapper}>
          <Grid
            className={classes.contactUsContainer}
            container
            direction="column"
            wrap="nowrap"
          >
            <Typography variant="body1">Home/ Contact us</Typography>
            <Grid className={classes.contactUsTitleContainer} container>
              <Grid container item xs={12} md={6}>
                <Typography className={classes.contactUsTitle} variant="h1">
                  Contact us
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                md={6}
                direction="column"
                wrap="nowrap"
              >
                <Typography className={classes.contactUsSubtitle} variant="body1">
                  Please feel free to call us at
                </Typography>
                <Typography
                  className={classes.contactUsSubtitle2}
                  variant="body1"
                >
                  888-253-7171
                </Typography>
                <Typography className={classes.contactUsSubtitle} variant="body1">
                  or use the form below to send an email.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <ContactUsForm
            openModal={handleOpenThanksDialog}
            handleError={handleError}
            prospect={props.prospect}
          />
          <ThankyouDialog
            open={isOpenThanks}
            handleClose={handleHideThanksDialog}
          />
          <ErrorSnackbar
            showErrorBar={state.showErrorBar}
            error={state.error}
            closeErrorBar={closeErrorBar}
          />
        </Box>
      </Layout>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  prospect: prospectData,
});

ContactUs.propTypes = {
  prospect: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(ContactUs));
