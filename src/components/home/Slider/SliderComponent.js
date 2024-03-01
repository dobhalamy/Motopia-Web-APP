/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Slider from 'react-animated-slider';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Carousels } from 'src/api';
import { useRouter } from 'next/router';
import { customCss } from 'assets/customSlider.css';
import { applyAdsQuery, appendQueryParams } from '@/utils/commonUtils';
import { aspectStyles } from '../../../utils/styles';

const useStyles = makeStyles(theme => ({
  carsListContainer: {
    height: 'auto',
    zIndex: 1000,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
    marginTop: 20,
  },
  carsListTitle: {
    textAlign: 'center',
  },
  carsListButtonWrapper: {
    textAlign: 'center',
    paddingTop: theme.spacing(6.25),
    paddingBottom: theme.spacing(8.75),
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
    boxShadow: '-1px -4px 9px 0px rgba(181, 181, 181, 0.75)',
    '& .flickity-page-dots': {
      bottom: 20,
    },
    '& .flickity-page-dots .dot': {
      height: 4,
      width: 40,
      margin: 0,
      borderRadius: 0,
      background: 'lightgrey',

      '&.is-selected': {
        background: 'white',
      },
    },
  },
  carouselCellCover: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    float: 'left',
    position: 'absolute',
    borderRadius: 5,
    width: '100%',
    ...aspectStyles(theme)
  },
  carouselCellMainCoverText: {
    width: '75%',
    height: '100%',
    color: 'white',
    padding: '0px 100px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '0px 15px',
      position: 'relative',
      top: 25,
    }
  },
  carouselCellMainCover: {
    height: '100%',
    position: 'absolute',
    borderRadius: 5,
    width: '100%',
  },
  subCarousel: {
    padding: '75px 10px',
    backgroundColor: '#001c5e',
    borderRadius: 5,
    '& .flickity-prev-next-button': {
      width: 20,
      height: 20,
      backgroundColor: theme.palette.primary.dark,
      '&.previous': {
        left: 20,
      },
      '&.next': {
        right: 20,
      },
      '&:disabled': {
        display: 'none',
      },
    },
  },
  carouselCell: {
    background: '#001c5e',
    marginRight: 10,
    borderRadius: 5,
    width: '100%',
    ...aspectStyles(theme)
  },
  subCarouselCell: {
    width: '20%',
    height: 250,
    background: 'white',
    marginRight: 10,
    borderRadius: 5,
  },
  subCarouselButton: {
    position: 'absolute',
    bottom: 30,
    border: `2px solid ${theme.palette.secondary.main}`,
    '&:hover': {
      border: `2px solid ${theme.palette.secondary.main}`,
    },
  },
  cardTitle: {
    fontSize: 50,
    marginBottom: 0,
    [theme.breakpoints.down('sm')]: {
      fontSize: 23,
    },
  },
  cardDescription: {
    fontSize: 20,
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  slider: {
    height: 468
  },
}));

const SliderComponent = props => {
  const classes = useStyles();
  const { query } = useRouter();
  const adsQuery = applyAdsQuery(query);
  /* eslint-disable no-underscore-dangle */
  const [carousalSetting, setCarousalSetting] = useState({
    textColor: '#000000',
    backgroundColor: '#ffffff',
    sliderSpeed: '3000',
  });
  const [isWindow, setIsWindow] = useState(false);

  useEffect(() => {
    async function getHeroCarousalData() {
      try {
        const settingResponse = await Carousels.getHeroCarouselSetting();
        const settingData = settingResponse.data;
        setCarousalSetting({
          ...carousalSetting,
          textColor: settingData.textColor,
          backgroundColor: settingData.backgroundColor,
          sliderSpeed: settingData.sliderSpeed * 1000,
        });
      } catch (error) {
        console.error(error);
      }
    }
    getHeroCarousalData();
    if (window) {
      setIsWindow(true);
    }
    //  eslint-disable-next-line
  }, []);

  if (!props.data.length) return null;

  const handleSlideClick = (e, url) => {
    if (url.includes('#')) {
      e.preventDefault();
      const button = document.querySelector(url);
      button.click();
    }
  };

  return (
    <Container maxWidth="xl" className={classes.carsListContainer}>
      <div className={classes.mainCarousel}>
        <Slider className={customCss} autoplay={carousalSetting.sliderSpeed}>
          {props.data.map((item) => (
            <div
              key={item._id}
              className={classes.carouselCell}
              style={{ backgroundColor: carousalSetting.backgroundColor }}
            >
              <div
                className={classes.carouselCellCover}
                style={{
                  backgroundImage: `url(${
                    isWindow && window.innerWidth < 530 ? item.mobileSrc : item.src
                  })`,
                  opacity: 0.8,
                }}
              >
                {null}
              </div>
              <Link
                href={
                  item.linkPath.includes('#how-it-works')
                    ? item.linkPath
                    : appendQueryParams(item.linkPath, adsQuery)
                }
                passHref
              >
                <a onClickCapture={e => handleSlideClick(e, item.linkPath)}>
                  <div className={classes.carouselCellMainCover}>
                    <div className={classes.carouselCellMainCoverText}>
                      <h1
                        className={classes.cardTitle}
                        style={{ color: carousalSetting.textColor }}
                      >
                        {item.title}
                      </h1>
                      <p
                        className={classes.cardDescription}
                        style={{ color: carousalSetting.textColor }}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </Container>
  );
};

SliderComponent.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SliderComponent;
