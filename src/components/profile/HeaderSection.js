import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import GetAppIcon from '@material-ui/icons/GetApp';

import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
import format from 'date-fns/format';

const useStyles = makeStyles(theme => ({
  headerSection: {
    height: 230,
    color: theme.palette.secondary.main,
    maxWidth: 1130,
    margin: 'auto',
    padding: `${theme.spacing(1.25)}px 0`,
  },
  downloadButton: {
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
    fontSize: 18,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));

const HeaderSection = props => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('xs'));
  const [state, setState] = React.useState({
    currentProfileSection: 0,
  });

  const handleClickProfileSection = (event, newValue) => {
    setState({
      ...state,
      currentProfileSection: newValue,
    });
  };

  return (
    <>
      <Grid className={classes.headerSection} container justifyContent="center">
        <Hidden smDown>
          <Grid xs={12} item>
            <Typography gutterBottom variant="body1">
              Home/Trade-in value
            </Typography>
          </Grid>
        </Hidden>
        <Grid container direction="column" xs={12} md={6}>
          <Grid item>
            <Typography gutterBottom variant="h4">
              MANAGE YOUR ACCOUNT
            </Typography>
          </Grid>
        </Grid>
        {props.file &&
        <Grid container direction="column" alignItems="flex-end" xs={12} md={6}>
          <Grid item>
            <Button
              variant="outlined"
              component="a"
              className={classes.downloadButton}
              href={props.link}
              download={props.file}
            >
              <span>Download your MVR</span>&ensp;<GetAppIcon />
            </Button>
          </Grid>
        </Grid>}
        <Grid
          container
          alignContent="flex-end"
          direction="column"
          xs={12}
          md={6}
        >
          <Grid item>
            {props.userData.expDate && (
              <Typography gutterBottom variant="body1">
                Financing terms valid until: &nbsp;
                {format(new Date(props.userData.expDate), 'MM/dd/yyyy')}
              </Typography>
            )}
          </Grid>
          <Grid item>
            {props.userData.amount && (
              <Typography gutterBottom variant="body1">
                Amount approved: &nbsp;
                {formatMoneyAmount(props.userData.amount)}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Paper square style={{ width: '100%' }}>
          {matches ? (
            <Select
              autoWidth
              style={{ width: '100%', height: 70 }}
              value={props.activeSection}
              onChange={props.handleChangeActiveSection}
            >
              <MenuItem value={0}>ACCOUNT DETAILS</MenuItem>
              <MenuItem value={1}>CHANGE PASSWORD</MenuItem>
              <MenuItem value={2}>CONNECTED ACCOUNTS</MenuItem>
            </Select>
          ) : (
            <Tabs
              style={{ maxWidth: 1130, margin: 'auto' }}
              value={state.currentProfileSection}
              indicatorColor="secondary"
              textColor="secondary"
              onChange={handleClickProfileSection}
            >
              <Tab
                label="ACCOUNT DETAILS"
                onClick={() =>
                  props.handleMoveToSection(props.accountSectionRef)}
              />
              <Tab
                onClick={() =>
                  props.handleMoveToSection(props.passwordSectionRef)}
                label="CHANGE PASSWORD"
              />
              {/* NOTE: Uncomment, if need to show connected social */}
              {/* <Tab
                onClick={() =>
                  props.handleMoveToSection(props.connectedSectionRef)
                }
                label="CONNECTED ACCOUNTS"
              /> */}
            </Tabs>
          )}
        </Paper>
      </Grid>
    </>
  );
};

HeaderSection.propTypes = {
  userData: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.string,
      expDate: PropTypes.string,
      firstName: PropTypes.string,
    })
  ),
  handleMoveToSection: PropTypes.func.isRequired,
  accountSectionRef: PropTypes.object.isRequired,
  passwordSectionRef: PropTypes.object.isRequired,
  // NOTE: Uncomment, if need to show connected social
  // connectedSectionRef: PropTypes.object.isRequired,
  activeSection: PropTypes.number.isRequired,
  handleChangeActiveSection: PropTypes.func.isRequired,
  file: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

HeaderSection.defaultProps = {
  userData: {
    amount: 0,
    expoDate: '',
    firstName: '',
  },
};

export default HeaderSection;
