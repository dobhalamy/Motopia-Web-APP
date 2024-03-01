/* eslint-disable react/prop-types */
import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { appendQueryParams, applyAdsQuery } from '@/utils/commonUtils';

const DOT_SIZE = 10;

const useStales = makeStyles(theme => ({
  firstRow: {
    paddingBottom: theme.spacing(8.75),
    marginTop: 30,
  },
  firstRowRightColumn: {
    marginTop: theme.spacing(8.125),
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
  },
  firstRowLeftColumn: {
    marginBottom: theme.spacing(8.125),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1.25),
    },
  },
  firstRowItem: {
    paddingTop: theme.spacing(8.75),
    paddingRight: theme.spacing(21.5),
    paddingBottom: theme.spacing(7.5),
    paddingLeft: theme.spacing(12.5),
    height: '100%',
    borderRadius: 5,
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: theme.spacing(9.375),
      left: theme.spacing(5.625),
      width: DOT_SIZE,
      height: DOT_SIZE,
      backgroundColor: theme.palette.common.white,
      borderRadius: 2,
    },
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(2.5),
    },
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(1.875),
      paddingBottom: theme.spacing(1.875),
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(12.5),
      paddingLeft: theme.spacing(2.5),
      '&:before': {
        left: theme.spacing(2.5),
      },
    },
  },
  firstRowSecondContentGrid: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
  firstRowContent: {
    maxWidth: 400,
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      marginLeft: 'none',
    },
  },
  firstRowImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: 5,
  },
  secondRow: {
    paddingBottom: theme.spacing(8.75),
    [theme.breakpoints.down('xs')]: {
      paddingBottom: theme.spacing(5),
    },
  },
  secondRowLeftColumn: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: 2,
      backgroundColor: theme.palette.secondary.main,
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(10),
      '&:before': {
        left: theme.spacing(1),
      },
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(3),
      paddingRight: 0,
      paddingLeft: 0,
      '&:before': {
        left: 0,
      },
    },
  },
  secondRowImage: {
    display: 'block',
    maxWidth: 500,
    height: 'auto',
    margin: '0 auto',
    width: '100%',
  },
  secondRowContent: {
    maxWidth: '100%',
  },
  secondRowSmallInformation: {
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(10),
    maxWidth: 220,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      margin: '0 auto',
      padding: 0,
    },
  },
  thirdRow: {
    borderTop: '1px solid #D5DDE2',
    paddingTop: theme.spacing(8.75),
    paddingBottom: theme.spacing(3.5),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
  thirdRowImage: {
    display: 'block',
    maxWidth: 850,
    height: 'auto',
    marginLeft: 'auto',
    width: '100%',
  },
  thirdRowRightColumn: {
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: 2,
      backgroundColor: theme.palette.secondary.main,
    },
    [theme.breakpoints.down('md')]: {
      '&:before': {
        right: theme.spacing(5),
      },
    },
    [theme.breakpoints.down('sm')]: {
      '&:before': {
        right: 'unset',
        top: -theme.spacing(3),
        left: 0,
      },
    },
  },
  thirdRowContent: {
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(5),
    maxWidth: 500,
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(7),
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      paddingLeft: 0,
    },
  },
  imageMarginBottomWrapper: {
    marginBottom: theme.spacing(6.25),
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
    },
  },
  title: {
    fontSize: theme.typography.pxToRem(34),
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1.875),
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.pxToRem(26),
    },
  },
  text: {
    marginBottom: theme.spacing(3.75),
    fontWeight: 200,
  },
  button: {
    fontWeight: 600,
    paddingLeft: 0,
  },
  buttonWrapper: {
    paddingBottom: theme.spacing(2.5),
  },
  arrow: {
    fontSize: 20,
    marginLeft: theme.spacing(1.25),
  },
  colorWhite: {
    color: theme.palette.common.white,
  },
}));

