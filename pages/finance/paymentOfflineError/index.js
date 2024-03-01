import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import CancelIcon from '@material-ui/icons/Cancel';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { Prospect } from 'src/api';
import { getCookie } from 'src/utils/cookie';
import Layout from 'components/shared/Layout';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import FinanceHero from 'assets/finance_hero.jpg';
import { applyAdsQuery } from '@/utils/commonUtils';

const useStyles = makeStyles(theme => ({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  BlacklistedErrorFormContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  BlacklistedErrorFormTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  BlacklistedErrorFormWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
    marginTop: theme.spacing(2),
  },
  BlacklistedErrorFormContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  RejectPaymentIcon: {
    color: 'red',
    width: 40,
    height: 'auto',
  },
  arrow: {
    color: '#FFF',
    fontSize: 'x-large'
  }
}));

const PaymentOfflineError = () => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const [name, setName] = useState('');

  useEffect(() => {
    async function fetchData() {
      const prospectId = getCookie('prospectId');
      const prospectData = await Prospect.GetProspect(prospectId);
      if (prospectData.firstName) {
        setName(prospectData.firstName);
      }
    }
    fetchData();
  }, []);

  const moveAhead = () =>
    router.push({
      pathname: '/',
      query: { ...adsQuery },
    });

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.financeMainWrapper}>
        <Container maxWidth="md" className={classes.BlacklistedErrorFormContainer}>
          <Typography
            variant="h4"
            align="center"
            className={classes.BlacklistedErrorFormTitle}
          >
            INFORMATION
          </Typography>
          <Box className={classes.BlacklistedErrorFormWrapper} boxShadow={6}>
            <Box className={classes.BlacklistedErrorFormContent}>
              <Box marginTop={2} marginBottom={2}>
                <Typography align="center">
                  <CancelIcon className={classes.RejectPaymentIcon} />
                </Typography>
              </Box>
              <Box marginTop={4} marginBottom={4}>
                <Typography
                  align="center"
                  variant="h6"
                  style={{ lineHeight: '2.5', margin: 10 }}
                  component="p"
                >
                  {name}, Currently we&#39;re not accepting any online payment
                  <br />
                  Please call us on +1 888-253-7171 to process your order.
                </Typography>
              </Box>
            </Box>
            <CustomPrimaryButton isLarge={!matches} fullWidth onClick={moveAhead}>
              Continue <ArrowRightAltIcon className={classes.arrow} />
            </CustomPrimaryButton>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default PaymentOfflineError;
