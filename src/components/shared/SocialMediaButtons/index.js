import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InstaIcon from 'assets/instagram.png';
import FacebookIcon from 'assets/facebook_blue.svg';
import LinkedInIcon from 'assets/linkedin_blue.svg';

const useStyles = makeStyles({
  socialMediaButton: {
    width: 40,
    height: 50,
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
});

export default function SocialMediaButtons(props) {
  const classes = useStyles();

  return (
    <Grid
      style={{ margin: props.withMargin && '40px 0px 20px' }}
      container
      justifyContent="center"
      alignItems="center"
    >
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
  );
}

SocialMediaButtons.propTypes = {
  withMargin: PropTypes.bool,
};

SocialMediaButtons.defaultProps = {
  withMargin: false,
};
