import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';

import { VEHICLE_CYLINDER_AMOUNT } from 'src/constants';
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
  selectorTitle: {
    display: 'block',
    width: '100%',
    margin: `${theme.spacing(1)}px 0px`,
    '&:nth-of-type(2)': {
      marginTop: theme.spacing(2),
    },
  },
  filterWrapper: {
    width: 200,
  }
});

class Engine extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(nextProps.selectedCylindersAmount, this.props.selectedCylindersAmount)
    );
  }

  setSelectedCylindersAmount = selectedType => () =>
    this.props.multipurposeFilterHandler('selectedCylindersAmount')(
      null,
      ArrayItemToggler(selectedType, this.props.selectedCylindersAmount)
    );

  render() {
    const { classes, selectedCylindersAmount } = this.props;
    return (
      <Grid container alignItems="flex-start" justifyContent="center">
        <Typography variant="body1" className={classes.selectorTitle}>
          Cylinders
        </Typography>
        <Grid
          className={classes.filterWrapper}
          item
          container
          alignItems="center"
          justifyContent="space-between"
        >
          {VEHICLE_CYLINDER_AMOUNT.map(cylinder => (
            <Grid container alignItems="center" justifyContent="space-between" key={cylinder.type}>
              <Button
                variant="contained"
                className={classNames(
                  classes.selectorButton,
                  selectedCylindersAmount.includes(cylinder.type)
                    ? classes.isSelectedColor
                    : classes.unselectedColor
                )}
                onClick={this.setSelectedCylindersAmount(cylinder.type)}
              >
                {cylinder.title}
              </Button>
              <FilterCount filterName="cylinder" title={cylinder.title}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
}

Engine.propTypes = {
  selectedCylindersAmount: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(Engine);
