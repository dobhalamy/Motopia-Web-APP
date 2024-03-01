import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SvgIcon from '@material-ui/core/SvgIcon';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Badge from '@material-ui/core/Badge';
import HandleTour from 'components/shared/HandleTour';
import { getNewPriceList } from '@/utils/commonUtils';

import DollarIcon from 'assets/dollar.svg';

import { formatNumber } from 'utils/formatNumbersToLocale';
import { BORDER_COLOR } from 'src/constants';
import { Box } from '@material-ui/core';
import { getCookieJSON } from '@/utils/cookie';

const useStyles = makeStyles(theme => ({
  vehicleCard: {
    width: 735,
    height: 230,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: 5,
    margin: `${theme.spacing(1.25)}px 0px`,
    backgroundColor: theme.palette.common.white,
  },
  vehicleMobileCard: {
    width: 350,
    height: 460,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: 5,
    margin: `${theme.spacing(1.25)}px 0px`,
    backgroundColor: theme.palette.common.white,
  },
  vehicleCardInformation: {
    height: '100%',
    padding: `0 ${theme.spacing(1.5)}px`,
  },
  vehicleCardPrice: {
    fontSize: theme.typography.pxToRem(30),
  },
  vehicleCardMileage: {
    margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(1.25)}px`,
  },
  vehicleCardSubtitle: {
    margin: `${theme.spacing(0.5)}px 0px ${theme.spacing(1.5)}px`,
  },
  vehiclePicture: {
    width: '100%',
    padding: theme.spacing(0.25),
    height: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  heroInputs: {
    height: 20,
  },
  vehicleCardButton: {
    height: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(12),
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  states: {
    width: '40%',
  },
  mobileCardButton: {
    position: 'absolute',
    top: -theme.spacing(2),
    right: theme.spacing(1.5),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(12),
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  svgIcon: {
    backgroundImage: `url(${DollarIcon})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    marginLeft: theme.spacing(1),
  },
  boldText: {
    fontWeight: 600,
  },
}));

