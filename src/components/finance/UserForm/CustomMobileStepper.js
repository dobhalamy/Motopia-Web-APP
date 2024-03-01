import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import HandleTour from 'components/shared/HandleTour';

import { STEPS } from './constants';

const CustomMobileStepper = ({ activeStep, isRetail }) => {
  const theme = useTheme();
  const [isTourOpen, setIsTourOpen] = React.useState(true);
  const [isFinanceOpen, setisFinanceOpen] = React.useState(undefined);
  const steps = [];
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
          And With Two More Step You`ll Get Your Pre-Approval Amount
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
          And With One More Step You`ll Get Your Pre-Approval Amount
        </Typography>
      ),
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF'
      },
      position: 'top'
    },
  ];
  useEffect(() => {
    setisFinanceOpen(localStorage.getItem('financeOpen'));
    if (activeStep === 0) {
      steps.push(headerSteps[0]);
      steps.push(headerSteps[3]);
    } else if (activeStep === 1) {
      steps.push(headerSteps[1]);
      steps.push(headerSteps[4]);
    } else {
      steps.push(headerSteps[2]);
    }
  }, [activeStep, headerSteps, steps]);

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
  return (
    <>
      {STEPS.map(({ label, icon }, index) => {
        const text = isRetail && label === 'HOUSING' ? 'REGISTRATION' : label;
        return (
          <Box
            key={text}
            hidden={activeStep !== index}
            pb={1}
            style={{ backgroundColor: theme.palette.common.white }}
          >
            <Grid container justifyContent="space-between" data-tut={renderTour(label)}>
              <Grid item>
                <Typography
                  variant="body2"
                  style={{ fontSize: 15, fontWeight: theme.typography.fontWeightBold }}
                  color="secondary"
                >
                  {text}
                </Typography>
              </Grid>
              <Grid item>
                <img src={icon} alt="icon" />
              </Grid>
            </Grid>
          </Box>);
      })}
      {!isFinanceOpen && <HandleTour
        isOpen={isTourOpen}
        steps={steps}
        handleClose={closeTour}
      />}
    </>
  );
};

CustomMobileStepper.propTypes = {
  activeStep: PropTypes.number.isRequired,
  isRetail: PropTypes.bool.isRequired,
};

export default CustomMobileStepper;
