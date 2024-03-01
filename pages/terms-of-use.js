/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, useMediaQuery } from '@material-ui/core';

import Layout from 'components/shared/Layout';
import mainText from 'assets/terms-of-use/text.json';

const useStyles = makeStyles(theme => ({
  heroContentContainer: {
    padding: `${theme.spacing(4.5)}px ${theme.spacing(2)}px ${theme.spacing(
      4
    )}px`,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0
    },
    color: '#000'
  },
  mainTitle: {
    fontSize: theme.typography.pxToRem(48),
    marginBottom: 30
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableTitle: {
    fontWeight: 600,
    marginBottom: 10
  },
  textBold: {
    fontWeight: 600
  },
  paragraphBox: {
    marginBottom: 30,
  },
  contactBox: {
    padding: '25px 0px',
    maxWidth: '100%'
  }
}));

const ListItem = ({ item }) =>
  <li>
    <Typography
      variant="body1"
    >
      {item}
    </Typography>
  </li>;

ListItem.propTypes = {
  item: PropTypes.string.isRequired,
};

const TermsOfUse = () => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const { text } = mainText;

  const renderParagraphs = paragraphs =>
    paragraphs.map(el =>
      <Box key={el.title}>
        <Typography
          variant="h6"
          className={classes.textBold}
          paragraph
        >
          {el.title}
        </Typography>
        <Typography
          paragraph
          variant="body1"
          dangerouslySetInnerHTML={{ __html: el.descOne }}
        />
        {el.descList &&
          <ol>
            {el.descList.map((item, index) => <ListItem key={index} item={item}/>)}
          </ol>}
        {el.contacts &&
          <Typography paragraph component="div">
            {el.contacts.map((item, index) =>
              <Typography variant="body1" key={index}>{item}</Typography>)}
          </Typography>}
        {el.descTwo &&
          <Typography
            paragraph
            variant="body1"
            dangerouslySetInnerHTML={{ __html: el.descTwo }}
          />}
        {el.descThree &&
          <Typography
            paragraph
            variant="body1"
            dangerouslySetInnerHTML={{ __html: el.descThree }}
          />}
        {el.descFour &&
          <Typography
            paragraph
            variant="body1"
            dangerouslySetInnerHTML={{ __html: el.descFour }}
          />}
        {el.descFive &&
          <Typography
            paragraph
            variant="body1"
            dangerouslySetInnerHTML={{ __html: el.descFive }}
          />}
        {el.descSix &&
          <Typography
            paragraph
            variant="body1"
            dangerouslySetInnerHTML={{ __html: el.descSix }}
          />}
      </Box>
    );

  const renderText = array =>
    array.map((el, index) =>
      <Box key={index}>
        <Typography
          variant="h5"
          className={classes.textBold}
          paragraph
        >
          {el.title}
        </Typography>
        <Typography
          paragraph
          variant="body1"
          dangerouslySetInnerHTML={{ __html: el.descOne }}
        />
        {el.descList &&
          <ol>
            {el.descList.map((item, index2) => <ListItem key={index2} item={item} />)}
          </ol>}
        {el.contacts &&
          <Typography paragraph component="div">
            {el.contacts.map((item, index1) =>
              <Typography variant="body1" key={index1}>{item}</Typography>)}
          </Typography>}
        {el.paragraphs && renderParagraphs(el.paragraphs)}
        {el.descTwo &&
          <Typography
            paragraph
            variant="body1"
            dangerouslySetInnerHTML={{ __html: el.descTwo }}
          />}
        {el.descThree &&
          <Typography
            paragraph
            variant="body1"
            dangerouslySetInnerHTML={{ __html: el.descThree }}
          />}
      </Box>
    );

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };
  return (
    <>
      <Head>
        <meta name="description" content="Read GoMotopia's Terms & Conditions for the smooth transaction flows, car rental bookings, & to understand how we use your personal information & how do we store it?" />
        <title>Terms of Use - Know How We Use Information | Online Vehicle Sale and Rideshare rentals</title>
      </Head>
      <Layout tutorialOpen={tutorialOpen}>
        <Box
          className={classes.heroContentContainer}
          style={{ maxWidth: matches ? '100%' : 1138 }}
        >
          <Typography
            variant="h1"
            align="center"
            className={classes.mainTitle}
          >
            Terms And Conditions
          </Typography>
          {renderText(text)}
        </Box>
      </Layout>
    </>
  );
};

export default TermsOfUse;
