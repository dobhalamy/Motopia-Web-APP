import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Slider, Typography } from '@material-ui/core';
// NOTE: uncomment after functionality is done
// import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
// import Icon from '@material-ui/core/Icon';

// import PlayIcon from '@material-ui/icons/PlayArrow';

import CalculatorIcon from 'assets/calculator.svg';

import RangeInputChanger from 'utils/RangeInputChanger';
import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
import FilterInput from '../filterCustomComponents/FilterInput';
import FilterCount from './FilterCount';

const styles = theme => ({
  monthlyPriceContainer: {
    margin: `${theme.spacing(3)}px 0px`,
  },
  sliderContainer: {
    padding: `${theme.spacing(1.25)}px ${theme.spacing(1.25)}px 0px`,
  },
  inputOutsideAdornment: {
    margin: `0px ${theme.spacing(0.75)}px`,
  },
  cashDownAmount: {
    color: '#3C3B4A',
    fontSize: theme.typography.pxToRem(13),
  },
  estimatesTitle: {
    fontSize: theme.typography.pxToRem(13),
    margin: `${theme.spacing(1)}px 0px ${theme.spacing(2.5)}px`,
    textAlign: 'center',
  },
  personalFinancingContainer: {
    height: 80,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculator: {
    width: 36,
    height: 52,
    marginLeft: theme.spacing(2),
    backgroundImage: `url(${CalculatorIcon})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  personalFinancingButton: {
    height: '100%',
    width: 25,
    backgroundColor: theme.palette.primary.main,
  },
  playIcon: {
    width: 14,
    height: 14,
    color: theme.palette.common.white,
  },
});

class PriceAndFinancingFilter extends React.Component {
  PRICE_INPUT_PROPS = {
    min: this.props.defaultMinCarPrice,
    max: this.props.defaultMaxCarPrice,
  };

  state = {
    carPriceRange: this.props.carPriceRange,
    monthlyPaymentRange: this.props.monthlyPaymentRange,
    cashDownPaymentRange: this.props.cashDownPaymentRange,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.carPriceRange, this.props.carPriceRange) ||
      !isEqual(nextProps.monthlyPaymentRange, this.props.monthlyPaymentRange) ||
      !isEqual(nextProps.cashDownPaymentRange, this.props.cashDownPaymentRange) ||
      nextProps.defaultMinCarPrice !== this.props.defaultMinCarPrice ||
      nextProps.defaultMaxCarPrice !== this.props.defaultMaxCarPrice ||
      nextProps.defaultMinMonthPrice !== this.props.defaultMinMonthPrice ||
      nextProps.defaultMaxMonthPrice !== this.props.defaultMaxMonthPrice ||
      nextProps.defaultMinDownPrice !== this.props.defaultMinDownPrice ||
      nextProps.defaultMaxDownPrice !== this.props.defaultMaxDownPrice ||
      !isEqual(nextState.carPriceRange, this.state.carPriceRange) ||
      !isEqual(nextState.monthlyPaymentRange, this.state.monthlyPaymentRange) ||
      !isEqual(nextState.cashDownPaymentRange, this.state.cashDownPaymentRange)
    );
  }

  componentDidUpdate(prevProps) {
    if (
      (!isEqual(this.state.carPriceRange, this.props.carPriceRange) &&
        !isEqual(prevProps.carPriceRange, this.props.carPriceRange)) ||
      (!isEqual(this.state.monthlyPaymentRange, this.props.monthlyPaymentRange) &&
        !isEqual(prevProps.monthlyPaymentRange, this.props.monthlyPaymentRange)) ||
      (!isEqual(this.state.cashDownPaymentRange, this.props.cashDownPaymentRange) &&
        !isEqual(prevProps.cashDownPaymentRange, this.props.cashDownPaymentRange))
    ) {
      this.setState({
        carPriceRange: this.props.carPriceRange,
        monthlyPaymentRange: this.props.monthlyPaymentRange,
        cashDownPaymentRange: this.props.cashDownPaymentRange,
      });
    }
  }

  handleCarPriceInputs = inputLabel => event => {
    event.persist();
    this.setState(prevState => ({
      carPriceRange: RangeInputChanger(
        inputLabel,
        prevState.carPriceRange,
        event
      ),
    }));
  };

  handleMonthlyPaymentInput = inputLabel => event => {
    event.persist();
    this.setState(prevState => ({
      monthlyPaymentRange: RangeInputChanger(
        inputLabel,
        prevState.monthlyPaymentRange,
        event
      ),
    }));
  };

  handleFilterSliders = sliderLabel => (_, sliderValue) =>
    this.setState({ [sliderLabel]: sliderValue });

  handleFilterOnBlur = label => () => {
    this.props.multipurposeFilterHandler(label)(null, this.state[label]);
  };

  render() {
    const { classes,
      defaultMinCarPrice,
      defaultMaxCarPrice,
      // defaultMinMonthPrice,
      // defaultMaxMonthPrice,
      // defaultMinDownPrice,
      // defaultMaxDownPrice
    } = this.props;
    const { carPriceRange,
      // monthlyPaymentRange,
      // cashDownPaymentRange
    } = this.state;

    return (
      <Grid container direction="column" alignItems="center" wrap="nowrap">
        {/* Vehicle Price */}
        <Grid container direction="column" alignItems="center" wrap="nowrap">
          <Grid
            container
            item
            wrap="nowrap"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">Price</Typography>
            <FilterCount filterName="listPrice" filterRange={carPriceRange} noMargin />
            <Grid
              container
              wrap="nowrap"
              alignItems="center"
              justifyContent="flex-end"
            >
              <FilterInput
                isMoneyInput
                value={carPriceRange[0]}
                inputProps={this.PRICE_INPUT_PROPS}
                onChange={this.handleCarPriceInputs('min')}
                onBlur={this.handleFilterOnBlur('carPriceRange')}
              />
              <span className={classes.inputOutsideAdornment}>-</span>
              <FilterInput
                isMoneyInput
                value={carPriceRange[1]}
                inputProps={this.PRICE_INPUT_PROPS}
                onChange={this.handleCarPriceInputs('max')}
                onBlur={this.handleFilterOnBlur('carPriceRange')}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="center" justifyContent="center">
            <Grid item container className={classes.sliderContainer}>
              <Slider
                value={carPriceRange}
                min={defaultMinCarPrice}
                max={defaultMaxCarPrice}
                valueLabelDisplay="off"
                step={50}
                onChange={this.handleFilterSliders('carPriceRange')}
                onChangeCommitted={this.handleFilterOnBlur('carPriceRange')}
              />
            </Grid>
            <Grid item container justifyContent="space-between">
              <Typography variant="body2" color="textSecondary">
                {formatMoneyAmount(defaultMinCarPrice)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatMoneyAmount(defaultMaxCarPrice)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* NOTE: Uncomment after implementing functionality */}
        {/* Monthly Payment */}
        {/* <Grid
          className={classes.monthlyPriceContainer}
          container
          direction="column"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid
            container
            item
            wrap="nowrap"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={6}>
              <Typography variant="body1">Monthly Payment</Typography>
            </Grid>
            <Grid
              item
              xs={6}
              container
              wrap="nowrap"
              alignItems="center"
              justifyContent="flex-end"
            >
              <span className={classes.inputOutsideAdornment}>{'<'}</span>
              <FilterInput
                isMoneyInput
                value={monthlyPaymentRange[1]}
                onChange={this.handleMonthlyPaymentInput('monthlyPaymentRange')}
                onBlur={this.handleFilterOnBlur('monthlyPaymentRange')}
              />
            </Grid>
          </Grid>
          <Grid item container alignItems="center" justifyContent="center">
            <Grid item container className={classes.sliderContainer}>
              <Slider
                value={monthlyPaymentRange}
                min={defaultMinMonthPrice}
                max={defaultMaxMonthPrice}
                valueLabelDisplay="off"
                step={5}
                onChange={this.handleFilterSliders('monthlyPaymentRange')}
                onChangeCommitted={this.handleFilterOnBlur('monthlyPaymentRange')}
              />
            </Grid>
            <Grid item container justifyContent="space-between">
              <Typography variant="body2" color="textSecondary">
                {formatMoneyAmount(defaultMinMonthPrice)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatMoneyAmount(defaultMaxMonthPrice)}
              </Typography>
            </Grid>
          </Grid>
        </Grid> */}

        {/* Cash Down payment */}
        {/* <Grid container direction="column" alignItems="center" wrap="nowrap">
          <Grid
            container
            item
            wrap="nowrap"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">Cash Down</Typography>
            <Typography className={classes.cashDownAmount}>
              {formatMoneyAmount(cashDownPaymentRange[1])}
            </Typography>
          </Grid>
          <Grid item container alignItems="center" justifyContent="center">
            <Grid item container className={classes.sliderContainer}>
              <Slider
                value={cashDownPaymentRange}
                min={defaultMinDownPrice}
                max={defaultMaxDownPrice}
                valueLabelDisplay="off"
                step={5}
                onChange={this.handleFilterSliders('cashDownPaymentRange')}
                onChangeCommitted={this.handleFilterOnBlur('cashDownPaymentRange')}
              />
            </Grid>
            <Grid item container justifyContent="space-between">
              <Typography variant="body2" color="textSecondary">
                {formatMoneyAmount(defaultMinDownPrice)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatMoneyAmount(defaultMaxDownPrice)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Typography className={classes.estimatesTitle}>
          Estimates calculated using 780 Vantage Score, $80k income, & 72
          mo.loan term
        </Typography>
        <Button fullWidth style={{ padding: 0 }} onClick={this.props.handlePersonalFinancing}>
          <Paper className={classes.personalFinancingContainer}>
            <Icon className={classes.calculator} />
            <Grid container direction="column" wrap="nowrap">
              <Typography variant="button">Personal Financing</Typography>
              <Typography variant="caption" style={{ color: '#857D70' }}>
                Get your personal <br /> financing terms now
              </Typography>
            </Grid>
            <Grid
              className={classes.personalFinancingButton}
              container
              alignItems="center"
              justifyContent="center"
            >
              <PlayIcon className={classes.playIcon} />
            </Grid>
          </Paper>
        </Button> */}
      </Grid>
    );
  }
}

PriceAndFinancingFilter.propTypes = {
  carPriceRange: PropTypes.array.isRequired,
  defaultMinCarPrice: PropTypes.number.isRequired,
  defaultMaxCarPrice: PropTypes.number.isRequired,
  monthlyPaymentRange: PropTypes.array.isRequired,
  defaultMinMonthPrice: PropTypes.number.isRequired,
  defaultMaxMonthPrice: PropTypes.number.isRequired,
  cashDownPaymentRange: PropTypes.array.isRequired,
  defaultMinDownPrice: PropTypes.number.isRequired,
  defaultMaxDownPrice: PropTypes.number.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
  // handlePersonalFinancing: PropTypes.func.isRequired,
  // NOTE: uncomment after implementing functionality
};

export default withStyles(styles, { withTheme: true })(PriceAndFinancingFilter);
