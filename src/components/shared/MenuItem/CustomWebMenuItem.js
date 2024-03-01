import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import './index.css';
import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
} from '@material-ui/icons';
import { useRouter } from 'next/router';
import { RideShareSeo } from 'src/api';
import { CSSTransition } from 'react-transition-group';
import Button from '@material-ui/core/Button';
import videoLaunch from 'src/assets/launch.png';
import { Box, Grid } from '@material-ui/core';
import { applyAdsQuery, appendQueryParams } from '@/utils/commonUtils.js';
import { isEmpty } from 'lodash';
import VideoDialog from '../VideoDialog';
import { ROUTE_CONSTANTS } from '../../../constants';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    overflowY: 'auto',
  },
  nested: {
    paddingLeft: theme.spacing(4),
    width: '100%',
  },
  expansionDetails: {
    right: 0,
    position: 'absolute',
    marginRight: '-14px',
    top: 42,
    minWidth: 200,
    maxHeight: 510,
  },
  links: {
    color: 'black',
    textDecoration: 'none',
    borderBottom: '1px solid #29282E',
    width: '100%',
  },
  iconClass: {
    marginTop: 4,
  },
  buttonClass: {
    border: 'none',
    backgroundColor: '#fff',
    width: '100%',
  },
  borders: {
    borderBottom: '1px solid #29282E',
    width: '100%',
  },
  tutorial: {
    maxWidth: 32,
  },
  signIn: {
    color: 'black',
    textDecoration: 'none',
    width: '100%',
    display: 'flex',
  },
  invisibleDiv: {
    width: '200%',
    height: 2000,
    position: 'absolute',
  },
  locationList: {
    display: 'block',
    position: 'absolute',
    top: '40px',
    left: 0,
    zIndex: 100,
    backgroundColor: '#fafafa',
    border: '1px solid black',
    borderRadius: '0.5rem',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '180px',
    maxHeight: '500px', // Limit the maximum height to prevent excessive scrolling
    overflowY: 'auto', // Enable vertical scrolling if content exceeds maxHeight
  },
  location: {
    padding: '0.5rem',
    color: '#4E4E51',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#cacacc',
    },
  },
}));

