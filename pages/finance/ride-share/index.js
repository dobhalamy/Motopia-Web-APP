import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'next/router';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import FinanceHero from 'assets/finance_hero.jpg';
import Layout from 'components/shared/Layout';
import StepOne from 'components/finance/RideShare/StepOne';
import StepTwo from 'components/finance/RideShare/StepTwo';
import StepThree from 'components/finance/RideShare/StepThree';
import LocationModal from 'components/finance/RideShare/LocationModal';
import CustomHint from 'components/finance/CustomComponents/CustomHint';
import {
  RIDE_SHARE_STEP_1,
  RIDE_SHARE_STEP_2,
  RIDE_SHARE_STEP_3,
} from 'src/constants';
import { FinancePins, MVR, Location } from 'src/api';
import { getCookie, getCookieJSON, setCookie } from 'src/utils/cookie';
import { applyAdsQuery, getNewPriceList } from '@/utils/commonUtils';

import {
  isMobileSelector,
  rdsVehiclesSelector,
  rdsVehiclesErrorSelector,
  prospectData,
  rdsPoints,
} from 'src/redux/selectors';

const DELIVERY = 'Delivery';

const useStyles = makeStyles(theme => ({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
  },
  VehiclePaymentContainer: {
    position: 'relative',
    flexGrow: 1,
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  VehiclePaymentTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
  },
}));

