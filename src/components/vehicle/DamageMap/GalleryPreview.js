/* eslint-disable no-underscore-dangle */
import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Grid, Typography, makeStyles, useMediaQuery } from '@material-ui/core';
import FilterIcon from '@material-ui/icons/FilterNone';
import Box from '@material-ui/core/Box';
import './meep.css';

const useStyles = makeStyles(theme => ({
  galleryContainer: {
    width: 486,
    marginTop: 25,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      background: theme.palette.secondary.main,
      height: 150,
      padding: 32,
    },
  },
  galleryItemWrapper: {
    marginTop: theme.spacing(1.0),
    position: 'relative',
    left: '20%',
    [theme.breakpoints.up('xl')]: {
      width: '250% !important',
      left: '40%',
    },
    [theme.breakpoints.up(1800)]: {
      width: '240% !important',
      left: '35%',
    },
    [theme.breakpoints.up(1370)]: {
      width: '200%',
    },
    [theme.breakpoints.down(1370)]: {
      width: '155%',
      left: 20,
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
      width: 350,
    },
  },
  nextImageArrow: {
    position: 'absolute',
    right: 10,
    zIndex: 11,
    color: '#FFFFFF',
    outline: 'none',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
      paddingTop: 9,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 33,
      paddingTop: 25,
    },
    [theme.breakpoints.up(2000)]: {
      right: 10,
    },
    [theme.breakpoints.down(2000)]: {
      right: 20,
    },
    [theme.breakpoints.down(1400)]: {
      right: 10,
    },
    [theme.breakpoints.up(2000)]: {
      paddingTop: 35,
    },
  },
  prevImageArrow: {
    position: 'absolute',
    left: 14,
    zIndex: 11,
    color: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
      paddingTop: 9,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 33,
      paddingTop: 25,
    },
    [theme.breakpoints.down(1400)]: {
      left: 31,
    },
  },
  column1: {
    float: 'left',
    width: '20%',
    padding: 10,
    [theme.breakpoints.down(1370)]: {
      width: '25%',
    },
    [theme.breakpoints.up(1500)]: {
      width: '16%',
      paddingTop: 17,
    },
    [theme.breakpoints.up(2000)]: {
      width: '14%',
    },
  },
}));

export default function GalleryPreview(props) {
  const isLg = useMediaQuery(theme => theme.breakpoints.up(1370));
  const isXll = useMediaQuery(theme => theme.breakpoints.up(2000));

  const [arrowPosition, setArrowPosition] = React.useState(0);

  const imageIndex = () => {
    if (isXll) {
      return 7;
    } else if (isLg && !isXll) {
      return 6;
    } else {
      return 4;
    }
  };

  let imgIndex = imageIndex();
  const classes = useStyles();
  const { pictureList, handleOpenGallery } = props;
  const myLoop = () => {
    const picArray = [];
    let i = arrowPosition;
    imgIndex += arrowPosition;
    for (i; i < imgIndex; i += 1) {
      if (pictureList.length > i) {
        picArray.push(pictureList[i]);
      } else {
        break;
      }
    }
    return picArray;
  };

  const prevImage = () => {
    setArrowPosition(arrowPosition - 1);
    myLoop();
  };

  const nextImage = () => {
    setArrowPosition(arrowPosition + 1);
    myLoop();
  };
  return (
    <Grid
      className={classes.galleryContainer}
      container
      alignItems="center"
      direction="column"
      wrap="nowrap"
    >
      <Grid item container>
        <FilterIcon />
        <Typography>Gallery</Typography>
      </Grid>
      <Grid
        className={classes.galleryItemWrapper}
        item
        container
        alignItems="flex-end"
        wrap="nowrap"
        justifyContent="space-between"
      >
        {!!pictureList.length && (
          <>
            <div className="slideImage1">
              {arrowPosition !== 0 && (
                <a
                  className={classes.prevImageArrow}
                  onClick={() => prevImage()}
                  role="link"
                  tabIndex="0"
                  onKeyDown={() => {}}
                >
                  ❮
                </a>
              )}
              {myLoop().map((item, index) => (
                <div key={item._id} className={classes.column1}>
                  <Box onClick={handleOpenGallery}>
                    <Image
                      className={item.pin ? 'demo glow' : 'demo'}
                      src={item.picture}
                      alt={`pin${index}`}
                      layout="responsive"
                      width={400}
                      height={300}
                      priority
                    />
                  </Box>
                </div>
              ))}
              {imgIndex < pictureList.length && (
                <a
                  className={classes.nextImageArrow}
                  onClick={() => nextImage()}
                  role="link"
                  tabIndex="-1"
                  onKeyUp={() => {}}
                >
                  ❯
                </a>
              )}
            </div>
          </>
        )}
      </Grid>
    </Grid>
  );
}

GalleryPreview.propTypes = {
  pictureList: PropTypes.array.isRequired,
  handleOpenGallery: PropTypes.func.isRequired,
};
