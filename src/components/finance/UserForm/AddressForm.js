import React from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import subYears from 'date-fns/subYears';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CustomInput from 'components/shared/CustomInput';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import CustomSelect from 'components/shared/CustomSelect';
import { SELECT_OPTIONS_USA_STATES } from 'src/constants';
import { setCookie } from 'src/utils/cookie';
import { useRouter } from 'next/router';
import { removeGteFromUrl } from '@/utils/commonUtils';
import CustomPreviousButton from './CustomPreviousButton';
import AddressAutocomplete from './AddressAutocomplete';

import {
  SELECT_OPTIONS_TIME_TO_TRAVEL,
  SELECT_OPTIONS_TIME_TO_PRIOR_ADDRESS,
  SELECT_OPTIONS_MONTHS,
} from './constants';
import {
  addressValidationSchema,
  retailAddressValidationSchema,
} from './validationSchema';
import { Prospect } from '../../../api';

const MAX_AVAILABLE_DATE = subYears(new Date(), 16);

const useStyles = makeStyles(theme => ({
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  financeButtonGroup: {
    marginTop: theme.spacing(1.5),
  },
  root: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.secondary.main,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: theme.palette.common.white,
    transition: theme.transitions.create(['border-color']),
    '&:hover': {
      backgroundColor: theme.palette.common.white,
      borderColor: theme.palette.secondary.main,
    },
    '&$focused': {
      backgroundColor: theme.palette.common.white,
      borderColor: theme.palette.secondary.main,
    },
  },
  errorBorder: {
    borderColor: theme.palette.error.main,
  },
  input: {
    boxSizing: 'border-box',
    padding: `${theme.spacing(5)}px ${theme.spacing(1.5)}px ${theme.spacing(
      1.25
    )}px`,
  },
}));

