import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';

import CarIcons from 'assets/cars';
import ArrayItemToggler from 'utils/ArrayItemToggler';
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
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  spanTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(0.5),
  }
});

class BodyType extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.selectedBodyTypes, this.props.selectedBodyTypes) ||
    !isEqual(nextProps.availableBodyTypes, this.props.availableBodyTypes);
  }

  setSelectedBodyType = selectedType => () =>
    this.props.multipurposeFilterHandler('selectedBodyTypes')(
      null,
      ArrayItemToggler(selectedType, this.props.selectedBodyTypes)
    );

  render() {
    const { classes, selectedBodyTypes, availableBodyTypes } = this.props;
    const filterType = 'carBody';
    return (
      <Grid>
        {availableBodyTypes.map(bodyType => {
          const BodyTypeIcon = CarIcons[bodyType.title.toUpperCase()];
          return (
            <Button
              fullWidth
              key={bodyType.title}
              style={{ textTransform: 'none' }}
              onClick={this.setSelectedBodyType(bodyType.title)}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                wrap="nowrap"
                style={{ marginRight: 5 }}
              >
                {selectedBodyTypes.includes(bodyType.title) ? (
                  <Grid item container alignItems="center">
                    <CheckIcon className={classes.checkIcon} />
                    <Typography color="error" variant="body1" className={classes.typeTitle}>
                      <span className={classes.spanTitle}>{bodyType.title}</span>
                      <FilterCount filterName={filterType} title={bodyType.title} />
                    </Typography>
                  </Grid>
                ) : (
                  <Typography variant="body1" className={classes.typeTitle}>
                    <span className={classes.spanTitle}>{bodyType.title}</span>
                    <FilterCount filterName={filterType} title={bodyType.title} />
                  </Typography>
                )}
                {BodyTypeIcon &&
                <Grid item>
                  <BodyTypeIcon />
                </Grid>}
              </Grid>
            </Button>
          );
        })}
      </Grid>
    );
  }
}

BodyType.propTypes = {
  selectedBodyTypes: PropTypes.array.isRequired,
  availableBodyTypes: PropTypes.array.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(BodyType);
