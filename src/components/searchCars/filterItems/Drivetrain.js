import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';

import { VEHICLE_DRIVETRAIN_TYPE } from 'src/constants';
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
  },
  selectorTitle: {
    display: 'block',
    width: '100%',
    margin: `${theme.spacing(1)}px 0px`,
    '&:nth-of-type(2)': {
      marginTop: theme.spacing(2),
    },
  },
});

class Drivetrain extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.selectedDrivetrainType, this.props.selectedDrivetrainType);
  }

  setSelectedDrivetrainType = selectedType => () =>
    this.props.multipurposeFilterHandler('selectedDrivetrainType')(
      null,
      ArrayItemToggler(selectedType, this.props.selectedDrivetrainType)
    );

  render() {
    const { classes, selectedDrivetrainType } = this.props;
    return (
      <Grid container alignItems="flex-start" justifyContent="center">
        <Typography variant="body1" className={classes.selectorTitle}>
          Drivetrain
        </Typography>
        <Grid className={classes.filterWrapper}>
          {VEHICLE_DRIVETRAIN_TYPE.map(drivetrain => (
            <Grid container alignItems="center" justifyContent="space-between" key={drivetrain.type}>
              <Button
                variant="contained"
                className={classNames(
                  classes.selectorButton,
                  selectedDrivetrainType.includes(drivetrain.type)
                    ? classes.isSelectedColor
                    : classes.unselectedColor
                )}
                onClick={this.setSelectedDrivetrainType(drivetrain.type)}
              >
                {// eslint-disable-next-line no-nested-ternary
                  drivetrain.type === 'Rear Wheel Drive'
                    ? 'Rear Wheel'
                    : drivetrain.type === 'Front Wheel Drive'
                      ? 'Front Wheel'
                      : 'All Wheel'
                }
              </Button>
              <FilterCount filterName="drivetrain" title={drivetrain.type} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
}

Drivetrain.propTypes = {
  selectedDrivetrainType: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(Drivetrain);
