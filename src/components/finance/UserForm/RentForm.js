/* eslint-disable react/jsx-closing-tag-location */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import InputAdornment from '@material-ui/core/InputAdornment';
// import Typography from '@material-ui/core/Typography'; NOTE: this components is used for Disclaimer above.

import CustomInput from 'components/shared/CustomInput';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import CustomSelect from 'components/shared/CustomSelect';
import { CAR_REGISTER_USA_STATES } from 'src/constants';
import { getCookieJSON } from 'src/utils/cookie';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/router';
import CustomPreviousButton from './CustomPreviousButton';
import {
  rentValidationSchema,
  retailRentValidationSchema,
} from './validationSchema';
import {
  SELECT_OPTIONS_RENT_OR_OWN,
  SELECT_WISH_TO_TRANSFER,
} from './constants';

const useStyles = makeStyles(theme => ({
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  financeButtonGroup: {
    marginTop: theme.spacing(1.5),
  },
  greyColor: {
    color: '#a0a0a0',
  },
}));

const RentForm = props => {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const [state, setState] = React.useState({
    initialValues: {
      rentOrOwn: '',
      amount: '',
      registrationState: '',
      state: '',
      transfer: '',
      zip: '',
    },
  });
  const { isRetail } = props;

  const gridSpacing = matches ? 1 : 3;
  const gridJustify = matches ? 'space-between' : 'flex-end';

  React.useEffect(() => {
    const { rentInfo } = props;
    if (rentInfo) {
      setState({
        ...state,
        initialValues: {
          ...state.initialValues,
          ...rentInfo,
        },
      });
    }
    // eslint-disable-next-line
  }, [props, props.rentInfo]);
  useEffect(() => {
    if (
      router.pathname.includes('retail') &&
      router.query.gte !== 'Complete-Pay-Stage-3'
    ) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, gte: 'Complete-Pay-Stage-3' },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangeStateRetail = formik => ({ target }) => {
    const { value } = target;
    formik.setFieldValue('state', value);
    const address = getCookieJSON('address');
    if (value === 'NY') {
      if (value === address.state) {
        formik.setFieldValue('zip', address.homeZip);
      }
    }
  };

  return (
    <Box>
      <Formik
        enableReinitialize
        validationSchema={
          isRetail ? retailRentValidationSchema : rentValidationSchema
        }
        onSubmit={values => props.handleSaveRentInfo(values)}
        initialValues={{ ...state.initialValues }}
        render={formik =>
          !isRetail ? (
            <Form onSubmit={formik.handleSubmit} id="car-sale-submit-finance">
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <CustomSelect
                    options={SELECT_OPTIONS_RENT_OR_OWN}
                    label="RESIDENCE RENT OR OWN?"
                    name="rentOrOwn"
                    hasError={
                      !!formik.errors.rentOrOwn && formik.touched.rentOrOwn
                    }
                    errorMessage={formik.errors.rentOrOwn}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.rentOrOwn}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    fullWidth
                    label="RENT/OWN MONTHLY PAYMENT"
                    name="amount"
                    hasError={!!formik.errors.amount && formik.touched.amount}
                    errorMessage={formik.errors.amount}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.amount}
                    startAdornment={
                      formik.values.amount && (
                        <InputAdornment position="start">$</InputAdornment>
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomSelect
                    options={CAR_REGISTER_USA_STATES}
                    fullWidth
                    label="WHERE DO YOU PLAN REGISTER YOUR CAR?"
                    name="registrationState"
                    hasError={
                      !!formik.errors.registrationState &&
                      formik.touched.registrationState
                    }
                    errorMessage={formik.errors.registrationState}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.registrationState}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent={gridJustify}
                className={classes.financeButtonGroup}
              >
                <Grid>
                  <CustomPreviousButton onClick={props.handlePreviousStep} />
                </Grid>
                <Grid item>
                  {props.loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <CustomPrimaryButton
                      type="submit"
                      withIcon
                      disabled={!formik.dirty || !formik.isValid}
                    >
                      {matches ? 'next' : 'see results'}
                    </CustomPrimaryButton>
                  )}
                </Grid>
              </Grid>
            </Form>
          ) : (
            <Form id="car-sale-submit">
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <CustomSelect
                    options={CAR_REGISTER_USA_STATES}
                    label="VEHICLE REGISTRATION STATE"
                    name="state"
                    hasError={!!formik.errors.state && formik.touched.state}
                    errorMessage={formik.errors.state}
                    onBlur={formik.handleBlur}
                    onChange={handleChangeStateRetail(formik)}
                    value={formik.values.state}
                  />
                </Grid>
                {formik.values.state === 'NY' && (
                  <Grid item xs={12}>
                    <CustomInput
                      fullWidth
                      label="Enter ZIP for the New York state"
                      name="zip"
                      hasError={!!formik.errors.zip && formik.touched.zip}
                      errorMessage={formik.errors.zip}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.zip}
                      style={{ height: 'auto' }}
                    />
                    {/* NOTE: Uncomment if need some Disclaimer here */}
                    {/* <Typography
                    variant="body2"
                    align="left"
                    className={classes.greyColor}
                  >
                    Disclaimer: Lorem ipsum dolor sit amet, consectetur adipisici
                  </Typography> */}
                  </Grid>
                )}
                <Grid item xs={12}>
                  <CustomSelect
                    fullWidth
                    options={SELECT_WISH_TO_TRANSFER}
                    label="Do you plan to transfer your plate?"
                    name="transfer"
                    hasError={
                      !!formik.errors.transfer && formik.touched.transfer
                    }
                    errorMessage={formik.errors.transfer}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.transfer}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent={gridJustify}
                className={classes.financeButtonGroup}
              >
                <Grid>
                  <CustomPreviousButton onClick={props.handlePreviousStep} />
                </Grid>
                <Grid item>
                  {props.loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <CustomPrimaryButton
                      type="submit"
                      withIcon
                      disabled={!formik.dirty || !formik.isValid}
                    >
                      {matches ? 'next' : 'see results'}
                    </CustomPrimaryButton>
                  )}
                </Grid>
              </Grid>
            </Form>
          )
        }
      />
    </Box>
  );
};
RentForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleSaveRentInfo: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
  rentInfo: PropTypes.object.isRequired,
  isRetail: PropTypes.bool.isRequired,
};

export default RentForm;
