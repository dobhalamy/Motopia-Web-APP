import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowLeft';

import { formatMoneyAmount, formatNumber } from 'utils/formatNumbersToLocale';
import { BORDER_COLOR, LIGHT_GRAY_BACKGROUND } from 'src/constants';

import ReturnLabel from 'assets/return_label.png';
import Gallery from '../Gallery';
import GalleryPreview from './GalleryPreview';
import PinMapper from './PinMapper';

const useStyles = makeStyles(theme => ({
  DamageMapContainer: {
    minHeight: 650,
    background: `linear-gradient(180deg, ${theme.palette.secondary.main},
       ${theme.palette.secondary.main} 48%, ${LIGHT_GRAY_BACKGROUND} 48%,
        ${LIGHT_GRAY_BACKGROUND} 100%)`,
    color: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      background: `linear-gradient(180deg, ${theme.palette.secondary.main},
        ${theme.palette.secondary.main} 38%, ${LIGHT_GRAY_BACKGROUND} 38%,
         ${LIGHT_GRAY_BACKGROUND} 100%)`,
      height: 'auto',
    },
  },
  subHeaderContainer: {
    padding: `${theme.spacing(2)}px ${theme.spacing(6)}px`,
    maxHeight: 100,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
    },
  },
  backToResultButton: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightLight,
    padding: 0,
    [theme.breakpoints.down('md')]: {
      margin: `0px 0px ${theme.spacing(1.5)}px -${theme.spacing(1)}px`,
    },
  },
  availabilityButtonContainer: {
    height: 60,
    width: 270,
    [theme.breakpoints.down('md')]: {
      height: 50,
      width: 172,
    },
  },
  availabilityButton: {
    height: '100%',
    [theme.breakpoints.down('md')]: {
      fontSize: theme.typography.pxToRem(12),
    },
  },
  vehiclePriceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehiclePriceText: {
    width: 'auto',
    marginRight: theme.spacing(2),
  },
  emptyBlockForGrid: {
    display: 'block',
    width: 'auto',
    [theme.breakpoints.down('md')]: {
      width: 200,
    },
  },
  pictureContainer: {
    padding: `${theme.spacing(7)}px ${theme.spacing(6)}px 0px`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      padding: 0,
    },
  },
  priceTitleDesktop: {
    fontSize: theme.typography.pxToRem(35),
  },
  priceTitleMobile: {
    fontSize: theme.typography.pxToRem(29),
  },
  confirmButtonBottomMenu: {
    height: 70,
    bottom: 0,
    position: 'fixed',
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    zIndex: 200,
    borderTop: `1px solid ${BORDER_COLOR}`,
    padding: `0px ${theme.spacing(1.5)}px`,
  },
  labelClass: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: '5%'
    },
  }
}));

