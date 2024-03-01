import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import { ListItem, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  customDotContainer: {
    width: 10,
    height: 10,
    padding: 0,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    background: '#857D70',
    borderRadius: 3,
    cursor: 'pointer',
    zIndex: 100,
    position: 'relative',
    '&:first-child, &:last-child': {
      width: 6,
      height: 6,
      borderRadius: '50%',
    },
  },
  activeCustomDotButton: {
    background: theme.palette.secondary.main,
  },
  pagination: {
    position: 'absolute',
    bottom: 0,
  },
}));

const CustomDots = ({
  onClick,
  active,
  index,
  carouselState,
  withPagination,
}) => {
  const classes = useStyles();

  const { totalItems } = carouselState;

  return (
    <>
      <ListItem
        classes={{
          root: classNames(
            classes.customDotContainer,
            active && classes.activeCustomDotButton
          ),
        }}
        onClick={onClick}
      />
      {withPagination && active && (
        <Typography variant="caption" className={classes.pagination}>
          {`${index + 1}/${totalItems}`}
        </Typography>
      )}
    </>
  );
};

CustomDots.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool,
  carouselState: PropTypes.object,
  index: PropTypes.number,
  withPagination: PropTypes.bool,
};

CustomDots.defaultProps = {
  onClick: noop,
  active: false,
  carouselState: {},
  index: 0,
  withPagination: false,
};

export default CustomDots;
