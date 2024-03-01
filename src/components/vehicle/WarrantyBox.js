/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import PointInspection from 'assets/vehicle/Point_Inspection.png';

const useStyles = makeStyles(theme => ({
  warColumn1: {
    padding: `${theme.spacing(1.25)}px`
  },
  warColumn2: {
    padding: `${theme.spacing(1.25)}px`
  },
  warRow: {
    content: '',
    display: 'table',
    clear: 'both'
  },
  green: {
    color: '#00a60b',
    fontWeight: 600
  },
  fontSpan: {
    fontSize: '1rem'
  },
  title: {
    textTransform: 'uppercase',
    fontSize: theme.typography.pxToRem(28),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
}));

const WarrantyBox = (props) => {
  const [state, setState] = useState({
    features: []
  });
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [mobileArray, setmobileArray] = useState([]);
  const ref = React.createRef();
  const classes = useStyles();
  const defaultInst = {
    title: 'Warranty',
    desc: [],
    paired: true
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
    setmobileArray(array);
    setLeft(preLeft);
    setRight(preRight);
  };

  useEffect(() => {
    if (props.warranty) {
      const warrDesc = [];
      props.warranty.map(el => {
        if (!el.value.includes('Expired')) {
          warrDesc.push({
            title: el.type,
            desc: el.value,
          });
        }
      });
      setState({
        features: [
          { ...defaultInst, desc: warrDesc },
        ]
      });
      getPairedArray(warrDesc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screenWidthDynamic = window.innerWidth;
  window.onload = screenWidthDynamic;

  const renderPairedListItem = array =>
    array.map((el, index) =>
      (
        // eslint-disable-next-line react/no-array-index-key
        <ListItem key={index} alignItems="flex-start">
          <ListItemIcon>
            <FiberManualRecordIcon color="primary" fontSize="small" />
          </ListItemIcon>
          {el.title === 'Basic' && (
            <ListItemText>
              <div className={classes.fontSpan}>
                {'Manufacturer\'s Bumper to Bumper'}<br />
                {el.desc.split('-')[0]} -
                <span className={classes.green}>{el.desc.split('-')[1]}</span>
              </div>
            </ListItemText>
          )}
          {el.title === 'Drivetrain' && (
            <ListItemText>
              <div className={classes.fontSpan}>
                Powertrain<br />
                {el.desc.split('-')[0]} -
                <span className={classes.green}>{el.desc.split('-')[1]}</span>
              </div>
            </ListItemText>
          )}
          {el.title !== 'Basic' && el.title !== 'Drivetrain' && (
            <ListItemText>
              <div className={classes.fontSpan}>
                {el.title}<br />
                {el.desc.split('-')[0]} -
                <span className={classes.green}>{el.desc.split('-')[1]}</span>
              </div>
            </ListItemText>
          )}
        </ListItem>
      )
    );

  return (
    <div style={{ width: '100%', minHeight: 'max-content' }} ref={ref}>
      <Typography className={classes.title} variant="h5">
        Warranties & Motopia Promise
      </Typography>
      {state.features.map(feature =>
        (
          <Grid key={feature.desc} container item justifyContent={feature.desc.length === 0 && 'center'}>
            {screenWidthDynamic > 450 ?
              <>
                <Grid container justifyContent="space-evenly">
                  <Grid container alignItems="center" item md={4}>
                    <img src={PointInspection} width="100%" alt="Warranty"/>
                  </Grid>
                  {feature.desc.length > 0 && (
                    <>
                      <Grid item md={right.length > 0 ? 4 : 8}>
                        <List className={classes.warColumn1}>
                          {feature.desc.length > 0 && renderPairedListItem(left)}
                        </List>
                      </Grid>
                      {right.length > 0 &&
                      <Grid item md={4}>
                        <List className={classes.warColumn2}>
                          {feature.desc.length > 1 && renderPairedListItem(right)}
                        </List>
                      </Grid>}
                    </>
                  )}
                </Grid>
              </>
              :
              <>
                <div style={{ width: '100%' }}>
                  <img src={PointInspection} width="100%" alt="Warranty" />
                  {feature.desc.length > 0 &&
                    <List>
                      {feature.desc.length > 0 && renderPairedListItem(mobileArray)}
                    </List>}
                </div>
              </>}
          </Grid>
        ))}
    </div>
  );
};

WarrantyBox.propTypes = {
  warranty: PropTypes.array
};

WarrantyBox.defaultProps = {
  warranty: []
};

export default WarrantyBox;
