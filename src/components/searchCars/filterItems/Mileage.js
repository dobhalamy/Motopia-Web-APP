import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Slider, Typography } from '@material-ui/core';

import RangeInputChanger from 'utils/RangeInputChanger';
import FilterInput from '../filterCustomComponents/FilterInput';
import FilterCount from './FilterCount';

const styles = theme => ({
  sliderContainer: {
    padding: `${theme.spacing(1.25)}px ${theme.spacing(1.25)}px 0px`,
  },
  inputOutsideAdornment: {
    margin: `0px ${theme.spacing(0.75)}px`,
  },
});

class Mileage extends Component {
  MILEAGE_INPUT_PROPS = {
    min: this.props.defaultMileageRange[0],
    max: this.props.defaultMileageRange[1],
  };

  state = {
    mileageRange: this.props.mileageRange,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.mileageRange, this.props.mileageRange) ||
      !isEqual(nextProps.defaultMileageRange, this.props.defaultMileageRange) ||
      !isEqual(nextState.mileageRange, this.state.mileageRange)
    );
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(this.state.mileageRange, this.props.mileageRange) &&
      !isEqual(prevProps.mileageRange, this.props.mileageRange)
    ) {
      this.setState({
        mileageRange: this.props.mileageRange,
      });
    }
  }

  handleMileageRange = (_, range) => this.setState({ mileageRange: range });

  handleMileageRangeInput = inputLabel => event => {
    this.setState({ mileageRange: RangeInputChanger(inputLabel, this.props.mileageRange, event) });
  };

  handleOnBlur = () =>
    this.props.multipurposeFilterHandler('mileageRange')(null, this.state.mileageRange);

  render() {
    const { classes, defaultMileageRange } = this.props;
    const { mileageRange } = this.state;

    return (
      <Grid container direction="column" alignItems="center" wrap="nowrap">
        <Grid container item wrap="nowrap" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">Mileage</Typography>
          <FilterCount filterName="mileage" filterRange={defaultMileageRange} noMargin />
          <Grid container wrap="nowrap" alignItems="center" justifyContent="flex-end">
            <FilterInput
              value={mileageRange[0]}
              width={70}
              onChange={this.handleMileageRangeInput('min')}
              inputProps={this.MILEAGE_INPUT_PROPS}
              onBlur={this.handleOnBlur}
            />
            <span className={classes.inputOutsideAdornment}>-</span>
            <FilterInput
              value={mileageRange[1]}
              width={70}
              onChange={this.handleMileageRangeInput('max')}
              inputProps={this.MILEAGE_INPUT_PROPS}
              onBlur={this.handleOnBlur}
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="center">
          <Grid item container className={classes.sliderContainer}>
            <Slider
              value={mileageRange}
              min={defaultMileageRange[0]}
              max={defaultMileageRange[1]}
              valueLabelDisplay="off"
              onChange={this.handleMileageRange}
              onChangeCommitted={this.handleOnBlur}
            />
          </Grid>
          <Grid item container justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              {defaultMileageRange[0]}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {defaultMileageRange[1]}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Mileage.propTypes = {
  mileageRange: PropTypes.array.isRequired,
  defaultMileageRange: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(Mileage);
