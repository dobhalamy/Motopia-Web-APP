/* eslint-disable react/jsx-closing-tag-location */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, useRouter } from 'next/router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { listOfVehiclesSelector, prospectData } from 'src/redux/selectors';

import {
  Typography,
  Container,
  Box,
  Grid,
  Badge,
  Slider,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Amount, Vehicle, FinancePins } from 'src/api';
import { saveUserData } from 'src/redux/actions/user';
import { getCookie, getCookieJSON } from 'src/utils/cookie';

import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
import { FINANCE_RESULT } from 'src/constants';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import CustomHint from 'components/finance/CustomComponents/CustomHint';
import CustomSliderLabel from 'components/finance/CustomComponents/CustomSliderLabel';
import { applyAdsQuery } from '@/utils/commonUtils';
import AmountSaveDialog from './AmountSaveDialog';

const useStyles = makeStyles(theme => ({
  resultFormTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  resultFormContainer: {
    paddingTop: theme.spacing(9),
  },
  resultFormCongratulation: {
    marginBottom: theme.spacing(2.5),
    textAlign: 'center',
    [theme.breakpoints.only('xs')]: {
      textAlign: 'left',
    },
  },
  resultFormWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
  },
  resultFormContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  resultFormBlueBox: {
    maxWidth: 285,
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
    margin: `0px auto ${theme.spacing(3)}px`,
    padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
    color: theme.palette.common.white,
  },
  resultFormAutoScore: {
    marginBottom: theme.spacing(7),
  },
  resultFormDownPayment: {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.spacing(1),
  },
  resultFormDownPaymentWrapper: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.only('xs')]: {
      marginBottom: theme.spacing(2),
    },
  },
  resultFormSliderWrapper: {
    padding: `0 ${theme.spacing(6)}px`,
    [theme.breakpoints.only('xs')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
  },
  disclaimer: {
    textAlign: 'center',
    padding: `${theme.spacing(5)}px ${theme.spacing(8)}px 0`,
    [theme.breakpoints.only('xs')]: {
      padding: `${theme.spacing(5)}px ${theme.spacing(2)}px 0`,
    },
    marginBottom: theme.spacing(5),
    fontStyle: 'italic',
    fontSize: 14,
    color: '#a0a0a0',
  },
}));

