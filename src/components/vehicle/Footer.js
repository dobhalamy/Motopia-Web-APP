import React from 'react';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import BackToSearchIcon from 'assets/vehicle/back_to_search.svg';
import FinancingIcon from 'assets/vehicle/financing_white.svg';
import RentIcon from 'assets/vehicle/rent_to_own.svg';
import TradeInIcon from 'assets/vehicle/trade_in.svg';

import { appendQueryParams, applyAdsQuery } from '@/utils/commonUtils';
import { useRouter } from 'next/router';
import { VEHICLE_PAGE_WIDTH } from './constants';

const useStyles = makeStyles(theme => ({
  footerWrapper: {
    background: '#19191E',
    height: 210,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  footerContainer: {
    maxWidth: VEHICLE_PAGE_WIDTH,
    height: '100%',
  },
  footerButtonContainer: {
    maxWidth: 300,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
    },
    '&:last-child': {
      borderRight: 'none',
    },
  },
  footerButton: {
    width: '100%',
    height: '100%',
  },
  footerButtonTitle: {
    marginTop: theme.spacing(4),
    color: theme.palette.common.white,
  },
}));

export default function Footer() {
  const classes = useStyles();
  const { query } = useRouter();
  const adsQuery = applyAdsQuery(query);

  return (
    <Grid
      className={classes.footerWrapper}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Grid className={classes.footerContainer} container wrap="nowrap">
        <Link href={`${appendQueryParams('/search-cars', adsQuery)}`}>
          <Button className={classes.footerButtonContainer}>
            <Grid className={classes.footerButton} container direction="column">
              <img src={BackToSearchIcon} alt="back to search" />
              <span className={classes.footerButtonTitle}>back to search</span>
            </Grid>
          </Button>
        </Link>
        <Link href={`${appendQueryParams('/finance', adsQuery)}`}>
          <Button className={classes.footerButtonContainer}>
            <Grid className={classes.footerButton} container direction="column">
              <img src={FinancingIcon} alt="financing" />
              <span className={classes.footerButtonTitle}>get financing</span>
            </Grid>
          </Button>
        </Link>
        <Link href={`${appendQueryParams('/trade-in', adsQuery)}`}>
          <Button className={classes.footerButtonContainer}>
            <Grid className={classes.footerButton} container direction="column">
              <img src={TradeInIcon} alt="trade-in" />
              <span className={classes.footerButtonTitle}>get trade-in</span>
            </Grid>
          </Button>
        </Link>
        <Link href={`${appendQueryParams('/ride-share', adsQuery)}`}>
          <Button className={classes.footerButtonContainer}>
            <Grid className={classes.footerButton} container direction="column">
              <img src={RentIcon} alt="ride-share" />
              <span className={classes.footerButtonTitle}>Ride-share</span>
            </Grid>
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
}
