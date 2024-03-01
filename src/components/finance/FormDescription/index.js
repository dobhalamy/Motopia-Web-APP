import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core';

import MeterIcon from 'assets/finance/meter.svg';

const useStyles = makeStyles(theme => ({
  financeFormDescription: {
    padding: `${theme.spacing(4.375)}px 0px ${theme.spacing(7)}px`,
    borderBottom: '1px solid #D5DDE2',
    marginBottom: theme.spacing(5),
    [theme.breakpoints.only('xs')]: {
      paddingBottom: 0,
      border: 0,
    },
  },
  financeFormDescriptionIcon: {
    marginRight: theme.spacing(1.25),
    width: theme.spacing(5.75),
    height: theme.spacing(5.75),
    display: 'block',
  },
  financeFormDescriptionTitle: {
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
}));

const FormDescription = ({ title }) => {
  const classes = useStyles();

  return (
    <Box className={classes.financeFormDescription}>
      <Hidden xsDown>
        <Typography color="secondary" variant="body2" gutterBottom>
          Home/Finance
        </Typography>
      </Hidden>
      <Grid container>
        <Grid item sm={6}>
          <Typography variant="h4" className={classes.financeFormDescriptionTitle} gutterBottom>
            {title}
          </Typography>
        </Grid>
        <Grid item sm={6}>
          <Typography variant="body1" gutterBottom>
            Pre-qualified shoppers see real terms and actual monthly payments for each vehicle.
          </Typography>
          <Grid container alignItems="center">
            <Grid item>
              <img src={MeterIcon} alt="meter" className={classes.financeFormDescriptionIcon} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body1">No IMPACT ON YOUR CREDIT SCORE </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

FormDescription.propTypes = {
  title: PropTypes.string.isRequired,
};

export default FormDescription;
