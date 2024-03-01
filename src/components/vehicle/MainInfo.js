import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {
  BORDER_COLOR,
  VEHICLE_EXTERIOR_COLORS,
  VEHICLE_INTERIOR_COLORS,
  LIGHT_GRAY_BACKGROUND,
} from 'src/constants';
import { formatNumber } from 'utils/formatNumbersToLocale';
import FlipCountdown from 'src/components/shared/FlipCountdown';
import { VEHICLE_PAGE_WIDTH } from './constants';
import WarrantyBox from './WarrantyBox';
import WarrantyStandard from './WarrantyStandard';

const useStyles = makeStyles(theme => ({
  mainInfoWrapper: {
    borderBottom: `1px solid ${BORDER_COLOR}`,
    height: 150,
    background: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
  warrantyWrapper: {
    height: 'max-content',
    background: LIGHT_GRAY_BACKGROUND,
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
  warrantyStanWrapper: {
    height: 'max-content',
    background: LIGHT_GRAY_BACKGROUND,
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
    },
  },
  mainInfoContainer: {
    maxWidth: VEHICLE_PAGE_WIDTH,
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  dataContainer: {
    height: 100,
    minWidth: 150,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      height: 90,
    },
  },
  mainInfoValue: {
    margin: theme.spacing(2),
    marginLeft: 0,
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  batteryInfoValue: {
    margin: theme.spacing(1.625),
    marginLeft: 0,
    fontSize: '2.125rem',
    [theme.breakpoints.down('sm')]: {
      margin: -4,
    },
  },
  mileageAndFuelContainer: {
    justifyContent: 'flex-start',
    padding: 9,
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      flexDirection: 'column',
    },
  },
  colorsWrapper: {
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
    },
  },
  colorContainer: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  colorTitle: {
    marginRight: theme.spacing(3),
    width: 60,
  },
  addBorder: {
    border: `1px solid ${BORDER_COLOR}`,
  },
  interiorColorWrapper: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  requestActionButton: {
    minWidth: 260,
    width: '100%',
    height: 60,
  },
  requestActionText: {
    textAlign: 'center',
    color: BORDER_COLOR,
    width: '100%',
    marginTop: theme.spacing(1.25),
  },
}));

export default function MainInfo(props) {
  const classes = useStyles();

  const {
    vehicleInformation:
    {
      batteryRange,
      mileage,
      interiorColor,
      exteriorColor,
      mpg,
      features,
      purchaseDate,
      availabilityStatus,
      isLifeTimeWarranty
    },
  } = props;
  const { invWarranties } = features;
  const interiorColorData =
    VEHICLE_INTERIOR_COLORS.find(color => color.constant === interiorColor) ||
    {};
  const exteriorColorData =
    VEHICLE_EXTERIOR_COLORS.find(color => color.constant === exteriorColor) ||
    {};

  return (
    <>
      <Grid
        className={classes.mainInfoWrapper}
        container
        alignItems="center"
        justifyContent="center"
        wrap="nowrap"
      >
        <Grid
          className={classes.mainInfoContainer}
          container
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
        >
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            wrap="nowrap"
          >
            <Grid
              container
              alignItems="flex-start"
              justifyContent="space-between"
              wrap="nowrap"
              direction="column"
              className={classes.dataContainer}
            >
              <Typography variant="body1">Mileage:</Typography>
              <Grid
                className={classes.mileageAndFuelContainer}
                container
                alignItems="center"
                wrap="nowrap"
              >
                <Typography className={classes.mainInfoValue} variant="h4">
                  {mileage && formatNumber(mileage)}
                </Typography>
                <Typography variant="body1">Miles</Typography>
              </Grid>
            </Grid>
            <Grid
              container
              alignItems="flex-start"
              justifyContent="space-between"
              wrap="nowrap"
              direction="column"
              className={classes.dataContainer}
            >
              {batteryRange === null
                ?
                  <Typography variant="body1">Fuel Economy</Typography>
                :
                  <Typography variant="body1">Battery Range</Typography>}
              <Grid
                className={classes.mileageAndFuelContainer}
                container
                alignItems="center"
                wrap="nowrap"
              >
                {mpg
                  ?
                    <Typography className={classes.mainInfoValue} variant="h4">
                      {`${formatNumber(mpg.city.low)}/${formatNumber(mpg.hwy.low)}`}
                    </Typography>
                  :
                    <Typography className={classes.batteryInfoValue} variant="h5">
                      {batteryRange}
                    </Typography>}
                {batteryRange === null
                  ? <Typography variant="body1">mpg City/Hwy</Typography>
                  : <Typography variant="body1">MI</Typography>}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            className={classNames(classes.colorsWrapper, classes.dataContainer)}
            container
            alignItems="center"
            justifyContent="flex-start"
            wrap="nowrap"
          >
            <Grid container justifyContent="center" wrap="nowrap">
              <Typography className={classes.colorTitle} variant="body1">
                Exterior:
              </Typography>
              <Grid
                item
                className={classNames(
                  classes.colorContainer,
                  exteriorColorData.constant === 'WHITE' && classes.addBorder
                )}
                style={{ background: exteriorColorData.colorCode }}
              />
            </Grid>
            <Grid
              className={classes.interiorColorWrapper}
              container
              justifyContent="center"
              wrap="nowrap"
            >
              <Typography className={classes.colorTitle} variant="body1">
                Interior
              </Typography>
              <Grid
                item
                className={classNames(
                  classes.colorContainer,
                  interiorColorData.constant === 'WHITE' && classes.addBorder
                )}
                style={{ background: interiorColorData.colorCode }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            alignItems="flex-start"
            justifyContent="flex-start"
            wrap="nowrap"
            direction="column"
            className={classes.dataContainer}
          >
            <Grid container alignItems="center">
              <Button
                className={classes.requestActionButton}
                color="secondary"
                variant="outlined"
                onClick={props.handleOpenProspectForm}
              >
                request more info
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            alignItems="flex-start"
            justifyContent="flex-start"
            wrap="nowrap"
            direction="column"
            className={classes.dataContainer}
          >
            {availabilityStatus === ('E' || 'H') &&
              <Grid container alignItems="center">
                <Grid container alignItems="center" style={{ height: '60px' }}>
                  <FlipCountdown
                    endAt={purchaseDate}
                    hideYear
                    hideMonth
                    hideSecond
                    titlePosition="bottom"
                    size="small"
                  />
                </Grid>
                <Typography className={classes.requestActionText} variant="body2">
                  Purchase this car before this time. It might not be available after.
                </Typography>
              </Grid>}
          </Grid>
        </Grid>
      </Grid>
      {(isLifeTimeWarranty || mileage > 500) &&
        <Grid
          className={classes.warrantyStanWrapper}
          container
          alignItems="center"
          justifyContent="center"
          wrap="nowrap"
        >
          <WarrantyStandard lifeTimeWarranty={isLifeTimeWarranty} mileage={mileage} />
        </Grid>}
      <Grid
        className={classes.warrantyWrapper}
        container
        alignItems="center"
        justifyContent="center"
        wrap="nowrap"
      >
        <Grid
          className={classes.mainInfoContainer}
          container
          item
          xs={12}
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
        >
          <WarrantyBox warranty={invWarranties} />
        </Grid>
      </Grid>
    </>
  );
}

MainInfo.propTypes = {
  vehicleInformation: PropTypes.object,
  handleOpenProspectForm: PropTypes.func.isRequired,
};

MainInfo.defaultProps = {
  vehicleInformation: {},
};
