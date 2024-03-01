/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Warranty } from 'src/api';

import Inner1 from 'assets/carfax/inner1.png';
import Inner2 from 'assets/carfax/inner2.png';
import Inner3 from 'assets/carfax/inner3.png';
import War from 'assets/carfax/warrHome.png';
import { Box, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  WarrantyButton: {
    top: '50%',
    width: '25%',
    height: '3rem',
    background: '#001c5e',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#001c5e',
    },
    [theme.breakpoints.down('sm')]: {
      top: '30%',
      width: '75%',
      height: '20pt',
      fontSize: '9pt',
    },
  },
  WarrantyButton2: {
    background: '#001c5e',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#001c5e',
    },
    top: '6%',
    width: '30%',
    height: '20pt',
    fontSize: '9pt',
    marginLeft: '36%',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '58%',
      top: '-6%'
    },
  },
  outerMainDiv: {
    width: '100%',
    height: '60rem',
    background: '#001c5e',
    marginRight: 10,
    display: 'flex',
    borderRadius: 5,
    flexDirection: 'column',
    [theme.breakpoints.down(3000)]: {
      height: '64rem'
    },
    [theme.breakpoints.down('sm')]: {
      height: '90rem'
    },
  },
  outerMainLifeDiv: {
    width: '100%',
    height: '100%',
    background: '#001c5e',
    marginRight: 10,
    display: 'flex',
    borderRadius: 5,
    flexDirection: 'column',
  },
  outerDiv: {
    width: '100%',
    height: '60rem',
    background: '#001c5e',
    marginRight: 10,
    display: 'flex',
    borderRadius: 5,
    flexDirection: 'column',
    [theme.breakpoints.down(3000)]: {
      height: '48rem'
    },
    [theme.breakpoints.down('sm')]: {
      height: '88rem'
    },
  },
  outerBackgroundDiv: {
    width: '100%',
    height: 240,
    backgroundPosition: 'center',
    [theme.breakpoints.down('sm')]: {
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      height: 100
    },
    [theme.breakpoints.up(1750)]: {
      height: 320
    },
  },
  warrantyStan: {
    height: '80%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    [theme.breakpoints.down(2500)]: {
      height: '76%',
    },
    [theme.breakpoints.down('sm')]: {
      height: '100%'
    },
  },
  warrantStan: {
    height: '80%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    [theme.breakpoints.down(2500)]: {
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      height: '100%'
    },
  },
  heroHeaderContentTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(22),
      marginBottom: theme.spacing(2),
    },
    textTransform: 'uppercase',
    color: '#FFF'
  },
  warrantyStanHeader: {
    marginBottom: 75,
    display: 'contents',
    textAlign: 'center'
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#001c5e',
    opacity: 0.8
  },
  innerBoxes: {
    width: '30%'
  },
  innerText: {
    color: '#FFF',
    textAlign: 'center',
    padding: 10
  },
  outerBox: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '16rem'
    },
    width: '33%',
    margin: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  LearnButton: {
    color: 'silver',
    width: 200,
    height: 55,
    background: 'transparent',
    border: '2px solid silver'
  },
  iconDiv: {
    margin: '30px 0',
    display: 'flex',
    padding: '0 18%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  textClass: {
    width: '40%',
    margin: '6% 0 1% auto',
    [theme.breakpoints.down(4000)]: {
      margin: '4% 0 1% auto'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '12% 1% 1% auto'
    },
  },
  warrantyText: {
    marginBottom: 10,
    color: '#001c5e',
    fontWeight: '900',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem'
    },
  },
  imgClass: {
    width: 250,
    height: 100,
    textAlign: 'center',
    margin: '20px 0 20px 0'
  }
}));

