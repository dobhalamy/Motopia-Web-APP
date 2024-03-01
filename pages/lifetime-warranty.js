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
import mainText from 'assets/carfax/text.json';

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

const ListItem = ({ item }) =>
  <li
    style={{
      padding: '2px',
      paddingBottom: '13px',
      fontWeight: 100
    }}
  >
    <Typography
      variant="body1"
      style={{ color: 'darkslategray' }}
    >
      {item}
    </Typography>
  </li>;

ListItem.propTypes = {
  item: PropTypes.string.isRequired
};

const DescListItem = ({ item, mainIndex }) =>
  <li style={{ padding: '2px', paddingBottom: '13px' }}>
    {item.paragraphs &&
      <Typography
        variant="body1"
      >
        {item.paragraphs}
      </Typography>}
    {item.subHeading &&
      <>
        <Typography
          variant="body1"
        >
          <span style={{ fontWeight: '900', color: (mainIndex % 2) === 0 ? 'black' : '#FFF' }}>
            {item.subHeading}
          </span>
          {item.subHeadingData}
        </Typography>
      </>}
    {item.subHeadingData1 &&
      <Typography
        variant="body1"
        style={{ paddingBottom: '13px', paddingTop: '13px' }}
      >
        {item.subHeadingData1}
      </Typography>}
    {item.subHeadingData2 &&
      <Typography
        variant="body1"
        style={{ paddingBottom: '13px' }}
      >
        {item.subHeadingData2}
      </Typography>}
    {item.subHeadingData3 &&
      <Typography
        variant="body1"
      >
        {item.subHeadingData3}
      </Typography>}
  </li>;

DescListItem.propTypes = {
  item: PropTypes.string.isRequired,
  mainIndex: PropTypes.number.isRequired
};

const DescProbItem = ({ item }) =>
  <li style={{ padding: '2px', paddingBottom: '13px' }}>
    {item.paragraph &&
      <Typography
        variant="body1"
        style={{ color: 'darkslategray' }}
      >
        {item.paragraph}
      </Typography>}
    {item.subHeading &&
      <>
        <Typography
          variant="body1"
        >
          <span
            style={{
              lineHeight: 3,
              fontWeight: '900',
              fontSize: 'large',
              color: 'darkslategray'
            }}
          >
            {item.subHeading}
          </span>
          {item.subHeadingData1 &&
            <li
              style={{
                color: 'darkslategray',
                display: 'flex',
                flexDirection: 'inherit',
                fontSize: '10pt',
                margin: '5px 0 5px 0'
              }}
            >
              <FiberManualRecordIcon
                style={{ color: '#721C3D', marginRight: 10 }}
                fontSize="small"
              />
              {item.subHeadingData1}
            </li>}
          {item.subHeadingData2 &&
            <li
              style={{
                color: 'darkslategray',
                display: 'flex',
                flexDirection: 'inherit',
                fontSize: '10pt',
                margin: '5px 0 5px 0'
              }}
            >
              <FiberManualRecordIcon
                style={{ color: '#721C3D', marginRight: 10 }}
                fontSize="small"
              />
              {item.subHeadingData2}
            </li>}
          {item.subHeadingData3 &&
            <li
              style={{
                color: 'darkslategray',
                display: 'flex',
                flexDirection: 'inherit',
                fontSize: '10pt',
                margin: '5px 0 5px 0'
              }}
            >
              <FiberManualRecordIcon
                style={{ color: '#721C3D', marginRight: 10 }}
                fontSize="small"
              />
              {item.subHeadingData3}
            </li>}
        </Typography>
      </>}
  </li>;

DescProbItem.propTypes = {
  item: PropTypes.string.isRequired
};

const LifetimeWarranty = () => {
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
            {el.descList &&
              <ul style={{ width: '850px' }}>
                {el.descList.map((item, index2) =>
                  <ListItem key={index2} item={item} mainIndex={index} />)}
              </ul>}
            {el.descProblem &&
              <ul style={{ width: '850px' }}>
                {el.descProblem.map((item, index2) =>
                  <DescProbItem key={index2} item={item} mainIndex={index} />)}
              </ul>}
            {el.desc &&
              <ul style={{ width: '850px' }}>
                {el.desc.map((item, index2) =>
                  <DescListItem key={index2} item={item} mainIndex={index} />)}
              </ul>}
          </div>
        </Box>
        {(index % 2) === 0 &&
          <div className={classes.straightLine}/>
        }
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
              Worry-Free Driving!
            </Typography>
            <Grid container item justifyContent="flex-start" xs={12} className={classes.headerContainer}>
              <Typography
                className={classes.heroSubHeaderContentTitle}
                variant="h6"
                style={{ padding: '0 20px 0 0' }}
              >
                Lifetime Warranty
              </Typography>
              <Typography className={classes.heroSubHeaderContentTitle} variant="h6">
                <FiberManualRecordIcon
                  style={{ color: '#FFF', margin: '4px 10px 0 0', fontSize: '10px' }}
                />
                Unlimited Miles
              </Typography>
              <Typography className={classes.heroSubHeaderContentTitle} variant="h6">
                <FiberManualRecordIcon
                  style={{ color: '#FFF', margin: '4px 10px 0 0', fontSize: '10px' }}
                />
                Unlimited Time
              </Typography>
              <Typography className={classes.heroSubHeaderContentTitle} variant="h6">
                <FiberManualRecordIcon
                  style={{ color: '#FFF', margin: '4px 10px 0 0', fontSize: '10px' }}

                />
                No Cost To You
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

LifetimeWarranty.propTypes = {
};

export default connect(mapStateToProps)(withRouter(LifetimeWarranty));
