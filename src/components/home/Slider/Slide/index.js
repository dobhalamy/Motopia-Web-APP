import React from 'react';
import Link from 'next/link';
import propTypes from 'prop-types';

import { makeStyles } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { SLIDER_DESKTOP_HEIGHT, SLIDER_MOBILE_HEIGHT } from '../../constants';

const useStyles = makeStyles(theme => ({
  slideWrapper: {
    cursor: 'pointer',
    padding: `${theme.spacing(14.125)}px 0px ${theme.spacing(
      31.625
    )}px ${theme.spacing(27)}px`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: '100%',
    backgroundPositionY: 'top',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(10),
      backgroundPositionX: 'center',
    },
    height: SLIDER_DESKTOP_HEIGHT,
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      paddingBottom: theme.spacing(2),
      backgroundPositionY: 'center',
      height: SLIDER_MOBILE_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
  },
  slideTitle: {
    textTransform: 'uppercase',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: theme.typography.pxToRem(100),
    letterSpacing: '0.03em',
    color: theme.palette.common.white,
    maxWidth: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(60),
      maxWidth: 450,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.pxToRem(28),
      textAlign: 'center',
      maxWidth: 200,
      margin: '0 auto',
    },
  },
  slideText: {
    color: theme.palette.common.white,
    textTransform: 'uppercase',
    marginBottom: theme.spacing(5),
    letterSpacing: '0.1em',
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.pxToRem(11),
      marginBottom: theme.spacing(1.875),
      textAlign: 'center',
      maxWidth: 175,
      margin: '0 auto',
    },
  },
}));

const Slider = ({
  slideTitle, slideText, slideImage, slideLink, isMobile
}) => {
  const classes = useStyles();

  return (
    <Link href={slideLink} >
      <Box
        className={classes.slideWrapper}
        style={{
          height: isMobile ? SLIDER_MOBILE_HEIGHT : SLIDER_DESKTOP_HEIGHT,
          backgroundImage: `url("${slideImage}")`,
        }}
      >
        <Typography variant="body1" className={classes.slideText}>
          {slideText}
        </Typography>
        <Typography variant="h1" className={classes.slideTitle}>
          {slideTitle}
        </Typography>
      </Box>
    </Link>
  );
};

Slider.propTypes = {
  slideText: propTypes.string.isRequired,
  slideTitle: propTypes.string.isRequired,
  slideImage: propTypes.string.isRequired,
  slideLink: propTypes.string.isRequired,
  isMobile: propTypes.bool.isRequired,
};

export default Slider;
