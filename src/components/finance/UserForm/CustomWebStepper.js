import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import HandleTour from 'components/shared/HandleTour';

import CheckedBlue from 'assets/finance/checked_blue.svg';
import { STEPS } from './constants';

const useStyles = makeStyles(theme => ({
  customWebStepperStep: {
    borderTop: '2px solid transparent',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  customWebStepperStepActive: {
    borderColor: theme.palette.error.main,
    backgroundColor: theme.palette.common.white,
  },
  customWebStepperStepImage: {
    marginRight: theme.spacing(1.5),
  },
  customWebStepperStepName: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.secondary.light,
  },
  customWebStepperStepNameActive: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.secondary,
  },
  customWebStepperStepChecked: {
    marginLeft: theme.spacing(3),
  },
  chunkyForm: {
    [theme.breakpoints.up('md')]: {
      maxWidth: 850,
      margin: 'auto'
    }
  },
}));

const CustomWebStepper = (props) => {
  const classes = useStyles();
  const [isTourOpen, setIsTourOpen] = React.useState(true);
  const [isFinanceOpen, setisFinanceOpen] = React.useState(undefined);
  const { activeStep, isRetail, openTourAgain } = props;
  const headerSteps = [
    {
      selector: '[data-tut="Finance-Information"]',
      content: () => (
        <Typography>
          Add Contact Info
        </Typography>
      ),
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF'
      },
      position: 'left'
    },
    {
      selector: '[data-tut="Finance-Address"]',
      content: () => (
        <Typography>
          Add Address Info
        </Typography>
      ),
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF'
      },
      position: 'top'
    },
    {
      selector: '[data-tut="Finance-Housing"]',
      content: () => (
        <Typography>
          Add Housing Info
        </Typography>
      ),
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF'
      },
      position: 'top'
    },
    {
      selector: '[data-tut="Finance-Next"]',
      content: () => (
        <Typography>
          And Proceed To Get Your Pre-Approval Amount
        </Typography>
      ),
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF'
      },
      position: 'top'
    },
  ];
  const closeTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('financeOpen', true);
  };
  const renderTour = (label) => {
    if (label === 'INFORMATION') {
      return 'Finance-Information';
    } else if (label === 'ADDRESS') {
      return 'Finance-Address';
    } else {
      return 'Finance-Housing';
    }
  };
  useEffect(() => {
    setisFinanceOpen(localStorage.getItem('financeOpen'));
    setIsTourOpen(true);
  }, [openTourAgain]);
  return (
    <>
      <Grid container className={classes.chunkyForm}>
        {STEPS.map(({ label, icon }, index) => {
          const isActiveStep = activeStep >= index;
          const text = isRetail && label === 'HOUSING' ? 'REGISTRATION' : label;
          return (
            <Grid item xs={4} key={text} data-tut={renderTour(label)}>
              <Box
                className={classNames(classes.customWebStepperStep, {
                  [classes.customWebStepperStepActive]: isActiveStep,
                })}
              >
                {isActiveStep && (
                  <img src={icon} alt="icon" className={classes.customWebStepperStepImage} />
                )}
                <Typography
                  variant="body2"
                  className={classNames(classes.customWebStepperStepName, {
                    [classes.customWebStepperStepNameActive]: isActiveStep,
                  })}
                >
                  {text}
                </Typography>
                {isActiveStep && (
                <img src={CheckedBlue} alt="icon" className={classes.customWebStepperStepChecked} />
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
      {!isFinanceOpen && <HandleTour
        isOpen={isTourOpen}
        steps={headerSteps}
        handleClose={closeTour}
      />}
    </>
  );
};

CustomWebStepper.propTypes = {
  activeStep: PropTypes.number.isRequired,
  isRetail: PropTypes.bool.isRequired,
  openTourAgain: PropTypes.bool.isRequired
};

export default CustomWebStepper;
