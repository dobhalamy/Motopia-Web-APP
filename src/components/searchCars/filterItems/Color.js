import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';

import { Check as CheckIcon } from '@material-ui/icons';

import { VEHICLE_EXTERIOR_COLORS, BORDER_COLOR } from 'src/constants';
import ArrayItemToggler from 'utils/ArrayItemToggler';
import OtherColorIcon from 'assets/otherColor.svg';
import FilterCount from './FilterCount';

const styles = theme => ({
  checkIcon: {
    width: 18,
    height: 18,
    marginRight: theme.spacing(0.5),
    color: theme.palette.error.main,
  },
  typeTitle: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  colorContainer: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  addBorder: {
    border: `1px solid ${BORDER_COLOR}`,
  },
  chosenColorBorder: {
    border: '1px solid #FD151B',
    boxSizing: 'content-box',
    width: 27,
  },
});

class Color extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(nextProps.selectedColors, this.props.selectedColors) ||
      !isEqual(nextProps.availableVehicleColors, this.props.availableVehicleColors)
    );
  }

  setSelectedColors = selectedType => () =>
    this.props.multipurposeFilterHandler('selectedColors')(
      null,
      ArrayItemToggler(selectedType, this.props.selectedColors)
    );

  render() {
    const { classes, selectedColors, availableVehicleColors } = this.props;
    const filterName = 'exteriorColor';
    return (
      <Grid>
        {VEHICLE_EXTERIOR_COLORS.filter(exteriorColor =>
          availableVehicleColors.includes(exteriorColor.constant)
        ).map(exteriorColor => (
          <Button
            fullWidth
            key={exteriorColor.constant}
            style={{ textTransform: 'none' }}
            onClick={this.setSelectedColors(exteriorColor.constant)}
          >
            <Grid container alignItems="center" justifyContent="space-between" wrap="nowrap">
              {selectedColors.includes(exteriorColor.constant) ? (
                <Grid item container alignItems="center">
                  <CheckIcon className={classes.checkIcon} />
                  <Typography color="error" variant="body1" className={classes.typeTitle}>
                    {exteriorColor.title}
                    <FilterCount filterName={filterName} title={exteriorColor.title.toUpperCase()}/>
                  </Typography>
                </Grid>
              ) : (
                <Typography variant="body1" className={classes.typeTitle}>
                  {exteriorColor.title}
                  <FilterCount filterName={filterName} title={exteriorColor.title.toUpperCase()} />
                </Typography>
              )}
              {exteriorColor.constant === 'OTHER' ? (
                <Grid
                  item
                  className={classNames(
                    classes.colorContainer,
                    selectedColors.includes(exteriorColor.constant) && classes.chosenColorBorder
                  )}
                  style={{ backgroundImage: `url(${OtherColorIcon})` }}
                />
              ) : (
                <Grid
                  item
                  className={classNames(
                    classes.colorContainer,
                    exteriorColor.constant === 'WHITE' && classes.addBorder,
                    selectedColors.includes(exteriorColor.constant) && classes.chosenColorBorder
                  )}
                  style={{ background: exteriorColor.colorCode }}
                />
              )}
            </Grid>
          </Button>
        ))}
      </Grid>
    );
  }
}

Color.propTypes = {
  selectedColors: PropTypes.array.isRequired,
  availableVehicleColors: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(Color);
