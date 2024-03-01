import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

import { STANDARD_FEATURE_TYPE } from 'src/constants';
import ArrayItemToggler from 'utils/ArrayItemToggler';
import FilterCount from './FilterCount';

const styles = theme => ({
  selectorButton: {
    width: 175,
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
});

class StandardFeature extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.selectedStandardFeatureType, this.props.selectedStandardFeatureType);
  }

  setSelectedStandardFeatureType = selectedType => () =>
    this.props.multipurposeFilterHandler('selectedStandardFeatureType')(
      null,
      ArrayItemToggler(selectedType, this.props.selectedStandardFeatureType)
    );

  render() {
    const { classes, selectedStandardFeatureType } = this.props;
    return (
      <Grid className={classes.filterWrapper}>
        {STANDARD_FEATURE_TYPE.map(standardFeature => (
          <Grid container alignItems="center" justifyContent="space-between" key={standardFeature.type}>
            <Button
              variant="contained"
              className={classNames(
                classes.selectorButton,
                selectedStandardFeatureType.includes(standardFeature.type)
                  ? classes.isSelectedColor
                  : classes.unselectedColor
              )}
              onClick={this.setSelectedStandardFeatureType(standardFeature.type)}
            >
              {standardFeature.type}
            </Button>
            <FilterCount filterName="features" title={standardFeature.type}/>
          </Grid>
        ))}
      </Grid>
    );
  }
}

StandardFeature.propTypes = {
  selectedStandardFeatureType: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(StandardFeature);
