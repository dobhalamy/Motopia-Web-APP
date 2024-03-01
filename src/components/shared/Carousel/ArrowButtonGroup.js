import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';

import {
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  carouselButtonGroup: {
    position: 'absolute',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  carouselButtonContainer: {
    position: 'absolute',
    top: -20,
    bottom: 0,
    width: 60,
    alignItems: 'center',
  },
  carouselButton: {
    border: '1px solid #D5DDE2',
    minWidth: 40,
    maxWidth: 0,
    height: 60,
    display: 'flex',
    alignItems: 'center',
  },
  carouselPrevButton: {
    left: 0,
  },
  carouselNextButton: {
    right: 15,
  },
  arrows: {
    fontSize: 40,
    color: '#333',
  }
}));

const ArrowButtonGroup = ({ next, previous }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.carouselButtonGroup}>
      <Grid
        container
        className={classNames(
          classes.carouselButtonContainer,
          classes.carouselPrevButton
        )}
      >
        <Button
          onClick={() => previous()}
        >
          <KeyboardArrowLeftIcon className={classes.arrows}/>
        </Button>
      </Grid>
      <Grid
        container
        className={classNames(
          classes.carouselButtonContainer,
          classes.carouselNextButton
        )}
      >
        <Button
          onClick={() => next()}
        >
          <KeyboardArrowRightIcon className={classes.arrows}/>
        </Button>
      </Grid>
    </Grid>
  );
};

ArrowButtonGroup.propTypes = {
  next: PropTypes.func,
  previous: PropTypes.func,
};

ArrowButtonGroup.defaultProps = {
  next: noop,
  previous: noop,
};

export default ArrowButtonGroup;
