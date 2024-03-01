import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import Slider from '@material-ui/core/Slider';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

import { Prospect, Bank } from 'src/api';
import { getCookie, getCookieJSON, setCookie } from 'src/utils/cookie';
import { FINANCE_VEHICLE_APPROVAL } from 'src/constants';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
import CustomHint from '../CustomComponents/CustomHint';
import CustomSliderLabel from '../CustomComponents/CustomSliderLabel';

const useStyles = makeStyles(theme => ({
  licenseApprovalContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 1020,
    },
  },
  licenseApprovalTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.125rem',
    },
  },
  licenseApprovalWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
  },
  licenseApprovalContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(10)}px`,
    [theme.breakpoints.only('xs')]: {
      padding: `${theme.spacing(3)}px ${theme.spacing(4)}px`,
    },
  },
  resultFormCongratulation: {
    marginBottom: theme.spacing(2.5),
  },
  vehicleApprovalSliderTitle: {
    fontWeight: 600,
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(15),
    },
  },
  vehicleApprovalSliderTitleWrapper: {
    marginBottom: theme.spacing(3),
  },
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
  },
  blueBox: {
    maxWidth: 285,
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
    margin: `0px 15px ${theme.spacing(3)}px 15px`,
    padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
    color: theme.palette.common.white,
    display: 'inline-block',
    width: 200,
    [theme.breakpoints.up('md')]: {
      width: 200,
      padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: 10,
      marginLeft: 5,
      marginRight: 5,
      width: 80,
      padding: '10px 0px',
    },
  },
  alignBox: {
    textAlign: 'center',
    [theme.breakpoints.only('xs')]: {
      display: 'flex',
      fontSize: 10,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
  },
  alignText: {
    textAlign: 'center',
    fontSize: '1rem',
    [theme.breakpoints.only('xs')]: {
      display: 'flex',
    },
  },
  textMonth: {
    [theme.breakpoints.up('md')]: {
      fontSize: 14,
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: 10,
    },
  },
  textTypo: {
    fontSize: 10,
  },
  amnt: {
    [theme.breakpoints.up('md')]: {
      fontSize: '2.15rem',
    },
  },
}));

const VehicleApproval = props => {
  const PAYMENT = 'payment';
  const DOWN_PAYMENT = 'downPayment';
  const APPROVED_TERM = 72;

  const hintRef = useRef();
  const [activeHint, setActiveHint] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const router = useRouter();
  const { stockid } = router.query;
  const [state, setState] = useState({
    getBankAnalysisWithCar: {},
    downPayment: null,
    monthlyPayment: null,
    monthlyPaymentPeriod: null,
    minDownPayment: null,
    maxDownPayment: null,
    minMonthlyPayment: null,
    maxMonthlyPayment: null,
    decision: null
  });

  const handleCloseHint = () => setActiveHint(null);

  useEffect(() => {
    if (activeHint) {
      hintRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }, [activeHint]);

  const handleActiveHint = id =>
    setActiveHint(
      props.financePins.find(
        item => item.page === FINANCE_VEHICLE_APPROVAL && item.number === id
      )
    );

  const handlePaymentSliderMove = (event, value, name) => {
    const selectedBank = state.getBankAnalysisWithCar.filter(bankResponse =>
      name === PAYMENT
        ? +bankResponse.payment === +value
        : +bankResponse.downPayment === +value
    );
    setState({
      ...state,
      downPayment: selectedBank[0].downPayment,
      monthlyPayment: selectedBank[0].payment,
      monthlyPaymentPeriod: selectedBank[0].term,
      decision: selectedBank[0].decision,
    });
  };

  const getBanksinfo = array =>
    array
      .filter(item => item.decision !== 'Declined')
      .map(item =>
        item.downPayment === ''
          ? { ...item, downPayment: 0 }
          : {
            ...item,
            downPayment: Math.round(item.downPayment),
          }
      )
      .map(item =>
        item.counterDownPayment
          ? {
            ...item,
            downPayment: Math.round(
              item.counterDownPayment.substr(1).slice(0, -1)
            ),
          }
          : { ...item }
      )
      .map(item =>
        item.counterTerm
          ? {
            ...item,
            term: Math.round(item.counterTerm.substr(1).slice(0, -1)),
          }
          : { ...item }
      );
  const savingPaymentData = async () => {
    if (state.decision !== null) {
      try {
        const savingData = {
          prospectId: parseFloat(props.prospect.prospectId),
          creditAppId: Number(getCookie('bankCreditId')),
          stockid: parseFloat(stockid),
          downPayment: Number(state.downPayment),
          monthlyPayment: Number(state.monthlyPayment),
          monthlyPaymentPeriod: Number(state.monthlyPaymentPeriod),
          appStatus: state.decision
        };
        await Prospect.SavePayments(savingData);
        setCookie('isSendedSavings', true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const localtCreditId = getCookie('bankCreditId');
    const baseData = getCookieJSON('vehicleChosenInfo');
    const creditAppId = Number(localtCreditId);
    let updateCreditResponse;
    let BankAnalysisWithCarResponse;

    (async () => {
      if (baseData) {
        // NOTE: Uncomment this after confirmation of logic
        // const creditAppId = props.prospect.creditAppId
        //   ? +props.prospect.creditAppId : +localtCreditId;
        const {
          employerName,
          employerZip,
          employerPhone,
          annualIncome,
          workExperience,
          employerAddress,
          employerCity,
          employerState,
          employerPosition,
          manager,
        } = baseData;

        const CREDIT_APPLICATION = {
          creditAppId,
          empName: employerName,
          empAddress: employerAddress,
          empCity: employerCity,
          empState: employerState,
          empZipCode: employerZip,
          empPosition: employerPosition,
          empPhone: employerPhone.replace(/\D+/g, ''),
          annualIncome: +annualIncome,
          yearsInEmpLoc: +workExperience,
          manager,
        };

        try {
          updateCreditResponse = await Bank.UpdateCreditApplicationVehicleSale({
            ...CREDIT_APPLICATION,
          });
        } catch (error) {
          props.handleShowRideShareForm();
          console.error(error);
        }
      } else {
        props.handlePreviousForm();
      }
    })();

    if (props && props.vehicle && props.vehicle.savings) {
      const { banksInfo } = props.vehicle.savings;
      setState({
        ...state,
        getBankAnalysisWithCar: banksInfo,
        minDownPayment: Math.min(...banksInfo.map(value => value.downPayment)),
        maxDownPayment: Math.max(...banksInfo.map(value => value.downPayment)),
        minMonthlyPayment: Math.min(...banksInfo.map(value => value.payment)),
        maxMonthlyPayment: Math.max(...banksInfo.map(value => value.payment)),
      });
      setLoading(false);
    } else {
      (async () => {
        try {
          BankAnalysisWithCarResponse = await Bank.GetBankAnalysisWithCar(
            creditAppId,
            stockid,
            APPROVED_TERM,
            0
          );
        } catch (error) {
          props.handleShowRideShareForm();
          console.error(error);
        }
        if (
          updateCreditResponse &&
          BankAnalysisWithCarResponse &&
          !BankAnalysisWithCarResponse.errorMessage
        ) {
          setCookie('updateCreditResponse', updateCreditResponse);
          setCookie('GetBankAnalysisWithCar', BankAnalysisWithCarResponse);
          const banksInfo = getBanksinfo(BankAnalysisWithCarResponse);
          if (!banksInfo.length) {
            props.handleShowRideShareForm();
          }
          setState({
            ...state,
            getBankAnalysisWithCar: banksInfo,
            minDownPayment: Math.min(
              ...banksInfo.map(value => value.downPayment)
            ),
            maxDownPayment: Math.max(
              ...banksInfo.map(value => value.downPayment)
            ),
            minMonthlyPayment: Math.min(
              ...banksInfo.map(value => value.payment)
            ),
            maxMonthlyPayment: Math.max(
              ...banksInfo.map(value => value.payment)
            ),
          });
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (state.getBankAnalysisWithCar.length) {
      handlePaymentSliderMove(
        null,
        Math.min(...state.getBankAnalysisWithCar.map(value => value.payment)),
        PAYMENT
      );
      savingPaymentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.getBankAnalysisWithCar]);
  useEffect(() => {
    if (
      (state.downPayment &&
      state.monthlyPayment &&
      state.monthlyPaymentPeriod) !== null
    ) {
      savingPaymentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.downPayment, state.monthlyPayment, state.monthlyPaymentPeriod]);

  const handleLockDownDeal = async () => {
    setCookie('selectedDownPayment', state.downPayment);
    setCookie('dmp', {
      downPayment: Math.floor(parseFloat(state.downPayment)),
      monthlyPayment: Math.floor(parseFloat(state.monthlyPayment)),
      monthlyPaymentPeriod: state.monthlyPaymentPeriod,
    });
    props.handleNextForm();
  };

  return (
    <Container className={classes.licenseApprovalContainer}>
      {isLoading ? (
        <LinearProgress className={classes.loader} color="secondary" />
      ) : (
        <>
          <Typography
            variant="h4"
            align="center"
            className={classes.licenseApprovalTitle}
          >
            FINALIZE YOUR PAYMENT PLAN
          </Typography>
          <Box className={classes.licenseApprovalWrapper} boxShadow={6}>
            <Box className={classes.licenseApprovalContent}>
              <Typography
                variant="body1"
                className={classes.resultFormCongratulation}
              >
                <div className={classes.alignText}>
                  Based on your credit, these are the actual financing plans
                  available for this vehicle, and are guaranteed.
                </div>
                <br />
                <div className={classes.alignText}>
                  Please select a plan based on your preferred downpayment or
                  monthly payment.
                </div>
              </Typography>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                className={classes.vehicleApprovalSliderTitleWrapper}
              >
                <Grid item>
                  <Badge
                    color="error"
                    badgeContent="1"
                    onClick={() => handleActiveHint(1)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      className={classes.vehicleApprovalSliderTitle}
                    >
                      CHOOSE YOUR DOWN PAYMENT
                    </Typography>
                  </Badge>
                </Grid>
              </Grid>
              {state.getBankAnalysisWithCar.length && (
                <Slider
                  ValueLabelComponent={CustomSliderLabel}
                  onChange={(event, value) =>
                    handlePaymentSliderMove(event, value, DOWN_PAYMENT)
                  }
                  defaultValue={state.downPayment}
                  step={null}
                  valueLabelDisplay="on"
                  value={+state.downPayment}
                  marks={[
                    ...new Set(
                      state.getBankAnalysisWithCar.map(
                        value => value.downPayment
                      )
                    ),
                  ].map(value => ({
                    value,
                    label:
                      +value === +state.maxDownPayment ||
                      +value === +state.minDownPayment
                        ? value
                        : null,
                  }))}
                  min={state.minDownPayment}
                  max={state.maxDownPayment}
                />
              )}
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                className={classes.vehicleApprovalSliderTitleWrapper}
              >
                <Grid item>
                  <Typography
                    variant="h6"
                    gutterBottom
                    className={classes.vehicleApprovalSliderTitle}
                    style={{ paddingTop: 30 }}
                  >
                    CHOOSE YOUR MONTHLY PAYMENT
                  </Typography>
                </Grid>
              </Grid>
              {state.getBankAnalysisWithCar.length && (
                <Slider
                  valueLabelFormat={value =>
                    `${formatMoneyAmount(value)} (${
                      state.monthlyPaymentPeriod
                    }Mo)`
                  }
                  ValueLabelComponent={CustomSliderLabel}
                  onChange={(event, value) =>
                    handlePaymentSliderMove(event, value, PAYMENT)
                  }
                  value={+state.monthlyPayment}
                  marks={state.getBankAnalysisWithCar.map(value => ({
                    value: value.payment,
                    label:
                      +value.payment === +state.maxMonthlyPayment ||
                      +value.payment === +state.minMonthlyPayment
                        ? `${value.payment} (${value.term} Mo)`
                        : '',
                  }))}
                  step={null}
                  valueLabelDisplay="on"
                  min={state.minMonthlyPayment}
                  max={state.maxMonthlyPayment}
                />
              )}
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                className={classes.vehicleApprovalSliderTitleWrapper}
              >
                <Grid item>
                  <Typography
                    variant="h6"
                    gutterBottom
                    className={classes.vehicleApprovalSliderTitle}
                    style={{ paddingTop: 30 }}
                  >
                    YOUR SELECTED PLAN
                  </Typography>
                </Grid>
              </Grid>
              <div className={classes.alignBox}>
                <Box className={classes.blueBox}>
                  <Typography
                    align="center"
                    color="inherit"
                    gutterBottom
                    className={matches ? classes.textTypo : ''}
                  >
                    DOWN PAYMENT
                  </Typography>
                  <Typography
                    align="center"
                    color="inherit"
                    className={classes.amnt}
                  >
                    {formatMoneyAmount(+state.downPayment)}
                  </Typography>
                </Box>
                <Box className={classes.blueBox}>
                  <Typography
                    align="center"
                    color="inherit"
                    gutterBottom
                    className={matches ? classes.textTypo : ''}
                  >
                    MONTHLY PAYMENT
                  </Typography>
                  <Typography
                    align="center"
                    color="inherit"
                    className={classes.amnt}
                  >
                    {formatMoneyAmount(+state.monthlyPayment)}
                  </Typography>
                </Box>
                <Box className={classes.blueBox}>
                  <Typography
                    align="center"
                    color="inherit"
                    gutterBottom
                    className={matches ? classes.textTypo : ''}
                  >
                    TERM
                  </Typography>
                  <Typography
                    align="center"
                    color="inherit"
                    className={classes.amnt}
                  >
                    {+state.monthlyPaymentPeriod}
                    <span className={classes.textMonth}>Mos</span>
                  </Typography>
                </Box>
              </div>
              {/* NOTE: Uncomment if need some Disclaimer here */}
              {/* <Typography
                variant="body1"
                align="center"
                className={classes.licenseApprovalLightGrayColor}
              >
                Disclaimer: Lorem ipsum dolor sit amet, consectetur adipisici
              </Typography> */}
            </Box>
            <CustomPrimaryButton
              withIcon
              isLarge={!matches}
              fullWidth
              onClick={handleLockDownDeal}
              id="lock-down-deal"
            >
              lock down this deal
            </CustomPrimaryButton>
          </Box>
        </>
      )}
      <div ref={hintRef}>
        {activeHint && (
          <CustomHint
            activeHint={activeHint}
            handleCloseHint={handleCloseHint}
          />
        )}
      </div>
    </Container>
  );
};

VehicleApproval.propTypes = {
  handleNextForm: PropTypes.func.isRequired,
  handleShowRideShareForm: PropTypes.func.isRequired,
  handlePreviousForm: PropTypes.func.isRequired,
  financePins: PropTypes.array,
  prospect: PropTypes.object.isRequired,
  vehicle: PropTypes.object,
};

VehicleApproval.defaultProps = {
  financePins: [],
  vehicle: {},
};

export default VehicleApproval;
