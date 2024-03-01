import React from 'react';
import { useRouter } from 'next/router';

import { Typography, Container, Box, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MessageIcon from 'assets/homepage/message.svg';

import Layout from 'components/shared/Layout';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import FinanceHero from 'assets/finance_hero.jpg';
import { applyAdsQuery } from '@/utils/commonUtils';

const useStyles = makeStyles(theme => ({
  ConfirmationMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  ConfirmationInformationContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  ConfirmationInformationTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  ConfirmationIformationWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
    marginTop: theme.spacing(2),
  },
  ConfirmationInfoContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  messageIcon: {
    width: '30%',
    backgroundImage: `url(${MessageIcon})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    [theme.breakpoints.down('sm')]: {
      height: 35,
    },
    [theme.breakpoints.up('sm')]: {
      height: 55,
    },
  },
  titleContainer: {
    background: theme.palette.secondary.main,
    padding: theme.spacing(2.5),
    color: '#FFF',
    display: 'flex'
  },
  msgSec: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '80%',
      margin: 'auto',
      padding: 15
    },
    display: 'flex',
  },
  thnkYou: {
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      fontSize: '2rem'
    },
    [theme.breakpoints.up('sm')]: {
      width: '70%',
    },
  }
}));

const Confirmation = () => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);

  const goHome = () =>
    router.push({
      pathname: '/',
      query: { ...adsQuery },
    });

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {};
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.ConfirmationMainWrapper}>
        <Container maxWidth="md" className={classes.ConfirmationInformationContainer}>
          <Typography
            variant="h4"
            align="center"
            className={classes.ConfirmationInformationTitle}
          >
            INFORMATION
          </Typography>
          <Box className={classes.ConfirmationIformationWrapper} boxShadow={6}>
            <Box className={classes.ConfirmationInfoContent}>
              <Box marginTop={2} marginBottom={2} className={classes.titleContainer}>
                <div className={classes.msgSec}>
                  <div className={classes.messageIcon} />
                  <Typography align="center" variant="h3" className={classes.thnkYou}>
                    THANK YOU
                  </Typography>
                </div>
              </Box>
              <Box marginTop={4} marginBottom={4}>
                <Typography
                  align="center"
                  variant="h6"
                  style={{ lineHeight: '2.5' }}
                  component="p"
                >
                  We appreciate you contacting us. One of our colleagues will be in touch
                  with you soon. In the meanwhile, please continue to experience GoMotopia.com
                  and it&#39;s resources for you.
                </Typography>
              </Box>
            </Box>
            <CustomPrimaryButton isLarge={!matches} fullWidth onClick={goHome}>
              Go Home
            </CustomPrimaryButton>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Confirmation;
