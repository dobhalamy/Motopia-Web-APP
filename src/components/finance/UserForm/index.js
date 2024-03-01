import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import subYears from 'date-fns/subYears';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Bank, Taxes } from 'src/api';
import { getCookieJSON, setCookie } from 'src/utils/cookie';

import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import { removeGteFromUrl } from '@/utils/commonUtils';
import InformationForm from './InformationForm';
import AddressForm from './AddressForm';
import FormDescription from '../FormDescription';
import CustomWebStepper from './CustomWebStepper';
import CustomMobileStepper from './CustomMobileStepper';
import RentForm from './RentForm';

const useStyles = makeStyles(theme => ({
  financeStepperContainer: { marginBottom: theme.spacing(10) },
  financeFormWrapper: {
    backgroundColor: theme.palette.common.white,
    padding: `${theme.spacing(5)}px ${theme.spacing(3.75)}px ${theme.spacing(
      7.5
    )}px`,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    [theme.breakpoints.only('xs')]: {
      padding: theme.spacing(2),
      borderRadius: 5,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 850,
      margin: 'auto',
    },
  },
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  financeButtonGroup: {
    marginTop: theme.spacing(1.5),
  },
}));

const UserForm = props => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const [state, setState] = React.useState({
    activeTab: 0,
    userData: {},
    showErrorBar: false,
    error: '',
    loading: false,
  });
  const [financeState, setFinanceState] = React.useState({
    addressData: {},
    rentInfo: {},
  });
  const [isRetail, setRetail] = React.useState(false);
  const [openTourAgain, setOpenTourAgain] = React.useState(false);
  const [vehicle, setVehicle] = React.useState();

  React.useEffect(() => {
    if (router.pathname.includes('retail') && router.query.stockid) {
      setRetail(true);
    }
    if (props.vehicle) {
      setVehicle(props.vehicle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.stockid, vehicle]);

  React.useEffect(() => {
    if (props.tutorialOpen === true) {
      setOpenTourAgain(true);
    }
  }, [props.tutorialOpen, openTourAgain]);
  const closeErrorBar = () => {
    setState({ ...state, showErrorBar: false });
  };

  const updateDataFromCookies = async () => {
    const address = getCookieJSON('address');
    const rentInfo = getCookieJSON('rentInfo');
    setFinanceState({
      ...financeState,
      addressData: {
        ...financeState.addressData,
        ...(address ?? {}),
      },
      rentInfo: rentInfo ?? {},
    });
  };

  const handlePreviousStep = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setState({
      ...state,
      activeTab: state.activeTab - 1,
    });
    updateDataFromCookies();
  };

  const handleNextStep = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setState({
      ...state,
      activeTab: state.activeTab + 1,
    });
    updateDataFromCookies();
  };

  const handleSaveAddressInfo = values => {
    setCookie('address', values);
    handleNextStep();
  };

  const handleError = error => {
    setState({
      ...state,
      showErrorBar: true,
      error,
    });
  };

  const handleSaveRentInfo = async values => {
    const { userData } = state;
    const { addressData } = financeState;
    const winLocation = window.location.href.toString();
    if (winLocation.includes('finance/?stockid')) {
      if (router.query.gte !== 'Finance-Second-Step') {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, gte: 'Finance-Second-Step' },
        });
      }
    } else if (router.query.gte !== 'All-Pay-Phase-Two') {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, gte: 'All-Pay-Phase-Two' },
      });
    }
    if (!isRetail) {
      setCookie('rentInfo', values);

      const CREDIT_APPLICATION = {
        prospectId: userData.prospectId,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.homeZip,
        priorAddress1: addressData.priorAddress,
        priorCity: addressData.priorCity,
        priorState: addressData.priorState,
        priorZipCode: addressData.priorZip,
        yearsInSecondLoc: addressData.travelTimeToPriorAddress,
        yearsInCurrentLoc: Number(addressData.travelTimeToAddressYears),
        dob: addressData.dob,
        ssn: addressData.socialSecurity.replace(/\D+/g, ''),
        dependentCount: addressData.hoveManyDependents,
        rentOrOwn: values.rentOrOwn,
        rentOwnAmount: Number(values.amount),
        carRegisterState: values.registrationState,

        priorAddress2: '',
      };
      let creditAppIdResponse;
      let pullCreditResponse;
      let bankAnalysisResponse;

      try {
        setState({ ...state, loading: true });
        creditAppIdResponse = await Bank.CreateCreditApplicationVehicleSale({
          ...CREDIT_APPLICATION,
        });

        const { creditAppId } = creditAppIdResponse;
        pullCreditResponse = await Bank.PullCredit(creditAppId);
        bankAnalysisResponse = await Bank.GetBankAnalysisWithoutCar(
          creditAppId
        );
      } catch (error) {
        setState({
          ...state,
          showErrorBar: true,
          error: error.response.data,
        });
      }
      setState({ ...state, loading: false });

      if (
        pullCreditResponse &&
        pullCreditResponse.status === 'Success' &&
        bankAnalysisResponse &&
        bankAnalysisResponse.status === 'OK'
      ) {
        setCookie('bankCreditId', creditAppIdResponse.creditAppId);
        setCookie('pullCredit', pullCreditResponse);
        setCookie('bankAnalysisResponse', bankAnalysisResponse);
        if (router.query.stockid) props.handleShowEmployerScreen();
        else props.handleNextForm();
      } else {
        props.handleShowRideShareForm();
      }
    }
    if (isRetail) {
      const { transfer, zip } = values;
      const { fuelType } = vehicle;
      const sendFuel = fuelType.toLowerCase().includes('electric')
        ? 'ELECTRIC'
        : 'OTHER';
      if (values.state === 'NY' && !zip) {
        handleError('ZIP is required for NY state');
      } else {
        const FEE_REQ = {
          registeringState: values.state,
          registrationTransfer: transfer,
          fuelType: sendFuel,
        };
        const TAX_REQ = {
          registeringState: values.state,
          zipcode: zip,
        };
        try {
          const feeResponse = await Taxes.GetFeeByState({ ...FEE_REQ });
          setCookie('fees', feeResponse.fees);
          const taxResponse = await Taxes.GetSalesTax({ ...TAX_REQ });
          setCookie('salesTaxRate', taxResponse.salesTaxRate);
          props.handleTaxAndFees(feeResponse.fees, taxResponse.salesTaxRate);
          props.handleNextForm();
        } catch (error) {
          handleError(error.response.data);
        }
      }
    }
    removeGteFromUrl(router);
  };
  const MAX_AVAILABLE_DATE = subYears(new Date(), 16);
  React.useEffect(() => {
    const { prospect } = props;
    if (props.prospect.firstName && props.prospect.contactNumber) {
      setState({
        ...state,
        activeTab: 1,
        userData: prospect,
      });
      updateDataFromCookies();
      setFinanceState({
        ...financeState,
        addressData: {
          ...financeState.addressData,
          dob: new Date(prospect.dob) ?? MAX_AVAILABLE_DATE,
          annualIncome: prospect.annualIncome ?? 0,
          homeZip: prospect.zipcode ?? '',
          address: prospect.address ?? '',
          state: prospect.state ?? '',
          city: prospect.city ?? '',
        },
      });
    } else updateDataFromCookies();
    // eslint-disable-next-line
  }, [props.prospect]);

  return (
    <Container maxWidth="lg" className={classes.financeStepperContainer}>
      <FormDescription title="GET PRE-QUALIFIED FOR AN AUTO LOAN IN 2 MINUTES" />
      {!matches && (
        <CustomWebStepper
          isRetail={isRetail}
          activeStep={state.activeTab}
          openTourAgain={openTourAgain}
        />
      )}
      <Box boxShadow={6} className={classes.financeFormWrapper}>
        {matches && (
          <CustomMobileStepper
            isRetail={isRetail}
            activeStep={state.activeTab}
          />
        )}
        {state.activeTab === 0 && (
          <InformationForm
            handleNextStep={handleNextStep}
            prospectData={state.userData}
            isRetail={isRetail}
          />
        )}
        {state.activeTab === 1 && (
          <AddressForm
            handleSaveAddressInfo={handleSaveAddressInfo}
            handlePreviousStep={handlePreviousStep}
            addressData={financeState.addressData}
            isRetail={isRetail}
            prospectData={state.userData}
            handleError={handleError}
          />
        )}
        {state.activeTab === 2 && (
          <RentForm
            handleSaveRentInfo={handleSaveRentInfo}
            handlePreviousStep={handlePreviousStep}
            rentInfo={financeState.rentInfo}
            loading={state.loading}
            isRetail={isRetail}
          />
        )}
      </Box>
      <ErrorSnackbar
        showErrorBar={state.showErrorBar}
        error={state.error}
        closeErrorBar={closeErrorBar}
      />
    </Container>
  );
};

UserForm.propTypes = {
  handleShowRideShareForm: PropTypes.func.isRequired,
  handleNextForm: PropTypes.func.isRequired,
  prospect: PropTypes.object.isRequired,
  vehicle: PropTypes.object,
  handleTaxAndFees: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  handleShowEmployerScreen: PropTypes.func,
  tutorialOpen: PropTypes.bool.isRequired,
};

UserForm.defaultProps = {
  vehicle: null,
};

export default UserForm;
