/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { prospectData } from 'src/redux/selectors';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Typography, Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Footer from 'components/vehicle/Footer';
import Layout from 'components/shared/Layout';
import Banner1 from 'assets/carfax/banner1.png';
import Banner2 from 'assets/carfax/banner2.png';
import mainText from 'assets/warranty/text.json';

const useStyles = makeStyles(theme => ({
  contactUsWrapper: {
    width: '100%',
    height: 'max-content'
  },
  contactUsContainer: {
    maxWidth: 1138,
    padding: '0px 20px',
    margin: '0 auto',
  },
  contactUsTitleContainer: {
    margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(4)}px`,
  },
  contactUsTitle: {
    fontWeight: theme.typography.fontWeightLight,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(22),
      marginBottom: theme.spacing(2),
    },
  },
  contactUsSubtitle: {
    fontSize: theme.typography.pxToRem(17),
  },
  contactUsSubtitle2: {
    fontSize: theme.typography.pxToRem(25),
  },
  warrantyStan: {
    height: '50rem',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    [theme.breakpoints.up(2000)]: {
      height: '60rem',
    },
    [theme.breakpoints.up(3000)]: {
      height: '80rem',
    },
    [theme.breakpoints.down('sm')]: {
      height: '25rem',
      backgroundPosition: 'left'
    },
  },
  heroHeaderContentTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '18pt',
      marginBottom: theme.spacing(2),
      paddingTop: '10% !important'
    },
    textTransform: 'uppercase',
    color: '#FFF'
  },
  warrantyStanHeader: {
    paddingTop: '6%',
    paddingLeft: '8%',
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0
    },
  },
  headerContainer: {
    paddingTop: 15,
    [theme.breakpoints.down(1000)]: {
      display: 'flex',
      fontSize: '1rem',
      flexDirection: 'column',
    },
  },
  heroSubHeaderContentTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
      marginBottom: theme.spacing(2),
      display: 'block'
    },
    textTransform: 'uppercase',
    color: '#FFF',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'inherit',
    fontSize: '10pt'
  },
  textBold: {
    fontWeight: 900,
    color: '#001c5e'
  },
  straightLine: {
    backgroundColor: 'gray',
    height: 1,
    borderRadius: 25,
    margin: '20px 0',
  },
  liClass: {
    color: 'darkslategray',
    display: 'flex',
    flexDirection: 'inherit',
    fontSize: '10pt'
  },
  ListItemLi: {
    padding: '2px',
    paddingBottom: '13px',
    fontWeight: 100
  },
  ovalBox: {
    width: '100%',
    minHeight: '35rem',
    borderRadius: '63% 55% 90% 20% / 80% 30% 80% 20%',
    transform: 'rotate(10deg)',
    background: '#FFF',
    marginTop: '-20%',
    [theme.breakpoints.up(2000)]: {
      borderRadius: '63% 55% 90% 0% / 82% 15% 75% 20%',
      transform: 'rotate(8deg)',
    },
    [theme.breakpoints.up(2600)]: {
      borderRadius: '63% 55% 90% 0% / 82% 8% 75% 20%',
      transform: 'rotate(8deg)',
    },
    [theme.breakpoints.up(3600)]: {
      transform: 'rotate(6deg)',
    },
    [theme.breakpoints.down(5000)]: {
      marginTop: '-8%',
    },
    [theme.breakpoints.down(3300)]: {
      marginTop: '-10%',
    },
    [theme.breakpoints.down(2600)]: {
      marginTop: '-12%',
    },
    [theme.breakpoints.down(2000)]: {
      marginTop: '-16%',
    },
    [theme.breakpoints.down(1700)]: {
      marginTop: '-18%',
    },
    [theme.breakpoints.down(1300)]: {
      marginTop: '-22%',
      borderRadius: '106% 24% 123% 10% / 137% 21% 117% 13%',
      transform: 'rotate(25deg)'
    },
    [theme.breakpoints.down(1000)]: {
      marginTop: '-9%',
      transform: 'rotate(7deg)',
      borderRadius: '75% 88% 94% 62% / 98% 19% 80% 5%',
      minHeight: '8rem',
    },
    [theme.breakpoints.down(650)]: {
      minHeight: '8rem',
      marginTop: '-14%',
    },
  },
  heroContentContainer: {
    padding: 100,
    color: '#000',
    zIndex: 3,
    [theme.breakpoints.down(5000)]: {
      margin: '-14% 0 0 5%',
    },
    [theme.breakpoints.down(3900)]: {
      margin: '-16% 0 0 5%',
    },
    [theme.breakpoints.down(3600)]: {
      margin: '-18% 0 0 5%',
    },
    [theme.breakpoints.down(3000)]: {
      margin: '-22% 0 0 5%',
    },
    [theme.breakpoints.down(2500)]: {
      margin: '-25% 0 0 5%',
    },
    [theme.breakpoints.down(2000)]: {
      margin: '-28% 0 0 5%',
    },
    [theme.breakpoints.down(1600)]: {
      margin: '-37% 0 0 5%',
    },
    [theme.breakpoints.down(1400)]: {
      margin: '-42% 0 0 5%',
    },
    [theme.breakpoints.down(1200)]: {
      margin: '-50% 0 0 5%',
    },
    [theme.breakpoints.down(1000)]: {
      margin: '-24% 0 0 1%',
      width: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0,
      width: '100%',
      padding: 10,
      margin: '-25% 0 0 2% !important'
    },
  },
  alignText: {
    display: 'flex'
  }
}));

const splitPara = data => {
  const d = data.split('test drive on us');
  return <Typography variant="body1">{d[0]}<b>&quot;test drive on us&quot;</b>{d[1]}</Typography>;
};

const DescProbItem = ({ item }) =>
  <li style={{ padding: '2px', paddingBottom: '13px' }}>
    {item.paragraph.includes('test drive on us') ?
      <Typography
        variant="body1"
        style={{ color: 'darkslategray' }}
      >
        {splitPara(item.paragraph)}
      </Typography>
      :
      <Typography
        variant="body1"
        style={{ color: 'darkslategray' }}
      >
        {item.paragraph}
      </Typography>}
  </li>;

DescProbItem.propTypes = {
  item: PropTypes.string.isRequired
};

const Warranty = () => {
  const { text } = mainText;
  const classes = useStyles();
  const [banner, setBanner] = useState();

  useEffect(() => {
    (async () => {
      try {
        const banners = [Banner1, Banner2];
        const ranIndex = Math.floor(Math.random() * banners.length);
        setBanner(banners[ranIndex]);
      } catch (ex) {
        console.error(ex);
      }
    })();
  }, []);

  const renderText = array =>
    array.map((el, index) =>
      <>
        <Box key={index} className={(index % 2) === 0 ? classes.boxLayout : classes.boxLayout2}>
          <Typography
            variant="h4"
            className={classes.textBold}
            paragraph
          >
            {el.title}
          </Typography>
          <Typography
            paragraph
            variant="body1"
            dangerouslySetInnerHTML={{ __html: el.descOne }}
            className={classes.headingData}
          />
          <div className={classes.alignText}>
            {el.descProblem &&
              <ul style={{ width: '850px' }}>
                {el.descProblem.map((item, index2) =>
                  <DescProbItem key={index2} item={item} mainIndex={index} />)}
              </ul>}
          </div>
        </Box>
      </>
    );
  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => { };
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.contactUsWrapper}>
        <div
          style={{
            backgroundImage: `url(${banner})`,
            position: 'relative'
          }}
          className={classes.warrantyStan}
        >
          <Grid container item justifyContent="flex-start" xs={12} className={classes.warrantyStanHeader}>
            <Typography
              className={classes.heroHeaderContentTitle}
              style={{ paddingTop: '5%', fontWeight: 900 }}
              variant="h3"
            >
              Love It Or Return It!
            </Typography>
            <Grid container item justifyContent="flex-start" xs={12} className={classes.headerContainer}>
              <Typography
                className={classes.heroSubHeaderContentTitle}
                variant="h6"
                style={{ padding: '0 20px 0 0' }}
              >
                10 Day Drive on us
              </Typography>
              <Typography className={classes.heroSubHeaderContentTitle} variant="h6">
                <FiberManualRecordIcon
                  style={{ color: '#FFF', margin: '4px 10px 0 0', fontSize: '10px' }}
                />
                No Questions Asked
              </Typography>
              <Typography className={classes.heroSubHeaderContentTitle} variant="h6">
                <FiberManualRecordIcon
                  style={{ color: '#FFF', margin: '4px 10px 0 0', fontSize: '10px' }}

                />
                Return For Full Refund
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box className={classes.ovalBox}/>
      <Box
        className={classes.heroContentContainer}
      >
        {renderText(text)}
      </Box>
      <Footer />
    </Layout>
  );
};

const mapStateToProps = createStructuredSelector({
  prospect: prospectData,
});

Warranty.propTypes = {
};

export default connect(mapStateToProps)(withRouter(Warranty));
