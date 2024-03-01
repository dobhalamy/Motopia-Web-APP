/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { groupBy } from 'lodash';
import { useRouter } from 'next/router';
import Slider from 'react-animated-slider';
import Carousel from 'react-multi-carousel';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ArrowButtonGroup from 'components/shared/Carousel/ArrowButtonGroup';
import { customCss } from 'assets/customSlider.css';
import { applyAdsQuery, appendQueryParams } from '@/utils/commonUtils';
import { aspectStyles } from '../../utils/styles';

const categoriesArr = ['Life Style', 'Body Type', 'Ride Share'];

const useStyles = makeStyles(theme => ({
  carsListContainer: {
    height: 'auto',
    zIndex: 1000,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  carsListTitle: {
    textAlign: 'center',
  },
  carsListButtonWrapper: {
    textAlign: 'center',
    paddingTop: theme.spacing(6.25),
    paddingBottom: theme.spacing(5.75),
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(5),
    },
  },
  carsListButton: {
    border: `2px solid ${theme.palette.secondary.main}`,
    '&:hover': {
      border: `2px solid ${theme.palette.secondary.main}`,
    },
  },
  mainCarousel: {
    marginBottom: 10,
    borderRadius: 5,
    margin: 'auto',
    boxShadow: '-1px -4px 9px 0px rgba(181, 181, 181, 0.75)',
    ...aspectStyles(theme),
  },
  carouselCellCover: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    float: 'left',
    position: 'absolute',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    ...aspectStyles(theme),
  },
  carouselCellMainCoverDiv: {
    height: '100%',
    position: 'absolute',
    color: 'white',
    borderRadius: 5,
    width: '80%',
    padding: '0px 100px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '0px 60px',
    },
  },
  carouselCellMainCover: {
    height: '100%',
    position: 'absolute',
    color: 'white',
    borderRadius: 5,
    width: '100%',
    padding: '0px 10px',
  },
  subCarousel: {
    padding: '12px 10px',
    backgroundColor: '#001c5e',
    borderRadius: 5,
    marginTop: 10,
  },
  subCarouselDiv: {
    height: 125,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  subCarouselImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  carouselCell: {
    background: '#001c5e',
    marginRight: 10,
    borderRadius: 5,
    backgroundSize: 'cover',
    width: '100%',
    ...aspectStyles(theme),
  },
  subCarouselCell: {
    height: 235,
    background: 'white',
    marginRight: 10,
    borderRadius: 5,
  },
  subCarouselButton: {
    position: 'absolute',
    bottom: 10,
    border: `2px solid ${theme.palette.secondary.main}`,
    '&:hover': {
      border: `2px solid ${theme.palette.secondary.main}`,
    },
  },
  subCarouselTitle: {
    fontSize: 50,
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
    },
  },
  subCarouselCategoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: '0.5em 0',
    color: '#000',
  },
  subCarouselDescription: {
    fontSize: 20,
    margin: 0,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  carouselDescription: {
    height: 58,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
}));

