import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, useMediaQuery, Container } from '@material-ui/core';
import CustomPrimaryButton from 'components/shared/CustomPrimaryButton';
import FinanceHero from 'assets/finance_hero.jpg';
import {
  applyAdsQuery,
  rejectMessage,
  tierMessage,
  getCreditIdQueryParams,
} from '@/utils/commonUtils';

const useStyles = makeStyles(theme => ({
  mvrMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  mvrInformationContainer: {
    marginTop: theme.spacing(9),
    [theme.breakpoints.only('xs')]: {
      marginTop: theme.spacing(3),
    },
  },
  mvrInformationTitle: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  mvrInformationWrapper: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 5,
    marginBottom: theme.spacing(10),
    marginTop: theme.spacing(2),
  },
  mvrInfoContent: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2.5)}px`,
  },
  titleContainer: {
    background: theme.palette.secondary.main,
    padding: theme.spacing(2.5),
    color: '#FFF',
    display: 'flex',
  },
}));

const PlaidResponseWithMvr = props => {
  const { mvr = null } = props;
  const { tierName, rejectReason } = mvr;

  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const creditIdQuery = getCreditIdQueryParams(router.query);
  let messageContent;

  PlaidResponseWithMvr.propTypes = {
    mvr: PropTypes.object.isRequired,
  };
  const goRideShare = () =>
    router.push({
      pathname: '/ride-share',
      query: { ...adsQuery, ...creditIdQuery },
    });
  if (rejectReason) {
    messageContent = rejectMessage;
  } else {
    messageContent = tierMessage(tierName);
  }
  return (
    <Box className={classes.mvrMainWrapper}>
      <Container maxWidth="md" className={classes.mvrInformationContainer}>
        <Typography
          variant="h4"
          align="center"
          className={classes.mvrInformationTitle}
        >
          INFORMATION
        </Typography>
        <Box className={classes.mvrInformationWrapper} boxShadow={6}>
          <Box className={classes.mvrInfoContent}>
            <Box marginTop={4} marginBottom={4}>
              <Typography
                align="center"
                variant="h6"
                style={{ lineHeight: '2.5', fontSize: '1.2rem' }}
                component="p"
              >
                {messageContent}
              </Typography>
            </Box>
          </Box>
          {!rejectReason && (
            <CustomPrimaryButton
              isLarge={!matches}
              fullWidth
              onClick={goRideShare}
            >
              Go To Ride Share
            </CustomPrimaryButton>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PlaidResponseWithMvr;
