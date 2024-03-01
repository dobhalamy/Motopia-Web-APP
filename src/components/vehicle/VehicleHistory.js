import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import ArrowIcon from '@material-ui/icons/ArrowRightAlt';

import CarFaxLogoIcon from 'assets/vehicle/carfaxlogo.svg';

import { VEHICLE_PAGE_WIDTH } from './constants';

const useStyles = makeStyles(theme => ({
  vehicleHistoryWrapper: {
    maxWidth: VEHICLE_PAGE_WIDTH,
    background: theme.palette.common.white,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  vehicleConditionContainer: {
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  vehicleHistoryContainer: {
    marginTop: theme.spacing(2),
    height: 192,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignItems: 'center',
      height: 'auto',
    },
  },
  vehicleHistoryItem: {
    [theme.breakpoints.down('sm')]: {
      margin: `${theme.spacing(1.5)}px 0px`,
    },
  },
  vehicleHistoryContentContainer: {
    marginLeft: theme.spacing(2),
  },
  icons: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  iconItems: {
    width: 46,
    height: 46,
  },
  carfaxContainer: {
    width: '100%',
    height: 192,
    padding: `${theme.spacing(3)}px ${theme.spacing(2)}px ${theme.spacing(
      1
    )}px`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      width: '100%',
      maxWidth: 440,
    },
  },
  carfaxIcon: {
    width: 138,
    height: 32,
  },
  carfaxContent: {
    textAlign: 'center',
    margin: `${theme.spacing(1.25)}px 0px `,
  },
  carfaxButton: {
    marginRight: theme.spacing(1.5),
  },
}));

export default function VehicleHistory(props) {
  const classes = useStyles();

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid className={classes.vehicleHistoryWrapper} container wrap="nowrap">
        <Paper className={classes.carfaxContainer}>
          <div
            className={classNames(classes.icons, classes.carfaxIcon)}
            style={{ backgroundImage: `url(${CarFaxLogoIcon})` }}
          />
          <Typography className={classes.carfaxContent} variant="body1">
            You may use a CARFAX Report to check the history of a car you’re
            about to buy,
          </Typography>
          <Button
            className={classes.carfaxButton}
            variant="text"
            color="secondary"
            onClick={props.handleOpenProspectForm}
          >
            Get Carfax report <ArrowIcon />
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

VehicleHistory.propTypes = {
  handleOpenProspectForm: PropTypes.func.isRequired
};
