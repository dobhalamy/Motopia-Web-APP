import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import ExitToAppIcon from '@material-ui/icons/ExitToAppOutlined';
import GoogleIcon from 'assets/google-button.svg';

const useStyles = makeStyles(theme => ({
  financeGridMarginBottom: {
    marginBottom: theme.spacing(2.5),
  },
  financeButtonGroup: {
    marginTop: theme.spacing(1.5),
  },
  socialMediaButton: {
    margin: `${theme.spacing(2.5)}px ${theme.spacing(1.25)}px`,
    backgroundColor: '#e6e8ef',
    textTransform: 'none',
  },
  iconButton: {
    padding: theme.spacing(2.5),
    border: '1px solid rgba(41, 40, 46, 0.2)',
    borderRadius: 5,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  socialMediaButtonContainer: {
    margin: `${theme.spacing(2.5)}px 0`,
    border: '1px solid rgba(41, 40, 46, 0.2)',
    borderRadius: 5,
    padding: `${theme.spacing(1.25)}px ${theme.spacing(2.5)}px`,

    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
      textAlign: 'center',
    },
  },
  sectionName: {
    display: 'flex',
    alignContent: 'center',
  },
}));

export default function ConnectedSection() {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      <Typography
        className={classes.sectionName}
        gutterBottom
        variant="body1"
      >
        <ExitToAppIcon color="error" /> Connected Accounts
      </Typography>

      <Grid
        container
        item
        xs={12}
        md={7}
        direction={matches ? 'row' : 'column'}
        className={classes.socialMediaButtonContainer}
      >
        <Grid
          justifyContent="center"
          alignContent="center"
          container
          item
          xs={12}
          md={1}
        >
          <Icon
            className={classes.iconButton}
            style={{ backgroundImage: `url(${GoogleIcon})` }}
          />
        </Grid>
        <Grid
          direction="column"
          alignContent="center"
          justifyContent="center"
          container
          item
          md={6}
          xs={12}
        >
          <Typography variant="h6">GOOGLE</Typography>
          <Typography variant="body2">
            Your Google account is not connected
          </Typography>
        </Grid>
        <Grid item justifyContent="flex-end" container md={5} xs={12}>
          <Button className={classes.socialMediaButton} variant="contained">
            CONNECT ACCOUNT
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
