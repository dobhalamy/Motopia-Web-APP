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
    bottom: 0,
    right: 0,
    left: 0,
    maxWidth: 500,
    flexWrap: 'nowrap',
    margin: '0 auto',
    height: 70,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  carouselButton: {
    padding: `0px ${theme.spacing(3)}px`,
    zIndex: 20,
  },
  arrows: {
    margin: `0px ${theme.spacing(1.25)}px`,
  },
}));

const BottomArrowsButtonGroup = ({ next, previous }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.carouselButtonGroup}>
      <Grid
        container
        className={classNames(
          classes.carouselButtonContainer,
          classes.carouselPrevButton
        )}
        alignItems="center"
      >
        <Button
          classes={{ root: classes.carouselButton }}
          onClick={() => previous()}
          color="secondary"
        >
          <img className={classes.arrows} src={LeftArrow} alt="arrow button" />
          Prev
        </Button>
      </Grid>
      <Grid
        container
        className={classNames(
          classes.carouselButtonContainer,
          classes.carouselNextButton
        )}
        justifyContent="flex-end"
        alignItems="center"
      >
        <Button
          classes={{ root: classes.carouselButton }}
          onClick={() => next()}
          color="secondary"
        >
          Next
          <img className={classes.arrows} src={RightArrow} alt="arrow button" />
        </Button>
      </Grid>
    </Grid>
  );
};

BottomArrowsButtonGroup.propTypes = {
  next: PropTypes.func,
  previous: PropTypes.func,
};

BottomArrowsButtonGroup.defaultProps = {
  next: noop,
  previous: noop,
};

export default BottomArrowsButtonGroup;
