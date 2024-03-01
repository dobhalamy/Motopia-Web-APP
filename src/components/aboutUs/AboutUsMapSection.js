import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AboutUsMap from 'assets/tradeIn/about_us_map.png';
import { useRouter } from 'next/router';

import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import LuxorIcon from 'assets/vehicle/motopia_logo.png';
import ContactUSIcon from 'assets/contact-us.svg';
import { applyAdsQuery } from '@/utils/commonUtils';

const useStyles = makeStyles(theme => ({
  dealerInfoContainer: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    borderRadius: 5,
    height: 518,
    padding: `${theme.spacing(3.75)}px ${theme.spacing(6.25)}px`,
    [theme.breakpoints.down('md')]: {
      padding: `${theme.spacing(3.75)}px ${theme.spacing(4.25)}px`,
    },
    [theme.breakpoints.down('sm')]: {
      height: 470,
      padding: theme.spacing(2),
      maxWidth: 380,
      flexWrap: 'wrap',
    },
  },
  heroBackground: {
    width: '100%',
    backgroundImage: `url(${AboutUsMap})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: 729,
    padding: theme.spacing(10),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      backgroundPositionX: '35%',
      backgroundPositionY: -200,
      height: 770,
    },
  },
  addressIcon: {
    width: 90,
    height: 90,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      width: 50,
      height: 50,
    }
  },
}));

const AboutUsMapSection = () => {
  const classes = useStyles();
  const router = useRouter();

  const adsQuery = applyAdsQuery(router.query);

  const handleClickAboutUs = () =>
    router.push({
      pathname: '/contact-us',
      query: { ...adsQuery },
    });

  return (

    <Grid className={classes.heroBackground} container justifyContent="flex-end" alignItems="flex-end">
      <Grid
        className={classes.dealerInfoContainer}
        item
        container
        md={6}
        xs={12}
        justifyContent="center"
      >
        <Grid
          container
          item
        >
          <img src={LuxorIcon} className={classes.addressIcon} alt="luxor logo" />
          <Grid item>

            <Typography variant="h5">
              ADDRESS:
            </Typography>
            <Typography variant="body1">
              GoMotopia.com <br />
              405 RXR Plaza<br />
              Uniondale, NY 11556<br />
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          item
        >
          <img
            src={ContactUSIcon}
            className={classes.addressIcon}
            alt="contact icon"
          />
          <Grid item>
            <Typography variant="h5">
              CONTACT
            </Typography>
            <Typography variant="body1">
              Contact Sales
            </Typography>
            <Typography variant="h4">
              888-253-7171
            </Typography>
          </Grid>
        </Grid>
        <Grid item style={{ height: 60 }} >
          <CustomPrimaryButton onClick={handleClickAboutUs}>
            Contact Us
          </CustomPrimaryButton>
        </Grid>
      </Grid>
    </Grid>

  );
};

export default AboutUsMapSection;
