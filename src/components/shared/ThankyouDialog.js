import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import MessageIcon from 'assets/homepage/message.svg';

import { BORDER_COLOR } from 'src/constants';
import SocialMediaButtons from 'components/shared/SocialMediaButtons';

const useStyles = makeStyles(theme => ({
  dialogContainer: {
    width: 450,
  },
  titleContainer: {
    background: theme.palette.secondary.main,
    padding: theme.spacing(2.5),
  },
  dialogTitleText: {
    textTransform: 'uppercase',
    color: theme.palette.common.white,
    letterSpacing: '0.05rem',
    fontWeight: 300,
  },
  messageIcon: {
    width: 30,
    height: 30,
    backgroundImage: `url(${MessageIcon})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    margin: `${theme.spacing(2)}px 0px ${theme.spacing(1)}px`,
  },
  contentContainer: {
    padding: `0px ${theme.spacing(2)}px`,
    height: '100%',
  },
  contentContainerMessage: {
    padding: `${theme.spacing(3)}px 0px ${theme.spacing(4)}px `,
    borderBottom: `1px solid ${BORDER_COLOR}`,
  },
  textSpacing: {
    margin: `${theme.spacing(1.5)}px 0px`,
  },
  contentContainerLink: {
    padding: `${theme.spacing(3)}px 0px ${theme.spacing(4)}px `,
  },
  dialogLink: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  unsubscribeLink: {
    margin: `${theme.spacing(2)}px 0px`,
    cursor: 'pointer',
  },
}));

export default function ThankyouDialog(props) {
  const classes = useStyles();

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      classes={{
        paper: classes.dialogContainer,
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Grid
        className={classes.titleContainer}
        container
        alignItems="center"
        direction="column"
      >
        <Typography className={classes.dialogTitleText} variant="body1">
          Motopia
        </Typography>
        <div className={classes.messageIcon} />
        <Typography className={classes.dialogTitleText} variant="h5">
          Thank you!
        </Typography>
      </Grid>
      <Grid
        className={classes.contentContainer}
        container
        wrap="nowrap"
        direction="column"
      >
        <Grid
          className={classes.contentContainerMessage}
          container
          wrap="nowrap"
          direction="column"
        >
          <Typography variant="body2">
            Thank you for reaching out to us.
          </Typography>
          <Typography className={classes.textSpacing} variant="body2">
            One of our customer service representatives will contact you shortly.
          </Typography>
        </Grid>
        <Grid
          className={classes.contentContainerLink}
          container
          alignItems="center"
          direction="column"
        >
          <SocialMediaButtons />
        </Grid>
      </Grid>
    </Dialog>
  );
}

ThankyouDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
