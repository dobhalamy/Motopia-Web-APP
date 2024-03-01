import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from '@material-ui/icons';

const CustomAccordion = withStyles({
  root: {
    width: '100%',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(Accordion);

const CustomAccordionSummary = withStyles({
  root: {
    backgroundColor: '#F2F3F7',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    color: '#001C5E',
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(AccordionSummary);

const CustomAccordionDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
  },
}))(AccordionDetails);

const CustomExpansion = props => {
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const getPairs = array => {
    const preLeft = [];
    const preRight = [];
    if (array.length > 8) {
      // eslint-disable-next-line array-callback-return
      array.map((el, index) => {
        if (index % 2 === 0) {
          preRight.push(el);
        } else preLeft.push(el);
      });
    } else {
      preLeft.push(...array);
    }
    setLeft(preLeft);
    setRight(preRight);
  };

  const getPairedArray = array => {
    const preLeft = [];
    const preRight = [];
    const empArray = array;
    if (empArray.length > 0) {
      empArray.forEach((el, index) => {
        if (!el.desc.includes('In Effect')) {
          array.pop(index);
        }
      });
    }
    if (array.length > 0) {
      // eslint-disable-next-line array-callback-return
      array.map((el, index) => {
        if (index % 2 === 0) {
          preLeft.push(el);
        } else preRight.push(el);
      });
    } else {
      preLeft.push(...array);
    }
    setLeft(preLeft);
    setRight(preRight);
  };

  useEffect(() => {
    if (!props.feature.paired && props.feature && !props.long) {
      getPairs(props.feature.desc);
    }
    if (!props.feature.paired && props.long && props.feature) {
      setLeft(props.feature.desc);
    }
    if (props.feature.paired && props.long && props.feature) {
      getPairedArray(props.feature.desc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screenWidthDynamic = window.innerWidth;
  window.onload = screenWidthDynamic;
  const renderListItem = array =>
    array.map((el, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ListItem key={index} alignItems="flex-start">
        <ListItemIcon>
          <FiberManualRecordIcon color="primary" fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={el} />
      </ListItem>
    ));

  const renderCustomListItem = array =>
    array.map((el, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ListItem key={index} alignItems="flex-start">
        <ListItemIcon>
          <FiberManualRecordIcon color="primary" fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          {el.title}
          <br />
          {el.desc}
        </ListItemText>
      </ListItem>
    ));

  const { expanded, handleChange, feature } = props;
  return (
    <>
      {feature && !feature.paired && !props.long && (
        <CustomAccordion
          expanded={expanded === feature.title}
          onChange={handleChange(feature.title)}
        >
          <CustomAccordionSummary
            aria-controls={`${feature.title}-content`}
            id={`${feature.title}-header`}
            expandIcon={<ExpandMoreIcon color="secondary" />}
          >
            <Typography>{feature.title}</Typography>
          </CustomAccordionSummary>
          <CustomAccordionDetails>
            <Grid
              container
              item
              justifyContent={
                feature.desc.length === 0 ? 'center' : 'space-around'
              }
              alignItems="flex-start"
            >
              {feature.desc.length > 0 && (
                <Grid
                  item
                  xl={right.length > 0 ? 6 : 12}
                  style={{ width: right.length > 0 && '100%' }}
                >
                  <List style={{ padding: 0 }}>
                    {feature.desc.length > 0 && renderListItem(left)}
                  </List>
                </Grid>
              )}
              {right.length > 0 && (
                <Grid item xl={6} style={{ width: '100%' }}>
                  <List style={{ padding: 0 }}>{renderListItem(right)}</List>
                </Grid>
              )}
              {feature.desc.length === 0 && (
                <Typography>No information about features yet.</Typography>
              )}
            </Grid>
          </CustomAccordionDetails>
        </CustomAccordion>
      )}
      {feature && !feature.paired && props.long && (
        <CustomAccordion
          square
          expanded={expanded === feature.title}
          onChange={handleChange(feature.title)}
        >
          <CustomAccordionSummary
            aria-controls={`${feature.title}-content`}
            id={`${feature.title}-header`}
            expandIcon={<ExpandMoreIcon color="secondary" />}
          >
            <Typography>{feature.title}</Typography>
          </CustomAccordionSummary>
          <CustomAccordionDetails>
            <Grid
              container
              item
              justifyContent={feature.desc.length === 0 && 'center'}
            >
              {feature.desc.length > 0 && (
                <List>
                  {feature.desc.length > 0 && renderCustomListItem(left)}
                </List>
              )}
              {feature.desc.length === 0 && (
                <Typography>No information about features yet.</Typography>
              )}
            </Grid>
          </CustomAccordionDetails>
        </CustomAccordion>
      )}
    </>
  );
};

CustomExpansion.propTypes = {
  expanded: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  feature: PropTypes.object.isRequired,
  long: PropTypes.bool,
};

CustomExpansion.defaultProps = {
  long: false,
};

export default CustomExpansion;
