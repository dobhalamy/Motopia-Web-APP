import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  tabTitle: {
    fontSize: theme.typography.pxToRem(28),
    textTransform: 'uppercase',
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(26),
      textAlign: 'center',
    },
  },
  summaryWrapper: {
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    minHeight: 300
  },
  vehicleDetailsContainer: {
    flexGrow: 1,
    maxWidth: 1200,
    margin: 'auto',
    padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

export default function UseTextTab(props) {
  const classes = useStyles();

  return (
    <Grid
      className={classes.vehicleDetailsContainer}
      container
      justifyContent="center"
      direction="column"
    >
      <Typography className={classes.tabTitle}>{props.title}</Typography>
      <Grid
        className={classes.summaryWrapper}
        item
        container
      >
        <Typography description={props.text.meta} variant="body1">{props.text.desc}</Typography>
      </Grid>
    </Grid>
  );
}

UseTextTab.propTypes = {
  text: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};
