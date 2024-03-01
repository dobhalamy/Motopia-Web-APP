import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';

export default function ErrorSnackbar({ showErrorBar, closeErrorBar, error, type }) {
  const useStyles = makeStyles(theme => ({
    snackbarRoot: {
      backgroundColor: type === 'success' ? theme.palette.success : theme.palette.error.main,
    },
    errorIcon: {
      marginRight: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={showErrorBar}
      autoHideDuration={6000}
      onClose={closeErrorBar}
    >
      <SnackbarContent
        className={classes.snackbarRoot}
        message={
          <Grid container alignItems="center" justifyContent="center">
            <ErrorIcon className={classes.errorIcon} /> {error}
          </Grid>
        }
        action={[
          <IconButton key="close" color="inherit" onClick={closeErrorBar}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
}

ErrorSnackbar.propTypes = {
  showErrorBar: PropTypes.bool.isRequired,
  closeErrorBar: PropTypes.func.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
};

ErrorSnackbar.defaultProps = {
  error: '',
  type: 'error',
};
