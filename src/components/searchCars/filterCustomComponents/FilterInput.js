import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';

import { FILTERS_BACKGROUND_COLOR } from 'src/constants';

const styles = theme => ({
  textFieldRoot: {
    height: '100%',
    color: '#3C3B4A',
    background: FILTERS_BACKGROUND_COLOR,
  },
  inputRoot: {
    padding: 0,
    height: '100%',
    fontSize: theme.typography.pxToRem(13),
  },
  outlineInput: {
    borderColor: 'rgba(68, 104, 124, 0.3)',
    borderRadius: 5,
  },
  inputAdornment: {
    margin: theme.spacing(1),
  },
  inputAdornmentText: {
    fontSize: theme.typography.pxToRem(13),
  },
});

const FilterInput = ({
  value,
  onChange,
  onBlur,
  classes,
  width,
  height,
  startAdornment,
  isMoneyInput,
  inputProps,
}) => (
  <TextField
    style={{ width, height }}
    className={classes.textFieldRoot}
    onChange={onChange}
    onBlur={onBlur}
    value={value}
    margin="none"
    variant="outlined"
    InputProps={{
      classes: { root: classes.inputRoot, notchedOutline: classes.outlineInput },
      startAdornment: isMoneyInput ? (
        <InputAdornment position="start" className={classes.inputAdornment}>
          <Typography className={classes.inputAdornmentText}>$</Typography>
        </InputAdornment>
      ) : (
        startAdornment
      ),
      inputProps,
    }}
  />
);

FilterInput.defaultProps = {
  height: 32,
  width: 78,
  startAdornment: null,
  isMoneyInput: false,
  value: 0,
  inputProps: {},
  onBlur: null,
};

FilterInput.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  startAdornment: PropTypes.node,
  isMoneyInput: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.any,
  inputProps: PropTypes.object,
};

export default withStyles(styles)(FilterInput);
