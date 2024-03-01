/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SvgIcon from '@material-ui/core/SvgIcon';
import Skeleton from '@material-ui/lab/Skeleton';

import NoImageBackground from 'assets/noImageAvailable.jpg';
import DollarIcon from 'assets/dollar.svg';
import PendingDeal from 'assets/vehicle/pendingDeal.png';

import { formatNumber } from 'utils/formatNumbersToLocale';
import { getCookie } from 'utils/cookie';
import { BORDER_COLOR } from 'src/constants';

const useStyles = makeStyles(theme => ({
  vehicleCard: {
    width: 350,
    height: 460,
    cursor: 'pointer',
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: 5,
    margin: `${theme.spacing(1.25)}px 0px`,
    backgroundColor: theme.palette.common.white,
  },
  vehicleCardInformation: {
    height: 190,
    padding: `${theme.spacing(2.25)}px ${theme.spacing(1.5)}px`,
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
    height: 265,
    marginTop: theme.spacing(0.5),
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  vehicleCardButton: {
    position: 'absolute',
    top: -theme.spacing(2),
    right: theme.spacing(1.5),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    textDecoration: 'none',
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
  cardLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  pendingDeal: {
    width: '100pt',
    position: 'relative',
    bottom: 145,
    zIndex: 2,
    height: 0,
    marginLeft: 15,
    [theme.breakpoints.down('sm')]: {
      bottom: 90,
    },
    [theme.breakpoints.up(1000)]: {
      bottom: 105,
    },
  },
  PendingDealImg: {
    width: '80pt',
    [theme.breakpoints.down('sm')]: {
      width: 55,
    },
    [theme.breakpoints.up(1000)]: {
      width: 70,
    },
  },
  pndngTypo: {
    fontFamily: 'Campton SemiBold',
    color: 'black',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
}));

const VehicleCard = React.memo(props => {
  const classes = useStyles();
  const router = useRouter();
  const { vehicle, isTourOpen, index, restQuery } = props;

  const { availabilityStatus } = vehicle;
  const [isLoadSavings, setLoadSavings] = useState(false);
  const [downPayment, setDownPayment] = useState(null);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [monthlyPaymentPeriod, setMonthlyPaymentPeriod] = useState(null);

  useEffect(() => {
    const prospectId = getCookie('prospectId');
    const localtCreditId = getCookie('bankCreditId');
    const isSendedSavings = getCookie('isSendedSavings');

    if (prospectId && localtCreditId && isSendedSavings && props.vehicle) {
      setLoadSavings(true);
    }

    if (props.vehicle && props.vehicle.savings) {
      const { savings } = props.vehicle;
      setDownPayment(savings.downPayment);
      setMonthlyPayment(savings.monthlyPayment);
      setMonthlyPaymentPeriod(savings.monthlyPaymentPeriod);
      setLoadSavings(false);
    }
  }, [props.vehicle]);

  const parseVehiclePrice = price => {
    const parsedPrice = parseInt(price, 10);
    return Number.isNaN(parsedPrice)
      ? '$--'
      : `$${parsedPrice.toLocaleString()}`;
  };

  const vehicleImageArray = vehicle.picturesUrl.sort(
    (a, b) =>
      a.name.split('.')[0].split('_')[
        a.name.split('.')[0].split('_').length - 1
      ] -
      b.name.split('.')[0].split('_')[
        b.name.split('.')[0].split('_').length - 1
      ]
  );

  const handleGoToVehicle = () => {
    const { vehiclesAreSortedBy, searchState } = props;
    const { query } = router;
    const savedFilter = { query, vehiclesAreSortedBy, searchState };
    localStorage.setItem('savedFilter', JSON.stringify(savedFilter));
  };

  const renderDownPayment = () => {
    if (downPayment || downPayment === 0) {
      return `$ ${formatNumber(downPayment)}`;
    } else return '-';
  };

  const renderMonthPayment = () => {
    if (monthlyPayment || monthlyPayment === 0) {
      return `$ ${formatNumber(monthlyPayment)}/Mo (${monthlyPaymentPeriod})`;
    } else return '-';
  };

  const renderButtonText = () => {
    if (monthlyPayment) {
      return 'Proceed to finance';
    } else return 'Get Your Values';
  };

  return (
    <Link
      href={{
        pathname: '/vehicle',
        query: { id: vehicle.stockid, ...restQuery },
      }}
    >
      <a onClick={handleGoToVehicle} className={classes.cardLink}>
        <Grid
          container
          className={classes.vehicleCard}
          wrap="nowrap"
          direction="column"
          alignItems="flex-start"
          data-tut={index === 0 && isTourOpen ? 'Search-car' : ''}
        >
          <Grid item container className={classes.vehicleCardInformation}>
            <Grid
              item
              xs={7}
              container
              wrap="nowrap"
              direction="column"
              alignItems="flex-start"
              style={{ paddingTop: 6, textAlign: 'left' }}
            >
              <Typography variant="body1">
                {`${vehicle.carYear} ${vehicle.make} ${vehicle.model}`}
              </Typography>
              <Typography
                className={classes.vehicleCardSubtitle}
                color="textSecondary"
                variant="body2"
              >
                {vehicle.series}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography align="right" className={classes.vehicleCardPrice}>
                {parseVehiclePrice(vehicle.listPrice)}
              </Typography>
              <Typography
                className={classes.vehicleCardMileage}
                align="right"
                variant="body2"
              >
                {`${formatNumber(vehicle.mileage)} miles`}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" style={{ color: '#44687C' }}>
                Your Down Payment
              </Typography>
              <Typography variant="body2">
                {isLoadSavings ? (
                  <Skeleton variant="text" width={60} animation="wave" />
                ) : (
                  renderDownPayment()
                )}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" style={{ color: '#44687C' }}>
                Your Monthly Payment
              </Typography>
              <Typography variant="body2">
                {isLoadSavings ? (
                  <Skeleton variant="text" width={60} animation="wave" />
                ) : (
                  renderMonthPayment()
                )}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            style={{ position: 'relative' }}
            item
            container
            direction="column"
          >
            <Link
              href={{
                pathname: '/finance',
                query: { stockid: vehicle.stockid, ...restQuery },
              }}
            >
              <Button
                variant="contained"
                className={classes.vehicleCardButton}
                data-tut={index === 0 && isTourOpen ? 'Search-value' : ''}
              >
                {isLoadSavings ? (
                  <Skeleton variant="text" width={120} animation="wave" />
                ) : (
                  renderButtonText()
                )}
                <SvgIcon className={classes.svgIcon} />
              </Button>
            </Link>
            <img
              className={classes.vehiclePicture}
              src={
                vehicleImageArray.length
                  ? vehicleImageArray[0].picture
                  : NoImageBackground
              }
              alt="vehicle"
            />
          </Grid>
          {availabilityStatus === 'D' && (
            <div className={classes.pendingDeal}>
              <img
                src={PendingDeal}
                alt="Pending_Deal"
                className={classes.PendingDealImg}
              />
              <Typography variant="h6" className={classes.pndngTypo}>
                Pending Deal
              </Typography>
            </div>
          )}
        </Grid>
      </a>
    </Link>
  );
});

VehicleCard.propTypes = {
  vehicle: PropTypes.object.isRequired,
  vehiclesAreSortedBy: PropTypes.string,
  searchState: PropTypes.object,
  isTourOpen: PropTypes.bool,
  index: PropTypes.number,
  restQuery: PropTypes.object,
};

VehicleCard.defaultProps = {
  vehiclesAreSortedBy: [],
  searchState: {},
  isTourOpen: false,
  index: 0,
  restQuery: {},
};

export default VehicleCard;
