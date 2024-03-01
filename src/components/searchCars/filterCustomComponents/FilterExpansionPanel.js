import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';

import { ArrowDropDown as ArrowDropIcon } from '@material-ui/icons';

import { BORDER_COLOR } from 'src/constants';

const useStyles = makeStyles(theme => ({
  filtersPanelTitle: {
    fontWeight: theme.typography.fontWeightMedium,
    textTransform: 'uppercase',
  },
  filtersPanelsSummaryRoot: {
    padding: 0,
  },
  filtersPanelsDetailsRoot: {
    padding: `0px 0px ${theme.spacing(2.5)}px`,
    justifyContent: 'center',
  },
  ArrowIcon: {
    color: theme.palette.text.primary,
  },
}));

const CustomAccordion = withStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${BORDER_COLOR}`,
    padding: 0,
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      padding: `0px ${theme.spacing(3)}px`,
    },
    '&$expanded': {
      margin: 0,
    }
  },
  expanded: {},
}))(Accordion);

function FilterPanel(props) {
  const classes = useStyles();

  return (
    <CustomAccordion
      id={props.title}
      elevation={0}
    >
      <AccordionSummary
        classes={{ root: classes.filtersPanelsSummaryRoot }}
        expandIcon={<ArrowDropIcon className={classes.ArrowIcon} />}
      >
        <Typography className={classes.filtersPanelTitle}>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails classes={{ root: classes.filtersPanelsDetailsRoot }}>
        {props.children}
      </AccordionDetails>
    </CustomAccordion>
  );
}

export default FilterPanel;

FilterPanel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

FilterPanel.defaultProps = {
  children: 'No data available',
};
