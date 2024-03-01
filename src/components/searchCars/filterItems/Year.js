import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Slider, Grid, Typography } from '@material-ui/core';

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

class Year extends Component {
  YEAR_INPUT_PROPS = {
    min: this.props.defaultYearRange[0],
    max: this.props.defaultYearRange[1],
  };

  state = {
    yearRange: this.props.yearRange,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.yearRange, this.props.yearRange) ||
      !isEqual(nextProps.defaultYearRange, this.props.defaultYearRange) ||
      !isEqual(nextState.yearRange, this.state.yearRange)
    );
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(this.state.yearRange, this.props.yearRange) &&
      !isEqual(prevProps.yearRange, this.props.yearRange)
    ) {
      this.setState({
        yearRange: this.props.yearRange,
      });
    }
  }

  handleYearRangeInputs = inputLabel => event => {
    event.persist();
    this.setState({ yearRange: RangeInputChanger(inputLabel, this.props.yearRange, event) });
  };

  handleYearRangeSlider = (_, yearRange) => this.setState({ yearRange });

  handleOnBlur = () =>
    this.props.multipurposeFilterHandler('yearRange')(null, this.state.yearRange);

  render() {
    const { classes, defaultYearRange } = this.props;
    const { yearRange } = this.state;

    return (
      <Grid container direction="column" alignItems="center" wrap="nowrap">
        <Grid container item wrap="nowrap" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">Year</Typography>
          <FilterCount filterName="carYear" filterRange={this.props.defaultYearRange} noMargin />
          <Grid container wrap="nowrap" alignItems="center" justifyContent="flex-end">
            <FilterInput
              value={yearRange[0]}
              width={60}
              inputProps={this.YEAR_INPUT_PROPS}
              onChange={this.handleYearRangeInputs('min')}
              onBlur={this.handleOnBlur}
            />
            <span className={classes.inputOutsideAdornment}>-</span>
            <FilterInput
              value={yearRange[1]}
              width={60}
              inputProps={this.YEAR_INPUT_PROPS}
              onChange={this.handleYearRangeInputs('max')}
              onBlur={this.handleOnBlur}
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justifyContent="center">
          <Grid item container className={classes.sliderContainer}>
            <Slider
              value={yearRange}
              min={defaultYearRange[0]}
              max={defaultYearRange[1]}
              valueLabelDisplay="off"
              onChange={this.handleYearRangeSlider}
              onChangeCommitted={this.handleOnBlur}
            />
          </Grid>
          <Grid item container justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              {defaultYearRange[0]}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {defaultYearRange[1]}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

Year.propTypes = {
  yearRange: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
  defaultYearRange: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(Year);