const AddressForm = ({ ...props }) => {
  const {
    handleSaveAddressInfo,
    handlePreviousStep,
    addressData,
    isRetail,
    prospectData,
    handleError,
  } = props;
  const classes = useStyles();
  const { pathname } = useRouter();
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const [state, setState] = React.useState({
    socialSecurity: '',
    dob: MAX_AVAILABLE_DATE,
    homeZip: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    travelTimeToAddressMonths: 0,
    travelTimeToAddressYears: 0,
    priorAddress: '',
    priorCity: '',
    priorState: '',
    priorZip: '',
    travelTimeToPriorAddress: 0,
    hoveManyDependents: 0,
  });

  const gridSpacing = matches ? 1 : 3;
  const gridJustify = matches ? 'space-between' : 'flex-end';

  React.useEffect(() => {
    const winLocation = window.location.href.toString();
    if (winLocation.includes('finance/?stockid')) {
      window.dataLayer.push({
        event: 'Financing_W_Car_Tab_2',
        FWCT: 'Financing_W_Car_Tab_2',
      });
    } else {
      window.dataLayer.push({
        event: 'Financing_WO_Car_Tab_2',
        FWOCT: 'Financing_WO_Car_Tab_2',
      });
    }
    if (addressData) {
      setState({
        ...state,
        ...addressData,
      });
    }
    return () => {
      removeGteFromUrl(router);
    };
    // eslint-disable-next-line
  }, [addressData]);

  const handleAddressAutocompleteData = (data, formik) => {
    formik.setFieldValue('city', data.city);
    formik.setFieldValue('state', data.state);
    formik.setFieldValue('homeZip', data.homeZip);
    formik.setFieldValue('address', data.address);
  };

  const handlePriorAddressAutocompleteData = (data, formik) => {
    formik.setFieldValue('priorCity', data.city);
    formik.setFieldValue('priorState', data.state);
    formik.setFieldValue('priorZip', data.homeZip);
    formik.setFieldValue('priorAddress', data.address);
  };

  const handleTransfer = async values => {
    if (pathname.includes('retail')) {
      window.dataLayer.push({
        event: 'Car_Sale_Pay_In_Full_Level_2',
        CAPIFL2: 'Car_Sale_Pay_In_Full_Level_2',
      });
    } else {
      window.dataLayer.push({
        event: 'Car_Sale_Finance_Level_2',
        CAPIFL2: 'Car_Sale_Finance_Level_2',
      });
    }
    if (!isRetail) {
      const formVal = values;
      const selectedDob = formVal.dob.toString();
      if (selectedDob === 'Invalid Date') {
        formVal.dob = MAX_AVAILABLE_DATE;
      }
      handleSaveAddressInfo(formVal);
    } else {
      const { address, homeZip, city } = values;
      const { prospectId, firstName, middleName, lastName } = prospectData;
      const TRANSFER_DATA = {
        prospectId,
        address,
        city,
        state: values.state,
        zipCode: homeZip,
        registFirstName: firstName,
        registMiddleName: middleName || null,
        registLastName: lastName,
        registAddress: address,
        registCity: city,
        registState: values.state,
        registZipCode: homeZip,
      };
      try {
        const transfer = await Prospect.Transfer({ ...TRANSFER_DATA });
        setCookie('customerId', transfer.customerId);
        handleSaveAddressInfo(values);
      } catch (error) {
        handleError('Transfer to Customer is failed');
      }
    }
  };

  return (
    <Box>
      <Formik
        enableReinitialize
        validationSchema={
          isRetail ? retailAddressValidationSchema : addressValidationSchema
        }
        validateOnBlur
        onSubmit={values => handleTransfer(values)}
        initialValues={{ ...state }}
        render={formik => (
          <Form onSubmit={formik.handleSubmit}>
            <Typography gutterBottom variant="body1">
              Primary information
            </Typography>
            <Grid
              container
              spacing={gridSpacing}
              className={classes.financeGridMarginBottom}
            >
              {!isRetail && (
                <Grid item xs={12} md={6}>
                  <CustomInput
                    label="SOCIAL SECURITY"
                    name="socialSecurity"
                    fullWidth
                    withSsnMask
                    hasError={
                      !!formik.errors.socialSecurity &&
                      formik.touched.socialSecurity
                    }
                    errorMessage={formik.errors.socialSecurity}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.socialSecurity}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <KeyboardDatePicker
                  autoOk
                  fullWidth
                  maxDate={MAX_AVAILABLE_DATE}
                  label="DATE OF BIRTH"
                  format="MM/dd/yyyy"
                  value={formik.values.dob}
                  error={!!formik.errors.dob}
                  errormessage={formik.errors.dob}
                  helperText={formik.errors.dob}
                  onBlur={formik.handleBlur}
                  onChange={value => {
                    formik.setFieldValue('dob', value === null ? '' : value);
                  }}
                  InputAdornmentProps={{ position: 'end' }}
                  variant="filled"
                  name="dob"
                  InputProps={{
                    classes: {
                      root: classes.root,
                      input: classes.input,
                    },
                    disableUnderline: true,
                    style: {
                      height: 90,
                      marginTop: 0,
                      borderColor: formik.errors.dob ? '#FD151B' : '#001C5E',
                    },
                  }}
                  InputLabelProps={{
                    shrink: false,
                    style: {
                      color: formik.errors.dob ? '#FD151B' : '#001C5E',
                      zIndex: 1,
                      transform: 'translate(12px, 20px) scale(1)',
                    },
                  }}
                  {...props}
                />
              </Grid>
            </Grid>
            <Typography gutterBottom variant="body1">
              Address
            </Typography>
            <Grid
              container
              spacing={gridSpacing}
              className={classes.financeGridMarginBottom}
            >
              <AddressAutocomplete
                label="ADDRESS"
                handleAddressData={data =>
                  handleAddressAutocompleteData(data, formik)
                }
                name="address"
                hasError={!!formik.errors.address && formik.touched.address}
                errorMessage={formik.errors.address}
                onBlur={formik.handleBlur}
                handleChangeAddress={formik.setFieldValue}
                value={formik.values.address}
                formik={formik}
              />
              <Grid item xs={12} md={6}>
                <CustomInput
                  fullWidth
                  label="HOME ZIP"
                  name="homeZip"
                  hasError={!!formik.errors.homeZip && formik.touched.homeZip}
                  errorMessage={formik.errors.homeZip}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.homeZip}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomInput
                  fullWidth
                  label="CITY"
                  name="city"
                  hasError={!!formik.errors.city && formik.touched.city}
                  errorMessage={formik.errors.city}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.city}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomSelect
                  options={SELECT_OPTIONS_USA_STATES}
                  fullWidth
                  label="STATE"
                  name="state"
                  hasError={!!formik.errors.state && formik.touched.state}
                  errorMessage={formik.errors.state}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.state}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <CustomInput
                  fullWidth
                  label="ADDRESS (APT , FLOOR )"
                  name="address2"
                  hasError={!!formik.errors.address2 && formik.touched.address2}
                  errorMessage={formik.errors.address2}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address2}
                />
              </Grid>
            </Grid>
            {!isRetail && (
              <>
                <Typography gutterBottom variant="body1">
                  Details
                </Typography>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12} md={6}>
                    <CustomSelect
                      options={SELECT_OPTIONS_TIME_TO_TRAVEL}
                      label="HOW LONG AT ADDRESS? (YEARS)"
                      name="travelTimeToAddressYears"
                      hasError={
                        !!formik.errors.travelTimeToAddressYears &&
                        formik.touched.travelTimeToAddressYears
                      }
                      errorMessage={formik.errors.travelTimeToAddressYears}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.travelTimeToAddressYears}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomSelect
                      disabled={formik.values.travelTimeToAddressYears > 10}
                      options={SELECT_OPTIONS_MONTHS}
                      label="HOW LONG AT ADDRESS? (MONTHS)"
                      name="travelTimeToAddressMonths"
                      hasError={
                        !!formik.errors.travelTimeToAddressMonths &&
                        formik.touched.travelTimeToAddressMonths
                      }
                      errorMessage={formik.errors.travelTimeToAddressMonths}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.travelTimeToAddressMonths}
                    />
                  </Grid>
                  {formik.values.travelTimeToAddressYears < 3 && (
                    <>
                      <AddressAutocomplete
                        label="PRIOR ADDRESS"
                        name="priorAddress"
                        handleAddressData={data =>
                          handlePriorAddressAutocompleteData(data, formik)
                        }
                        disabled={formik.values.travelTimeToAddressYears > 10}
                        // NOTE: don't know do we exactly need type=select
                        // type="select"
                        fullWidth
                        hasError={
                          !!formik.errors.priorAddress &&
                          formik.touched.priorAddress
                        }
                        errorMessage={formik.errors.priorAddress}
                        onBlur={formik.handleBlur}
                        handleChangeAddress={formik.setFieldValue}
                        value={formik.values.priorAddress}
                      />
                      <Grid item xs={12} md={6}>
                        <CustomInput
                          fullWidth
                          label="ZIP"
                          name="priorZip"
                          hasError={
                            !!formik.errors.priorZip && formik.touched.priorZip
                          }
                          errorMessage={formik.errors.priorZip}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.priorZip}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomInput
                          fullWidth
                          label=" CITY"
                          name="priorCity"
                          hasError={
                            !!formik.errors.priorCity &&
                            formik.touched.priorCity
                          }
                          errorMessage={formik.errors.priorCity}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.priorCity}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomSelect
                          options={SELECT_OPTIONS_USA_STATES}
                          fullWidth
                          label="STATE"
                          name="priorState"
                          hasError={
                            !!formik.errors.priorState &&
                            formik.touched.priorState
                          }
                          errorMessage={formik.errors.priorState}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.priorState}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomSelect
                          options={SELECT_OPTIONS_TIME_TO_PRIOR_ADDRESS}
                          label="HOW LONG AT PRIOR ADDRESS?"
                          name="travelTimeToPriorAddress"
                          hasError={
                            !!formik.errors.travelTimeToPriorAddress &&
                            formik.touched.travelTimeToPriorAddress
                          }
                          errorMessage={formik.errors.travelTimeToPriorAddress}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.travelTimeToPriorAddress}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} md={6}>
                    <CustomSelect
                      options={SELECT_OPTIONS_TIME_TO_TRAVEL}
                      label="HOW MANY DEPENDENTS?"
                      name="hoveManyDependents"
                      hasError={
                        !!formik.errors.hoveManyDependents &&
                        formik.touched.hoveManyDependents
                      }
                      errorMessage={formik.errors.hoveManyDependents}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.hoveManyDependents}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            <Grid
              container
              justifyContent={gridJustify}
              className={classes.financeButtonGroup}
            >
              <Grid>
                <CustomPreviousButton onClick={handlePreviousStep} />
              </Grid>
              <Grid item data-tut="Finance-Next">
                <CustomPrimaryButton
                  type="submit"
                  withIcon
                  disabled={!formik.dirty || !formik.isValid}
                >
                  Next
                </CustomPrimaryButton>
              </Grid>
            </Grid>
          </Form>
        )}
      />
    </Box>
  );
};
AddressForm.propTypes = {
  handleSaveAddressInfo: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
  addressData: PropTypes.object.isRequired,
  isRetail: PropTypes.bool.isRequired,
  prospectData: PropTypes.object.isRequired,
  handleError: PropTypes.func.isRequired,
};

export default AddressForm;
