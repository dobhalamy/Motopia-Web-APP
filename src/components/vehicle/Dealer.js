// NOTE: This component is not using now in all project.
import React from 'react';
import classNames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import LuxorIcon from 'assets/vehicle/luxor.svg';
import WithAddressIcon from 'assets/vehicle/withAddress.svg';
import AddressPinIcon from 'assets/vehicle/addressPin.svg';

import { VEHICLE_PAGE_WIDTH } from './constants';

const useStyles = makeStyles(theme => ({
  dealerWrapper: {
    padding: theme.spacing(2),
  },
  dealerContainer: {
    maxWidth: VEHICLE_PAGE_WIDTH,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(5),
    },
  },
  dealerTitle: {
    fontSize: theme.typography.pxToRem(28),
    marginBottom: theme.spacing(3),
    width: 215,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  dealerInfoContainer: {
    border: '1px solid rgba(45, 55, 69, 0.2)',
    maxWidth: 875,
    height: 190,
    borderRadius: 5,
    padding: `${theme.spacing(3.75)}px ${theme.spacing(6.25)}px`,
    [theme.breakpoints.down('md')]: {
      padding: `${theme.spacing(3.75)}px ${theme.spacing(4.25)}px`,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      height: 270,
      maxWidth: 380,
      flexWrap: 'wrap',
    },
  },
  dealerPhoneNumber: {
    fontSize: theme.typography.pxToRem(28),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(22),
    },
  },
  icon: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  addressIcon: {
    width: 295,
    height: 85,
    backgroundImage: `url(${WithAddressIcon})`,
    position: 'relative',
    [theme.breakpoints.only('sm')]: {
      marginLeft: theme.spacing(2),
    },
  },
  pinIcon: {
    width: 24,
    height: 35,
    backgroundImage: `url(${AddressPinIcon})`,
    position: 'absolute',
    top: 20,
    left: 28,
  },
}));
export default function Dealer() {
  const classes = useStyles();

  return (
    <Grid
      className={classes.dealerWrapper}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid className={classes.dealerContainer} container wrap="nowrap">
        <Typography className={classes.dealerTitle} variant="h5">
          DEALER INFORMATION
        </Typography>
        <Grid
          container
          alignItems="flex-start"
          className={classes.dealerInfoContainer}
          wrap="nowrap"
        >
          <Grid
            container
            direction="column"
            alignContent="center"
            item
            xs={6}
            md={3}
          >
            <img src={LuxorIcon} alt="dealership logo" />
            <Hidden smDown>
              <Typography align="center" variant="body1" color="secondary">
                Luxor Livery Sales
              </Typography>
            </Hidden>
          </Grid>
          <Grid container direction="column" item xs={6} md={4}>
            <Hidden mdUp>
              <Typography variant="body1" color="secondary">
                Luxor Livery Sales
              </Typography>
            </Hidden>
            <Typography variant="body1">Contact Sales</Typography>
            <Typography className={classes.dealerPhoneNumber} variant="h5">
              888-253-7171
            </Typography>
          </Grid>
          <Grid container direction="column" item xs={12} md={5}>
            <div className={classNames(classes.icon, classes.addressIcon)}>
              <div className={classNames(classes.icon, classes.pinIcon)} />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
