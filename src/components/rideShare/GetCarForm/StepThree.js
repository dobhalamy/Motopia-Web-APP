import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CustomInput from 'components/shared/CustomInput';
import CustomSelect from 'components/shared/CustomSelect';
import { SELECT_OPTIONS_USA_STATES } from 'src/constants';
import { useRouter } from 'next/router';
import { removeGteFromUrl, getGteUrl } from '@/utils/commonUtils';
import AddressAutocomplete from '../../finance/UserForm/AddressAutocomplete';

const useStyles = makeStyles(theme => ({
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
}));

const StepThree = ({ ...props }) => {
  const { formik } = props;
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));

  const gridSpacing = matches ? 1 : 3;

  const handleAddressAutocompleteData = (data, form) => {
    form.setFieldValue('city', data.city);
    form.setFieldValue('state', data.state);
    form.setFieldValue('homeZip', data.homeZip);
    form.setFieldValue('address', data.address);
  };
  useEffect(() => {
    const urlWithGte = `${window.location.origin}${router.asPath}${getGteUrl(
      router.query,
      'End-Uber-Earn'
    )}`;
    window.history.replaceState(
      { ...window.history.state, as: urlWithGte, url: urlWithGte },
      null,
      urlWithGte
    );
    return () => {
      removeGteFromUrl(router);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography gutterBottom variant="body1">
        Current living address
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
      </Grid>
    </>
  );
};
StepThree.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default StepThree;