const SearchCarsFeatureSections = ({ promoBanners }) => {
  const classes = useStales();
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const [state, setState] = React.useState({
    banner1: {},
    banner2: {},
    banner3: {},
    banner4: {},
    bannersAreUploaded: false,
    errorMessage: '',
  });

  React.useEffect(() => {
    if (promoBanners) {
      setState({
        ...state,
        banner1: promoBanners.find(banner => banner.position === 1),
        banner2: promoBanners.find(banner => banner.position === 2),
        banner3: promoBanners.find(banner => banner.position === 3),
        banner4: promoBanners.find(banner => banner.position === 4),
        bannersAreUploaded: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleButtonClick = (e, url) => {
    if (url.includes('#')) {
      e.preventDefault();
      const button = document.querySelector(url);
      button.click();
    }
  };

  const renderFirstRow = banner => (
    <Grid item xs={12} md={6} className={classes.firstRowLeftColumn}>
      <Paper
        className={classes.firstRowItem}
        style={{ backgroundColor: banner.background, color: banner.color }}
      >
        <Box className={classes.firstRowContent}>
          <Typography
            variant="h1"
            className={classNames(classes.title, classes.colorWhite)}
          >
            {banner.title}
          </Typography>
          <Typography
            variant="body1"
            className={classNames(classes.text, classes.colorWhite)}
          >
            {banner.text}
          </Typography>
          <Box className={classes.buttonWrapper}>
            <Button
              href={banner.linkPath}
              className={classNames(classes.button, classes.colorWhite)}
              onClickCapture={(e) => handleButtonClick(e, banner.linkPath)}
            >
              {banner.linkText}
              <Typography component="span" className={classes.arrow}>
                &#10145;
              </Typography>
            </Button>
          </Box>
          <img
            src={banner.src}
            alt="man"
            className={classes.firstRowImage}
          />
        </Box>
      </Paper>
    </Grid>
  );

  const renderSecondRow = banner => (
    <Grid item xs={12} md={6} className={classes.firstRowRightColumn}>
      <Paper
        className={classes.firstRowItem}
        style={{ backgroundColor: banner.background, color: banner.color }}
      >
        <Box className={classes.firstRowContent}>
          <Grid
            container
            direction="column"
            className={classes.firstRowSecondContentGrid}
          >
            <Grid item>
              <Box className={classes.imageMarginBottomWrapper}>
                <img
                  src={banner.src}
                  alt="man"
                  className={classes.firstRowImage}
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography
                variant="h1"
                className={classNames(classes.title, classes.colorWhite)}
              >
                {banner.title}
              </Typography>
              <Typography
                variant="body1"
                className={classNames(classes.text, classes.colorWhite)}
              >
                {banner.text}
              </Typography>
              <Box className={classes.buttonWrapper}>
                <Button
                  className={classNames(classes.button, classes.colorWhite)}
                  href={appendQueryParams(banner.linkPath, adsQuery)}
                  onClickCapture={e => handleButtonClick(e, banner.linkPath)}
                >
                  {banner.linkText}
                  <Typography component="span" className={classes.arrow}>
                    &#10145;
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );

  const renderThirdRow = banner => (
    <Grid container alignItems="center" className={classes.secondRow}>
      <Grid item xs={12} md={6} className={classes.secondRowLeftColumn}>
        <Box
          style={{ backgroundColor: banner.background, color: banner.color }}
          className={classes.secondRowContent}
        >
          <Typography variant="h1" className={classes.title}>
            {banner.title}
          </Typography>
          <Typography variant="body1" className={classes.text}>
            {banner.text}
          </Typography>
          <Box className={classes.buttonWrapper}>
            <Button
              className={classes.button}
              href={appendQueryParams(banner.linkPath, adsQuery)}
              onClickCapture={e => handleButtonClick(e, banner.linkPath)}
            >
              {banner.linkText}
              <Typography component="span" className={classes.arrow}>
                &#10145;
              </Typography>
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <img
          src={banner.src}
          alt="white_car"
          className={classes.secondRowImage}
        />
      </Grid>
    </Grid>
  );

  const renderForthRow = banner => (
    <Grid container alignItems="center" className={classes.thirdRow}>
      <Grid item md={6}>
        <img
          src={banner.src}
          alt="homepage_car_with_key"
          className={classes.thirdRowImage}
        />
      </Grid>
      <Grid item md={6} className={classes.thirdRowRightColumn}>
        <Box
          style={{ backgroundColor: banner.background, color: banner.color }}
          className={classes.thirdRowContent}
        >
          <Typography variant="h1" className={classes.title}>
            {banner.title}
          </Typography>
          <Typography variant="body1" className={classes.text}>
            {banner.text}
          </Typography>
          <Box className={classes.buttonWrapper}>
            <Link href={banner.linkPath} onClickCapture={(e) => handleButtonClick(e, banner.linkPath)}>
              <Button
                style={{ color: banner.linkColor }}
                variant="text"
                color="secondary"
                className={classes.button}
              >
                {banner.linkText}
                <Typography component="span" className={classes.arrow}>
                  &#10145;
                </Typography>
              </Button>
            </Link>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );

  return state.bannersAreUploaded ? (
    <Container maxWidth="xl">
      <Grid
        container
        alignItems="stretch"
        spacing={1}
        className={classes.firstRow}
      >
        {state.banner1 && renderFirstRow(state.banner1)}
        {state.banner2 && renderSecondRow(state.banner2)}
      </Grid>
      {state.banner3 && renderThirdRow(state.banner3)}
      {state.banner4 && renderForthRow(state.banner4)}
    </Container>
  ) : null;
};

export default SearchCarsFeatureSections;
