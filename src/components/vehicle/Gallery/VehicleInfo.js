import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import FilterIcon from '@material-ui/icons/FilterNone';
import CloseIcon from '@material-ui/icons/Close';

import { BORDER_COLOR } from 'src/constants';
import { DRAWER_WIDTH } from '../constants';

const useStyles = makeStyles(theme => ({
  vehicleInfoHeader: {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${BORDER_COLOR}`,
  },
  filterIcon: {
    color: BORDER_COLOR,
    marginRight: theme.spacing(1),
  },
  closeIcon: {
    padding: theme.spacing(0.5),
    color: BORDER_COLOR,
  },
  vehicleInfoSpecContainer: {
    padding: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
    borderBottom: `1px solid ${BORDER_COLOR}`,
    height: 'auto',
  },
  vehicleInfoSpecTitle: {
    textTransform: 'uppercase',
    fontSize: theme.typography.pxToRem(28),
    margin: `${theme.spacing(1)}px 0px`,
  },
  vehicleInfoSpecItem: {
    margin: `${theme.spacing(0.5)}px 0px`,
  },
  vehicleMainDataContainer: {
    padding: `${theme.spacing(3.5)}px ${theme.spacing(2.5)}px`,
  },
  seriesTitle: {
    color: BORDER_COLOR,
  },
  priceTitleDesktop: {
    fontSize: theme.typography.pxToRem(28),
  },
  priceTitleMobile: {
    fontSize: theme.typography.pxToRem(20),
  },
  vehicleMainPicture: {
    width: 290,
    height: 'auto',
    margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(2.5)}px`,
  },

  menuButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: theme.palette.common.white,
  },
  hideMenuButton: {
    display: 'none',
  },
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

function VehicleInfo(props) {
  const classes = useStyles();
  const theme = useTheme();

  const {
    vehicleInformation: {
      series,
      carYear,
      make,
      model,
      seating,
      exteriorColor,
    },
    vehicleMileage,
    vehiclePrice,
    isMobile,
    handleCloseGallery,
    showDrawer,
    handleDrawerOpen,
    handleDrawerClose,
    handleOpenProspectForm,
  } = props;

  const vehicleMainSpec = `${carYear} ${make} ${model}`;
  let headRoomData = {
    frontHeadRoom: null,
    rearHeadRoom: null,
    frontLegRoom: null,
    rearLegRoom: null
  };
  headRoomData = props.vehicleInformation.features.invHeadroom.length > 0
    ? props.vehicleInformation.features.invHeadroom[0] : headRoomData;
  const renderVehicleInfo = () => (
    <>
      <Grid
        className={classes.vehicleInfoHeader}
        container
        justifyContent="space-between"
      >
        <Typography style={{ display: 'flex' }} variant="body1">
          <FilterIcon className={classes.filterIcon} />
          Gallery
        </Typography>
        <IconButton
          className={classes.closeIcon}
          edge="start"
          color="inherit"
          onClick={handleCloseGallery}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Grid>
      <Grid
        className={classes.vehicleInfoSpecContainer}
        container
        direction="column"
      >
        <Typography variant="subtitle2">FEATURE</Typography>
        <Typography className={classes.vehicleInfoSpecTitle} variant="h4">
          Interior color/specs
        </Typography>
        <Typography className={classes.vehicleInfoSpecItem} variant="body1">
          {`Color: ${exteriorColor}`}
        </Typography>
        <Typography className={classes.vehicleInfoSpecItem} variant="body1">
          {`Seats ${seating} passengers`}
        </Typography>
        <Typography className={classes.vehicleInfoSpecItem} variant="body1">
          Dimensions:
        </Typography>
        <Typography className={classes.vehicleInfoSpecItem} variant="body1">
          - Front head-room: {headRoomData.frontHeadRoom} in
        </Typography>
        <Typography className={classes.vehicleInfoSpecItem} variant="body1">
          - Rear head-room: {headRoomData.rearHeadRoom} in
        </Typography>
        <Typography className={classes.vehicleInfoSpecItem} variant="body1">
          - Front leg-room: {headRoomData.frontLegRoom} in
        </Typography>
        <Typography className={classes.vehicleInfoSpecItem} variant="body1">
          - Rear leg-room: {headRoomData.rearLegRoom} in
        </Typography>
      </Grid>
      <Grid
        className={classes.vehicleMainDataContainer}
        container
        justifyContent="center"
        direction="column"
      >
        <Grid container wrap="nowrap" justifyContent="space-between" style={{ marginBottom: 10 }}>
          <Grid container direction="column" justifyContent="space-between">
            <Typography variant="body1">{vehicleMainSpec}</Typography>
            <Typography className={classes.seriesTitle} variant="body2">
              {series}
            </Typography>
          </Grid>
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Typography
              className={
                isMobile ? classes.priceTitleMobile : classes.priceTitleDesktop
              }
              variant={isMobile ? 'body1' : 'h4'}
            >
              {vehiclePrice}
            </Typography>
            <Typography variant="body2">{vehicleMileage}</Typography>
          </Grid>
        </Grid>
        <Button variant="outlined" color="secondary" onClick={handleOpenProspectForm}>
          Request More Info
        </Button>
      </Grid>
    </>
  );

  return isMobile || theme.breakpoints.width(props.width) < 960 ?
    (
      <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={classNames(
            classes.menuButton,
            showDrawer && classes.hideMenuButton
          )}
        >
          <MenuIcon />
        </IconButton>
        <SwipeableDrawer
          className={classes.drawer}
          anchor="right"
          open={props.showDrawer}
          onClose={handleDrawerClose}
          onOpen={handleDrawerOpen}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction !== 'ltr' ?
                (
                  <ChevronLeftIcon />
                ) :
                (
                  <ChevronRightIcon />
                )}
            </IconButton>
          </div>
          <Divider />
          {renderVehicleInfo()}
        </SwipeableDrawer>
      </>
    )
    :
    (
      renderVehicleInfo()
    );
}

VehicleInfo.propTypes = {
  handleCloseGallery: PropTypes.func.isRequired,
  vehicleInformation: PropTypes.object,
  vehicleMileage: PropTypes.string,
  vehiclePrice: PropTypes.string,
  isMobile: PropTypes.bool,
  showDrawer: PropTypes.bool.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
  handleOpenProspectForm: PropTypes.func.isRequired,
};

VehicleInfo.defaultProps = {
  vehicleInformation: {},
  vehicleMileage: '',
  vehiclePrice: '',
  isMobile: false,
};

export default withWidth()(VehicleInfo);
