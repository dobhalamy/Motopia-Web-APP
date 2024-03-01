import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Typography, Container, Box, useMediaQuery } from '@material-ui/core';
import { Cancel as CancelIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'components/shared/Layout';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import FinanceHero from 'assets/finance_hero.jpg';
import { appendQueryParams, applyAdsQuery } from '@/utils/commonUtils';

const useStyles = makeStyles(theme => ({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  RideShareInformationContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  RideShareInformationTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  RideShareInformationWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
    marginTop: theme.spacing(2),
  },
  RideShareInformationContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  RideShareInformationLightGrayColor: {
    color: '#a0a0a0',
  },
  RejectPaymentIcon: {
    color: 'red',
    width: 40,
    height: 'auto',
  },
}));

const RideShareInformationForm = () => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const [isRds, setRds] = React.useState(false);

  React.useEffect(() => {
    if (router.query.rds) {
      setRds(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => router.back();

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.financeMainWrapper}>
        <Container maxWidth="md" className={classes.RideShareInformationContainer}>
          <Typography
            variant="h4"
            align="center"
            className={classes.RideShareInformationTitle}
          >
            INFORMATION
          </Typography>
          <Box className={classes.RideShareInformationWrapper} boxShadow={6}>
            <Box className={classes.RideShareInformationContent}>
              <Box marginTop={2} marginBottom={2}>
                <Typography align="center">
                  <CancelIcon className={classes.RejectPaymentIcon} />
                </Typography>
              </Box>
              <Box marginTop={4} marginBottom={4}>
                {!isRds
                  ?
                    <Typography
                      align="center"
                      variant="h6"
                      style={{ lineHeight: '2.5' }}
                      component="p"
                    >
                      Unfortunately, we couldn&#39;t get you an approval at this time to
                      purchase your own car.
                      <br />
                      But don&#39;t worry, you can explore rent-to-own options with
                      Rideshare.
                      <br />
                      If you feel this decision is in error, please{' '}
                      <Link href={appendQueryParams('/finance', adsQuery)}>
                        <Typography
                          color="primary"
                          style={{
                            fontSize: 'inherit',
                            textDecoration: 'none',
                            display: 'inline',
                            cursor: 'pointer',
                          }}
                        >
                          go back
                        </Typography>
                      </Link>
                      , verify your information is correct,
                      <br />
                      make any corrections, and resubmit your application.
                    </Typography>
                  :
                    <Typography
                      align="center"
                      variant="h6"
                      style={{ lineHeight: '2.5' }}
                      component="p"
                    >
                      Unfortunately we cannot approve you based on your driver&#39;s
                      license history.
                      <br />
                      If you feel this may be in error, please email us at{' '}
                      <a
                        href="mailto:info@gomotopia.com"
                        style={{
                          textDecoration: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Typography
                          color="primary"
                          style={{ fontSize: 'inherit', display: 'inline' }}
                        >
                          info@gomotopia.com
                        </Typography>
                      </a>
                      , and we will reassess your application.
                    </Typography>}
              </Box>
            </Box>
            <CustomPrimaryButton isLarge={!matches} fullWidth onClick={goBack}>
              Go back
            </CustomPrimaryButton>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default RideShareInformationForm;