const FinanceResult = props => {
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const classes = useStyles();
  const [totalCar, setTotalCar] = React.useState(0);
  const [financePins, setFinancePins] = React.useState([]);
  const [state, setState] = React.useState({
    pullCredit: {},
    bankAnalysisResponse: {},
    downPayment: 500,
    availableVehiclesCount: 0,
    activeHint: null,
    saveAmountDialogOpen: false,
    maxListPrice: 0,
  });
  const [sliderValues, setSlider] = React.useState({
    minDownPaymentLabel: 0,
    minDownPaymentValue: 0,
    bestDownPaymentLabel: 0,
    bestDownPaymentValue: 0,
    maxDownPaymentLabel: 0,
    maxDownPaymentValue: 0,
  });
  const hintRef = React.useRef();
  const step = 500;

  const handleViewResults = () => {
    props.router.push({
      pathname: '/search-cars',
      // FIXME: Need test this part
      query: { price: `0,${state.maxPrice}`, ...adsQuery },
    });
  };

  const handleOpenSaveAmountDialog = () => {
    setState({
      ...state,
      saveAmountDialogOpen: true,
    });
  };

  const handleCloseSaveAmountDialog = async () => {
    setState({
      ...state,
      saveAmountDialogOpen: false,
    });
    await Amount.setAmount({
      amount: state.bankAnalysisResponse.amountApproved,
      downPayment: state.downPayment,
      creditAppId: state.bankCreditId,
      dmsUserId: props.prospect.prospectId,
    });
    props.saveUserData({
      amount: state.bankAnalysisResponse.amountApproved,
      downPayment: state.downPayment,
      creditAppId: state.bankCreditId,
      dmsUserId: props.prospect.prospectId,
    });

    handleViewResults();
  };

  const updateDataFromCookies = () => {
    const pullCredit = getCookieJSON('pullCredit');
    const bankAnalysisResponse = getCookieJSON('bankAnalysisResponse');
    const bankCreditId = getCookie('bankCreditId');
    if (
      pullCredit !== undefined &&
      bankAnalysisResponse !== undefined &&
      bankCreditId !== undefined
    ) {
      setState({
        ...state,
        bankCreditId,
        pullCredit: pullCredit || {},
        bankAnalysisResponse: bankAnalysisResponse || {},
      });
    } else {
      router.push({
        pathname: '/finance',
        query: { ...adsQuery },
      });
    }
  };

  const getDisclaimerData = async () => {
    const response = await FinancePins.getFinancePins();
    setFinancePins([...response.data]);
  };

  React.useEffect(() => {
    updateDataFromCookies();
    getDisclaimerData();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (state.bankAnalysisResponse.amountApproved) {
      const {
        amountApproved,
        bestRateDownpayment,
        minimumDownpayment,
      } = state.bankAnalysisResponse;
      const obj = {};

      obj.minDownPaymentLabel = minimumDownpayment * 100;
      obj.minDownPaymentValue =
        Math.ceil((amountApproved * minimumDownpayment) / step) * step;
      // NOTE: If need to use step like 500, this is rounded value to nearest 500
      // obj.minDownPaymentValue = Math.ceil((amountApproved * minimumDownpayment) / step) * step;
      if (obj.minDownPaymentValue < 500) {
        obj.minDownPaymentValue = 500;
      }
      obj.bestDownPaymentLabel = bestRateDownpayment * 100;
      obj.bestDownPaymentValue =
        Math.ceil((amountApproved * bestRateDownpayment) / step) * step;

      if (obj.bestDownPaymentValue < 500) {
        obj.bestDownPaymentValue = 500;
      }

      obj.maxDownPaymentLabel = 30;
      obj.maxDownPaymentValue = Math.ceil((amountApproved * 0.3) / step) * step;

      setSlider(obj);
      setState({ ...state, downPayment: obj.bestDownPaymentValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.bankAnalysisResponse.amountApproved]);

  React.useEffect(() => {
    if (state.activeHint) {
      hintRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }, [state.activeHint]);

  const getCarCount = async () => {
    try {
      const totalVal =
        state.downPayment + state.bankAnalysisResponse.amountApproved;
      const response = await Vehicle.getFinanceCarCount(totalVal);
      setTotalCar(response.data);
    } catch {
      console.error();
    }
  };

  const handleDownPaymentSliderChange = async (event, newValue) => {
    setState({ ...state, downPayment: newValue });
    getCarCount();
  };

  React.useEffect(() => {
    if (
      state.downPayment &&
      state.bankAnalysisResponse.amountApproved &&
      props.listOfVehicles
    ) {
      const maxPrice =
        state.downPayment + state.bankAnalysisResponse.amountApproved;
      const availableVehicles = props.listOfVehicles
        .filter(vehicle => vehicle.listPrice <= maxPrice)
        .sort((a, b) => b.listPrice - a.listPrice);
      const availableVehiclesCount = availableVehicles.length;
      const maxListPrice = maxPrice;
      // eslint-disable-next-line array-callback-return
      getCarCount();
      // FIXME: something wrong with setState inside useEffect
      // eslint-disable-next-line no-shadow
      setState(state => ({
        ...state,
        maxPrice,
        maxListPrice,
        availableVehiclesCount,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.downPayment,
    props.listOfVehicles,
    state.bankAnalysisResponse.amountApproved,
  ]);

  const handleCloseHint = () =>
    setState({
      ...state,
      activeHint: null,
    });

  const handleActiveHint = id =>
    setState({
      ...state,
      activeHint: financePins.find(
        item => item.page === FINANCE_RESULT && item.number === id
      ),
    });

  const {
    minDownPaymentLabel,
    minDownPaymentValue,
    bestDownPaymentLabel,
    bestDownPaymentValue,
    maxDownPaymentLabel,
    maxDownPaymentValue,
  } = sliderValues;

  const valueText = value =>
    value === bestDownPaymentLabel ? 'Best Rate Downpayment' : `${value}%`;

  return (
    <Container maxWidth="md" className={classes.resultFormContainer}>
      <Typography
        variant="h4"
        align="center"
        className={classes.resultFormTitle}
      >
        INSTANT APPROVAL RESULTS
      </Typography>
      <Box className={classes.resultFormWrapper} boxShadow={6} mb={2}>
        <Box className={classes.resultFormContent}>
          <Typography
            variant="body1"
            className={classes.resultFormCongratulation}
          >
            Congratulations! You’re pre-approved.
            <br />
            This is a pre-approval only. Actual approval and terms may vary
            based on vehicle and bank terms.
          </Typography>
          <Box className={classes.resultFormBlueBox}>
            <Typography
              variant="body1"
              align="center"
              color="inherit"
              gutterBottom
            >
              Amount Approved
            </Typography>
            <Typography variant="h4" align="center" color="inherit">
              {formatMoneyAmount(state.bankAnalysisResponse.amountApproved)}
            </Typography>
          </Box>
          <Box mb={7} display="flex" justifyContent="center">
            <Typography
              variant="body1"
              component="span"
              style={{ marginRight: 10, fontSize: 20 }}
            >
              Your Fico Auto Score:
            </Typography>
            <Typography
              variant="body1"
              component="span"
              color="error"
              style={{ fontSize: 20 }}
            >
              {state.pullCredit.fico}
            </Typography>
            <Badge
              onClick={() => handleActiveHint(1)}
              color="error"
              badgeContent="1"
              classes={{
                anchorOriginTopRightRectangular:
                  classes.resultFormAnchorOriginTopRightRectangle,
              }}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          <Box className={classes.resultFormSliderWrapper}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              className={classes.resultFormDownPaymentWrapper}
            >
              <Grid container item wrap="nowrap">
                <Typography
                  variant="body2"
                  align="center"
                  gutterBottom
                  className={classes.resultFormDownPayment}
                >
                  DOWN PAYMENT
                </Typography>
                <Badge
                  color="error"
                  badgeContent="2"
                  onClick={() => handleActiveHint(2)}
                  style={{ cursor: 'pointer' }}
                />
              </Grid>
            </Grid>
            {bestDownPaymentValue && (
              <Slider
                ValueLabelComponent={CustomSliderLabel}
                defaultValue={bestDownPaymentValue}
                step={step}
                valueLabelFormat={formatMoneyAmount}
                valueLabelDisplay="auto"
                onChange={handleDownPaymentSliderChange}
                marks={[
                  {
                    label: valueText(minDownPaymentLabel),
                    value: minDownPaymentValue,
                  },
                  {
                    label: valueText(bestDownPaymentLabel),
                    value: bestDownPaymentValue,
                  },
                  {
                    label: valueText(maxDownPaymentLabel),
                    value: maxDownPaymentValue,
                  },
                ]}
                min={minDownPaymentValue}
                max={maxDownPaymentValue}
              />
            )}
          </Box>
          <Typography className={classes.disclaimer} color="secondary">
            Disclaimer: These down payment options explain how increasing or
            decreasing your down payment changes your deal.{' '}
            <b>
              To benefit with the best deal from a lender, we recommend the Best
              Rate down payment.
            </b>{' '}
            Changing your down payments also changes the vehicle purchase
            options available to you.
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Based on your pre-approval, you have{' '}
            <Typography component="span" color="error">
              {totalCar}
            </Typography>{' '}
            vehicles to choose from
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            With a maximum price of{' '}
            <Typography component="span" color="error">
              {formatMoneyAmount(state.maxListPrice)}
            </Typography>
          </Typography>
        </Box>
        <CustomPrimaryButton
          withIcon
          isLarge={!matches}
          fullWidth
          onClick={handleOpenSaveAmountDialog}
          id="open-save-amount"
        >
          show vehicles
        </CustomPrimaryButton>
      </Box>
      <div ref={hintRef}>
        {state.activeHint && (
          <CustomHint
            activeHint={state.activeHint}
            handleCloseHint={handleCloseHint}
          />
        )}
      </div>
      <AmountSaveDialog
        amountApproved={state.bankAnalysisResponse.amountApproved}
        isOpenSaveAmountDialog={state.saveAmountDialogOpen}
        onCloseSaveAmountDialog={handleCloseSaveAmountDialog}
      />
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  listOfVehicles: listOfVehiclesSelector,
  prospect: prospectData,
});

const mapDispatchToProps = {
  saveUserData,
};

FinanceResult.propTypes = {
  listOfVehicles: PropTypes.array.isRequired,
  prospect: PropTypes.object.isRequired,
  saveUserData: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)(FinanceResult);
