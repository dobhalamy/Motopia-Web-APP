import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import HandleTour from 'components/shared/HandleTour';
import { getNewPriceList } from '@/utils/commonUtils';

import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import ApproveIcon from 'assets/finance/ride-share/approved_icon.svg';

const useStyles = makeStyles(theme => ({
  VehiclePaymentWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
  },
  VehiclePaymentContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  VehiclePaymentText: {
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
  },
  BoxMargin: {
    marginBottom: theme.spacing(2.5),
  },
  textBold: {
    fontWeight: 600,
  },
  VehicleName: {
    fontSize: '1.375rem',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  VehicleSeries: {
    fontSize: '0.875rem',
    opacity: 0.6,
  },
  ChoiceButton: {
    display: 'block',
    backgroundColor: 'rgba(9, 30, 66, 0.04)',
    textAlign: 'center',
    textTransform: 'none',
    padding: '29px 0',
    width: '100%',
    borderRadius: 0,
    cursor: 'pointer',
    opacity: 0.7,
  },
  ButtonLeft: {
    borderRight: '1px solid #fff',
    borderBottom: 'none',
    borderRadius: '5px 0 0 5px',
    [theme.breakpoints.only('xs')]: {
      borderBottom: '1px solid #fff',
      borderRadius: '5px 5px 0 0',
      borderRight: 'none',
    },
  },
  ButtonRight: {
    borderRadius: '0 5px 5px 0',
    [theme.breakpoints.only('xs')]: {
      borderRadius: '0 0 5px 5px',
    },
  },
  ButtonText: {
    marginBottom: 8,
  },
  ButtonAmount: {
    fontSize: '2.25rem'
  },
  ButtonActive: {
    opacity: 1,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
  }
}));

