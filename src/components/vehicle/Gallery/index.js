/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import { createTheme, makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowIcon from '@material-ui/icons/ArrowRightAlt';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { BORDER_COLOR } from 'src/constants';
import ImageMapper from 'react-image-mapper';
import VehicleInfo from './VehicleInfo';
import './gallerySlideShow.css';
import { SCALABILITY_INDEX } from '../constants';

const breakVal = createTheme({
  breakpoints: {
    values: {
      xs: 550,
      sm: 768,
      md: 960,
      lg: 1400,
      xl: 1950,
    },
  },
});
const useStyles = makeStyles(theme => ({
  galleryWrapper: {
    position: 'relative',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'block'
    },
  },
  galleryContainer: {
    background: `linear-gradient(180deg, ${theme.palette.secondary.main},
       ${theme.palette.secondary.main} 40%, ${theme.palette.common.white} 40%,
        ${theme.palette.common.white} 100%)`,
    flexGrow: 0,
    maxWidth: '66.666667%',
    flexBasis: '66.666667%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      flexBasis: '100%',
    },
  },
  vehicleInfoContainer: {
    borderLeft: `1px solid ${BORDER_COLOR}`,
    [theme.breakpoints.down('sm')]: {
      width: 0,
      borderLeft: 'none',
    },
  },
  carouselContainer: {
    width: '900px'
  },
  carouselImage: {
    height: '20%',
    width: '100%',
    margin: '13px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  carouselTrack: {
    minHeight: 500,
    height: '100%',
    marginBottom: theme.spacing(8),
    paddingBottom: theme.spacing(3),
  },
  carouselDotList: {
    alignItems: 'center',
    height: 70,
  },
  lightBoxCaption: {
    width: '100%',
    textAlign: 'center',
  },
  damageDialogCategory: {
    textTransform: 'uppercase',
    marginTop: theme.spacing(1),
    color: 'black',
    padding: 13,
    fontWeight: 700,
    fontSize: 22,
    width: '100%'
  },
  damageDialogDescription: {
    color: 'black',
    width: 225,
    fontSize: '12px !important',
    height: 63,
    alignContent: 'center',
    overflowY: 'auto'
  },
  brdr: {
    borderRadius: 28
  },
  damagePinDetailsBox: {
    position: 'absolute',
    width: 250,
    minHeight: 120,
    zIndex: 1300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1.25)}px ${theme.spacing(1.875)}px`,
    background: theme.palette.common.white,
  },
  damageDialogCloseIcon: {
    width: 16,
    height: 16,
    cursor: 'pointer',
  },
  damageDialogPreviousArrow: {
    transform: 'rotate(180deg)',
  },
  damageDialogActionButtons: {
    width: 65,
    marginTop: 12,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1111111
  },
  LightboxStyle: {
    position: 'relative',
    width: '520px',
    margin: '0 auto 15px',
    [theme.breakpoints.up('md')]: {
      height: 390
    },
    [theme.breakpoints.down('sm')]: {
      left: '6%',
      height: 300
    },
  },
  TypographyText: {
    fontSize: 13,
    display: 'flex',
    alignItems: 'center'
  },
  nextImageArrow: {
    position: 'absolute',
    zIndex: 11,
    cursor: 'pointer',
    outline: 'none',
    color: '#FFFFFF',
    [breakVal.breakpoints.down('xl')]: {
      right: 20,
      paddingTop: 28,
      fontSize: 50,
    },
    [breakVal.breakpoints.down('md')]: {
      right: 10,
      paddingTop: 20,
      fontSize: 50,
    },
    [breakVal.breakpoints.down('sm')]: {
      right: '2%',
      paddingTop: 20,
      fontSize: 40,
    },
    [breakVal.breakpoints.down('xs')]: {
      right: '21%',
      paddingTop: 10,
      fontSize: 37,
    },
  },
  prevImageArrow: {
    position: 'absolute',
    left: 5,
    zIndex: 11,
    color: '#FFFFFF',
    outline: 'none',
    cursor: 'pointer',
    [theme.breakpoints.down('xl')]: {
      left: 10,
      paddingTop: 38,
      fontSize: 50,
    },
    [theme.breakpoints.down('lg')]: {
      left: 10,
      paddingTop: 28,
      fontSize: 50,
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: 20,
      fontSize: 50,
    },
    [theme.breakpoints.down('sm')]: {
      left: 5,
      paddingTop: 20,
      fontSize: 40,
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: 10,
      fontSize: 37,
    },
  },
  imgBox: {
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      marginTop: 60
    },
  },
  disclaimer: {
    color: '#fff',
    backgroundColor: '#002f9e94',
    textAlign: 'center',
    padding: `${theme.spacing(5)}px`,
    [theme.breakpoints.only('xs')]: {
      padding: `${theme.spacing(2)}px 5px ${theme.spacing(2)}px`,
    },
    fontSize: 14,
  },
}));

const galleryTransition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function Gallery(props) {
  const classes = useStyles();
  const [popUpClass, setpopUpClass] = useState('fie');
  const [state, setState] = React.useState({
    showDrawer: false,
    showLightBox: false,
    lightBoxImageIndex: 0,
    selectedIndex: 0,
    arrowIndex: 5,
    selectedPin: null,
  });

  const {
    vehicleInformation,
    vehicleMileage,
    vehiclePrice,
    isGalleryOpen,
    isMobile,
  } = props;

  const { lightBoxImageIndex, showLightBox, selectedIndex, arrowIndex,
    selectedPin } = state;

  const handleDrawerOpen = () => {
    setState({ ...state, showDrawer: true });
  };

  const handleDrawerClose = () => {
    setState({ ...state, showDrawer: false });
  };

  const handleLightBoxOpen = imageIndex => () => {
    setState({ ...state, showLightBox: true, lightBoxImageIndex: imageIndex });
  };

  const handleLightBoxClose = () => {
    setState({ ...state, showLightBox: false });
  };

  const handleOnMovePrevImage = () => {
    const { picturesUrl } = props.vehicleInformation;
    setState({
      ...state,
      lightBoxImageIndex:
        (state.lightBoxImageIndex + picturesUrl.length - 1) %
        picturesUrl.length,
    });
  };

  const handleOnMoveNextImage = () => {
    const { picturesUrl } = props.vehicleInformation;
    setState({
      ...state,
      lightBoxImageIndex: (state.lightBoxImageIndex + 1) % picturesUrl.length,
    });
  };

  const showImage = Index => () => {
    setState({ ...state, selectedIndex: Index });
  };

  const myLoop = () => {
    const picArray = [];
    let i = arrowIndex - 5;
    for (i; i <= arrowIndex; i += 1) {
      if (vehicleInformation.picturesUrl.length > i) {
        picArray.push(vehicleInformation.picturesUrl[i]);
      }
    }
    return picArray;
  };
  const prevImage = () => {
    if (arrowIndex === 5) {
      return;
    }
    setState({ ...state, arrowIndex: (arrowIndex - 1) });
    myLoop();
  };

  const nextImage = () => {
    if (vehicleInformation.picturesUrl.length <= arrowIndex) {
      return;
    }
    setState({ ...state, arrowIndex: (arrowIndex + 1) });
    myLoop();
  };

  const assignArea = () => {
    let PinArea = [];
    if (myLoop()[selectedIndex].pin !== undefined) {
      PinArea = myLoop()[selectedIndex].pin.areas;
      return PinArea;
    }
    return PinArea;
  };

  const getTipPosition = (area, isPinDialog, isTip) => {
    const xAxis = area.coords[0];
    const yAxis = area.coords[1];
    // NOTE: get pin dialog position for mobile
    // dialog should not exceed mapper container
    // eslint-disable-next-line consistent-return
    const getMobilPosition = (x, y) => {
      const MAP_WIDTH = 245;
      if (x) {
        if (isPinDialog && x < 170) {
          return x * SCALABILITY_INDEX;
        } else if (isPinDialog && x >= 170 && x <= 350) {
          return (x * SCALABILITY_INDEX) - MAP_WIDTH / 2;
        } else if (isPinDialog && x > 350) {
          return (x * SCALABILITY_INDEX) - MAP_WIDTH;
        } else return x * SCALABILITY_INDEX;
      } else if (y) {
        return y * SCALABILITY_INDEX;
      }
    };
    if (isTip === true) {
      return {
        top: `${isMobile ? getMobilPosition(null, (yAxis - 15)) : (yAxis - 14)}px`,
        left: `${isMobile ? getMobilPosition((xAxis - 17), null) : (xAxis - 12)}px`
      };
    } else {
      return {
        top: `${isMobile ? getMobilPosition(null, yAxis) : ((yAxis - 14) + 10)}px`,
        left: `${isMobile ? 25 : ((xAxis - 12) - 130)}px`,
      };
    }
  };

  const handleNextPin = pinIndex => () =>
    setState({ ...state, selectedPin: (pinIndex + 1) % assignArea().length });

  const handlePrevPin = pinIndex => () =>
    setState({
      ...state, selectedPin: (pinIndex + assignArea().length - 1) % assignArea().length,
    });

  const assignDesc = () => {
    let PinDescription = [];
    if (myLoop()[selectedIndex].pin !== undefined) {
      PinDescription = myLoop()[selectedIndex].pin.description;
      return PinDescription;
    }
    return PinDescription;
  };

  const openPop = () => {
    setpopUpClass('fie');
  };

  const handleShowDamageDialog = Pin1 => () => {
    openPop();
    return setState({ ...state, selectedPin: Pin1 });
  };

  const handleCloseDamageDialog = () => setState({ ...state, selectedPin: -1 });

  const closePop = () => {
    setTimeout(() => {
      handleCloseDamageDialog();
    }, 300);
    setpopUpClass('fie out');
  };

  const sphereClass = (type) => {
    let className = '';
    switch (type) {
      case 'DAMAGE':
        className = 'sphereDamage';
        break;
      case 'FEATURE':
        className = 'sphereFeature';
        break;
      default:
        className = 'sphere';
    }
    return className;
  };

  const images = vehicleInformation.picturesUrl.map(image => image.picture);
  const extcolor = vehicleInformation.exteriorColor;
  return (
    <Dialog
      fullScreen
      open={isGalleryOpen}
      onClose={props.handleCloseGallery}
      TransitionComponent={galleryTransition}
    >
      <Grid className={classes.galleryWrapper} container wrap="nowrap">
        <Grid
          className={classes.galleryContainer}
          item
          container
          alignItems="center"
          justifyContent="center"
        >
          <Grid container>
            {vehicleInformation.picturesUrl.length > 0 ? (
              <>
                <div className="container">
                  {myLoop().length === 0 ? (
                    <div className={classes.LightboxStyle}>
                      <Box onClick={handleLightBoxOpen(selectedIndex)}>
                        <div className={classes.imgBox}>
                          <ImageMapper
                            src={vehicleInformation.picturesUrl[selectedIndex].picture}
                            width={isMobile ? 350 : 520}
                            imgWidth={520}
                            borderRadius={10}
                            lineWidth={0}
                            strokeColor="transparent"
                            fillColor="transparent"
                          />
                        </div>
                      </Box>
                    </div>
                  ) : (
                    <div className={classes.LightboxStyle}>
                      <Box onClick={handleLightBoxOpen(selectedIndex)} >
                        <div className={classes.imgBox}>
                          <ImageMapper
                            src={myLoop()[selectedIndex].picture}
                            width={isMobile ? 350 : 520}
                            imgWidth={520}
                            borderRadius={10}
                            lineWidth={0}
                            strokeColor="transparent"
                            fillColor="transparent"
                          />
                        </div>
                      </Box>
                      {assignArea() !== undefined && assignArea().map((area, areaIndex) => {
                        const damageDetails = assignDesc().find(
                          data => data.id === area.name
                        );
                        return (
                          <React.Fragment key={area.name + 1}>
                            <div
                              aria-describedby={area.name}
                              style={{ ...getTipPosition(area, false, true) }}
                              onClick={handleShowDamageDialog(areaIndex)}
                              className={sphereClass(damageDetails.type)}
                              id={damageDetails.type}
                              aria-hidden="true"
                            >
                              {damageDetails.type === 'DAMAGE' && (
                                <>{extcolor === 'RED' ?
                                  <div className="sphereDamageM">
                                    {/* NOTE: The m tag is for showing the damage sphere animation on the image
                                where no. of m is showing the no. of lines in sphere */}
                                    <m /><m /><m /><m /><m /><m /><m /><m /><m /><m />
                                  </div> :
                                  <div className="sphereDamage">
                                    {/* NOTE: The d tag is for showing the damage sphere animation on the image
                                where no. of d is showing the no. of lines in sphere */}
                                    <d /><d /><d /><d /><d /><d /><d /><d /><d /><d />
                                  </div>}
                                </>
                              )}
                              {damageDetails.type !== 'DAMAGE' && (
                                <>{extcolor === 'WHITE' ?
                                  <div className="sphere">
                                    {/* NOTE: The i tag is for showing the installed feature sphere animation on the image
                                    where no. of d is showing the no. of lines in sphere */}
                                    <i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                                  </div> :
                                  <div className="sphereFeature">
                                    {/* NOTE: The f tag is for showing the feature sphere animation on the image
                                    where no. of d is showing the no. of lines in sphere */}
                                    <f /><f /><f /><f /><f /><f /><f /><f /><f /><f />
                                  </div>}
                                </>
                              )}
                            </div>
                            {selectedPin === areaIndex && (
                            <div id="modal-container" className={popUpClass}>
                              <div className="modal-background" >
                                <div className="modal">
                                  <Paper
                                    className={classes.damagePinDetailsBox}
                                    id={area.name}
                                    style={{ ...getTipPosition(area, false, false) }}
                                  >
                                    <Grid
                                      container
                                      justifyContent="space-between"
                                      alignItems="center"
                                      wrap="nowrap"
                                    >
                                      {damageDetails && (
                                      <Typography
                                        className={classes.TypographyText}
                                        variant="button"
                                      >
                                        <FiberManualRecordIcon color="primary" fontSize="small" />
                                        <span style={{ paddingLeft: '3px' }}>{damageDetails.title}
                                        </span>
                                      </Typography>
                                      )}
                                      <CloseIcon
                                        classes={{
                                          root: classes.damageDialogCloseIcon,
                                        }}
                                        onClick={() => closePop()}
                                      />
                                    </Grid>
                                    <Grid container direction="column">
                                      {damageDetails && (
                                      <Typography
                                        className={classes.damageDialogCategory}
                                        variant="body1"
                                      >
                                        {damageDetails.category}
                                      </Typography>
                                      )}
                                      {damageDetails && (
                                      <Typography
                                        className={classes.damageDialogDescription}
                                        variant="body1"
                                      >
                                        {damageDetails.description}
                                      </Typography>
                                      )}
                                    </Grid>
                                    <Grid container justifyContent="space-between">
                                      <Button
                                        color="secondary"
                                        className={classes.damageDialogActionButtons}
                                        onClick={handlePrevPin(areaIndex)}
                                      >
                                        <ArrowIcon
                                          className={classes.damageDialogPreviousArrow}
                                        />
                                        {/* NOTE: Prev is the button along with text */}
                                        Prev
                                      </Button>
                                      <Button
                                        color="secondary"
                                        className={classes.damageDialogActionButtons}
                                        onClick={handleNextPin(areaIndex)}
                                      >
                                        {/* NOTE: Next is the button along with text */}
                                        Next <ArrowIcon />
                                      </Button>
                                    </Grid>
                                  </Paper>
                                </div>
                              </div>
                            </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}
                  <div className="slideImage">
                    {arrowIndex !== 5 && (
                      <a
                        className={classes.prevImageArrow}
                        onClick={() => prevImage()}
                        role="link"
                        tabIndex="0"
                        onKeyPress={() => { }}
                      >❮
                      </a>
                    )}
                    {myLoop().map((item, index) => (
                      <div
                        key={item._id}
                        className={index === selectedIndex ? 'column-active' : 'column'}
                      >
                        <Box onClick={showImage(index)}>
                          <img
                            className={item.pin ? 'demo cursor widthfull glow1' :
                              'demo cursor widthfull'}
                            src={item.picture}
                            alt="picArray"
                          />
                        </Box>
                      </div>
                    ))}
                    {arrowIndex < (vehicleInformation.picturesUrl.length - 1) && (
                      <a
                        className={classes.nextImageArrow}
                        onClick={() => nextImage()}
                        role="link"
                        tabIndex="-1"
                        onKeyPress={() => { }}
                      >❯
                      </a>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Typography variant="h4">
                No pictures available for this vehicle
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          className={classes.vehicleInfoContainer}
          container
          direction="column"
          wrap="nowrap"
        >
          <VehicleInfo
            handleCloseGallery={props.handleCloseGallery}
            vehicleMileage={vehicleMileage}
            vehiclePrice={vehiclePrice}
            vehicleInformation={vehicleInformation}
            isMobile={isMobile}
            showDrawer={state.showDrawer}
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
            handleOpenProspectForm={props.handleOpenProspectForm}
          />
        </Grid>
      </Grid>
      {showLightBox && (
        <Lightbox
          mainSrc={images[lightBoxImageIndex]}
          nextSrc={images[(lightBoxImageIndex + 1) % images.length]}
          prevSrc={
            images[(lightBoxImageIndex + images.length - 1) % images.length]
          }
          onCloseRequest={handleLightBoxClose}
          onMovePrevRequest={handleOnMovePrevImage}
          onMoveNextRequest={handleOnMoveNextImage}
          reactModalStyle={{
            overlay: { zIndex: 1500 },
          }}
          imagePadding={50}
          imageCaption={
            <Typography className={classes.lightBoxCaption} variant="caption">
              {`${lightBoxImageIndex + 1}/${images.length}`}
            </Typography>
          }
        />
      )}
    </Dialog>
  );
}

Gallery.propTypes = {
  isGalleryOpen: PropTypes.bool.isRequired,
  handleCloseGallery: PropTypes.func.isRequired,
  vehicleInformation: PropTypes.object,
  vehicleMileage: PropTypes.string,
  vehiclePrice: PropTypes.string,
  isMobile: PropTypes.bool,
  handleOpenProspectForm: PropTypes.func.isRequired,
};

Gallery.defaultProps = {
  vehicleInformation: {},
  vehicleMileage: '',
  vehiclePrice: '',
  isMobile: false,
};

export default Gallery;