const CustomWebMenuItem = props => {
  const classes = useStyles();
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const actualPath = router.asPath;
  const [menus, setmenus] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [subMenu, setsubMenu] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [rideshareVideoOpen, setRideshareVideoOpen] = useState(false);

  const loadListItem = async () => {
    const response = await RideShareSeo.getAllPagesRoutes();
    if (response.data) {
      const sortedMenu = response.data.sort((a, b) =>
        a.cityName.localeCompare(b.cityName)
      );
      const subMenuVal = sortedMenu.map(el => ({
        text: el.cityName,
        value: el.cityName,
        action: el.url,
      }));
      setsubMenu(subMenuVal);
    }
    const menuVal = ROUTE_CONSTANTS.map(el => ({
      text: el.routeTitle,
      value: el.routeTitle,
      action: el.routeValue,
    }));
    setmenus(menuVal);
  };

  useEffect(() => {
    loadListItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    handleChange,
    prospect,
    handleLogout,
    tutorialOpen,
    pickupLocations,
  } = props;

  const handleMenuClick = () => {
    setNavOpen(!navOpen);
    handleChange('menu', !navOpen);
  };
  const onHover = () => {
    setNavOpen(false);
    setIsHovered(true);
  };
  const offHover = () => {
    setIsHovered(false);
  };

  const assignDataTut = routeVal => {
    switch (routeVal) {
      case 'Search Cars':
        return 'Search';
      case 'Finance':
        return 'Finance';
      case 'Trade-in':
        return 'Trade-In';
      case 'Ride-share':
        return 'RideShare';
      case 'How-it-works':
        return 'How-it-works';
      default:
        return '';
    }
  };
  const handleGoToLink = routeVal => {
    if (routeVal === 'Search Car') {
      router.push({
        pathname: '/search-cars',
        query: { ...adsQuery },
      });
    } else if (routeVal === 'RideShare') {
      router.push({
        pathname: '/ride-share',
        query: { ...adsQuery },
      });
    } else if (routeVal === 'Blog') {
      router.push({
        pathname: '/blog',
        query: { ...adsQuery },
      });
    }
  };

  const openTutorial = () => {
    if (actualPath.includes('/finance?stockid=')) {
      localStorage.removeItem('employeropen');
    } else if (actualPath.includes('/finance/ride-share?id=')) {
      localStorage.removeItem('RSOpen');
    } else {
      switch (actualPath) {
        case '/':
          localStorage.removeItem('homeOpen');
          localStorage.removeItem('menuOpen');
          break;
        case '/search-cars':
          localStorage.removeItem('searchopen');
          break;
        case '/finance':
          localStorage.removeItem('financeOpen');
          break;
        case '/ride-share':
          localStorage.removeItem('rideshareOpen');
          break;
        default:
          break;
      }
    }
    if (actualPath !== '/') {
      handleMenuClick();
    }
    tutorialOpen(actualPath);
  };
  const handleOpenVideoDialog = () => setVideoOpen(true);
  const handleHideVideoDialog = () => setVideoOpen(false);
  const handleOpenRideshareVideoDialog = () => setRideshareVideoOpen(true);
  const handleHideRideshareVideoDialog = () => setRideshareVideoOpen(false);
  function Navbar(data) {
    return (
      <nav className="navbar">
        <ul className="navbar-nav">{data.children}</ul>
      </nav>
    );
  }
  function NavItem(navData) {
    if (navData.label === 'Video') {
      return (
        <li className="nav-item">
          <Button
            title="RideShare"
            className="icon-button"
            onClick={() =>
              navData.label === 'Menu'
                ? handleMenuClick()
                : handleGoToLink('RideShare')
            }
            data-tut="RideShare"
          >
            RideShare
          </Button>
          <Button
            title="Launch Tutorial"
            id="ride-share"
            className={classes.tutorial}
            onClick={() => handleOpenRideshareVideoDialog()}
          >
            <img
              src={videoLaunch}
              alt="videoLaunch"
              className={classes.tutorial}
            />
          </Button>
          <Button
            title="Search Car"
            className="icon-button"
            onClick={() =>
              navData.label === 'Menu'
                ? handleMenuClick()
                : handleGoToLink('Search Car')
            }
            data-tut="Search Car"
          >
            Search Car
          </Button>
          <Button
            title="Launch Tutorial"
            id="how-it-works"
            className={classes.tutorial}
            onClick={() => handleOpenVideoDialog()}
          >
            <img
              src={videoLaunch}
              alt="videoLaunch"
              className={classes.tutorial}
            />
          </Button>
        </li>
      );
    } else if (navData.label === 'PICKUP LOCATIONS') {
      return (
        <li className="nav-item" onMouseEnter={onHover} onMouseLeave={offHover}>
          {navData.label === 'PICKUP LOCATIONS' ? (
            <div
              className="icon-button"
              data-tut={navData.label}
              style={{ position: 'relative' }}
            >
              {navData.label}
              {isHovered && (
                <div className={classes.locationList}>
                  {pickupLocations.map(location => (
                    <div
                      className={classes.location}
                      // eslint-disable-next-line no-underscore-dangle
                      key={location._id}
                    >
                      <Link href={location.url} prefetch>
                        <a>{location.cityName}</a>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Button
              title={navData.label}
              className="icon-button"
              onClick={() =>
                navData.label === 'Menu'
                  ? handleMenuClick()
                  : handleGoToLink(navData.label)
              }
              data-tut={navData.label}
            >
              {navData.label}
            </Button>
          )}
          {navOpen && navData.children}
        </li>
      );
    } else {
      return (
        <li className="nav-item">
          <Button
            title={navData.label}
            className="icon-button"
            onClick={() =>
              navData.label === 'Menu'
                ? handleMenuClick()
                : handleGoToLink(navData.label)
            }
            data-tut={navData.label}
          >
            {navData.label}
          </Button>
          {navOpen && navData.children}
        </li>
      );
    }
  }

  function DropdownMenu() {
    const [activeMenu, setActiveMenu] = useState('main');
    const dropdownRef = useRef(null);
    const isClickedOutside = event => {
      if (event.currentTarget.id === 'invisible') {
        handleMenuClick();
      }
    };
    function DropdownItem(dropDownData) {
      return (
        <>
          {dropDownData.link !== '' ? (
            <>
              {dropDownData.children === 'Sign-In' ? (
                <>
                  {prospect.firstName && prospect.token ? (
                    <a
                      className="menu-item"
                      role="link"
                      tabIndex="0"
                      onClick={() => 'profile' && setActiveMenu('profile')}
                      onKeyDown={() => 'profile' && setActiveMenu('profile')}
                    >
                      {prospect.firstName}
                      <span className="icon-right">
                        <ArrowForwardIosRounded />
                      </span>
                    </a>
                  ) : (
                    <Link href={dropDownData.link}>
                      <a className="menu-item">
                        {dropDownData.link.length < 1 && dropDownData.leftIcon}
                        {dropDownData.children}
                        {dropDownData.link.length < 1 && dropDownData.rightIcon}
                      </a>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {dropDownData.link === 'video' ? (
                    <a
                      className="menu-item"
                      role="link"
                      tabIndex="0"
                      onClick={() => openTutorial()}
                      onKeyDown={() => openTutorial()}
                    >
                      {dropDownData.children}
                    </a>
                  ) : (
                    <Link href={dropDownData.link} prefetch>
                      <a
                        className="menu-item"
                        data-tut={assignDataTut(dropDownData.children)}
                      >
                        {dropDownData.link.length < 1 && dropDownData.leftIcon}
                        {dropDownData.children}
                        {dropDownData.link.length < 1 && dropDownData.rightIcon}
                      </a>
                    </Link>
                  )}
                </>
              )}
            </>
          ) : (
            <a
              className="menu-item"
              role="link"
              tabIndex="0"
              onClick={() =>
                dropDownData.goToMenu && setActiveMenu(dropDownData.goToMenu)
              }
              onKeyDown={() =>
                dropDownData.goToMenu && setActiveMenu(dropDownData.goToMenu)
              }
            >
              {dropDownData.link.length < 1 && dropDownData.leftIcon}
              {dropDownData.children}
              {dropDownData.link.length < 1 && dropDownData.rightIcon}
            </a>
          )}
        </>
      );
    }
    function ProfileDropDown(profileData) {
      return (
        <>
          {profileData.link !== '' ? (
            <a href={profileData.link} className="menu-item">
              {profileData.children}
            </a>
          ) : (
            <>
              {profileData.children === 'SignOut' ? (
                <a
                  className="menu-item"
                  role="link"
                  tabIndex="0"
                  onClick={() => handleLogout()}
                  onKeyDown={() => handleLogout()}
                >
                  {profileData.children}
                </a>
              ) : (
                <a
                  className="menu-item"
                  role="link"
                  tabIndex="0"
                  onClick={() =>
                    profileData.goToMenu && setActiveMenu(profileData.goToMenu)
                  }
                  onKeyDown={() =>
                    profileData.goToMenu && setActiveMenu(profileData.goToMenu)
                  }
                >
                  <span className="icon-left">
                    {profileData.link.length < 1 && profileData.leftIcon}
                  </span>
                  {profileData.children}
                </a>
              )}
            </>
          )}
        </>
      );
    }
    return (
      <>
        <Box
          className={classes.invisibleDiv}
          onClick={event => isClickedOutside(event)}
          id="invisible"
        />
        <div className="dropdown" ref={dropdownRef}>
          <CSSTransition
            in={activeMenu === 'main'}
            timeout={500}
            classNames="menu-primary"
            unmountOnExit
          >
            <div className="menu">
              {menus.map(el => (
                <DropdownItem
                  key={el.action}
                  rightIcon={<ArrowForwardIosRounded />}
                  goToMenu="settings"
                  link={
                    el.text !== 'Our Cities'
                      ? `${appendQueryParams(el.action, adsQuery)}`
                      : `${el.action}`
                  }
                >
                  {el.text}
                </DropdownItem>
              ))}
            </div>
          </CSSTransition>
          <CSSTransition
            in={activeMenu === 'settings'}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
          >
            <Grid container>
              <Grid xs={12} container alignItems="center">
                <DropdownItem
                  goToMenu="main"
                  leftIcon={<ArrowBackIosRounded />}
                  link=""
                >
                  Back
                </DropdownItem>
              </Grid>
              {subMenu.map(el => (
                <Grid xs={12} key={el.action}>
                  <DropdownItem link={appendQueryParams(el.action, adsQuery)}>
                    {el.text}
                  </DropdownItem>
                </Grid>
              ))}
            </Grid>
          </CSSTransition>
          <CSSTransition
            in={activeMenu === 'profile'}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
          >
            <div className="menu">
              <ProfileDropDown
                goToMenu="main"
                link=""
                leftIcon={<ArrowBackIosRounded />}
              >
                Back
              </ProfileDropDown>
              <ProfileDropDown link={appendQueryParams('/profile', adsQuery)}>
                Profile
              </ProfileDropDown>
              <ProfileDropDown link="">SignOut</ProfileDropDown>
            </div>
          </CSSTransition>
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar>
        <NavItem label="Blog" />
        <NavItem label="Video" />
        <NavItem label="Menu">
          <DropdownMenu />
        </NavItem>
        {!isEmpty(pickupLocations) && <NavItem label="PICKUP LOCATIONS" />}
      </Navbar>
      <VideoDialog
        urlType="RideShareUrl"
        open={rideshareVideoOpen}
        handleClose={handleHideRideshareVideoDialog}
        isMobile="false"
      />
      <VideoDialog
        open={videoOpen}
        handleClose={handleHideVideoDialog}
        isMobile="false"
      />
    </>
  );
};

CustomWebMenuItem.propTypes = {
  handleChange: PropTypes.func.isRequired,
  prospect: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
  tutorialOpen: PropTypes.func.isRequired,
  pickupLocations: PropTypes.array.isRequired,
};

export default CustomWebMenuItem;