const WarrantyStandard = (props) => {
  const { lifeTimeWarranty, mileage } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [warrantyImage, setWarrantyImages] = useState();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Warranty.getWarrantyImages();
        if (data) {
          const ranIndex = Math.floor(Math.random() * data.length);
          setWarrantyImages(data[ranIndex]);
        }
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, []);

  const outerClass = () => {
    if (mileage > 500) {
      if (lifeTimeWarranty) {
        return classes.outerMainDiv;
      } else {
        return classes.outerMainLifeDiv;
      }
    } else {
      return classes.outerDiv;
    }
  };

  return (
    <div className={outerClass()}>
      {warrantyImage && mileage > 500 &&
        <div
          style={{
            backgroundImage:
             `url(${isMobile ? warrantyImage.mobileImg : warrantyImage.src})`,
            backgroundSize: 'cover'
          }}
          className={classes.outerBackgroundDiv}
        >
          <div className={classes.textClass}>
            <Typography variant="h4" className={classes.warrantyText}>
              {warrantyImage.title}
            </Typography>
            {!isMobile &&
              <Link href="/warranty">
                <a target="_blank">
                  <Button className={classes.WarrantyButton}>
                    Learn More
                  </Button>
                </a>
              </Link>
            }
          </div>
          {isMobile &&
            <Link href="/warranty">
              <a target="_blank">
                <Button className={classes.WarrantyButton2}>
                  Learn More
                </Button>
              </a>
            </Link>
          }
        </div>}
      {lifeTimeWarranty &&
        <div
          style={{
            backgroundImage: `url(${War})`,
            position: 'relative',
            backgroundColor: 'rgb(0, 28, 94)',
            backgroundBlendMode: 'multiply',
            backgroundPosition: 'inherit'
          }}
          className={mileage > 500 ? classes.warrantyStan : classes.warrantStan}
        >
          <Grid container item justifyContent="center" xs={12} className={classes.warrantyStanHeader}>
            <Typography
              className={classes.heroHeaderContentTitle}
              style={{ paddingTop: '5%' }}
              variant="h3"
            >
              Motopia Life time Warranty
            </Typography>
            <Typography className={classes.heroHeaderContentTitle} variant="h4">
              HASSLE-FREE BUYING &amp; WORRY-FREE DRIVING
            </Typography>
          </Grid>
          <Grid container item justifyContent="center" xs={12} style={{ margin: '30px 0' }}>
            <Typography
              className={classes.heroHeaderContentTitle}
              style={{ color: '#00cef3' }}
              variant="h6"
            >
              Benefits:
            </Typography>
          </Grid>
          <Grid
            container
            item
            justifyContent="center"
            xs={12}
            className={classes.iconDiv}
          >
            <Box
              className={classes.outerBox}
              style={
                isMobile ? { borderBottom: '1px solid #FFF' } : { borderRight: '1px solid #FFF' }
              }
            >
              <div className={classes.imgClass}>
                <img src={Inner1} alt="inner1" />
              </div>
              <Typography variant="h6" className={classes.innerText}>
                Lifetime Warranty* standard - at no cost to you
              </Typography>
            </Box>
            <Box
              className={classes.outerBox}
              style={
                isMobile ? { borderBottom: '1px solid #FFF' } : { borderRight: '1px solid #FFF' }
              }
            >
              <div className={classes.imgClass}>
                <img src={Inner2} alt="inner2" />
              </div>
              <Typography variant="h6" className={classes.innerText}>
                Coverage on engine, transmission, and drive train
              </Typography>
            </Box>
            <Box className={classes.outerBox}>
              <div className={classes.imgClass}>
                <img src={Inner3} alt="inner3" />
              </div>
              <Typography variant="h6" className={classes.innerText}>
                Unlimited miles, unlimited time - for as long as you own the vehicle
              </Typography>
            </Box>
          </Grid>
          <Grid container item justifyContent="center" xs={12} style={{ margin: '25px 0px 80px 0' }}>
            <Box>
              <Link href="/lifetime-warranty">
                <a target="_blank">
                  <Button className={classes.LearnButton}>
                    Learn More
                  </Button>
                </a>
              </Link>
            </Box>
          </Grid>
        </div>}
    </div>
  );
};

WarrantyStandard.propTypes = {
  lifeTimeWarranty: PropTypes.any,
  mileage: PropTypes.any.isRequired
};

WarrantyStandard.defaultProps = {
  lifeTimeWarranty: true
};

export default WarrantyStandard;