const RideShareFinance = props => {
  const { router, listOfRDSVehicles, prospect, pickupPoints } = props;
  const { id } = router.query;
  const classes = useStyles();
  const [state, setState] = useState({
    vehicle: {},
    prospect: {},
    mvr: null,
  });
  const [step, setStep] = useState(1);
  const [activeHint, setActiveHint] = useState(null);
  const [financePins, setFinancePins] = useState([]);
  const [type, setType] = useState('rto');
  const [report, setReport] = useState(false);
  const [deposit, setDeposit] = useState();
  const [isLoading, setLoading] = useState(true);
  const [location, setLocation] = useState();
  const [deliveryDate, setDeliveryDate] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false);
  const hintRef = useRef();
  const adsQuery = applyAdsQuery(router.query);

  useEffect(() => {
    async function getPinsAndMvr() {
      try {
        const creditId = getCookie('creditId');
        const response = await FinancePins.getFinancePins();
        const cookiePickupInfo = getCookieJSON('pickupInfo');
        const jobsAmount = getCookie('jobsAmount');
        setFinancePins([...response.data]);
        const mvr = await MVR.getMVRAnalysis(creditId, jobsAmount);
        if (mvr.isBlacklisted) {
          router.push({
            pathname: '/finance/blacklistedError',
            query: { ...adsQuery },
          });
        } else {
          const vehicle = listOfRDSVehicles.find(el => el.rsdStockId === id);
          setState({ ...state, vehicle, prospect, mvr });
          if (vehicle && mvr) {
            const selectedState = router.query.state;
            const variedPrice = getNewPriceList(vehicle, selectedState);
            const { tierName } = mvr;
            const { tier1Down, tier2Down } = vehicle;
            if (vehicle?.isPriceVaries) {
              if (tierName === 'Tier 2') {
                setDeposit(variedPrice[0]?.tier2Down);
              } else {
                setDeposit(variedPrice[0]?.tier1Down);
              }
            } else if (tierName === 'Tier 2') {
              setDeposit(tier2Down);
            } else {
              setDeposit(tier1Down);
            }
          }
          if (cookiePickupInfo && props.pickupPoints) {
            const loc = props.pickupPoints.find(
              el => el.locationName === cookiePickupInfo.locationName
            );
            setLocation(loc);
            setDeliveryDate(cookiePickupInfo.date);
            setLoading(false);
          } else {
            const dDate = await Location.CalculatePickupDate(
              prospect.closestRDSPoint.locationName,
              null,
              'Ride-share'
            );
            if (listOfRDSVehicles && dDate) {
              setLocation(prospect.closestRDSPoint);
              setDeliveryDate(dDate.customerPickupDate);
              const pickupInfo = {
                locationName: prospect.closestRDSPoint.locationName,
                date: dDate.customerPickupDate,
              };
              setCookie('pickupInfo', pickupInfo);
              setLoading(false);
            }
          }
        }
      } catch (error) {
        router.push({
          pathname: '/finance/error',
          query: {
            rds: true,
            ...adsQuery,
          },
        });
      }
    }
    if (prospect && prospect.closestRDSPoint) {
      getPinsAndMvr();
    }
    // eslint-disable-next-line
  }, [listOfRDSVehicles, prospect]);

  React.useEffect(() => {
    if (activeHint) {
      hintRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }, [activeHint]);

  const handleCloseHint = () => setActiveHint(null);
  const handleGoBack = () => {
    if (step !== 1) {
      handleCloseHint();
      setStep(step - 1);
    }
  };
  const handleGoNext = (pickMethod, promoDiscount, deliveryFee) => {
    if (step !== 3) {
      handleCloseHint();
      setStep(step + 1);
    }
    if (step === 3) {
      const description = type === 'str' ? 'Short-Term Rental' : 'Rent-to-own';
      let amount = report ? deposit + 29 : deposit;
      if (promoDiscount) {
        amount -= promoDiscount;
      }
      const { rsdStockId, year, make, model, series } = state.vehicle;
      const { plate } = router.query;
      const vehicleInfo = `${year} ${make} ${model} ${series}`;
      const plateInfo = `${router.query.state} - ${plate}`;
      const payment = {
        amount,
        description,
        rsdStockId,
        vehicleInfo,
        plateInfo,
        report,
        ...adsQuery,
      };
      if (pickMethod === DELIVERY) {
        payment.amount += deliveryFee;
        payment.method = DELIVERY;
      }
      router.push({
        pathname: '/finance/payment',
        query: payment,
      });
    }
  };
  const handleActiveHint = (page, num, e) => {
    if (e) e.stopPropagation();
    if (page === 1) {
      setActiveHint(
        financePins.find(
          item => item.page === RIDE_SHARE_STEP_1 && item.number === num
        )
      );
    }
    if (page === 2) {
      if (num === 2) {
        setActiveHint(
          financePins.find(
            item =>
              item.page === `${RIDE_SHARE_STEP_2}_${type}` &&
              item.number === num
          )
        );
      } else {
        setActiveHint(
          financePins.find(
            item => item.page === RIDE_SHARE_STEP_2 && item.number === num
          )
        );
      }
    }
    if (page === 3) {
      setActiveHint(
        financePins.find(
          item => item.page === RIDE_SHARE_STEP_3 && item.number === num
        )
      );
    }
  };

  const pickType = name => {
    setType(name);
  };

  const handleCheckReport = () => setReport(!report);

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const handlePickLocation = async value => {
    const dDate = await Location.CalculatePickupDate(
      value.locationName,
      null,
      'Ride-share'
    );
    setLocation(value);
    setDeliveryDate(dDate.customerPickupDate);
    const pickupInfo = {
      locationName: value.locationName,
      date: dDate.customerPickupDate,
    };
    setCookie('pickupInfo', pickupInfo);
    handleCloseModal();
  };
  const tutorialOpen = path => {
    if (path.includes('/finance/ride-share?id=')) {
      setIsTutorialOpen(true);
    }
  };
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.financeMainWrapper}>
        <Container maxWidth="md" className={classes.VehiclePaymentContainer}>
          {isLoading ? (
            <Box className={classes.loader}>
              <Typography align="center" variant="h6" gutterBottom>
                Please, wait while we are checking your driving record.
              </Typography>
              <LinearProgress color="secondary" />
            </Box>
          ) : (
            <>
              <Typography
                variant="h4"
                align="center"
                className={classes.VehiclePaymentTitle}
              >
                INSTANT RIDE-SHARING APPROVAL
              </Typography>
              {step === 1 && state.vehicle && state.prospect && state.mvr && (
                <StepOne
                  vehicle={state.vehicle}
                  prospect={state.prospect}
                  handleActiveHint={handleActiveHint}
                  handleGoNext={handleGoNext}
                  pickType={pickType}
                  mvr={state.mvr}
                  type={type}
                  tutorialOpen={isTutorialOpen}
                />
              )}
              {step === 2 && state.vehicle && state.mvr && (
                <StepTwo
                  vehicle={state.vehicle}
                  mvr={state.mvr}
                  handleActiveHint={handleActiveHint}
                  handleGoBack={handleGoBack}
                  handleCheckReport={handleCheckReport}
                  handleGoNext={handleGoNext}
                  type={type}
                  report={report}
                />
              )}
              {step === 3 && state.vehicle && state.mvr && (
                <StepThree
                  vehicle={state.vehicle}
                  mvr={state.mvr}
                  handleActiveHint={handleActiveHint}
                  handleGoBack={handleGoBack}
                  handleGoNext={handleGoNext}
                  type={type}
                  deposit={deposit}
                  location={location}
                  deliveryDate={deliveryDate}
                  pointsCount={pickupPoints.length}
                  pickupPoints={pickupPoints}
                  report={report}
                  handleOpenModal={handleOpenModal}
                  handleCheckReport={handleCheckReport}
                />
              )}
            </>
          )}
        </Container>
        {pickupPoints && (
          <LocationModal
            open={isOpenModal}
            pickupPoints={pickupPoints}
            handleClose={handleCloseModal}
            handlePickLocation={handlePickLocation}
          />
        )}
        <div ref={hintRef}>
          {activeHint && (
            <Container maxWidth="md">
              <CustomHint
                activeHint={activeHint}
                handleCloseHint={handleCloseHint}
              />
            </Container>
          )}
        </div>
      </Box>
    </Layout>
  );
};

const mapStateToProps = createStructuredSelector({
  isMobile: isMobileSelector,
  listOfRDSVehicles: rdsVehiclesSelector,
  rdsVehiclesError: rdsVehiclesErrorSelector,
  prospect: prospectData,
  pickupPoints: rdsPoints,
});

RideShareFinance.propTypes = {
  listOfRDSVehicles: PropTypes.array.isRequired,
  prospect: PropTypes.object.isRequired,
  pickupPoints: PropTypes.array.isRequired,
};

export default compose(connect(mapStateToProps), withRouter)(RideShareFinance);
