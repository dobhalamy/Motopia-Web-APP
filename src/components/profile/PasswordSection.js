/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React from 'react';
import { Formik } from 'formik';

import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import LockIcon from '@material-ui/icons/LockOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import CustomInput from 'components/shared/CustomInput';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';

import { User } from 'src/api';
import validationSchema from './validationSchema';

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
}));

export default function PasswordSection() {
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = React.useState({
    showPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    showErrorBar: false,
    error: null,
  });

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };
  const handleClickShowNewPassword = () => {
    setState({ ...state, showNewPassword: !state.showNewPassword });
  };
  const handleClickShowConfirmPassword = () => {
    setState({ ...state, showConfirmPassword: !state.showConfirmPassword });
  };

  const gridSpacing = useMediaQuery(theme.breakpoints.only('xs')) ? 1 : 3;

  const handleChangePassword = async (values, resetForm) => {
    const PASSWORD_DATA = {
      currentPassword: values.password,
      newPassword: values.confirmPassword
    };

    try {
      const passwordResponse = await User.ChangePassword({
        ...PASSWORD_DATA,
      });
      if (passwordResponse === 'Success') {
        resetForm();
      } else {
        setState({
          ...state,
          showErrorBar: true,
          error:
          passwordResponse.errorMessage
        });
      }
    } catch (error) {
      setState({
        ...state,
        showErrorBar: true,
        error:
        error.errorMessage
      });
    }
  };

  const closeErrorBar = () =>
  setState({ ...state, showErrorBar: false, error: null });

  return (
    <Formik
      validationSchema={validationSchema}
      enableReinitialize
      initialValues={{ password: '', newPassword: '', confirmPassword: '' }}
      onSubmit={(
        values,
        { resetForm }
      ) => handleChangePassword(values, resetForm)}
      render={formik => (
        <>
          <Typography
            className={classes.sectionName}
            gutterBottom
            variant="body1"
          >
            <LockIcon color="error" /> Password
          </Typography>

          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
              <CustomInput
                label="CURRENT PASSWORD"
                fullWidth
                name="password"
                type={state.showPassword ? 'text' : 'password'}
                hasError={
                  !!formik.errors.password && formik.touched.password
                }
                errorMessage={formik.errors.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={formik.handleMouseDownPassword}
                    >
                      {state.showPassword ? (
                        <VisibilityIcon />
                      ) : (
                          <VisibilityOffIcon />
                        )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item xs={12} md={6} />
            <Grid item xs={12} md={6}>
              <CustomInput
                label="NEW PASSWORD"
                fullWidth
                name="newPassword"
                type={state.showNewPassword ? 'text' : 'password'}
                hasError={
                  !!formik.errors.newPassword && formik.touched.newPassword
                }
                errorMessage={formik.errors.newPassword}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowNewPassword}
                      onMouseDown={formik.handleMouseDownNewPassword}
                    >
                      {state.showNewPassword ? (
                        <VisibilityIcon />
                      ) : (
                          <VisibilityOffIcon />
                        )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomInput
                label="CONFIRM PASSWORD"
                fullWidth
                name="confirmPassword"
                type={state.showConfirmPassword ? 'text' : 'password'}
                hasError={
                  !!formik.errors.confirmPassword && formik.touched.confirmPassword
                }
                errorMessage={formik.errors.confirmPassword}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={formik.handleMouseDownNewPassword}
                    >
                      {state.showConfirmPassword ? (
                        <VisibilityIcon />
                      ) : (
                          <VisibilityOffIcon />
                        )}
                    </IconButton>
                  </InputAdornment>
                }
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
                Change Password
              </CustomPrimaryButton>
            </Grid>
          </Grid>
          <ErrorSnackbar
            showErrorBar={state.showErrorBar}
            error={state.error}
            closeErrorBar={closeErrorBar}
          />
        </>
      )}
    />
  );
}
