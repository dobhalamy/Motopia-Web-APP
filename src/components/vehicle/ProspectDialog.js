import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Prospect } from 'src/api';
import { PROSPECT_SOURCE } from 'src/constants';
import { setCookie } from 'src/utils/cookie';

import CustomInput from 'components/shared/CustomInput';
import ProspectValidationSchema from './ProspectValidationSchema';
import generateProspectSource from '../../utils/generateProspectSource';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    minHeight: 490,
    paddingTop: 20
  },
  customInputs: {
    margin: `${theme.spacing(1)}px 0`,
  },
  actionButtonsWrapper: {
    marginBottom: theme.spacing(3),
  },
  actionButtons: {
    width: 120,
    margin: `0 ${theme.spacing(1)}px`,
  },
}));

export default function ProspectDialog(props) {
  const { query } = useRouter();
  const classes = useStyles();
  const {
    handleCloseProspectForm,
    isOpen,
    requestType,
    vehicleInformation,
    handleShowError,
  } = props;

  const handleSubmitProspectForm = async values => {
    const contactNumber = values.cellPhone.startsWith('+1')
      ? values.cellPhone.replace(/\D+/g, '').slice(1)
      : values.cellPhone.replace(/\D+/g, '');

    const source =
      requestType === 'Additional Info' ? PROSPECT_SOURCE.moreinfo : PROSPECT_SOURCE.carfax;

    const INFORMATION_DATA = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      contactNumber,
      source: generateProspectSource(source, query),
      category: 'Sale',
      // eslint-disable-next-line max-len
      notes: `${requestType}: [stock]:${vehicleInformation.stockid} [yr]:${vehicleInformation.carYear} [make]:${vehicleInformation.make} [model]:${vehicleInformation.model} [vin]:${vehicleInformation.vin}, Customer Comments: ${values.notes}`,
    };
    let response;
    try {
      response = await Prospect.AddProspect({
        ...INFORMATION_DATA,
      });
      setCookie('prospectId', response.prospectId);
      props.handleOpenThanksDialog();
    } catch (error) {
      handleShowError(response.errorMessage);
    }
    handleCloseProspectForm();
  };
  return (
    <Dialog
      open={isOpen}
      onClose={handleCloseProspectForm}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Information form</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Formik
          validationSchema={ProspectValidationSchema}
          onSubmit={values => handleSubmitProspectForm(values)}
          enableReinitialize={false}
          initialValues={{ ...props.prospectFormValues }}
          render={formik => (
            <Form onSubmit={formik.handleSubmit}>
              <Grid
                container
                spacing={2}
                className={classes.financeGridMarginBottom}
              >
                <CustomInput
                  fullWidth
                  label="FIRST NAME"
                  name="firstName"
                  hasError={!!formik.errors.firstName && formik.touched.firstName}
                  errorMessage={formik.errors.firstName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  style={{ height: 120 }}
                />
                <CustomInput
                  fullWidth
                  label="LAST NAME"
                  name="lastName"
                  hasError={!!formik.errors.lastName && formik.touched.lastName}
                  errorMessage={formik.errors.lastName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  style={{ height: 120 }}
                />
                <CustomInput
                  fullWidth
                  label="EMAIL"
                  name="email"
                  hasError={!!formik.errors.email && formik.touched.email}
                  errorMessage={formik.errors.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  style={{ height: 120 }}
                />
                <CustomInput
                  fullWidth
                  label="CELL PHONE"
                  name="cellPhone"
                  hasError={!!formik.errors.cellPhone && formik.touched.cellPhone}
                  errorMessage={formik.errors.cellPhone}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.cellPhone}
                  style={{ height: 120 }}
                  withPhoneMask
                />
                <CustomInput
                  label="NOTES"
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  fullWidth
                  multiline
                  height={180}
                />
                <Grid
                  className={classes.actionButtonsWrapper}
                  container
                  justifyContent="flex-end"
                >
                  <Button
                    className={classes.actionButtons}
                    onClick={handleCloseProspectForm}
                    variant="contained"
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    className={classes.actionButtons}
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

ProspectDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleCloseProspectForm: PropTypes.func.isRequired,
  prospectFormValues: PropTypes.objectOf(PropTypes.string.isRequired)
    .isRequired,
  requestType: PropTypes.string.isRequired,
  vehicleInformation: PropTypes.object,
  handleShowError: PropTypes.func.isRequired,
  handleOpenThanksDialog: PropTypes.func.isRequired,
};

ProspectDialog.defaultProps = {
  vehicleInformation: {},
};
