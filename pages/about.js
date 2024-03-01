/* eslint-disable max-len */
import React from 'react';
import Head from 'next/head';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Button, Grid } from '@material-ui/core';

import Layout from 'components/shared/Layout';
import CustomInput from 'components/shared/CustomInput';
import AboutUsMapSection from 'components/aboutUs/AboutUsMapSection';
import {
  BACKGROUND_BASE_URL, LIGHT_GRAY_BACKGROUND,
} from 'src/constants';
import ArrowIcon from '@material-ui/icons/ArrowRightAlt';
import MapIcon from 'assets/map-icon.png';

const useStyles = makeStyles(theme => ({
  heroContentContainer: {
    maxWidth: 1138,
    padding: `${theme.spacing(4.5)}px ${theme.spacing(2)}px ${theme.spacing(
      4
    )}px`,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0
    },
  },
  heroContentTitleContainer: {
    margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(8)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(4)}px`
    },
  },
  heroContentTitle: {
    fontWeight: theme.typography.fontWeightLight,
    maxWidth: 180,
    fontSize: theme.typography.pxToRem(34),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(22),
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  heroContentSubtitle: {
    fontSize: theme.typography.pxToRem(17),
  },
  addressIcon: {
    width: 90,
    height: 90,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      width: 50,
      height: 50,
    }
  },
  secondAboutUsSection: {
    padding: theme.spacing(10),
    [theme.breakpoints.down('md')]: {
      padding: `${theme.spacing(10)}px 0px`,
    },
    margin: 'auto',
  },
  drivingDirectionContainer: {
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  heroInputs: {
    height: 110,
    borderRadius: '5px 0 0 5px'
  },
  heroInputContainer: {
    background: theme.palette.common.white,
    borderRadius: 5,
    margin: `${theme.spacing(1.5)}px 0px`,
    width: 'auto'
  },
  heroInputButton: {
    height: 90,
    borderRadius: '0 5px 5px 0',
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0 0 5px 5px',
    },
  },
  hoursBackground: {
    position: 'absolute',
    top: -40,
    width: '100%',
    height: 575,
    backgroundImage: `url(${BACKGROUND_BASE_URL}/about_us.jpg)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    [theme.breakpoints.up('xl')]: {
      height: '100%',
    },
    [theme.breakpoints.down('md')]: {
      backgroundPosition: 'right',
    },
    [theme.breakpoints.down('sm')]: {
      backgroundPosition: 'bottom',
      height: 400,
      left: -16
    },
    [theme.breakpoints.down('xs')]: {
      height: 235,
    }
  },
  hoursRow: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1.5),
    maxWidth: 567,
    [theme.breakpoints.only('sm')]: {
      marginTop: 150
    }
  },
  hoursRowItem: {
    margin: `${theme.spacing(0.5)}px 0`,
    backgroundColor: theme.palette.common.white,
    height: 50,
    paddingLeft: theme.spacing(2),
  },
  hoursItemText: {
    fontSize: theme.typography.pxToRem(22),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(16),
    }
  },
  hoursContainer: {
    position: 'relative',
    backgroundColor: LIGHT_GRAY_BACKGROUND,
    height: 617,
    flexDirection: 'row',
    [theme.breakpoints.up('xl')]: {
      minHeight: 850,
    },
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      alignItems: 'center',
      flexDirection: 'column',
      padding: theme.spacing(1.5)
    }
  }
}));

const About = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [yourAddress, setAddress] = React.useState('');

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };
  return (
    <>
      <Head>
        <meta name="description" content="We are the best car rental in New York City. We offer car rental for your regular cruize and rent-to-own, where you can own the car and pay us in little installments" />
        <title>About Us - GoMotopia | Lowest prices on Quality Used cars with Nationwide Delivery /  Instant Rideshare Approval - No Credit Necessary</title>
      </Head>
      <Layout tutorialOpen={tutorialOpen}>
        <Grid
          className={classes.heroContentContainer}
          container
          direction="column"
          wrap="nowrap"
        >
          <Typography variant="body1">Home / Trade-in value</Typography>
          <Grid className={classes.heroContentTitleContainer} container>
            <Grid container item xs={12} md={6}>
              <Typography className={classes.heroContentTitle} variant="h1">
                ABOUT US
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
              <Typography
                className={classes.heroContentSubtitle}
                variant="body1"
              >
                Hello, and welcome to Motopia.com!
                We&#39;re proud of the hard work we do,
                both for car shoppers and with the good people of the automotive industry.
                So, poke around and have fun getting to
                know us better — and, we&#39;d love to hear from you too!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <AboutUsMapSection />

        <Grid
          item
          container
          xs={12}
          spacing={theme.breakpoints.up('sm') ? 4 : 0}
          justifyContent="center"
          alignItems="center"
          alignContent="center"
          className={classes.secondAboutUsSection}
          direction={theme.breakpoints.down('md') ? 'row' : 'column'}
        >
          <Grid
            className={classes.drivingDirectionContainer}
            item
            container
            xs={12}
            md={6}
            alignItems="center"
            justifyContent="center"
            wrap="nowrap"
          >
            <Grid item >
              <img
                src={MapIcon}
                className={classes.addressIcon}
                alt="contact icon"
              />
            </Grid>
            <Grid item>
              <Typography className={classes.heroContentTitle} variant="h4">
                DRIVING DIRECTION
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} container>

            <Grid item xs={12} md={12} container>
              <CustomInput
                className={classes.heroInputs}
                fullWidth
                label="YOUR ADDRESS"
                placeholder="New York"
                value={yourAddress}
                onChange={(event) => setAddress(event.target.value)}
                endAdornment={
                  <Button
                    className={classes.heroInputButton}
                    fullWidth
                    variant="contained"
                    color="primary"
                  // eslint-disable-next-line max-len
                    href={`https://www.google.com.ua/maps/dir/${yourAddress}/43-19+Van+Dam+St,+Long+Island+City,+NY+11101`}
                  >
                    Get Directions <ArrowIcon style={{ marginLeft: 8 }} />
                  </Button>
              }
              />
            </Grid>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export default About;
