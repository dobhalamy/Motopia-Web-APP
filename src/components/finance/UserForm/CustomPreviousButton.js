import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import ArrowLeftBlueIcon from 'assets/arrow_left_blue.svg';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  customPreviousButton: {
    height: 60,
    border: 0,
    padding: `${theme.spacing(2)}px ${theme.spacing(5)}px`,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.secondary.main,
    [theme.breakpoints.only('xs')]: {
      padding: `${theme.spacing(2)}px 0px`,
    },
  },
  customPreviousIcon: {
    marginRight: theme.spacing(1.25),
  },
  disabled: {
    background: 'rgba(9, 30, 66, 0.1) !important',
    color: '#4E4E51 !important',
    borderColor: 'rgba(9, 30, 66, 0.01) !important',
  },
}));

const CustomPreviousButton = ({ onClick, disabled }) => {
  const classes = useStyles();

  return (
    <Button
      className={classNames(classes.customPreviousButton, {
        [classes.disabled]: disabled,
      })}
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
    >
      <img
        className={classes.customPreviousIcon}
        src={ArrowLeftBlueIcon}
        alt="arrow_left_blue"
      />
      Previous
    </Button>
  );
};

CustomPreviousButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
CustomPreviousButton.defaultProps = {
  disabled: false,
};

export default CustomPreviousButton;
