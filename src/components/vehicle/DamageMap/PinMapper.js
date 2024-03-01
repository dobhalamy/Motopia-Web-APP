/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ImageMapper from 'react-image-mapper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ArrowIcon from '@material-ui/icons/ArrowRightAlt';
import ArrowRightIcon from 'assets/arrow_right_lightblue.svg';
import ArrowLeftIcon from 'assets/arrow_left_lightblue.svg';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { isMobileSelector } from 'src/redux/selectors';
import { BORDER_COLOR } from 'src/constants';
import PendingDeal from 'assets/vehicle/pendingDeal.png';
import { CIRCLE_RADIUS, PIN_SHAPE, SCALABILITY_INDEX } from '../constants';
import './meep.css';

const styles = theme => ({
  damageMapPin: {
    position: 'absolute',
    transform: 'translate3d(-50%, -50%, 0)',
    cursor: 'pointer',
    zIndex: 100,
    height: 30,
    width: 30,
    display: 'block',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  damageMapDefaultDamagePin: {
    backgroundColor: '#fd151b'
  },
  damageMapDefaultFeaturePin: {
    backgroundColor: '#001c5e'
  },
  damageMapSelectedPin: {
    backgroundColor: '#ffae00'
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
  pinMapperButton: {
    height: 60,
    margin: theme.spacing(1),
    border: `1px solid ${BORDER_COLOR}`
  },
  TypographyText: {
    fontSize: 13,
    display: 'flex',
    alignItems: 'center'
  },
  pendingDeal: {
    width: '100pt',
    position: 'relative',
    bottom: 145,
    zIndex: 2,
    height: 0,
    marginLeft: 15,
    [theme.breakpoints.down('sm')]: {
      bottom: 90
    },
    [theme.breakpoints.up(1000)]: {
      bottom: 100
    },
  },
  PendingDealImg: {
    width: '80pt',
    [theme.breakpoints.down('sm')]: {
      width: 55
    },
    [theme.breakpoints.up(1000)]: {
      width: 70
    },
  },
  pndngTypo: {
    fontFamily: 'Campton SemiBold',
    color: 'black',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem'
    },
  }
});

class PinMapper extends React.Component {
  state = {
    selectedPin: null,
    damageMap: {
      name: 'my-map',
      areas: [
        { name: '1', shape: PIN_SHAPE, coords: [170, 100, CIRCLE_RADIUS] },
        { name: '2', shape: PIN_SHAPE, coords: [245, 200, CIRCLE_RADIUS] },
        { name: '3', shape: PIN_SHAPE, coords: [420, 30, CIRCLE_RADIUS] },
      ],
    },
    damageMapDescriptions: [
      {
        id: '1',
        title: 'feature',
        category: 'Wheels',
        description: '19 inch alloy wheels',
      },
      {
        id: '2',
        title: 'Damage',
        category: 'Scratch',
        description: 'Small scratch after shopping cart',
      },
      {
        id: '3',
        title: 'Damage',
        category: 'Scratch',
        description: 'Small paint scratch.',
      },
    ],
    activeImageIndex: 0,
    activeImage: null,
    popclass: ''
  };

  componentDidMount() {
    this.setActiveImagePins(0);
  }

  setActiveImagePins = (activeImageIndex) => {
    const { pictureList } = this.props;
    const hasPins = pictureList[activeImageIndex].pin;
    const activeImage = pictureList[activeImageIndex];

    this.setState({
      activeImageIndex,
      activeImage: {
        id: activeImage._id,
        picture: activeImage.picture
      },
      damageMap: {
        name: 'pin-map',
        areas: hasPins ? [...activeImage.pin.areas] : []
      },
      damageMapDescriptions: hasPins
        ? [...activeImage.pin.description]
        : [],
      selectedPin: null
    });
  }

  getTipPosition(area, isPinDialog, isTip) {
    const { isMobile } = this.props;
    const xAxis = area.coords[0];
    const yAxis = area.coords[1];
    // NOTE: get pin dialog position for mobile
    // dialog should not exceed mapper container
    // eslint-disable-next-line consistent-return
    const getMobilePosition = (x, y) => {
      const MAP_WIDTH = 250;

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
        top: `${isMobile ? getMobilePosition(null, (yAxis - 15)) : (yAxis - 14)}px`,
        left: `${isMobile ? getMobilePosition((xAxis - 17), null) : (xAxis - 12)}px`
      };
    } else {
      return {
        top: `${isMobile ? getMobilePosition(null, yAxis) : ((yAxis - 14) + 5)}px`,
        left: `${isMobile ? getMobilePosition(xAxis, null) : ((xAxis - 12) - 130)}px`,
      };
    }
  }

  // HANDLE DAMAGE MAP PINS

  handleShowDamageDialog = selectedPin => () => {
    this.setState({ selectedPin });
    this.openPop();
  };

  handleCloseDamageDialog = () => this.setState({ selectedPin: null });

  handleNextPin = pinIndex => () => {
    const { areas } = this.state.damageMap;
    this.setState({ selectedPin: (pinIndex + 1) % areas.length });
  };

  handlePrevPin = pinIndex => () => {
    const { areas } = this.state.damageMap;
    this.setState({
      selectedPin: (pinIndex + areas.length - 1) % areas.length,
    });
  };

  handleNextImage = () => {
    this.setActiveImagePins((this.state.activeImageIndex + 1) % this.props.pictureList.length);
  }

  handlePrevImage = () => {
    this.setActiveImagePins(
      (this.state.activeImageIndex + this.props.pictureList.length - 1)
      % this.props.pictureList.length);
  }

  openPop = () => {
    this.setState({ popclass: 'five' });
  };

  openPopNoClass = () => this.setState({ popclass: ' ' });

  closePop = () => {
    setTimeout(
      this.handleCloseDamageDialog.bind(), 500);
    this.setState({ popclass: 'five out' });
  };

  close = () => this.setState({ popclass: ' ' });

  assignSphereClass = (type) => {
    let sphereClass = '';
    switch (type) {
      case 'DAMAGE':
        sphereClass = 'sphereDamage';
        return sphereClass;
      case 'FEATURE':
        sphereClass = 'sphereFeature';
        return sphereClass;
      default:
        sphereClass = 'sphere';
        return sphereClass;
    }
  }

  render() {
    const {
      classes,
      pictureList,
      isMobile,
      exteriorColor,
      availabilityStatus
    } = this.props;

    const {
      selectedPin, damageMap, damageMapDescriptions, activeImage, popclass
    } = this.state;

    const vehicleHasPictures = pictureList && !!pictureList.length;
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        wrap="nowrap"
      >
        {vehicleHasPictures && activeImage ? (
          <>
            <div style={{ position: 'relative' }}>
              <ImageMapper
                src={activeImage.picture}
                map={damageMap}
                width={isMobile ? 350 : 520}
                imgWidth={520}
                borderRadius={10}
                lineWidth={0}
                strokeColor="transparent"
                fillColor="transparent"
                onImageClick={this.props.handleOpenGallery}
              />
              {availabilityStatus === 'D' &&
                <div className={classes.pendingDeal} >
                  <img src={PendingDeal} alt="Pending_Deal" className={classes.PendingDealImg}/>
                  <Typography variant="h6" className={classes.pndngTypo}>Pending Deal</Typography>
                </div>}
              {!!damageMap.areas.length &&
                damageMap.areas.map((area, areaIndex) => {
                  const damageDetails = damageMapDescriptions.find(
                    data => data.id === area.name
                  );
                  return (
                    <React.Fragment key={area.name + 1}>
                      <div
                        aria-describedby={area.name}
                        style={{ ...this.getTipPosition(area, false, true) }}
                        onClick={this.handleShowDamageDialog(areaIndex)}
                        className={this.assignSphereClass(damageDetails.type)}
                        aria-hidden="true"
                      >
                        {damageDetails.type === 'DAMAGE' && (
                          <>{exteriorColor === 'RED' ?
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
                          <>{exteriorColor === 'WHITE' || exteriorColor === 'SILVER' ?
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
                        <div id="modal-container" className={popclass}>
                          <div className="modal-background" >
                            <div className="modal">
                              <Paper
                                className={classes.damagePinDetailsBox}
                                id={area.name}
                                style={{
                                  ...this.getTipPosition(area, true, false),
                                }}
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
                                    onClick={() => this.closePop()}
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
                                    onClick={this.handlePrevPin(areaIndex)}
                                  >
                                    <ArrowIcon
                                      className={classes.damageDialogPreviousArrow}
                                    />
                                    Prev
                                  </Button>
                                  <Button
                                    color="secondary"
                                    className={classes.damageDialogActionButtons}
                                    onClick={this.handleNextPin(areaIndex)}
                                  >
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
            <Grid container justifyContent="center">
              <Button
                className={classes.pinMapperButton}
                onClick={this.handleNextImage}
              >
                <img src={ArrowLeftIcon} alt="arrow_left" />
              </Button>
              <Button
                className={classes.pinMapperButton}
                onClick={this.handlePrevImage}
              >
                <img src={ArrowRightIcon} alt="arrow_right" />
              </Button>
            </Grid>
          </>
        ) : (
          <Typography variant="h5">
            No vehicle pictures are available
          </Typography>
        )}
      </Grid>
    );
  }
}

PinMapper.propTypes = {
  pictureList: PropTypes.array,
  exteriorColor: PropTypes.string,
  isMobile: PropTypes.bool,
  handleOpenGallery: PropTypes.func.isRequired,
  availabilityStatus: PropTypes.string.isRequired
};

PinMapper.defaultProps = {
  pictureList: null,
  exteriorColor: '',
  isMobile: false,
};

const mapStateToProps = createStructuredSelector({
  isMobile: isMobileSelector,
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles, { withTheme: true })
)(PinMapper);
