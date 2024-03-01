import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import CustomInput from 'components/shared/CustomInput';
import { useRouter } from 'next/router';
import { removeGteFromUrl, getGteUrl } from '@/utils/commonUtils';

const useStyles = makeStyles(theme => ({
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  financeButtonGroup: {
    marginTop: theme.spacing(1.5),
  },
}));

const StepOne = props => {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const { formik } = props;
  const gridSpacing = matches ? 1 : 3;
  window.dataLayer.push({
    event: 'Rideshare_Tab_1',
    RT1: 'Rideshare_Tab_1',
  });
  useEffect(() => {
    const urlWithGte = `${window.location.origin}${router.asPath}${getGteUrl(
      router.query,
      'Ride-Share-1'
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
            hasError={!!formik.errors.firstName && formik.touched.firstName}
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
            hasError={!!formik.errors.middleName && formik.touched.middleName}
            errorMessage={formik.errors.middleName}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.middleName || ''}
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
      <Grid container spacing={gridSpacing} style={{ marginBottom: 0 }}>
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
            hasError={!!formik.errors.cellPhone && formik.touched.cellPhone}
            errorMessage={formik.errors.cellPhone}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.cellPhone}
            withPhoneMask
          />
        </Grid>
      </Grid>
    </>
  );
};

StepOne.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default StepOne;
