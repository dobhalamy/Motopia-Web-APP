import React from 'react';
import PropTypes from 'prop-types';

import {
  DialogTitle,
  Dialog,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';

import { formatMoneyAmount } from 'utils/formatNumbersToLocale';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  AmountSaveDialog: {
    maxWidth: 876,
    maxHeight: 604,
    margin: 'auto',
    // override materail inline style
    zIndex: '1700 !important',
  },
  saveAmountDialogPaper: {
    paddingTop: theme.spacing(6),
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  resultFormBlueBox: {
    maxWidth: 285,
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
    margin: `0px auto ${theme.spacing(3)}px`,
    padding: `${theme.spacing(5)}px ${theme.spacing(2)}px`,
    color: theme.palette.common.white,
    width: 'inherit',
  },
}));

export default function AmountSaveDialog(props) {
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));

  const classes = useStyles();
  const { onCloseSaveAmountDialog, isOpenSaveAmountDialog } = props;

  const handleClose = () => {
    onCloseSaveAmountDialog();
  };

  return (
    <Dialog
      classes={{
        root: classes.AmountSaveDialog,
        paper: classes.saveAmountDialogPaper,
      }}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={isOpenSaveAmountDialog}
      fullScreen
    >
      <DialogTitle>
        <Typography component="span" variant="h4">
          Save your pre-approval?
        </Typography>
      </DialogTitle>
      <IconButton className={classes.closeButton} onClick={handleClose}>
        <Close />
      </IconButton>
      <Typography style={{ maxWidth: 600 }} align="center" variant="body1">
        If you want to save your approved amount for 30 days, please confirm.
      </Typography>
      <Box className={classes.resultFormBlueBox}>
        <Typography variant="body1" align="center" color="inherit" gutterBottom>
          Amount Approved
        </Typography>
        <Typography variant="h4" align="center" color="inherit">
          {formatMoneyAmount(props.amountApproved)}
        </Typography>
      </Box>
      <CustomPrimaryButton
        onClick={handleClose}
        withIcon
        isLarge={!matches}
        fullWidth
        id="save-and-process"
      >
        Save and proceed
      </CustomPrimaryButton>
    </Dialog>
  );
}

AmountSaveDialog.propTypes = {
  onCloseSaveAmountDialog: PropTypes.func.isRequired,
  isOpenSaveAmountDialog: PropTypes.bool.isRequired,
  amountApproved: PropTypes.number,
};

AmountSaveDialog.defaultProps = {
  amountApproved: 0,
};
