import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { Button, Grid, Slider, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ArrayItemToggler from 'utils/ArrayItemToggler';
import RangeInputChanger from 'utils/RangeInputChanger';
import { VEHICLE_FUEL_TYPE } from 'src/constants';
import FilterInput from '../filterCustomComponents/FilterInput';
import FilterCount from './FilterCount';

const styles = theme => ({
  fuelTypeButton: {
    width: 150,
    height: 30,
    padding: 0,
    marginBottom: theme.spacing(1.25),
    fontSize: theme.typography.pxToRem(12),
  },
  defaultFuelTypeButton: {
    background: '#e6e8ef',
  },
  isSelectedFuelType: {
    background: theme.palette.error.main,
    '&:hover': {
      background: theme.palette.error.dark,
    },
  },
  sliderContainer: {
    padding: `0px ${theme.spacing(1.25)}px`,
  },
  inputOutsideAdornment: {
    margin: `0px ${theme.spacing(0.75)}px`,
  },
  filterWrapper: {
    width: 200,
  }
});

class FuelAndEfficiency extends Component {
  MPG_INPUT_PROPS = {
    min: this.props.defaultMpg[0],
    max: this.props.defaultMpg[1],
  };

  state = {
    mpg: this.props.mpg,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.selectedFuelType, this.props.selectedFuelType) ||
      !isEqual(nextProps.mpg, this.props.mpg) ||
      !isEqual(nextProps.defaultMpg, this.props.defaultMpg) ||
      !isEqual(nextState.mpg, this.state.mpg)
    );
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.state.mpg, this.props.mpg) && !isEqual(prevProps.mpg, this.props.mpg)) {
      this.setState({
        mpg: this.props.mpg,
      });
    }
  }

  setSelectedFuelType = selectedType => () => {
    this.props.multipurposeFilterHandler('selectedFuelType')(
      null,
      ArrayItemToggler(selectedType, this.props.selectedFuelType)
    );
  };

  handleMpgRangeInputs = inputLabel => event => {
    event.persist();
    this.setState(prevState => ({ mpg: RangeInputChanger(inputLabel, prevState.mpg, event) }));
  };

  handleMpgRange = (_, mpgRange) => this.setState({ mpg: mpgRange });

  render() {
    const { classes, defaultMpg, selectedFuelType } = this.props;
    const { mpg } = this.state;

    return (
      <Grid container alignItems="center" justifyContent="center" direction="column" spacing={2}>
        <Grid className={classes.filterWrapper}>
          {VEHICLE_FUEL_TYPE.map(fuel => (
            <Grid container alignItems="center" justifyContent="space-between" key={fuel.type}>
              <Button
                variant="contained"
                className={classNames(
                  classes.fuelTypeButton,
                  selectedFuelType.includes(fuel.type)
                    ? classes.isSelectedFuelType
                    : classes.defaultFuelTypeButton
                )}
                onClick={this.setSelectedFuelType(fuel.type)}
              >
                {fuel.title}
              </Button>
              <FilterCount filterName="fuelType" title={fuel.title}/>
            </Grid>
          ))}
        </Grid>
        <Grid container item wrap="nowrap" justifyContent="space-between" alignItems="center">
          <Grid item container wrap="nowrap" alignItems="center">
            <Typography variant="body1">MPG (Hwy)</Typography>
            <FilterCount filterName="mpg" filterRange={mpg} noMargin />
          </Grid>
          <Grid container wrap="nowrap" alignItems="center" justifyContent="flex-end">
            <FilterInput
              value={mpg[0]}
              width={50}
              onChange={this.handleMpgRangeInputs('min')}
              inputProps={this.MPG_INPUT_PROPS}
            />
            <span className={classes.inputOutsideAdornment}>-</span>
            <FilterInput
              value={mpg[1]}
              width={60}
              onChange={this.handleMpgRangeInputs('max')}
              inputProps={this.MPG_INPUT_PROPS}
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="center">
          <Grid item container className={classes.sliderContainer}>
            <Slider
              value={mpg}
              min={defaultMpg[0]}
              max={defaultMpg[1]}
              valueLabelDisplay="off"
              onChange={this.handleMpgRange}
              onChangeCommitted={this.props.multipurposeFilterHandler('mpg')}
            />
          </Grid>
          <Grid item container justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              {defaultMpg[0]}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {defaultMpg[1]}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

FuelAndEfficiency.propTypes = {
  selectedFuelType: PropTypes.array.isRequired,
  mpg: PropTypes.array.isRequired,
  defaultMpg: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(FuelAndEfficiency);
