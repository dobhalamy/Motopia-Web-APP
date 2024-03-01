import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import ArrowRightWhite from 'assets/arrow_right_white.svg';

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px ${theme.spacing(5)}px`,
    fontSize: theme.typography.pxToRem(15),
    textTransform: 'uppercase',
  },
  sizeBig: {
    height: 110,
    borderRadius: 3,
  },
  customPrimaryButtonIcon: {
    height: 'auto',
    width: 20,
    marginLeft: theme.spacing(2),
  },
  disabled: {
    background: 'rgba(9, 30, 66, 0.1) !important',
    color: '#4E4E51 !important',
    borderColor: 'rgba(9, 30, 66, 0.01) !important',
    // opacity: 0.7,
  },
}));

const CustomPrimaryButton = ({
  children,
  isLarge,
  withIcon,
  fullWidth,
  disabled,
  onClick,
  type,
  size,
  id,
}) => {
  const classes = useStyles();
  return (
    <Button
      id={id}
      color="primary"
      variant="contained"
      className={classNames(classes.root, {
        [classes.sizeBig]: isLarge,
        [classes.disabled]: disabled,
      })}
      type={type}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      size={size}
    >
      {children}
      {withIcon && (
        <img
          src={ArrowRightWhite}
          alt="arrow_right"
          className={classes.customPrimaryButtonIcon}
        />
      )}
    </Button>
  );
};

CustomPrimaryButton.defaultProps = {
  isLarge: false,
  withIcon: false,
  fullWidth: false,
  disabled: false,
  type: 'button',
  size: 'medium',
};

CustomPrimaryButton.propTypes = {
  children: PropTypes.string.isRequired,
  isLarge: PropTypes.bool,
  withIcon: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
  id: PropTypes.string.isRequired,
};

CustomPrimaryButton.defaultProps = {
  onClick: () => {},
};

export default CustomPrimaryButton;
