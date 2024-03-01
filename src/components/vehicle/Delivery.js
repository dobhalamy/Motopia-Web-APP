import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import WithAddressIcon from 'assets/vehicle/withAddress.svg';
import AddressPinIcon from 'assets/vehicle/addressPin.svg';

import { VEHICLE_PAGE_WIDTH } from './constants';
import DeliveryBlock from '../shared/DeliveryBlock';

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
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  dealerInfoContainer: {
    border: '1px solid rgba(45, 55, 69, 0.2)',
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
  textBold: {
    fontWeight: 600,
  },
}));

const LocTab = withStyles({
  root: {
    fontSize: 16,
  }
})(Tab);

const Delivery = props => {
  const classes = useStyles();
  const [tab, setActiveTab] = useState(0);
  const { handleOpenModal, location, pointsCount, pickupDate, pickupPoints } = props;
  const { query } = useRouter();

  const handleChangeTab = (event, activeTab) => {
    setActiveTab(activeTab);
  };

  return (
    <Grid
      className={classes.dealerWrapper}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid className={classes.dealerContainer} container>
        <Grid item xs={12}>
          <Typography className={classes.dealerTitle} variant="h5">
            DELIVERY OPTIONS
          </Typography>
          <Tabs
            value={tab}
            indicatorColor="secondary"
            textColor="secondary"
            onChange={handleChangeTab}
            aria-label="disabled tabs example"
            variant="fullWidth"
          >
            <LocTab label="Pickup" />
            <LocTab label="Delivery" />
          </Tabs>
        </Grid>
        <Grid
          container
          className={classes.dealerInfoContainer}
          item
          xs={12}
        >
          {tab === 0 &&
          (
            <>
              <Grid item xs={12} container alignItems="center">
                <Typography>
                  Pickup Location:{' '}
                  <Typography component="span" color="secondary" className={classes.textBold}>
                    {location.locationName}
                  </Typography>
                  {pointsCount > 1 &&
                  <Typography
                    component="span"
                    color="error"
                    style={{ cursor: 'pointer' }}
                    onClick={handleOpenModal}
                    className={classes.textBold}
                  >
                    {' '} (CHANGE)
                  </Typography>}
                </Typography>
              </Grid>
              <Grid item xs={12} container alignItems="center">
                <Typography>
                  Estimated Pickup Date:{' '}
                  <Typography component="span" color="secondary" className={classes.textBold}>
                    {pickupDate.toUpperCase()}
                  </Typography>
                </Typography>
              </Grid>
            </>
          )}
          {tab === 1 &&
            <DeliveryBlock
              pickupPoints={pickupPoints}
              pickupDate={pickupDate}
              flowType="Sales"
              vehicleId={query.id}
            />}
        </Grid>
      </Grid>
    </Grid>
  );
};

Delivery.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  pointsCount: PropTypes.number.isRequired,
  pickupDate: PropTypes.string.isRequired,
  pickupPoints: PropTypes.array.isRequired,
};

export default Delivery;
