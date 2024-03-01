import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';

import LeftArrow from 'src/assets/arrow_left_lightblue.svg';
import RightArrow from 'src/assets/arrow_right_lightblue.svg';

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
    top: 0,
    bottom: 0,
    width: 60,
    alignItems: 'center',
  },
  carouselButton: {
    border: '1px solid #D5DDE2',
    width: 60,
    maxWidth: 0,
    height: 60,
    display: 'flex',
    alignItems: 'center',
  },
  carouselPrevButton: {
    left: -65,
  },
  carouselNextButton: {
    right: -65,
  },
}));

const SquareButtonGroup = ({ next, previous }) => {
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
          classes={{ root: classes.carouselButton }}
          onClick={() => previous()}
        >
          <img src={LeftArrow} alt="arrow button" />
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
          classes={{ root: classes.carouselButton }}
          onClick={() => next()}
        >
          <img src={RightArrow} alt="arrow button" />
        </Button>
      </Grid>
    </Grid>
  );
};

SquareButtonGroup.propTypes = {
  next: PropTypes.func,
  previous: PropTypes.func,
};

SquareButtonGroup.defaultProps = {
  next: noop,
  previous: noop,
};

export default SquareButtonGroup;
