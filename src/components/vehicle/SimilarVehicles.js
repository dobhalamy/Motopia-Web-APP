import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-multi-carousel';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import VehicleCard from 'components/shared/VehicleCard';
import CustomDots from 'components/shared/Carousel/CustomDots';
import SquareButtonGroup from 'components/shared/Carousel/SquareButtonGroup';
import { VEHICLE_PAGE_WIDTH } from './constants';

const useStyles = makeStyles(theme => ({
  similarVehiclesContainer: {
    maxWidth: VEHICLE_PAGE_WIDTH,
    alignSelf: 'center',
    margin: `${theme.spacing(7)}px 0px`,
  },
  dealerTitle: {
    fontSize: theme.typography.pxToRem(28),
    marginBottom: theme.spacing(2.5),
  },
  carouselWrapper: {
    height: 500,
    maxWidth: 1160,
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      maxWidth: 815,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
    },
  },
  carouselContainer: {
    width: '100%',
  },
  carouselSlider: {
    marginBottom: theme.spacing(5),
  },
  carouselDotList: {
    alignItems: 'center',
  },
}));

function SimilarVehicles(props) {
  const classes = useStyles();

  return (
    <Grid
      className={classes.similarVehiclesContainer}
      container
      alignItems="center"
      direction="column"
    >
      <Typography className={classes.dealerTitle} align="center" variant="h4">
        SIMILAR VEHICLES
      </Typography>
      <Grid
        className={classes.carouselWrapper}
        container
        alignItems="center"
        justifyContent="space-around"
      >
        <Carousel
          arrows={false}
          renderButtonGroupOutside
          customButtonGroup={<SquareButtonGroup />}
          customDot={<CustomDots />}
          centerMode={false}
          removeArrowOnDeviceType={['tablet', 'mobile']}
          containerClass={`container-with-dots, ${classes.carouselContainer}`}
          dotListClass={classes.carouselDotList}
          draggable={false}
          focusOnSelect={false}
          infinite
          keyBoardControl
          partialVisible={false}
          showDots
          sliderClass={classes.carouselSlider}
          slidesToSlide={1}
          swipeable
          responsive={{
            desktop: {
              breakpoint: {
                max: 3900,
                min: 1280,
              },
              items: 3,
            },
            mobile: {
              breakpoint: {
                max: 960,
                min: 0,
              },
              items: 1,
            },
            tablet: {
              breakpoint: {
                max: 1280,
                min: 960,
              },
              items: 2,
            },
          }}
        >
          {props.similarVehicles.map(vehicle => (
            <Grid key={vehicle.stockid} container justifyContent="center">
              <VehicleCard vehicle={vehicle} />
            </Grid>
          ))}
        </Carousel>
      </Grid>
    </Grid>
  );
}

SimilarVehicles.propTypes = {
  similarVehicles: PropTypes.array.isRequired,
};

export default SimilarVehicles;