const BodyTypeCards = ({
  bodyTypeCardsCarouselSetting,
  bodyTypeCardsCarousel,
  vehicleList,
}) => {
  const classes = useStyles();
  const Router = useRouter();
  const adsQuery = applyAdsQuery(Router.query);
  const [mainCarouselIndex, setMainCarouselIndex] = useState(0);
  const [state, setState] = useState({
    cards: [],
    carousels: [],
  });
  const [carousalSetting, setCarousalSetting] = React.useState({
    textColor: '#000000',
    backgroundColor: '#ffffff',
    sliderSpeed: '3000',
  });

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      paritialVisibilityGutter: 60,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      paritialVisibilityGutter: 50,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1.5,
      paritialVisibilityGutter: 50,
    },
  };
  const assignSubCarousel = slideIndex => {
    setMainCarouselIndex(slideIndex);
  };

  const groupVehicles = async list => ({
    [categoriesArr[0]]: groupBy(list, 'lifeStyleCategory'),
    [categoriesArr[1]]: groupBy(list, 'carBody'),
    [categoriesArr[2]]: groupBy(list, 'rideShareCategory'),
  });

  useEffect(
    () => {
      if (bodyTypeCardsCarouselSetting) {
        setCarousalSetting({
          ...carousalSetting,
          textColor: bodyTypeCardsCarouselSetting.textColor,
          backgroundColor: bodyTypeCardsCarouselSetting.backgroundColor,
          sliderSpeed: bodyTypeCardsCarouselSetting.sliderSpeed * 1000,
        });
      }
      if (bodyTypeCardsCarousel && vehicleList) {
        const cars = groupVehicles(vehicleList);
        const filteredCarousels = bodyTypeCardsCarousel.filter(carousel =>
          categoriesArr.includes(carousel.title)
        );
        const remainingCarousels = bodyTypeCardsCarousel.filter(
          carousel => !categoriesArr.includes(carousel.title)
        );

        const newCarouselItems = filteredCarousels
          .map(carousel => {
            const carsSubcategory = cars[carousel.title] || {};
            const selectedSubCategories = carousel.subCategories.filter(
              subCategory => {
                const carsList = carsSubcategory[subCategory.title];

                if (!carsList) {
                  return true;
                }

                return Object.keys(carsSubcategory).find(
                  key =>
                    key === subCategory.title && carsSubcategory[key].length
                );
              }
            );

            return { ...carousel, subCategories: selectedSubCategories };
          })
          .filter(carousel => carousel.subCategories.length);

        const combinedCarousels = newCarouselItems.concat(remainingCarousels);

        setTimeout(
          setState({
            ...state,
            carousels: combinedCarousels,
          }),
          3000
        );
      }
    },
    //  eslint-disable-next-line
    []
  );

  const { carousels } = state;

  if (!carousels.length) {
    return null;
  }

  return (
    <Container maxWidth="xl" className={classes.carsListContainer}>
      <Box pt={8}>
        <Typography
          className={classes.carsListTitle}
          variant="body2"
          gutterBottom
        >
          research car models
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography className={classes.carsListTitle} variant="h4">
          START WITH TYPE
        </Typography>
      </Box>
      <Slider
        autoplay={carousalSetting.sliderSpeed}
        onSlideChange={event => assignSubCarousel(event.slideIndex)}
        className={customCss}
      >
        {carousels.map(category => (
          <div
            key={category._id}
            className={classes.carouselCell}
            style={{ backgroundColor: carousalSetting.backgroundColor }}
          >
            <div
              className={classes.carouselCellCover}
              style={{
                backgroundImage: `url(${
                  window.innerWidth < 530
                    ? category.mobileImage.src
                    : category.image.src
                })`,
                opacity: 0.8,
              }}
            >
              {null}
            </div>
            <div className={classes.carouselCellMainCoverDiv}>
              <h1
                className={classes.subCarouselTitle}
                style={{ marginBottom: 0, color: carousalSetting.textColor }}
              >
                {category.title}
              </h1>
              {category.description ? (
                <p
                  className={classes.subCarouselDescription}
                  style={{ color: carousalSetting.textColor }}
                >
                  {category.description}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </Slider>
      <div className={classes.subCarousel} key={mainCarouselIndex}>
        <Carousel
          ssr
          arrows={false}
          itemClass="image-item"
          swipeable="true"
          responsive={responsive}
          customButtonGroup={<ArrowButtonGroup />}
        >
          {carousels[mainCarouselIndex].subCategories.map(subCategory => (
            <div key={subCategory._id} className={classes.subCarouselCell}>
              <div className={classes.carouselCellMainCover}>
                <p className={classes.subCarouselCategoryTitle}>
                  {subCategory.title}
                </p>
                <div className={classes.subCarouselDiv}>
                  {subCategory.logoImage ? (
                    <img
                      className={classes.subCarouselImage}
                      src={subCategory.logoImage.src}
                      alt="logo"
                    />
                  ) : null}
                </div>
                <br />
                {subCategory.link ? (
                  <Link
                    href={`${appendQueryParams(subCategory.link, adsQuery)}`}
                  >
                    <a style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        className={classes.subCarouselButton}
                      >
                        Explore
                      </Button>
                    </a>
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <Box className={classes.carsListButtonWrapper}>
        <Button
          onClick={() =>
            Router.push({ pathname: '/search-cars', query: { ...adsQuery } })
          }
          variant="outlined"
          color="secondary"
          className={classes.carsListButton}
        >
          Explore vehicles
        </Button>
      </Box>
    </Container>
  );
};

export default BodyTypeCards;
