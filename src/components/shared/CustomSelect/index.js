import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  Select,
  InputLabel,
  Typography,
  Box,
  MenuItem,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  customSelectContainer: {
    height: 90,
    borderRadius: 5,
    border: `1px solid ${theme.palette.secondary.main}`,
    fontSize: theme.typography.pxToRem(15),
  },
  customSelect: {
    marginTop: theme.spacing(1.25),
  },
  customSelectInputLabel: {
    textTransform: 'uppercase',
    color: theme.palette.secondary.main,
    fontSize: theme.typography.pxToRem(15),
  },
  customSelectInputLowerLabel: {
    textTransform: 'none',
  },
  customSelectErrorMessage: {
    margin: `${theme.spacing(1)}px ${theme.spacing(1.75)}px 0`,
    display: 'block',
    color: theme.palette.error.main,
    lineHeight: '1em',
  },
  customSelectErrorBorder: {
    borderColor: '#FD151B',
  },
  customSelectClearBorder: {
    borderColor: 'transparent',
  },
  customSelectBigText: {
    fontSize: theme.typography.pxToRem(24),
  },
  customSelectMarginTop: {
    marginTop: theme.spacing(2),
  },
}));

const CustomSelect = ({
  name,
  label,
  options,
  value,
  onChange,
  clearBorder,
  withBigText,
  hasError,
  errorMessage,
  onBlur,
  disabled,
  placeholder,
  useLoading,
  loading,
  showLowerCaseLabel,
}) => {
  const classes = useStyles();
  const preloadArray = [1, 2, 3];
  return (
    <Box
      style={{
        height: 110,
        width: '100%',
      }}
    >
      <Box
        p={1.25}
        pt={2.5}
        className={classNames(classes.customSelectContainer, {
          [classes.customSelectErrorBorder]: hasError,
          [classes.customSelectClearBorder]: clearBorder,
        })}
      >
        <InputLabel
          shrink
          htmlFor={name}
          className={classNames(classes.customSelectInputLabel, {
            [classes.customSelectInputLowerLabel]: showLowerCaseLabel,
          })}
        >
          {label}
        </InputLabel>
        <Select
          displayEmpty
          inputProps={{
            id: name,
            className: classNames({
              [classes.customSelectBigText]: withBigText,
            }),
          }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          disableUnderline
          name={name}
          fullWidth
          className={classNames(classes.customSelect, {
            [classes.customSelectMarginTop]: withBigText,
          })}
          renderValue={selected => {
            if (selected.length === 0 && !!placeholder) {
              return (
                <span style={{ fontSize: 16, color: '#989898' }}>
                  {placeholder}
                </span>
              );
            }
            return selected;
          }}
        >
          {options.length > 0
            ? options.map(item => (
              <MenuItem
                key={item.value}
                value={item.value}
                disabled={item.disabled}
                className={item.disabled && classes.disabledPlaceholder}
              >
                {item.text}
              </MenuItem>
            ))
            : preloadArray.map(item => {
              if (useLoading) {
                return loading ? (
                  <MenuItem key={item} disabled style={{ opacity: 1 }}>
                    <Skeleton variant="text" width="100%" animation="wave" />
                  </MenuItem>
                ) : null;
              }
              return (
                <MenuItem key={item} disabled style={{ opacity: 1 }}>
                  <Skeleton variant="text" width="100%" animation="wave" />
                </MenuItem>
              );
            })}
        </Select>
      </Box>
      {hasError && (
        <Typography
          variant="caption"
          component="p"
          className={classes.customSelectErrorMessage}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

CustomSelect.defaultProps = {
  clearBorder: false,
  withBigText: false,
  hasError: false,
  errorMessage: '',
  onBlur: null,
  disabled: false,
  value: '',
  placeholder: null,
  useLoading: false,
  loading: false,
  showLowerCaseLabel: false,
};

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }).isRequired
  ).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  onChange: PropTypes.func.isRequired,
  clearBorder: PropTypes.bool,
  withBigText: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  useLoading: PropTypes.bool,
  loading: PropTypes.bool,
  showLowerCaseLabel: PropTypes.bool,
};

export default CustomSelect;
