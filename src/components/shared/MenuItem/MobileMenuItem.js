import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import './index.css';
import { applyAdsQuery, appendQueryParams } from '@/utils/commonUtils.js';
import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
} from '@material-ui/icons';
import { useRouter } from 'next/router';
import { RideShareSeo } from 'src/api';
import { CSSTransition } from 'react-transition-group';
import Button from '@material-ui/core/Button';
import videoLaunch from 'src/assets/launch.png';
import VideoDialog from '../VideoDialog';
import { MOBILE_ROUTE_CONSTANTS } from '../../../constants';

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
  menuHeader: {
    padding: theme.spacing(1.25),
    borderBottom: '1px solid #29282E',
    marginLeft: 5,
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
  navbar: {
    border: 'none',
  },
  navbarNav: {
    maxWidth: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    padding: 5,
    margin: 2,
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'filter 300ms',
  },
  dropdown: {
    height: '100%',
    position: 'absolute',
    top: 58,
    width: '100%',
    transform: 'translateX(-45%)',
    backgroundColor: 'white',
    border: '0.5px solid #474a4d',
    borderRadius: 8,
    padding: '1rem',
    overflow: 'hidden',
    transition: 'height 500ms ease',
    right: '-45%',
  },
  menu: {
    width: '100%',
  },
  menuItem: {
    height: 60,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 8,
    transition: 'background 500ms',
    padding: '0.5rem',
    fontSize: '1rem',
    width: '100%',
    cursor: 'pointer',
    justifyContent: 'space-between',
  },
  iconRight: {
    marginLeft: 'auto',
  },
  menuPrimary: {
    '&:enter': {
      position: 'absolute',
      transform: 'translateX(-110%)',
    },
    '&:enter, &:active': {
      transform: 'translateX(0%)',
      transition: 'all 500ms ease',
    },
    '&:exit': {
      position: 'absolute',
    },
    '&:exit, &:active': {
      transform: 'translateX(-110%)',
      transition: 'all 500ms ease',
    },
  },
}));

const MobileMenuItem = props => {
  const classes = useStyles();
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const actualPath = router.asPath;
  const [menus, setmenus] = useState([]);
  const [subMenu, setsubMenu] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const loadListItem = async () => {
    const response = await RideShareSeo.getAllPagesRoutes();
    if (response.data) {
      const subMenuVal = response.data.map(el => ({
        text: el.cityName,
        value: el.cityName,
        action: el.url,
      }));
      setsubMenu(subMenuVal);
    }
    const menuVal = MOBILE_ROUTE_CONSTANTS.map(el => ({
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
    assignHamOpen,
    handleChange,
    prospect,
    handleLogout,
    tutorialOpen,
  } = props;

  const handleMenuClick = () => {
    setNavOpen(!navOpen);
    assignHamOpen(!navOpen);
    handleChange('menu', !navOpen);
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
  function Navbar(data) {
    return (
      <nav className={classes.navbar}>
        <ul className={classes.navbarNav}>{data.children}</ul>
      </nav>
    );
  }
  function NavItem(navData) {
    return (
      <li className={classes.navItem}>
        {navData.label === 'Video' ? (
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
        ) : (
          <Button
            title={navData.label}
            className={classes.iconButton}
            onClick={() =>
              navData.label === 'Menu'
                ? handleMenuClick()
                : handleGoToLink(navData.label)
            }
            data-tut={navData.label}
          >
            <MenuIcon />
          </Button>
        )}
        {navOpen && navData.children}
      </li>
    );
  }
  function DropdownMenu() {
    const [activeMenu, setActiveMenu] = useState('main');
    const dropdownRef = useRef(null);
    function DropdownItem(dropDownData) {
      return (
        <>
          {dropDownData.link !== '' ? (
            <>
              {dropDownData.children === 'Sign-In' ? (
                <>
                  {prospect.firstName && prospect.token ? (
                    <a
                      className={classes.menuItem}
                      role="link"
                      tabIndex="0"
                      onClick={() => 'profile' && setActiveMenu('profile')}
                      onKeyDown={() => 'profile' && setActiveMenu('profile')}
                    >
                      {prospect.firstName}
                      <span className={classes.iconRight}>
                        <ArrowForwardIosRounded />
                      </span>
                    </a>
                  ) : (
                    <Link href={dropDownData.link} prefetch>
                      <a
                        className={classes.menuItem}
                        data-tut={assignDataTut(dropDownData.children)}
                      >
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
                      className={classes.menuItem}
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
                        className={classes.menuItem}
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
              className={classes.menuItem}
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
            <a href={profileData.link} className={classes.menuItem}>
              {profileData.children}
            </a>
          ) : (
            <>
              {profileData.children === 'SignOut' ? (
                <a
                  className={classes.menuItem}
                  role="link"
                  tabIndex="0"
                  onClick={() => handleLogout()}
                  onKeyDown={() => handleLogout()}
                >
                  {profileData.children}
                </a>
              ) : (
                <a
                  className={classes.menuItem}
                  role="link"
                  tabIndex="0"
                  onClick={() =>
                    profileData.goToMenu && setActiveMenu(profileData.goToMenu)
                  }
                  onKeyDown={() =>
                    profileData.goToMenu && setActiveMenu(profileData.goToMenu)
                  }
                >
                  <span className={classes.iconLeft}>
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
      <div className={classes.dropdown} ref={dropdownRef}>
        <CSSTransition
          in={activeMenu === 'main'}
          timeout={500}
          classNames="menu-primary"
          unmountOnExit
        >
          <div className={classes.menu}>
            {menus.map(el => (
              <DropdownItem
                rightIcon={<ArrowForwardIosRounded />}
                goToMenu="settings"
                link={
                  el.text !== 'Our Cities'
                    ? `${appendQueryParams(el.action, adsQuery)}`
                    : `${el.action}`
                }
                key={el.text}
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
          <div className={classes.menu}>
            <DropdownItem
              goToMenu="main"
              leftIcon={<ArrowBackIosRounded />}
              link=""
            >
              Back
            </DropdownItem>
            {subMenu.map(el => (
              <DropdownItem
                link={appendQueryParams(el.action, adsQuery)}
                key={el.text}
              >
                {el.text}
              </DropdownItem>
            ))}
          </div>
        </CSSTransition>
        <CSSTransition
          in={activeMenu === 'profile'}
          timeout={500}
          classNames="menu-secondary"
          unmountOnExit
        >
          <div className={classes.menu}>
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
    );
  }
  return (
    <>
      <Navbar>
        <NavItem label="Video" />
        <NavItem label="Menu">
          <Dialog
            fullScreen
            onClose={() => setNavOpen(!navOpen)}
            open={navOpen}
          >
            <Grid
              className={classes.menuHeader}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="secondary" variant="h5">
                MOTOPIA
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => setNavOpen(!navOpen)}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <DialogContent className={classes.content}>
              <DropdownMenu />
            </DialogContent>
          </Dialog>
        </NavItem>
      </Navbar>
      <VideoDialog
        open={videoOpen}
        handleClose={handleHideVideoDialog}
        isMobile="true"
      />
    </>
  );
};

MobileMenuItem.propTypes = {
  handleChange: PropTypes.func.isRequired,
  prospect: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
  tutorialOpen: PropTypes.func.isRequired,
  assignHamOpen: PropTypes.func.isRequired,
};

export default MobileMenuItem;
