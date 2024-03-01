import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

import ArrayItemToggler from 'utils/ArrayItemToggler';
import FilterCount from './FilterCount';

const styles = theme => ({
  selectorButton: {
    width: 150,
    height: 30,
    padding: 0,
    marginBottom: theme.spacing(1.25),
    fontSize: theme.typography.pxToRem(12),
  },
  unselectedColor: {
    background: '#e6e8ef',
  },
  isSelectedColor: {
    background: theme.palette.error.main,
    '&:hover': {
      background: theme.palette.error.dark,
    },
  },
  filterWrapper: {
    width: 200,
  }
});

class RideShare extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(nextProps.selectedRideShareType, this.props.selectedRideShareType) ||
      !isEqual(nextProps.listOfRDSCategory, this.props.listOfRDSCategory));
  }

  setSelectedRideShareType = selectedType => {
    this.props.multipurposeFilterHandler('selectedRideShareType')(
      null,
      ArrayItemToggler(selectedType, this.props.selectedRideShareType)
    );
  }

  render() {
    const { classes, selectedRideShareType, listOfRDSCategory } = this.props;

    return (
      <Grid className={classes.filterWrapper}>
        {listOfRDSCategory.length && listOfRDSCategory.map(rideShare => (
          <Grid container alignItems="center" justifyContent="space-between" key={rideShare}>
            <Button
              variant="contained"
              className={classNames(
                classes.selectorButton,
                selectedRideShareType.includes(rideShare)
                  ? classes.isSelectedColor
                  : classes.unselectedColor
              )}
              onClick={() => this.setSelectedRideShareType(rideShare)}
            >
              {rideShare}
            </Button>
            <FilterCount filterName="rideShareCategory" title={rideShare} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

RideShare.propTypes = {
  selectedRideShareType: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
  listOfRDSCategory: PropTypes.array.isRequired,
};

export default withStyles(styles)(RideShare);
