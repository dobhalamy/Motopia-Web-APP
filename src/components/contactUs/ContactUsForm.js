import React, { useState, useEffect } from 'react';
import { withFormik } from 'formik';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/styles';
import ArrowIcon from '@material-ui/icons/ArrowRightAlt';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import CustomInput from 'components/shared/CustomInput';

import { Prospect, Hubspot } from 'src/api';
import { PROSPECT_SOURCE } from 'src/constants';
import { setCookie } from 'src/utils/cookie';
import contactUsValidationSchema from './contactUsValidationSchema';
import generateProspectSource from '../../utils/generateProspectSource';

const useStyles = makeStyles(() => ({
  contactUsFormContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 25,
    boxShadow: '0px 25px 50px rgba(66, 90, 103, 0.25)',
  },
}));

const ContactUsForm = props => {
  const { query } = useRouter();
  const classes = useStyles();
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comments: '',
  });

  useEffect(() => {
    setState({ ...state, ...props.initialValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFieldsChange = name => event => {
    event.persist();
    setState({
      ...state,
      [name]: event.target.value,
    });
    props.setFieldValue(name, event.target.value);
  };

  const handleContactUs = async event => {
    const source = generateProspectSource(PROSPECT_SOURCE.contact, query);
    event.preventDefault();
    // eslint-disable-next-line object-curly-newline
    const {
      firstName,
      lastName,
      email,
      phone,
      comments } = state;

    const contactNumber = phone.startsWith('+1')
      ? phone.replace(/\D+/g, '').slice(1)
      : phone.replace(/\D+/g, '');

    const USER_INFORMATION = {
      firstName,
      lastName,
      email,
      contactNumber,
      source,
      comments
    };
    let response;
    try {
      response = await Prospect.AddProspect({
        ...USER_INFORMATION,
      });
      await Hubspot.formv3('Contact', USER_INFORMATION);
      setCookie('prospectId', response.prospectId);
      props.openModal();
      setState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        comments: '',
      });
    } catch (error) {
      props.handleError(error);
    }
  };

  return (
    <Container maxWidth="lg" className={classes.contactUsFormContainer}>
      <form onSubmit={handleContactUs}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} style={{ paddingTop: 0, paddingBottom: 0 }}>
            <Grid item xs={12}>
              <CustomInput
                label="FIRST NAME:"
                value={state.firstName}
                onChange={handleFieldsChange('firstName')}
                onBlur={props.handleBlur}
                hasError={!!props.errors.firstName && props.touched.firstName}
                errorMessage={props.errors.firstName}
                name="firstName"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <CustomInput
                label="LAST NAME:"
                value={state.lastName}
                onChange={handleFieldsChange('lastName')}
                onBlur={props.handleBlur}
                hasError={!!props.errors.lastName && props.touched.lastName}
                errorMessage={props.errors.lastName}
                name="lastName"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} style={{ paddingTop: 0, paddingBottom: 0 }}>
            <Grid item xs={12}>
              <CustomInput
                label="PHONE:"
                value={state.phone}
                onChange={handleFieldsChange('phone')}
                onBlur={props.handleBlur}
                hasError={!!props.errors.phone && props.touched.phone}
                errorMessage={props.errors.phone}
                name="phone"
                fullWidth
                withPhoneMask
              />
            </Grid>
            <Grid item xs={12}>
              <CustomInput
                label="EMAIL:"
                value={state.email}
                onChange={handleFieldsChange('email')}
                onBlur={props.handleBlur}
                hasError={!!props.errors.email && props.touched.email}
                errorMessage={props.errors.email}
                name="email"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <CustomInput
              label="COMMENTS: (optional)"
              name="comments"
              value={state.comments}
              onChange={handleFieldsChange('comments')}
              fullWidth
              multiline
              height={180}
            />
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={9}>
            <Typography>
              By sharing your contact information you agree to be contacted
              by GoMotopia with sales and promotional information by SMS.
              To opt out, simply reply STOP.
            </Typography>
          </Grid>
          <Grid container item xs={3} justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary">
              Send
              <ArrowIcon style={{ marginLeft: 8 }} />
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

ContactUsForm.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  handleError: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default withFormik({
  mapPropsToValues: (props) => ({
    firstName: props.prospect.firstName || '',
    lastName: props.prospect.lastName || '',
    email: props.prospect.email || '',
    phone: props.prospect.contactNumber || '',
    comments: '',
  }),
  validationSchema: contactUsValidationSchema,
})(ContactUsForm);
