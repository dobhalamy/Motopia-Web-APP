import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import CustomInput from 'components/shared/CustomInput';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import { Prospect, Hubspot } from 'src/api';
import { saveUserData, getProspectorProfile } from 'src/redux/actions/user';
import { setCookie } from 'src/utils/cookie';

import { PROSPECT_SOURCE } from 'src/constants';
import { removeGteFromUrl } from '@/utils/commonUtils';
import { informationValidationSchema } from './validationSchema';
import generateProspectSource from '../../../utils/generateProspectSource';

const useStyles = makeStyles(theme => ({
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  financeButtonGroup: {
    marginTop: theme.spacing(1.5),
  },
}));

const InformationForm = props => {
  const router = useRouter();
  const { query, pathname } = useRouter();
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const [state, setState] = React.useState({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      cellPhone: '',
      middleName: '',
    },
    showErrorBar: false,
    error: '',
  });

  const closeErrorBar = () => {
    setState({ showErrorBar: false });
  };

  const handleAddProspect = async values => {
    const { firstName, middleName, lastName, email, cellPhone } = values;
    const source = generateProspectSource(
      props.isRetail ? PROSPECT_SOURCE.sale : PROSPECT_SOURCE.finance,
      query
    );
    if (
      pathname.includes('retail') &&
      (query.gte === 'Pay-Full-Level-1' || query.gte === undefined)
    ) {
      const googleEvent = { ...query, gte: 'Pay-Full-Level-1' };
      router.push({
        pathname: router.pathname,
        query: googleEvent,
      });
      window.dataLayer.push({
        event: 'Car_Sale_Pay_In_Full_Level_1',
        CSPIFL1: 'Car_Sale_Pay_In_Full_Level_1',
      });
    } else {
      const googleEvent = { ...query, gte: 'Finance-Stage-1' };
      router.push({
        pathname: router.pathname,
        query: googleEvent,
      });
      window.dataLayer.push({
        event: 'Car_Sale_Pay_In_Full_Level_1',
        CSPIFL1: 'Car_Sale_Pay_In_Full_Level_1',
      });
    }
    const parseNumber = cellPhone.startsWith('+1')
      ? cellPhone.replace(/\D+/g, '').slice(1)
      : cellPhone.replace(/\D+/g, '');

    const USER_INFORMATION = {
      firstName,
      lastName,
      middleName,
      email,
      contactNumber: parseNumber,
      source,
      category: 'Sale',
      referrer: null,
      referrerContactNumber: null,
      promoCode: null,
      password: '',
    };
    let response;
    try {
      response = await Prospect.AddProspect({
        ...USER_INFORMATION,
      });
      await Hubspot.formv3('Finance', USER_INFORMATION);
      props.saveUserData({ prospectId: response.prospectId });
      setCookie('prospectId', response.prospectId);
      setCookie('userInfo', JSON.stringify(values));
      props.getProspectorProfile(response.prospectId);
    } catch (error) {
      setState({
        ...state,
        showErrorBar: true,
        error: response.errorMessage,
      });
    }
    removeGteFromUrl(router);
    props.handleNextStep();
  };

  React.useEffect(() => {
    const { prospectData } = props;
    if (prospectData.firstName && prospectData.contactNumber) {
      setState({
        ...state,
        initialValues: {
          firstName: prospectData.firstName || '',
          lastName: prospectData.lastName || '',
          email: prospectData.email || '',
          cellPhone: prospectData.contactNumber || '',
          middleName: prospectData.middleName || '',
        },
      });
    }
    // eslint-disable-next-line
  }, [props.prospectData]);
  useEffect(() => {
    if (pathname.includes('retail')) {
      router.push({
        pathname: router.pathname,
        query: { ...query, gte: 'Pay-Full-Level-1' },
      });
    } else {
      router.push({
        pathname: router.pathname,
        query: { ...query, gte: 'Finance-Stage-1' },
      });
    }
    return () => {
      removeGteFromUrl(router);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const gridSpacing = matches ? 1 : 3;

  return (
    <Box>
      <Formik
        validationSchema={informationValidationSchema}
        onSubmit={values => handleAddProspect(values)}
        enableReinitialize
        initialValues={{ ...state.initialValues }}
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
              <Grid item xs={12} md={4}>
                <CustomInput
                  fullWidth
                  label="FIRST NAME"
                  name="firstName"
                  hasError={
                    !!formik.errors.firstName && formik.touched.firstName
                  }
                  errorMessage={formik.errors.firstName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomInput
                  fullWidth
                  label="MIDDLE NAME"
                  name="middleName"
                  hasError={
                    !!formik.errors.middleName && formik.touched.middleName
                  }
                  errorMessage={formik.errors.middleName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.middleName}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomInput
                  fullWidth
                  label="LAST NAME"
                  name="lastName"
                  hasError={!!formik.errors.lastName && formik.touched.lastName}
                  errorMessage={formik.errors.lastName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
              </Grid>
            </Grid>
            <Typography gutterBottom variant="body1">
              Contacts
            </Typography>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={6}>
                <CustomInput
                  fullWidth
                  label="EMAIL"
                  name="email"
                  hasError={!!formik.errors.email && formik.touched.email}
                  errorMessage={formik.errors.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomInput
                  fullWidth
                  label="CELL PHONE"
                  name="cellPhone"
                  hasError={
                    !!formik.errors.cellPhone && formik.touched.cellPhone
                  }
                  errorMessage={formik.errors.cellPhone}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.cellPhone}
                  withPhoneMask
                />
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="flex-end"
              className={classes.financeButtonGroup}
            >
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
      <ErrorSnackbar
        showErrorBar={state.showErrorBar}
        error={state.error}
        closeErrorBar={closeErrorBar}
      />
    </Box>
  );
};
InformationForm.propTypes = {
  saveUserData: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  prospectData: PropTypes.object.isRequired,
  getProspectorProfile: PropTypes.func.isRequired,
  isRetail: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  saveUserData,
  getProspectorProfile,
};

export default compose(connect(null, mapDispatchToProps)(InformationForm));
