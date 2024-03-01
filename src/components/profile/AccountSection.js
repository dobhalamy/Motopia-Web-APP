import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import subYears from 'date-fns/subYears';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { KeyboardDatePicker } from '@material-ui/pickers';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getCookie } from 'src/utils/cookie';

import PermIdentityIcon from '@material-ui/icons/PermIdentityOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';

import CustomSelect from 'components/shared/CustomSelect';
import CustomInput from 'components/shared/CustomInput';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import AddressAutocomplete from 'components/finance/UserForm/AddressAutocomplete';
import { SELECT_OPTIONS_USA_STATES } from 'src/constants';
import { User } from 'src/api';

const useStyles = makeStyles(theme => ({
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  financeButtonGroup: {
    marginTop: theme.spacing(1.5),
  },
  sectionName: {
    display: 'flex',
    alignContent: 'center',
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
  input: {
    boxSizing: 'border-box',
    padding: `${theme.spacing(5)}px ${theme.spacing(1.5)}px ${theme.spacing(
      1.25
    )}px`,
  },
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%'
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  }
}));

const AccountSection = props => {
  const MAX_AVAILABLE_DATE = subYears(new Date(), 16);
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = React.useState({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      cellPhone: '',
      middleName: '',
      dateOfBirth: '',
      annualIncome: 0,
      homeZip: '',
      address: '',
      city: '',
      state: '',
    },
    accountDetails: {},
  });
  const gridSpacing = useMediaQuery(theme.breakpoints.only('xs')) ? 1 : 3;

  React.useEffect(() => {
    const { userData } = props;
    if (userData) {
      setState({
        ...state,
        initialValues: {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          cellPhone: userData.contactNumber || '',
          dateOfBirth: new Date(userData.dob) || MAX_AVAILABLE_DATE,
          annualIncome: userData.annualIncome || '',
          homeZip: userData.zipcode || '',
          address: userData.address || '',
          state: userData.state || '',
          city: userData.city || '',
          middleName: userData.middleName || '',
          address2: userData.address2 || '',
        },
      });
    }
    // eslint-disable-next-line
  }, [props.userData]);

  const handleUpdateProfile = async values => {
    const {
      firstName,
      lastName,
      email,
      middleName,
      dateOfBirth,
      homeZip,
      address,
      city,
      address2 } = values;

    const dob = moment(dateOfBirth).endOf('day').toISOString();

    const USER_INFORMATION = {
      creditAppId: Number(getCookie('bankCreditId')) || 0,
      firstName,
      lastName,
      dob,
      email,
      annualIncome: +values.annualIncome,
      zipcode: homeZip,
      address,
      address2,
      state: values.state,
      city
    };
    if (middleName.length > 0) {
      USER_INFORMATION.middleName = middleName;
    }
    try {
      await User.Update({
        ...USER_INFORMATION,
      });
      props.handleSuccess('Information was updated');
    } catch (error) {
      props.handleError(error);
    }
  };

  const handleAddressAutocompleteData = (data, formik) => {
    formik.setFieldValue('city', data.city);
    formik.setFieldValue('state', data.state);
    formik.setFieldValue('homeZip', data.homeZip);
    formik.setFieldValue('address', data.address);
  };
  return (
    <Formik
      onSubmit={handleUpdateProfile}
      enableReinitialize
      initialValues={{ ...state.initialValues }}
      render={formik => (
        <>
          <Typography
            className={classes.sectionName}
            gutterBottom
            variant="body1"
          >
            <PermIdentityIcon color="error" /> Account
          </Typography>
          <Grid
            container
            spacing={gridSpacing}
            className={classes.financeGridMarginBottom}
          >
            <Grid item xs={12} md={6}>
              <CustomInput
                fullWidth
                label="FIRST NAME"
                name="firstName"
                hasError={!!formik.errors.firstName && formik.touched.firstName}
                errorMessage={formik.errors.firstName}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomInput
                fullWidth
                label="MIDDLE NAME"
                name="middleName"
                hasError={
                  !!formik.errors.middleName && formik.touched.middleName
                }
                errorMessage={formik.errors.middleName}
                onBlur={formik.handleBlur}
                value={formik.values.middleName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomInput
                fullWidth
                label="LAST NAME"
                name="lastName"
                hasError={!!formik.errors.lastName && formik.touched.lastName}
                errorMessage={formik.errors.lastName}
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <KeyboardDatePicker
                autoOk
                fullWidth
                maxDate={MAX_AVAILABLE_DATE}
                label="DATE OF BIRTH"
                format="MM/dd/yyyy"
                value={formik.values.dateOfBirth}
                error={!!formik.errors.dateOfBirth}
                errormessage={formik.errors.dateOfBirth}
                helperText={formik.errors.dateOfBirth}
                onBlur={formik.handleBlur}
                onChange={value => {
                  formik.setFieldValue('dateOfBirth', value === null ? '' : value);
                }}
                InputAdornmentProps={{ position: 'end' }}
                variant="filled"
                name="DATE OF BIRTH"
                InputProps={{
                  classes: {
                    root:
                      classes.root,
                    input: classes.input,
                  },
                  disableUnderline: true,
                  style: {
                    height: 90,
                    marginTop: 0,
                    borderColor: formik.errors.dateOfBirth ? '#FD151B' : '#001C5E',
                  },
                }}
                InputLabelProps={{
                  shrink: false,
                  style: {
                    color: formik.errors.dateOfBirth ? '#FD151B' : '#001C5E',
                    zIndex: 1,
                    transform: 'translate(12px, 20px) scale(1)',
                  },
                }}
                {...props}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomInput
                fullWidth
                label="EMAIL"
                name="email"
                hasError={!!formik.errors.email && formik.touched.email}
                errorMessage={formik.errors.email}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomInput
                fullWidth
                label="ANNUAL INCOME"
                name="annualIncome"
                hasError={
                  !!formik.errors.annualIncome && formik.touched.annualIncome
                }
                errorMessage={formik.errors.annualIncome}
                onBlur={formik.handleBlur}
                value={formik.values.annualIncome}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomInput
                fullWidth
                label="CELL PHONE"
                name="cellPhone"
                hasError={!!formik.errors.cellPhone && formik.touched.cellPhone}
                errorMessage={formik.errors.cellPhone}
                onBlur={formik.handleBlur}
                value={formik.values.cellPhone}
                disabled
              />
            </Grid>
          </Grid>
          <Typography
            gutterBottom
            variant="body1"
            className={classes.sectionName}
          >
            <HomeIcon color="error" /> Address
          </Typography>
          <Grid
            container
            spacing={gridSpacing}
            className={classes.financeGridMarginBottom}
          >
            <AddressAutocomplete
              label="ADDRESS"
              handleAddressData={(data) => handleAddressAutocompleteData(data, formik)}
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
          <Grid
            container
            justifyContent="flex-start"
            className={classes.financeButtonGroup}
          >
            <Grid item>
              <CustomPrimaryButton withIcon onClick={formik.handleSubmit}>
                SAVE CHANGES
              </CustomPrimaryButton>
            </Grid>
          </Grid>
          {!props.userData.prospectId && (
            <div className={classes.backdrop}>
              <LinearProgress className={classes.loader} color="secondary" />
            </div>)}
        </>
      )}
    />
  );
};

AccountSection.propTypes = {
  handleError: PropTypes.func.isRequired,
  handleSuccess: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  isLoad: PropTypes.bool.isRequired,
};

export default AccountSection;
