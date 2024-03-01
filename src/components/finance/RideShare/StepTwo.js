import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { getNewPriceList } from '@/utils/commonUtils';

import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import CustomPreviousButton from 'components/finance/UserForm/CustomPreviousButton';

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
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
    textAlign: 'center',
    textTransform: 'none',
    padding: '29px 0',
    width: '100%',
    borderRadius: 5,
    cursor: 'pointer',
  },
  ButtonText: {
    marginBottom: 8,
  },
  ButtonAmount: {
    fontSize: '2.25rem'
  },
  FormLabel: {
    marginRight: 0,
  },
}));

const StepTwo = (props) => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const {
    mvr,
    vehicle,
    handleActiveHint,
    handleGoBack,
    type,
    report,
    handleCheckReport,
    handleGoNext } = props;
  const router = useRouter();
  const { state, plate } = router.query;
  const {
    mainDisplayImageUrl,
    year,
    make,
    model,
    series,
    tier1Down,
    tier2Down } = vehicle;

  const { tierName, licenseAge, licensePoint } = mvr;
  const variedPrice = getNewPriceList(vehicle, state);

  const [years, mos] = licenseAge.split(',');
  const driverLicenseAge = `${years}, ${mos}`;

  const getAmount = newPrice => {
    if (tierName === 'Tier 2') {
      if (newPrice) {
        return newPrice?.tier2Down;
      } else {
        return tier2Down;
      }
    } else if (newPrice) {
      return newPrice?.tier1Down;
    } else {
      return tier1Down;
    }
  };
  if (type === 'str') {
    window.dataLayer.push({
      event: 'Rideshare_ST_Deal_Review',
      RSTDR: 'Rideshare_ST_Deal_Review'
    });
  } else {
    window.dataLayer.push({
      event: 'Rideshare_LT_Deal_Review',
      RLTDR: 'Rideshare_LT_Deal_Review'
    });
  }
  return (
    <Box
      component="form"
      id="ride-share-financing-form-step-2"
      onSubmit={handleGoNext}
      className={classes.VehiclePaymentWrapper}
      boxShadow={6}
    >
      <Box className={classes.VehiclePaymentContent}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <CustomPreviousButton
              onClick={handleGoBack}
            />
          </Grid>
          <Grid item container justifyContent="center" xs={12} sm={10}>
            <Grid item container xs={12} className={classes.VehiclePaymentText}>
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
            >
              <Badge
                color="error"
                badgeContent="1"
                onClick={() => handleActiveHint(2, 1)}
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
          </Grid>
          <Grid item xs={12} className={classes.BoxMargin}>
            <Divider />
          </Grid>
          <Grid item container justifyContent="center" xs={12} sm={10}>
            <Grid
              item
              xs={12}
              container
              justifyContent="space-between"
              className={classes.BoxMargin}
            >
              <Grid item container xs={12} md={5}>
                <Badge
                  color="error"
                  badgeContent="2"
                  onClick={() => handleActiveHint(2, 2)}
                  style={{ cursor: 'pointer' }}
                >
                  <Typography className={classes.textBold}>
                    {type === 'str' ? 'SHORT TERM RENTAL' : 'RENT TO OWN'}
                  </Typography>
                </Badge>
                <Typography style={{ marginBottom: matches && 10 }}>
                  Upon review of your driving history of{' '}
                  <Typography component="span" color="error">
                    {driverLicenseAge}
                  </Typography> and having{' '}
                  <Typography component="span" color="error">
                    {licensePoint}
                  </Typography> {licensePoint === 1 ? 'point' : 'points'}{' '}
                  on your driver&apos;s license, here is your approved{' '}
                  {type === 'str' ? 'deposit' : 'downpayment'}:
                </Typography>
              </Grid>
              <Grid item container xs={12} md={6}>
                <Box
                  className={`${classes.ChoiceButton}`}
                >
                  <Typography className={classes.ButtonText}>
                    {type === 'str' ? 'Deposit' : 'Downpayment'}
                  </Typography>
                  <Badge
                    color="error"
                    badgeContent="3"
                    onClick={() => handleActiveHint(2, 3)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Typography className={classes.ButtonAmount}>
                      ${getAmount(variedPrice[0])}
                    </Typography>
                  </Badge>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
              <Box>
                <FormControlLabel
                  classes={{ root: classes.FormLabel }}
                  control={
                    <Checkbox
                      checked={report}
                      onChange={handleCheckReport}
                      name="report"
                      color="secondary"
                    />
                  }
                  label={
                    <Typography>
                      Get a copy of your{' '}
                      <Typography component="span" color="secondary">
                        MVR <b>for $29</b>
                      </Typography>
                    </Typography>
                  }
                />
                <Badge
                  color="error"
                  badgeContent="4"
                  onClick={(e) => handleActiveHint(2, 4, e)}
                  style={{ cursor: 'pointer', top: -16 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <CustomPrimaryButton
        isLarge={!matches}
        fullWidth
        type="submit"
      >
        Overview and reserve your car
      </CustomPrimaryButton>
    </Box>
  );
};

StepTwo.propTypes = {
  mvr: PropTypes.object.isRequired,
  vehicle: PropTypes.object.isRequired,
  handleActiveHint: PropTypes.func.isRequired,
  handleGoBack: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  report: PropTypes.bool.isRequired,
  handleCheckReport: PropTypes.func.isRequired,
  handleGoNext: PropTypes.func.isRequired,
};

export default StepTwo;