const StepOne = (props) => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const {
    prospect,
    vehicle,
    handleActiveHint,
    handleGoNext,
    pickType,
    type,
    mvr,
    tutorialOpen
  } = props;
  const [isTourOpen, setIsTourOpen] = React.useState(true);
  const [isRSOpen, setIsRSOpen] = React.useState(undefined);
  const router = useRouter();
  const { state, plate } = router.query;
  const headerSteps = [
    {
      selector: '[data-tut="Contract-type"]',
      content: () => (
        <Typography>
          Select contract type, to see your deposit amount.
        </Typography>
      ),
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF'
      },
      position: 'left'
    },
  ];
  React.useEffect(() => {
    setIsRSOpen(localStorage.getItem('RSOpen'));
    if (tutorialOpen === true && !isRSOpen) {
      setIsTourOpen(true);
    }
  }, [tutorialOpen, isRSOpen]);
  const {
    mainDisplayImageUrl,
    year,
    make,
    model,
    series,
    shortTermRentalPrice,
    baseRTOPrice } = vehicle;
  const { tierName, totalSurcharge } = mvr;
  const variedPrice = getNewPriceList(vehicle, state);

  const isTearOne = tierName === 'Tier 1';
  if (type === 'str') {
    window.dataLayer.push({
      event: 'Rideshare_ST_Selection',
      RSTS: 'Rideshare_ST_Selection'
    });
  } else {
    window.dataLayer.push({
      event: 'Rideshare_LT_Selection',
      RLTS: 'Rideshare_LT_Selection'
    });
  }
  const closeTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('RSOpen', true);
  };

  const getWeeklyAmount = (price, newPrice) => {
    if (isTearOne) {
      if (newPrice) {
        return newPrice;
      } else {
        return price;
      }
    } else if (newPrice) {
      return newPrice + totalSurcharge;
    } else {
      return price + totalSurcharge;
    }
  };

  return (
    <Box
      component="form"
      id="ride-share-financing-form-step-1"
      onSubmit={handleGoNext}
      className={classes.VehiclePaymentWrapper}
      boxShadow={6}
    >
      <Box className={classes.VehiclePaymentContent}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} container justifyContent="center">
            <img src={ApproveIcon} alt="approved-icon"/>
          </Grid>
          <Grid item container justifyContent="center" xs={12} sm={10}>
            <Typography
              variant="body1"
              align="center"
              className={classes.VehiclePaymentText}
            >
              Congratulations {prospect.firstName}, based on your driving history you have been{' '}
              <span className={classes.textBold}>approved!</span><br />
              Please <span className={classes.textBold}>choose</span> one of the
              following programs for this vehicle:
            </Typography>
            <Grid item container xs={12} className={classes.BoxMargin}>
              <Grid item xs={12} md={6}>
                <Typography className={classes.VehicleName}>
                  {year} {make}<br/>
                  {model}
                </Typography>
                <Typography className={classes.VehicleSeries}>
                  {series}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <img
                  src={mainDisplayImageUrl}
                  style={{ width: '100%', height: 'auto' }}
                  alt={`${make}-${model}`}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent="center"
              alignItems="center"
              className={classes.BoxMargin}
            >
              <Badge
                color="error"
                badgeContent="1"
                onClick={() => handleActiveHint(1, 1)}
                style={{ cursor: 'pointer' }}
              >
                <Typography>
                  <Typography component="span" color="secondary">
                    {state}{' '}
                  </Typography>
                  &mdash; {plate}
                </Typography>
              </Badge>
            </Grid>
            <Grid
              item
              xs={12}
              container
              justifyContent="center"
              alignItems="center"
              data-tut="Contract-type"
            >
              <Grid item container xs={12} md={6}>
                <Box
                  className={`
                    ${classes.ChoiceButton}
                    ${classes.ButtonLeft}
                    ${type === 'str' && classes.ButtonActive}
                    `}
                  onClick={() => pickType('str')}
                >
                  <Badge
                    color="error"
                    badgeContent="2"
                    onClick={(e) => handleActiveHint(1, 2, e)}
                    style={{ cursor: 'pointer' }}
                    className={classes.ButtonText}
                  >
                    <Typography>
                      Short-Term Rental
                    </Typography>
                  </Badge>
                  <Typography className={classes.ButtonAmount}>
                    $
                    {getWeeklyAmount(
                      shortTermRentalPrice,
                      variedPrice[0]?.shortTermRentalPrice
                    )}{' '}
                    /wk
                  </Typography>
                </Box>
              </Grid>
              <Grid item container xs={12} md={6}>
                <Box
                  className={`
                    ${classes.ChoiceButton}
                    ${classes.ButtonRight}
                    ${type === 'rto' && classes.ButtonActive}
                    `}
                  onClick={() => pickType('rto')}
                >
                  <Badge
                    color="error"
                    badgeContent="3"
                    onClick={(e) => handleActiveHint(1, 3, e)}
                    style={{ cursor: 'pointer' }}
                    className={classes.ButtonText}
                  >
                    <Typography>
                      Rent-to-Own
                    </Typography>
                  </Badge>
                  <Typography className={classes.ButtonAmount}>
                    $
                    {getWeeklyAmount(
                      baseRTOPrice,
                      variedPrice[0]?.baseRTOPrice
                    )}{' '}
                    /wk
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <CustomPrimaryButton
        isLarge={!matches}
        fullWidth
        type="submit"
      >
        {type === 'str' ? 'See your deposit' : 'See your downpayment'}
      </CustomPrimaryButton>
      {!isRSOpen && <HandleTour
        isOpen={isTourOpen}
        steps={headerSteps}
        handleClose={closeTour}
      />}
    </Box>
  );
};

StepOne.propTypes = {
  prospect: PropTypes.object.isRequired,
  vehicle: PropTypes.object.isRequired,
  handleActiveHint: PropTypes.func.isRequired,
  handleGoNext: PropTypes.func.isRequired,
  pickType: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  mvr: PropTypes.object.isRequired,
  tutorialOpen: PropTypes.bool.isRequired
};

export default StepOne;
