import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

import { VEHICLE_SEATS } from 'src/constants';
import ArrayItemToggler from 'utils/ArrayItemToggler';
import FilterCount from './FilterCount';

const styles = theme => ({
  seatingButton: {
    width: 150,
    height: 30,
    padding: 0,
    marginBottom: theme.spacing(1.25),
    fontSize: theme.typography.pxToRem(12),
  },
  defaultSeatColor: {
    background: '#e6e8ef',
  },
  selectedSeatColor: {
    background: theme.palette.error.main,
    '&:hover': {
      background: theme.palette.error.dark,
    },
  },
  filterWrapper: {
    width: 200,
  }
});

class Seating extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.selectedSeatAmount, this.props.selectedSeatAmount);
  }

  setSelectedSeatAmount = selectedType => () =>
    this.props.multipurposeFilterHandler('selectedSeatAmount')(
      null,
      ArrayItemToggler(selectedType, this.props.selectedSeatAmount)
    );

  render() {
    const { classes, selectedSeatAmount } = this.props;
    return (
      <Grid className={classes.filterWrapper}>
        {VEHICLE_SEATS.map(seat => (
          <Grid container alignItems="center" justifyContent="space-between" key={seat}>
            <Button
              variant="contained"
              className={classNames(
                classes.seatingButton,
                selectedSeatAmount.includes(seat)
                  ? classes.selectedSeatColor
                  : classes.defaultSeatColor
              )}
              onClick={this.setSelectedSeatAmount(seat)}
            >
              {seat}
            </Button>
            <FilterCount filterName="seating" title={seat}/>
          </Grid>
        ))}
      </Grid>
    );
  }
}

Seating.propTypes = {
  selectedSeatAmount: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(Seating);
