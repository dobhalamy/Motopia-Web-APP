import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { VEHICLE_PAGE_WIDTH } from './constants';

const useStyles = makeStyles(theme => ({
  tabsWrapper: {
    background: theme.palette.common.white,
    textAlign: 'right'
  },
  wrapper: {
    alignItems: 'flex-end',
  },
  mainInfoContainer: {
    maxWidth: VEHICLE_PAGE_WIDTH,
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    margin: 'auto',
  },
  tabsContainer: {
    // maxWidth: `calc(${VEHICLE_PAGE_WIDTH}px + 10px)`,
    width: '100%',
    margin: '0 auto',
    zIndex: 100,
  },
  flexContainer: {
    padding: '20px 5px 0',
  },
  homeTab: {
    backgroundColor: theme.palette.primary.contrastText,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    color: '#3C3B4A',
    fontSize: theme.typography.pxToRem(15),
    marginRight: 8,
    opacity: 1,
    '&:last-child': {
      marginRight: 0,
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto'
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
      fontSize: theme.typography.pxToRem(9),
    },
  },
  homeSelectedTab: {
    color: theme.palette.primary.contrastText,
    background: theme.palette.secondary.main,
    boxShadow: theme.shadows[2],
  },
}));

const labels = ['Information', 'Personal use details', 'Rideshare use details'];

const MainVehicleTabs = props => {
  const classes = useStyles();
  return (
    <Grid container justifyContent="center" className={classes.mainInfoContainer}>
      <Tabs
        TabIndicatorProps={{ style: { backgroundColor: 'transparent' } }}
        variant="fullWidth"
        className={classes.tabsContainer}
        classes={{ flexContainer: classes.flexContainer }}
        value={props.tab}
        onChange={props.handleChangeTab}
      >
        {labels.map(label =>
          <Tab
            key={label}
            label={label}
            classes={{
              root: classes.homeTab,
              selected: classes.homeSelectedTab,
            }}
          />)}
      </Tabs>
    </Grid>
  );
};

MainVehicleTabs.propTypes = {
  tab: PropTypes.number,
  handleChangeTab: PropTypes.func.isRequired,
};

MainVehicleTabs.defaultProps = {
  tab: 0,
};

export default MainVehicleTabs;
