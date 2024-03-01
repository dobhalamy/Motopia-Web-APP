import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CustomInput from 'components/shared/CustomInput';
import CustomSelect from 'components/shared/CustomSelect';
import { SELECT_OPTIONS_USA_STATES } from 'src/constants';
import AddressAutocomplete from '../../finance/UserForm/AddressAutocomplete';

const useStyles = makeStyles(theme => ({
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  stateStyle: {
    textTransform: 'none',
  },
}));

const StepThree = ({ ...props }) => {
  const { formik } = props;
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));

  const gridSpacing = matches ? 1 : 3;

  const handleAddressAutocomplete = (data, form) => {
    form.setFieldValue('odCity', data.city);
    form.setFieldValue('odState', data.state);
    form.setFieldValue('odZip', data.homeZip);
    form.setFieldValue('odAdress', data.address);
  };

  return (
    <>
      <Grid
        container
        spacing={gridSpacing}
        className={classes.financeGridMarginBottom}
      >
        <Grid item xs={12} md={6}>
          <CustomInput
            fullWidth
            label="OD License ID"
            name="odLicenseID"
            placeholder="Please enter other drier license ID"
            hasError={!!formik.errors.odLicenseID && formik.touched.odLicenseID}
            errorMessage={formik.errors.odLicenseID}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.odLicenseID}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            fullWidth
            label="OD first name"
            name="odFirstName"
            placeholder="Please enter other drier first name"
            hasError={!!formik.errors.odFistName && formik.touched.odFirstName}
            errorMessage={formik.errors.odFirstName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.odFirstName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            fullWidth
            label="OD middle name"
            name="odMiddleName"
            placeholder="Please enter other drier middle name"
            hasError={
              !!formik.errors.odMiddleName && formik.touched.odMiddleName
            }
            errorMessage={formik.errors.odMiddleName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.odMiddleName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            fullWidth
            label="OD last name"
            name="odLastName"
            placeholder="Please enter other drier last name"
            hasError={!!formik.errors.odLastName && formik.touched.odLastName}
            errorMessage={formik.errors.odLastName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.odLastName}
          />
        </Grid>
        <AddressAutocomplete
          label="OD address"
          name="odAdress"
          placeholder="Please enter other drier address"
          handleAddressData={data => handleAddressAutocomplete(data, formik)}
          hasError={!!formik.errors.odAdress && formik.touched.odAdress}
          errorMessage={formik.errors.odAdress}
          onBlur={formik.handleBlur}
          handleChangeAddress={formik.setFieldValue}
          value={formik.values.odAdress || ''}
          formik={formik}
        />
        <Grid item xs={12} md={6}>
          <CustomInput
            fullWidth
            label="OD zip"
            name="odZip"
            hasError={!!formik.errors.odZip && formik.touched.odZip}
            errorMessage={formik.errors.odZip}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.odZip}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            fullWidth
            label="OD city"
            name="odCity"
            hasError={!!formik.errors.odCity && formik.touched.odCity}
            errorMessage={formik.errors.odCity}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={
              formik.values.odCity === undefined ? '' : formik.values.odCity
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomSelect
            options={SELECT_OPTIONS_USA_STATES}
            fullWidth
            showLowerCaseLabel
            label="OD state"
            name="odState"
            hasError={!!formik.errors.odState && formik.touched.odState}
            errorMessage={formik.errors.odState}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.odState}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            fullWidth
            label="OD plate number"
            name="odPlateNumber"
            hasError={
              !!formik.errors.odPlateNumber && formik.touched.odPlateNumber
            }
            errorMessage={formik.errors.odPlateNumber}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.odPlateNumber}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomSelect
            options={SELECT_OPTIONS_USA_STATES}
            fullWidth
            className={classes.stateStyle}
            label="OD state of registration"
            name="odStateOfReg"
            hasError={
              !!formik.errors.odStateOfReg && formik.touched.odStateOfReg
            }
            errorMessage={formik.errors.odStateOfReg}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.odStateOfReg}
          />
        </Grid>
      </Grid>
    </>
  );
};
StepThree.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default StepThree;
