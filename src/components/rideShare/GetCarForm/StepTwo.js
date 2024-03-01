import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import subYears from 'date-fns/subYears';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { SELECT_OPTIONS_USA_STATES } from 'src/constants';
import CustomInput from 'components/shared/CustomInput';
import CustomSelect from 'components/shared/CustomSelect';
import { Badge, Container } from '@material-ui/core';
import CustomHint from 'components/finance/CustomComponents/CustomHint';
import { FinancePins } from 'src/api';
import router from 'next/router';
import { removeGteFromUrl, getGteUrl } from '@/utils/commonUtils';
import { getRdsCompaniesList } from '../../../api/ride-share-companies';

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
  toggleFont: {
    margin: 0,
    fontWeight: 500,
  },
  pinContainer: {
    marginBottom: '2rem',
    width: '100%',
  },
  socialSecurity: {
    position: 'relative',
  },
  socialSecurityPin: {
    position: 'absolute',
    bottom: '9rem',
    [theme.breakpoints.down('md')]: {
      bottom: '4.5rem',
      right: '3.2rem',
    },
  },
}));

const MAX_AVAILABLE_DATE = subYears(new Date(), 16);

const StepTwo = props => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const { formik } = props;
  const gridSpacing = matches ? 1 : 3;
  window.dataLayer.push({
    event: 'Rideshare_Tab_2',
    RT2: 'Rideshare_Tab_2',
  });
  const [rdsCompanies, setRdsCompanies] = useState([]);
  const [activeHint, setActiveHint] = useState(null);
  const [modalPins, setModalPins] = useState([]);
  const fetchData = useCallback(async () => {
    const data = await getRdsCompaniesList().then(array =>
      array.map(({ name }) => ({ text: name, value: name }))
    );
    setRdsCompanies(data);
  }, []);

  const getPins = useCallback(async () => {
    const response = await FinancePins.getFinancePins();
    if (response?.status === 'success') {
      const PINS = response?.data;
      PINS.find(item => item?.page === 'ride_share_modal');
      setModalPins([...PINS]);
    }
  }, []);

  useEffect(() => {
    const urlWithGte = `${window.location.origin}${router.asPath}${getGteUrl(
      router.query,
      'Process-Two-Earning'
    )}`;
    window.history.replaceState(
      { ...window.history.state, as: urlWithGte, url: urlWithGte },
      null,
      urlWithGte
    );
    fetchData();
    getPins();
    return () => {
      setRdsCompanies([]);
      removeGteFromUrl(router);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleCloseHint = () => setActiveHint(null);

  const handleActiveHint = id => {
    const pin = modalPins.find(
      item => item.number === id && item?.page === 'ride_share_modal'
    );
    if (activeHint) {
      if (activeHint.number === id) {
        setActiveHint(null);
      } else setActiveHint(pin);
    } else setActiveHint(pin);
  };
  return (
    <>
      <Typography gutterBottom variant="body1">
        Driver information
      </Typography>
      <Grid
        container
        spacing={gridSpacing}
        className={classes.financeGridMarginBottom}
        style={{ marginBottom: 0 }}
      >
        <Grid item xs={12} md={6}>
          <CustomSelect
            options={SELECT_OPTIONS_USA_STATES}
            fullWidth
            label="Drivers license state"
            name="licenseState"
            hasError={
              !!formik.errors.licenseState && formik.touched.licenseState
            }
            errorMessage={formik.errors.state}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.licenseState}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            label="LICENSE NUMBER"
            name="licenseNumber"
            fullWidth
            hasError={
              !!formik.errors.licenseNumber && formik.touched.licenseNumber
            }
            errorMessage={formik.errors.licenseNumber}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.licenseNumber}
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
            errorMessage={formik.errors.dateOfBirth}
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
                root: classes.root,
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
        <Grid item xs={12} md={6} className={classes.socialSecurity}>
          <Badge
            style={{ cursor: 'pointer' }}
            onClick={() => handleActiveHint(1)}
            color="error"
            component="div"
            className={classes.socialSecurityPin}
            badgeContent={1}
          />
          <CustomInput
            label="SOCIAL SECURITY #"
            name="socialSecurity"
            withSsnMask
            fullWidth
            hasError={
              !!formik.errors.socialSecurity && formik.touched.socialSecurity
            }
            errorMessage={formik.errors.socialSecurity}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.socialSecurity}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomSelect
            options={rdsCompanies}
            fullWidth
            label="Ride-Share company name"
            name="rdsCompany"
            hasError={!!formik.errors.rdsCompany && formik.touched.rdsCompany}
            errorMessage={formik.errors.rdsCompany}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.rdsCompany}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomInput
            label="TOTAL COMPLETED RIDESHARE JOBS"
            name="jobsAmount"
            fullWidth
            type="number"
            hasError={!!formik.errors.jobsAmount && formik.touched.jobsAmount}
            errorMessage={formik.errors.jobsAmount}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.jobsAmount}
          />
        </Grid>
        <div className={classes?.pinContainer}>
          {activeHint && (
            <Container maxWidth="md">
              <CustomHint
                activeHint={activeHint}
                handleCloseHint={handleCloseHint}
              />
            </Container>
          )}
        </div>
      </Grid>
    </>
  );
};

StepTwo.propTypes = {
  formik: PropTypes.object.isRequired,
  handleToggle: PropTypes.func.isRequired,
  toggle: PropTypes.bool.isRequired,
};

export default StepTwo;