function DamageMap(props) {
  const classes = useStyles();

  const renderConfirmButton = (func) => (
    <Grid className={classes.availabilityButtonContainer}>
      <Button
        className={classes.availabilityButton}
        color="primary"
        variant="contained"
        fullWidth
        onClick={func}
      >
        Payment Options
      </Button>
    </Grid>
  );

  const renderReturnLabel = () => (
    <Grid>
      <img src={ReturnLabel} alt="returnLabel"/>
    </Grid>
  );
  const {
    vehicleInformation,
    vehicleInformation: {
      stockid,
      carYear,
      make,
      model,
      series,
      mileage,
      listPrice,
      picturesUrl,
      exteriorColor,
      availabilityStatus
    },
    isMobile,
    isGalleryOpen,
    handleGoToPayment,
  } = props;
  const savedFilter = JSON.parse(localStorage.getItem('savedFilter'));
  const prevFilters = savedFilter ? savedFilter.query : null;
  const vehicleMainInformation = `${carYear} ${make} ${model}`;
  const vehiclePrice = +listPrice > 0 ? formatMoneyAmount(listPrice) : '--';
  const vehicleMileage = mileage ? `${formatNumber(mileage)} miles` : '--';
  const vehiclePictureList = picturesUrl.sort((a, b) =>
    a.name.split('.')[0].split('_')[a.name.split('.')[0].split('_').length - 1]
    - b.name.split('.')[0].split('_')[b.name.split('.')[0].split('_').length - 1]);

  return (
    <Grid
      container
      wrap="nowrap"
      direction="column"
      alignItems="flex-start"
      className={classes.DamageMapContainer}
    >
      <Grid
        className={classes.subHeaderContainer}
        container
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Box order={{ xs: 1, sm: 1 }}>
          <Link href={{ pathname: '/search-cars', hash: stockid, query: prevFilters }}>
            <Button className={classes.backToResultButton} color="inherit">
              <ArrowBackIcon /> Back to results
            </Button>
          </Link>
        </Box>
        <Box order={{ xs: 3, sm: 2 }}>
          <Grid item container direction="column">
            <Typography variant={isMobile ? 'body1' : 'h4'}>
              {carYear && make && vehicleMainInformation}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {series}
            </Typography>
          </Grid>
        </Box>
        <Box className={classes.vehiclePriceContainer} order={{ xs: 4, sm: 3 }}>
          <Grid
            className={classes.vehiclePriceText}
            item
            container
            direction="column"
            alignItems="flex-end"
            style={{ width: 'auto' }}
          >
            <Typography
              className={
                isMobile ? classes.priceTitleMobile : classes.priceTitleDesktop
              }
              variant={isMobile ? 'body1' : 'h4'}
            >
              {vehiclePrice}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {vehicleMileage}
            </Typography>
          </Grid>
          <Hidden smDown>{renderConfirmButton(handleGoToPayment)}</Hidden>
        </Box>
        <Box order={{ xs: 5, sm: 5 }} className={classes.labelClass}>{renderReturnLabel()}</Box>
        <Box className={classes.emptyBlockForGrid} order={{ xs: 2, sm: 4 }} />
      </Grid>
      {vehiclePictureList.length > 0 &&
        <Grid
          className={classes.pictureContainer}
          container
          alignItems="flex-start"
          justifyContent="center"
          wrap="nowrap"
        >
          <GalleryPreview
            pictureList={vehiclePictureList}
            handleOpenGallery={props.handleOpenGallery}
          />
          <PinMapper
            handleOpenGallery={props.handleOpenGallery}
            pictureList={vehiclePictureList}
            exteriorColor={exteriorColor}
            isMobile={isMobile}
            availabilityStatus={availabilityStatus}
          />
        </Grid>}
      <Hidden mdUp>
        <Grid
          className={classes.confirmButtonBottomMenu}
          container
          alignItems="center"
          justifyContent="space-around"
          wrap="nowrap"
        >
          <Grid item container direction="column" style={{ width: 'auto' }}>
            <Typography variant="caption">{vehicleMainInformation}</Typography>
            <Typography variant="body1">{vehiclePrice}</Typography>
          </Grid>
          {renderConfirmButton(handleGoToPayment)}
        </Grid>
      </Hidden>
      {vehicleInformation.stockid && (
        <Gallery
          isGalleryOpen={isGalleryOpen}
          handleCloseGallery={props.handleCloseGallery}
          vehiclePrice={vehiclePrice}
          vehicleMileage={vehicleMileage}
          vehicleInformation={vehicleInformation}
          isMobile={isMobile}
          handleOpenProspectForm={props.handleOpenProspectForm}
        />
      )}
    </Grid>
  );
}

DamageMap.propTypes = {
  vehicleInformation: PropTypes.object,
  isMobile: PropTypes.bool,
  isGalleryOpen: PropTypes.bool.isRequired,
  handleCloseGallery: PropTypes.func.isRequired,
  handleOpenGallery: PropTypes.func.isRequired,
  handleOpenProspectForm: PropTypes.func.isRequired,
  handleGoToPayment: PropTypes.func.isRequired,
};

DamageMap.defaultProps = {
  vehicleInformation: {},
  isMobile: false,
};

export default DamageMap;
