/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';
import RentalProcess from 'assets/Rental_Process.png';
import BarGraph from 'assets/bar_graph.png';
import Footer from 'components/vehicle/Footer';
import Bulb from 'assets/bulb.png';
import ExclamationMark from 'assets/exclamation_mark.png';
import MagnifyingGlass from 'assets/magnifying_glass.png';
import Settings from 'assets/settings.png';
import Layout from 'components/shared/Layout';
import mainText from 'assets/webbies/text.json';

const useStyles = makeStyles(theme => ({
  heroContentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0
    },
    color: '#000'
  },
  mainTitle: {
    backgroundColor: '#001B5D',
    color: '#F5F5F5',
    width: '100%',
    minHeight: 80,
    margin: 'auto',
    padding: 12,
    fontWeight: 100,
    letterSpacing: 3
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableTitle: {
    fontWeight: 600,
    marginBottom: 10
  },
  textBold: {
    fontWeight: 900,
    marginBottom: 0,
    width: 850,
    color: 'black'
  },
  textBold2: {
    fontWeight: 900,
    marginBottom: 0,
    width: 850,
    color: '#FFF'
  },
  paragraphBox: {
    marginBottom: 30,
  },
  contactBox: {
    padding: '25px 0px',
    maxWidth: '100%'
  },
  boxLayout: {
    width: '100%',
    textAlign: 'justify',
    float: 'left',
    paddingTop: 30,
    paddingLeft: 60,
    paddingBottom: 30,
    color: 'darkslategray'
  },
  boxLayout2: {
    width: '100%',
    textAlign: 'justify',
    float: 'left',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 60,
    backgroundColor: 'rgb(0, 28, 94)',
    color: '#FFF',
  },
  images: {
    width: 240,
    height: 240,
    padding: 20,
    margin: 'auto',
    marginLeft: 70
  },
  alignImage: {
    display: 'inline-flex'
  },
  headingData: {
    fontWeight: 100
  },
  rideShareButton: {
    backgroundColor: '#FD151B',
    fontWeight: 900,
    color: '#FFF',
    borderRadius: 3,
    width: 450,
    height: 85,
    fontSize: 'large',
    margin: 'auto',
    letterSpacing: 2,
    '&:hover': {
      backgroundColor: '#f52f34',
    },
    '&$focused': {
      backgroundColor: '#f52f34',
    },
  },
  rideShareBorder: {
    backgroundColor: '#001B5D',
    textAlign: 'center',
    width: '100%',
    padding: 15
  }
}));

const ListItem = ({ item, mainIndex }) =>
  <li style={{ padding: '2px', paddingBottom: '13px', fontWeight: 100 }}>
    <Typography
      variant="body1"
      style={{ color: (mainIndex % 2) === 0 ? 'darkslategray' : 'silver' }}
    >
      {item}
    </Typography>
  </li>;

ListItem.propTypes = {
  item: PropTypes.string.isRequired,
  mainIndex: PropTypes.number.isRequired
};

const DescListItem = ({ item, mainIndex }) =>
  <li style={{ padding: '2px', paddingBottom: '13px' }}>
    {item.paragraphs &&
      <Typography
        variant="body1"
        style={{ color: (mainIndex % 2) === 0 ? 'darkslategray' : 'silver' }}
      >
        {item.paragraphs}
      </Typography>}
    {item.subHeading &&
      <>
        <Typography
          variant="body1"
          style={{ color: (mainIndex % 2) === 0 ? 'darkslategray' : 'silver' }}
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
        style={{ paddingBottom: '13px', paddingTop: '13px', color: 'darkslategray' }}
      >
        {item.subHeadingData1}
      </Typography>}
    {item.subHeadingData2 &&
      <Typography
        variant="body1"
        style={{ paddingBottom: '13px', color: 'darkslategray' }}
      >
        {item.subHeadingData2}
      </Typography>}
    {item.subHeadingData3 &&
      <Typography
        variant="body1"
        style={{ color: 'darkslategray' }}
      >
        {item.subHeadingData3}
      </Typography>}
  </li>;

DescListItem.propTypes = {
  item: PropTypes.string.isRequired,
  mainIndex: PropTypes.number.isRequired
};

const DescProbItem = ({ item, mainIndex }) =>
  <li style={{ padding: '2px', paddingBottom: '13px' }}>
    {item.paragraph &&
      <Typography
        variant="body1"
        style={{ color: (mainIndex % 2) === 0 ? 'darkslategray' : 'silver' }}
      >
        {item.paragraph}
      </Typography>}
    {item.subHeading &&
      <>
        <Typography
          variant="body1"
          style={{ color: (mainIndex % 2) === 0 ? 'darkslategray' : 'silver' }}
        >
          <span
            style={{
              lineHeight: 3,
              fontWeight: '900',
              color: (mainIndex % 2) === 0 ? 'black' : '#FFF',
              fontSize: 'large'
            }}
          >
            {item.subHeading}
          </span>
          {item.subHeadingData1 &&
            <li>
              {item.subHeadingData1}
            </li>}
          {item.subHeadingData2 &&
            <li>
              {item.subHeadingData2}
            </li>}
          {item.subHeadingData3 &&
            <li>
              {item.subHeadingData3}
            </li>}
          {item.subHeadingData4 &&
            <li>
              {item.subHeadingData4}
            </li>}
        </Typography>
      </>}
  </li>;

DescProbItem.propTypes = {
  item: PropTypes.string.isRequired,
  mainIndex: PropTypes.number.isRequired
};
const Webby = () => {
  const classes = useStyles();
  const { text } = mainText;

  const renderImage = index => {
    switch (index) {
      case 0: {
        return <img src={MagnifyingGlass} alt="MagnifyingGlass" className={classes.images}/>;
      }
      case 1: {
        return <img src={ExclamationMark} alt="ExclamationMark" className={classes.images}/>;
      }
      case 2: {
        return <img src={Bulb} alt="Bulb" className={classes.images}/>;
      }
      case 3: {
        return <img src={Settings} alt="Settings" className={classes.images}/>;
      }
      case 4: {
        return <img src={BarGraph} alt="BarGraph" className={classes.images}/>;
      }
      default: {
        return '';
      }
    }
  };

  const renderText = array =>
    array.map((el, index) =>
      <Box key={index} className={(index % 2) === 0 ? classes.boxLayout : classes.boxLayout2}>
        <Typography
          variant="h5"
          className={(index % 2) === 0 ? classes.textBold : classes.textBold2}
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
        <div className={classes.alignImage}>
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
                <DescListItem key={index2} item={item} mainIndex={index}/>)}
            </ul>}
          {renderImage(index)}
        </div>
      </Box>
    );

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {
  };
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Typography
        variant="h3"
        align="center"
        className={classes.mainTitle}
      >
        GOMOTOPIA WEBBY AWARDS 2020 SUBMISSION
      </Typography>
      <img src={RentalProcess} alt="rental_Process" style={{ width: '60%', margin: 'auto' }}/>
      <Box
        className={classes.heroContentContainer}
      >
        {renderText(text)}
      </Box>
      <Box className={classes.rideShareBorder}>
        <Button
          href="/ride-share"
          className={classes.rideShareButton}
        >
          DEMO IT YOURSELF
        </Button>
      </Box>
      <Footer />
    </Layout>
  );
};

export default Webby;
