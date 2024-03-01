import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MenuItem } from 'src/api';

import { makeStyles } from '@material-ui/styles';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloseIcon from '@material-ui/icons/Close';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import SocialMediaButtons from 'components/shared/SocialMediaButtons';
import { MOBILE_ROUTE_CONSTANTS, SiteUrl } from '../constants';

const useStyles = makeStyles(theme => ({
  menuHeader: {
    padding: theme.spacing(2),
    borderBottom: '1px solid #29282E',
  },
  content: {
    borderTop: 'none',
    padding: 0,
  },
  routeButton: {
    height: theme.spacing(8),
    padding: `0px ${theme.spacing(1)}px`,
    borderBottom: '1px solid #29282E',
  },
  footerButtons: {
    margin: '20px 15px',
  },
  socialMediaButton: {
    width: 40,
    height: 40,
    border: '1px solid rgba(255,255,255,0.3)',
    margin: 5,
    background: '#E6E9EF',
  },
  socialMediaIcon: {
    width: 20,
    height: 20,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
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
    display: 'flex'
  },
  signlinks: {
    color: 'black',
    textDecoration: 'none',
    width: '100%',
    display: 'flex'
  },
  iconClass: {
    marginTop: 4
  },
  buttonClass: {
    border: 'none',
    backgroundColor: '#fff',
    width: '100%',
    padding: 0
  },
  borders: {
    borderBottom: '1px solid #29282E',
    width: '100%'
  },
  root: {
    fontSize: '1.1rem',
    color: '#4E4E51'
  },
  subMenu: {
    width: '100%'
  }
}));

function MobileMenu(props) {
  const classes = useStyles();
  const router = useRouter();
  const [profileOpen, setprofileOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [menus, setmenus] = useState([]);
  const [subMenu, setsubMenu] = useState([]);
  const pathname = router.pathname.split('/')[1];
  const loadListItem = async () => {
    const response = await MenuItem.getMenuItems();
    if (response.data) {
      const subMenuVal = response.data.map(el => ({
        text: el.title,
        value: el.title,
        action: el.linkPath,
      }));
      setsubMenu(subMenuVal);
      const menuVal = MOBILE_ROUTE_CONSTANTS.map(el => ({
        text: el.routeTitle,
        value: el.routeTitle,
        action: el.routeValue,
      }));
      setmenus(menuVal);
    }
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const handleProfile = () => {
    setprofileOpen(!profileOpen);
  };
  const assignDataTut = (routeVal) => {
    if (SiteUrl.includes(pathname)) {
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
    } else {
      return '';
    }
  };
  useEffect(() => {
    loadListItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderListItem = array =>
    array.map(el =>
      (
        <>
          {el.text === 'More' ?
            <ListItem
              button
              alignItems="flex-start"
              onClick={handleClick}
              className={classes.borders}
            >
              <ListItemText primary={el.text}/>
              {open ? <ExpandMore /> : <ExpandLess />}
            </ListItem>
            :
            <>
              {el.text === 'Sign-In' ?
                <ListItem button alignItems="flex-start" className={classes.borders}>
                  {props.prospect.firstName && props.prospect.token ?
                    <>
                      <ListItemText
                        primary={props.prospect.firstName}
                        onClick={handleProfile}
                      />
                      {profileOpen ?
                        <ExpandLess />
                        : <ExpandMore />}
                    </>
                    :
                    <>
                      <a href={el.action} className={classes.signlinks}>
                        <ListItemText primary={el.text}/>
                        <ListItemIcon className={classes.iconClass}>
                          <ExitToAppIcon />
                        </ListItemIcon>
                      </a>
                    </>}
                </ListItem>
                :
                <a href={el.action} className={classes.links}>
                  <ListItem button alignItems="flex-start" data-tut={assignDataTut(el.text)}>
                    <ListItemText primary={el.text}/>
                  </ListItem>
                </a>}
            </>}
          {el.text === 'Our Cities' &&
            <Collapse in={!open} className={classes.subMenu} timeout="auto" unmountOnExit>
              {subMenu.map(sb => (
                <List key={sb.action} component="div" disablePadding>
                  <a href={sb.action} className={classes.links}>
                    <ListItem button className={classes.nested}>
                      <ListItemText primary={sb.text} />
                    </ListItem>
                  </a>
                </List>
              ))}
            </Collapse>}
          {el.text === 'Sign-In' && props.prospect.token && props.prospect.firstName &&
            <Collapse in={profileOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <a href="/profile" className={classes.links}>
                  <ListItem button className={classes.nested}>
                    <ListItemText primary="My Account" />
                  </ListItem>
                </a>
                <button className={classes.buttonClass} onClick={() => props.handleLogout}>
                  <ListItem button className={classes.nested}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </button>
              </List>
            </Collapse>}
        </>
      )
    );
  return (
    <Dialog
      fullScreen
      onClose={() => props.handleOpenMenuDialog(false)}
      open={props.showMenuDialog}
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
          onClick={() => props.handleOpenMenuDialog(false)}
        >
          <CloseIcon />
        </IconButton>
      </Grid>
      <DialogContent className={classes.content}>
        <Grid container direction="column" alignItems="flex-start">
          {renderListItem(menus)}
        </Grid>
        <Grid container direction="column">
          <Grid container>
            <Link href="/terms-of-use">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  style={{ cursor: 'pointer' }}
                  className={classes.footerButtons}
                  color={router.pathname.includes('terms-of-use') ? 'error' : 'textPrimary'}
                  variant="body1"
                >
                  Terms of Use
                </Typography>
              </a>
            </Link>
            <Link href="/privacy-policy">
              <a style={{ textDecoration: 'none' }}>
                <Typography
                  style={{ cursor: 'pointer' }}
                  className={classes.footerButtons}
                  color={router.pathname.includes('privacy-policy') ? 'error' : 'textPrimary'}
                  variant="body1"
                >
                  Privacy Policy
                </Typography>
              </a>
            </Link>
          </Grid>
          <SocialMediaButtons withMargin />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

MobileMenu.propTypes = {
  handleOpenMenuDialog: PropTypes.func.isRequired,
  showMenuDialog: PropTypes.bool.isRequired,
  prospect: PropTypes.shape({
    firstName: PropTypes.string,
    token: PropTypes.string,
  }),
  handleLogout: PropTypes.func.isRequired,
};

MobileMenu.defaultProps = {
  prospect: {},
};

export default MobileMenu;