export default function VehicleCard(props) {
  const router = useRouter();
  const { state } = router.query;
  let tierDownValue;
  let baseRTOPriceValue;
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.down('md'));
  const mvr = getCookieJSON('mvr');
  const [isTourOpen, setIsTourOpen] = React.useState(false);
  const [isApprovalOpen, setisApprovalOpen] = React.useState(undefined);
  const headerSteps = [
    {
      selector: '[data-tut="Instant-Approval"]',
      content: () => (
        <Typography>
          Select Instant Approval To Get Pricing based On Your Contract Type.
        </Typography>
      ),
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'left',
    },
  ];
  const { vehicle, onVehicleClick, handleActiveHint, index } = props;
  const variedPrice = getNewPriceList(vehicle, state);
  useEffect(() => {
    if (index === 0) {
      setIsTourOpen(true);
    } else {
      setIsTourOpen(false);
    }
    setisApprovalOpen(localStorage.getItem('rideshareOpen'));
  }, [index]);
  const {
    tier1Down,
    tier2Down,
    baseRTOPrice,
    yearFrom,
    yearTo,
    make,
    model,
    series,
    pictureURLs,
    rsdStockId,
  } = vehicle;
  const vehicleCardTitle = `${make} ${model} (${yearFrom}-${yearTo
    .toString()
    .slice(-2)})`;
  if (mvr !== undefined) {
    if (vehicle?.isPriceVaries) {
      const tierDown = mvr.tierName.includes('Tier 2')
        ? variedPrice[0]?.tier2Down
        : variedPrice[0]?.tier1Down;
      tierDownValue = tierDown ? `$ ${formatNumber(tierDown)}` : '-';
    } else {
      const tierDown = mvr.tierName.includes('Tier 2') ? tier2Down : tier1Down;
      tierDownValue = tierDown ? `$ ${formatNumber(tierDown)}` : '-';
    }
  } else if (vehicle?.isPriceVaries) {
    tierDownValue = variedPrice[0]?.tier1Down
      ? `$ ${formatNumber(variedPrice[0]?.tier1Down)}`
      : '-';
  } else {
    tierDownValue = tier1Down ? `$ ${formatNumber(tier1Down)}` : '-';
  }

  if (vehicle?.isPriceVaries) {
    baseRTOPriceValue = variedPrice[0]?.baseRTOPrice
      ? `$ ${formatNumber(variedPrice[0]?.baseRTOPrice)}`
      : '-';
  } else {
    baseRTOPriceValue = baseRTOPrice ? `$ ${formatNumber(baseRTOPrice)}` : '-';
  }

  const renderImage = () => {
    const text = model;
    const textLength = text.length;
    const [imageOne, imageTwo] = pictureURLs;
    const imageStyles = makeStyles({
      basic: {
        width: '100%',
        height: '100%',
        minHeight: 228,
        backgroundImage: `url(${imageOne})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        '&:hover': {
          backgroundImage: `url(${imageTwo})`,
        },
        fontWeight: 600,
        fontSize: textLength < 10 ? 32 : 24,
        padding: '5px 10px',
      },
    });
    const imageClasses = imageStyles();

    return (
      <Box className={imageClasses.basic}>
        <Typography variant="h5">
          <b>{text}</b>
        </Typography>
      </Box>
    );
  };
  const closeTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('rideshareOpen', true);
  };

  return (
    <Grid
      container
      className={!matches ? classes.vehicleCard : classes.vehicleMobileCard}
      wrap="nowrap"
      justifyContent="center"
      direction={matches ? 'column' : 'row'}
      alignItems="flex-start"
    >
      {!matches ? (
        <>
          <Grid container item xs={6}>
            {renderImage()}
          </Grid>
          <Grid
            xs={6}
            item
            container
            className={classes.vehicleCardInformation}
            alignItems="flex-start"
          >
            <Grid
              item
              xs={12}
              container
              wrap="nowrap"
              direction="column"
              alignItems="flex-start"
              style={{ paddingTop: 6, textAlign: 'left' }}
            >
              <Typography variant="h6" className={classes.boldText}>
                {vehicleCardTitle}
              </Typography>
              <Typography
                className={classes.vehicleCardSubtitle}
                color="textSecondary"
                variant="body1"
              >
                {series}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Badge
                style={{ cursor: 'pointer' }}
                onClick={() => handleActiveHint(1)}
                color="error"
                badgeContent={1}
              >
                <Typography
                  variant="h6"
                  component="span"
                  style={{ color: '#44687C' }}
                >
                  Down Payment
                </Typography>
              </Badge>
              <Typography
                variant="h6"
                component="span"
                className={classes.boldText}
              >
                {tierDownValue}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Badge
                style={{ cursor: 'pointer' }}
                onClick={() => handleActiveHint(2)}
                color="error"
                badgeContent={2}
              >
                <Typography
                  variant="h6"
                  component="span"
                  style={{ color: '#44687C' }}
                >
                  Weekly Payment
                </Typography>
              </Badge>
              <Typography
                variant="h6"
                component="span"
                className={classes.boldText}
              >
                {baseRTOPriceValue}
              </Typography>
            </Grid>
            {mvr !== undefined && mvr.tierName.includes('Tier 2') && (
              <Grid
                item
                xs={12}
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  component="span"
                  style={{ color: '#44687C' }}
                >
                  Total Surcharge
                </Typography>
                <Typography
                  variant="h6"
                  component="span"
                  className={classes.boldText}
                >
                  {`$ ${formatNumber(mvr.totalSurcharge)}`}
                </Typography>
              </Grid>
            )}

            <Grid item container xs={12} justifyContent="flex-end">
              <Button
                onClick={() => onVehicleClick(rsdStockId)}
                variant="contained"
                className={classes.vehicleCardButton}
                data-tut="Instant-Approval"
              >
                {mvr ? <span>RESERVE CAR</span> : <span>INSTANT APPROVAL</span>}
                <SvgIcon className={classes.svgIcon} />
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid item container className={classes.vehicleCardInformation}>
            <Grid
              item
              xs={12}
              container
              wrap="nowrap"
              direction="column"
              alignItems="flex-start"
              style={{ paddingTop: 6, textAlign: 'left' }}
            >
              <Typography variant="h6" className={classes.boldText}>
                {vehicleCardTitle}
              </Typography>
              <Typography
                className={classes.vehicleCardSubtitle}
                color="textSecondary"
                variant="body1"
              >
                {series}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Badge
                style={{ cursor: 'pointer' }}
                onClick={() => handleActiveHint(1)}
                color="error"
                badgeContent={1}
              >
                <Typography
                  variant="h6"
                  component="span"
                  style={{ color: '#44687C' }}
                >
                  Down Payment
                </Typography>
              </Badge>
              <Typography
                variant="h6"
                component="span"
                className={classes.boldText}
              >
                {tierDownValue}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Badge
                style={{ cursor: 'pointer' }}
                onClick={() => handleActiveHint(2)}
                color="error"
                badgeContent={2}
              >
                <Typography
                  variant="h6"
                  component="span"
                  style={{ color: '#44687C' }}
                >
                  Weekly Payment
                </Typography>
              </Badge>
              <Typography
                variant="h6"
                component="span"
                className={classes.boldText}
              >
                {baseRTOPriceValue}
              </Typography>
            </Grid>
            {mvr !== undefined && mvr.tierName.includes('Tier 2') && (
              <Grid
                item
                xs={12}
                container
                justifyContent="space-between"
                alignItems="center"
                style={{ paddingBottom: '1rem' }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  style={{ color: '#44687C' }}
                >
                  Total Surcharge
                </Typography>
                <Typography
                  variant="h6"
                  component="span"
                  className={classes.boldText}
                >
                  {`$ ${formatNumber(mvr.totalSurcharge)}`}
                </Typography>
              </Grid>
            )}
          </Grid>

          <Grid
            style={{ position: 'relative', minHeight: 'max-content' }}
            item
            container
            direction="column"
          >
            <Button
              onClick={() => onVehicleClick(rsdStockId)}
              variant="contained"
              className={classes.mobileCardButton}
              data-tut="Instant-Approval"
            >
              {mvr ? <span>RESERVE CAR</span> : <span>INSTANT APPROVAL</span>}
              <SvgIcon className={classes.svgIcon} />
            </Button>
            {renderImage()}
          </Grid>
        </>
      )}
      {isApprovalOpen && (
        <HandleTour
          isOpen={isTourOpen}
          steps={headerSteps}
          handleClose={closeTour}
        />
      )}
    </Grid>
  );
}

VehicleCard.propTypes = {
  vehicle: PropTypes.object.isRequired,
  onVehicleClick: PropTypes.func.isRequired,
  handleActiveHint: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
