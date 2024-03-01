import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isMobileSelector, prospectData } from 'src/redux/selectors';
import { logoutUser } from 'src/redux/actions/user';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Icon from '@material-ui/core/Icon';
import HandleTour from 'components/shared/HandleTour';
import CustomWebMenuItem from 'components/shared/MenuItem/CustomWebMenuItem';
import MobileMenuItem from 'components/shared/MenuItem/MobileMenuItem';

import { RideShareSeo } from 'src/api';
import FacebookIcon from 'assets/facebook.svg';
import LinkedInIcon from 'assets/linkedin.svg';
import InstaIcon from 'assets/insta.jpg';
import TyreIcon from 'assets/tyre_protector.svg';
import Logo from 'assets/logo_300.png';

import { applyAdsQuery, appendQueryParams } from '@/utils/commonUtils';
import { SiteUrl } from '../../../constants';

const useStyles = makeStyles(theme => ({
  socialIcon: {
    paddingLeft: '20%',
  },
  routeTab: {
    margin: theme.spacing(1),
  },
  activeRouteTab: {
    margin: theme.spacing(1),
  },
  activeIndicator: {
    width: '100%',
    background: '#FD151B',
    height: 3,
    position: 'absolute',
    padding: '0px 8px',
    bottom: -6,
    left: 0,
  },
  exitIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing(1),
    color: '#A4A4A4',
  },
  childrenContainer: {
    height: '100%',
    flexGrow: 1,
    paddingTop: '65px'
    // [theme.breakpoints.up('md')]: {
    //   paddingTop: '4%',
    // },
    // [theme.breakpoints.down(1200)]: {
    //   paddingTop: '5%',
    // },
    // [theme.breakpoints.down('sm')]: {
    //   paddingTop: '13%',
    // },
  },
  footerCommon: {
    backgroundColor: '#051741',
    color: theme.palette.common.white,
    backgroundImage: `url(${TyreIcon})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right',
  },
  footerMobile: {
    padding: '50px 18px 12px',
  },
  footerLink: {
    margin: '10px 15px',
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
  },
  footer: {
    [theme.breakpoints.up('lg')]: {
      padding: '0px 180px',
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      padding: '0px 150px',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      padding: '0px 80px',
    },
    [theme.breakpoints.down('md')]: {
      padding: '0px 30px',
    },
  },
  socialMediaButton: {
    width: 50,
    height: 50,
    border: '1px solid rgba(255,255,255,0.3)',
    margin: 5,
  },
  socialMediaIcon: {
    width: 20,
    height: 20,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
  copyright: {
    borderTop: '1px solid #E6E9EF',
  },
  menuItem: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  iconButton: {
    backgroundImage: `url(${Logo})`,
    height: 45,
    maxWidth: 200,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    [theme.breakpoints.down(330)]: {
      width: 150,
    },
    [theme.breakpoints.up(330)]: {
      width: 200,
    },
  },
  menuType: {
    borderRadius: 0,
    width: 'auto',
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  menuGrid: {
    maxHeight: 90,
  },
  tutorial: {
    maxWidth: 32,
  },
  motopiaLink: {
    textDecoration: 'none',
    [theme.breakpoints.up(320)]: {
      padding: '6px 8px',
    },
  },
  toolbar: {
    [theme.breakpoints.down(322)]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}));

function Layout(props) {
  const classes = useStyles();
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [isTourOpen, setIsTourOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [pickupLocations, setPickupLocations] = React.useState([]);
  const [isHamOpen, setIsHamOpen] = React.useState(false);
  const [isSearchPage, setIsSearchPage] = React.useState(false);
  const pathname = router.pathname.split('/')[1];
  const [isHomeOpened, setisHomeOpened] = React.useState(undefined);
  const [isMenuOpened, setIsMenuOpened] = React.useState(undefined);

  const getPickupLocations = useCallback(async () => {
    const rideShareCities = await RideShareSeo.getRideSharesLocation();
    const activeLocations = rideShareCities.data.filter(
      city => city.active === true
    );
    const locations = activeLocations.map(city => ({
      ...city,
      url: city.url.replace('https://www.gomotopia.com', ''),
    }));
    setPickupLocations(locations);
  }, []);

  useEffect(() => {
    getPickupLocations();
  }, [getPickupLocations]);
  useEffect(() => {
    setisHomeOpened(localStorage.getItem('homeOpen'));
    setIsMenuOpened(localStorage.getItem('menuOpen'));
    if (!matches) {
      setIsHamOpen(false);
    }
    if (SiteUrl.includes(pathname) && (!isHomeOpened || !isMenuOpened)) {
      setIsTourOpen(true);
    } else {
      setIsTourOpen(false);
    }
    if (pathname === 'search-cars') {
      setIsSearchPage(true);
    }
  }, [pathname, matches, isHomeOpened, isMenuOpened]);
  const headerSteps = [
    {
      selector: matches ? '[data-tut="Search"]' : '[data-tut="Search Car"]',
      content: () => <Typography>Explore Inventory</Typography>,
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'left',
    },
    {
      selector: '[data-tut="Finance"]',
      content: () => <Typography>Get a Credit Pre-Approval</Typography>,
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'left',
    },
    {
      selector: '[data-tut="Trade-In"]',
      content: () => <Typography>Trade your car with us</Typography>,
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'left',
    },
    {
      selector: '[data-tut="RideShare"]',
      content: () => <Typography>Apply for a Rideshare Rental</Typography>,
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'left',
    },
  ];
  const hamSteps = [
    {
      selector: '[data-tut="Menu"]',
      content: () => <Typography>Explore Options</Typography>,
      style: {
        backgroundColor: '#001B5D',
        color: '#FFF',
      },
      position: 'left',
    },
  ];

  const [showProfileDialog, setProfileDialogState] = useState(false);
  const handleProfileDialog = () => setProfileDialogState(!showProfileDialog);

  const handleLogout = () => {
    props.logoutUser();
    handleProfileDialog();
    router.push({ pathname: '/', query: { ...adsQuery } });
  };
  const closeTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('homeOpen', true);
  };

  const tutorialOpen = path => {
    if (path === '/') {
      setIsMenuOpened(false);
      setIsTourOpen(true);
    } else {
      props.tutorialOpen(path);
    }
  };

  const renderFooterSections = () => (
    <Grid item container alignItems="center">
      {/* <Typography
        className={classes.footerLink}
        color="inherit"
        variant="body1"
      >
        How Motopia Works
      </Typography> */}
      <Link href={appendQueryParams('/contact-us', adsQuery)}>
        <a style={{ textDecoration: 'none' }}>
          <Typography
            style={{ cursor: 'pointer' }}
            className={classes.footerLink}
            color="inherit"
            variant="body1"
          >
            Contact Us
          </Typography>
        </a>
      </Link>
      <Link href={appendQueryParams('/trade-in', adsQuery)}>
        <a style={{ textDecoration: 'none' }}>
          <Typography
            style={{ cursor: 'pointer' }}
            className={classes.footerLink}
            color="inherit"
            variant="body1"
          >
            Value your trade
          </Typography>
        </a>
      </Link>
      <Link href={appendQueryParams('/about', adsQuery)}>
        <a style={{ textDecoration: 'none' }}>
          <Typography
            style={{ cursor: 'pointer' }}
            className={classes.footerLink}
            color="inherit"
            variant="body1"
          >
            About Us
          </Typography>
        </a>
      </Link>
      {/* NOTE: this block from social */}
      <Link href={appendQueryParams('/terms-of-use', adsQuery)}>
        <a style={{ textDecoration: 'none' }}>
          <Typography
            style={{ cursor: 'pointer' }}
            className={classes.footerLink}
            color="inherit"
            variant="body1"
          >
            Terms of Use
          </Typography>
        </a>
      </Link>
      <Link href={appendQueryParams('/privacy-policy', adsQuery)}>
        <a style={{ textDecoration: 'none' }}>
          <Typography
            style={{ cursor: 'pointer' }}
            className={classes.footerLink}
            color="inherit"
            variant="body1"
          >
            Privacy Policy
          </Typography>
        </a>
      </Link>
    </Grid>
  );

  const renderSocialMediaButtons = gridSize => (
    <Grid item xs={gridSize} className={classes.socialIcon} container>
      <Grid item container>
        <Button
          href="https://www.facebook.com/GoMotopia-109876917419476/"
          variant="outlined"
          classes={{ root: classes.socialMediaButton }}
        >
          <img
            className={classes.socialMediaIcon}
            src={FacebookIcon}
            alt="facebook"
          />
        </Button>
        <Button
          href="https://www.instagram.com/go.motopia/?hl=en"
          variant="outlined"
          classes={{ root: classes.socialMediaButton }}
        >
          <img
            className={classes.socialMediaIcon}
            src={InstaIcon}
            alt="instagram"
          />
        </Button>
        <Button
          href="https://www.linkedin.com/company/gomotopia/"
          variant="outlined"
          classes={{ root: classes.socialMediaButton }}
        >
          <img
            className={classes.socialMediaIcon}
            src={LinkedInIcon}
            alt="linkedin"
          />
        </Button>
        {/* NOTE: Uncomment when gmail link will be provided */}
        {/* <Button variant="outlined" classes={{ root: classes.socialMediaButton }}>
          <img
            className={classes.socialMediaIcon}
            src={EnvelopeIcon}
            alt="email"
          />
        </Button> */}
      </Grid>
    </Grid>
  );

  const renderCopyright = () => (
    <Grid
      className={classNames(classes.copyright, classes.footer)}
      container
      alignItems="center"
      justifyContent="flex-start"
    >
      <Typography
        style={
          isSearchPage
            ? { margin: '8px 0px', marginLeft: 14 }
            : { margin: '20px 0px' }
        }
        variant="caption"
      >
        Copyright © {new Date().getFullYear()} Motopia. All Rights Reserved.
      </Typography>
    </Grid>
  );

  const assignSteps = () => {
    if (matches && isHamOpen) {
      return headerSteps;
    } else if (matches && !isHamOpen) {
      return hamSteps;
    } else if (!matches && isMenuOpen) {
      return headerSteps;
    } else if (!matches && !isMenuOpen) {
      return hamSteps;
    } else {
      return [];
    }
  };
  const handleChange = (panel, isOpened) => {
    if (panel === 'menu') {
      localStorage.setItem('menuOpen', true);
      if (!isMenuOpened) {
        setIsMenuOpen(true);
        setIsTourOpen(true);
      }
      if (isOpened === false) {
        setIsMenuOpened(true);
      }
    }
  };
  const assignHamOpen = () => {
    setIsHamOpen(true);
  };
  return (
    <Grid
      style={{
        minHeight: '100vh',
        backgroundColor: props.backgroundColor,
      }}
      container
      direction="column"
      alignItems="center"
      justifyContent="space-between"
      wrap="nowrap"
    >
      <AppBar
        position="fixed"
        style={{
          borderBottom: `1px solid ${props.headerBorderBottomColor}`,
          background: 'white',
        }}
      >
        <Toolbar className={classes.toolbar}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            wrap="nowrap"
          >
            <Link href={appendQueryParams('/', adsQuery)}>
              <a className={classes.motopiaLink}>
                <Icon className={classes.iconButton} />
              </a>
            </Link>
            <Grid item container justifyContent="flex-end">
              {matches ? (
                <MobileMenuItem
                  prospect={props.prospect}
                  handleChange={handleChange}
                  handleLogout={handleLogout}
                  tutorialOpen={tutorialOpen}
                  assignHamOpen={assignHamOpen}
                />
              ) : (
                <CustomWebMenuItem
                  pickupLocations={pickupLocations}
                  prospect={props.prospect}
                  handleChange={handleChange}
                  handleLogout={handleLogout}
                  tutorialOpen={tutorialOpen}
                />
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid container className={classes.childrenContainer}>
        {props.children}
      </Grid>
      {matches ? (
        <Grid
          className={classNames(classes.footerCommon)}
          container
          alignItems="center"
          wrap="nowrap"
          direction="column"
        >
          <Grid
            className={classes.footerMobile}
            container
            alignItems="center"
            wrap="nowrap"
            direction="column"
          >
            <Grid
              item
              xs={12}
              container
              direction="column"
              alignItems="flex-start"
              justifyContent="center"
              style={{ marginBottom: 50 }}
            >
              <Typography style={{ margin: 10 }} color="inherit" variant="h5">
                MOTOPIA
              </Typography>
              {renderFooterSections()}
            </Grid>
            {renderSocialMediaButtons(12)}
          </Grid>
          {renderCopyright()}
        </Grid>
      ) : (
        <>
          {!isSearchPage && (
            <Grid
              className={classes.footerCommon}
              container
              alignItems="center"
              wrap="nowrap"
              direction="column"
            >
              <Grid
                style={{ margin: '70px 0px' }}
                className={classes.footer}
                container
                alignItems="center"
                wrap="nowrap"
              >
                <Grid
                  item
                  xs={7}
                  container
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="center"
                >
                  <Typography
                    style={{ margin: 10 }}
                    color="inherit"
                    variant="h5"
                  >
                    MOTOPIA
                  </Typography>
                  {renderFooterSections()}
                </Grid>
                {renderSocialMediaButtons(5)}
              </Grid>
              {renderCopyright()}
            </Grid>
          )}
        </>
      )}
      {!isHomeOpened && (
        <HandleTour
          isOpen={isTourOpen}
          steps={assignSteps()}
          handleClose={closeTour}
        />
      )}
    </Grid>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string,
  headerBorderBottomColor: PropTypes.string,
  headerTextColor: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  prospect: PropTypes.shape({
    firstName: PropTypes.string,
    token: PropTypes.string,
  }),
  logoutUser: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  tutorialOpen: PropTypes.func,
};

Layout.defaultProps = {
  backgroundColor: '#fff',
  headerBorderBottomColor: '#44687C',
  headerTextColor: '#001C5E',
  prospect: {},
};

const mapStateToProps = createStructuredSelector({
  prospect: prospectData,
  isMobile: isMobileSelector,
});

const mapDispatchToProps = {
  logoutUser,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Layout)
);
