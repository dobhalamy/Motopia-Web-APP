import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';

import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CustomPhoneMask from '../CustomPhoneMask';
import CustomSsnMask from './CustomSsnMask';

const useStyles = makeStyles(theme => ({
  labelInput: {
    marginTop: theme.spacing(2),
  },
  noLabelMargin: {
    marginTop: '0',
  },
  notchedOutline: {
    borderColor: `${theme.palette.secondary.main} !important`,
  },
  inputMultiline: {
    height: '140px !important',
    overflowY: 'auto !important',
    padding: 0,
    marginTop: theme.spacing(2.5),
  },
}));

export default function CustomInput({
  height,
  hasError,
  name,
  errorMessage,
  endAdornment,
  onChange,
  startAdornment,
  withPhoneMask,
  withSsnMask,
  value,
  // NOTE: we need rest operator here for Formik forms
  ...props
}) {
  const classes = useStyles();

  return (
    <>
      {(withPhoneMask || withSsnMask) && (
        <TextField
          variant={props.variant}
          name={name}
          value={value}
          onChange={onChange}
          style={{ height: height + 20 }}
          InputLabelProps={{
            classes: {
              root: value === '' && classes.labelInput,
              focused: classes.noLabelMargin,
            },
          }}
          InputProps={{
            classes: {
              notchedOutline: classNames(!hasError && classes.notchedOutline),
            },
            style: {
              height,
            },
            inputComponent: withPhoneMask ? CustomPhoneMask : CustomSsnMask,
          }}
          helperText={hasError && errorMessage}
          error={hasError}
          {...props}
        />
      )}

      {!withPhoneMask && !withSsnMask && (
        <TextField
          variant={props.variant}
          name={name}
          value={String(value)}
          onChange={onChange}
          style={{ height: height + 20 }}
          InputLabelProps={{
            classes: {
              root: value === '' && classes.labelInput,
              focused: classes.noLabelMargin,
            },
          }}
          InputProps={{
            classes: {
              notchedOutline: classNames(!hasError && classes.notchedOutline),
              inputMultiline: classes.inputMultiline,
            },
            style: {
              height,
            },
            endAdornment,
            startAdornment,
          }}
          helperText={hasError && errorMessage}
          error={hasError}
          {...props}
        />
      )}
    </>
  );
}

CustomInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string,
  height: PropTypes.number,
  hasError: PropTypes.bool,
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  endAdornment: PropTypes.node,
  startAdornment: PropTypes.node,
  onChange: PropTypes.func,
  withPhoneMask: PropTypes.bool,
  withSsnMask: PropTypes.bool,
  variant: PropTypes.string,
};

CustomInput.defaultProps = {
  height: 90,
  label: '',
  hasError: false,
  name: '',
  onChange: noop,
  errorMessage: '',
  endAdornment: null,
  startAdornment: null,
  withPhoneMask: false,
  withSsnMask: false,
  variant: 'outlined',
};
