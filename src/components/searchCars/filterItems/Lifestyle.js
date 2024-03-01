import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

import { LIFESTYLE_TYPE } from 'src/constants';
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

class Lifestyle extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.selectedLifeStyleType, this.props.selectedLifeStyleType);
  }

  setSelectedLifeStyleType = selectedType => () =>
    this.props.multipurposeFilterHandler('selectedLifeStyleType')(
      null,
      ArrayItemToggler(selectedType, this.props.selectedLifeStyleType)
    );

  render() {
    const { classes, selectedLifeStyleType } = this.props;
    return (
      <Grid className={classes.filterWrapper}>
        {LIFESTYLE_TYPE.map(lifeStyle => (
          <Grid container alignItems="center" justifyContent="space-between" key={lifeStyle.type}>
            <Button
              variant="contained"
              className={classNames(
                classes.selectorButton,
                selectedLifeStyleType.includes(lifeStyle.type)
                  ? classes.isSelectedColor
                  : classes.unselectedColor
              )}
              onClick={this.setSelectedLifeStyleType(lifeStyle.type)}
            >
              {lifeStyle.type}
            </Button>
            <FilterCount filterName="lifeStyleCategory" title={lifeStyle.type}/>
          </Grid>
        ))}
      </Grid>
    );
  }
}

Lifestyle.propTypes = {
  selectedLifeStyleType: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(Lifestyle);
