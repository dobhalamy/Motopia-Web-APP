/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Divider, useMediaQuery } from '@material-ui/core';

import Layout from 'components/shared/Layout';
import mainText from 'assets/privacy-policy/text.json';

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
  },
  customTable: {
    border: '1px solid rgb(187, 187, 187)',
    borderCollapse: 'collapse',
    width: '100%',
    tableLayout: 'fixed',
    wordWrap: 'break-word',
  },
  customTh: {
    border: '1px solid rgb(187, 187, 187)',
    borderCollapse: 'collapse',
    padding: 15,
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

const PrivacyPolicy = () => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const renderSimpleRow = (row) => (
    <>
      <Typography
        variant="body1"
        style={{ fontWeight: row.title === 'Facts' ? 600 : 400 }}
      >
        {row.desc}
      </Typography>
      {row.list &&
      <ul>
        {row.list.map((item, index1) => <ListItem key={index1} item={item}/>)}
      </ul>}
    </>
  );

  const renderHardRow = row => (
    <Box>
      {row.descOne &&
        <Typography variant="body1">
          {row.descOne}
        </Typography>}
      {row.listOne &&
        <ul>
          {row.listOne.map((item, index1) => <ListItem key={index1} item={item}/>)}
        </ul>}
      {row.descTwo &&
        <Typography variant="body1">
          {row.descTwo}
        </Typography>}
      {row.listTwo &&
        <ul>
          {row.listTwo.map((item, index1) => <ListItem key={index1} item={item}/>)}
        </ul>}
      {row.descThree &&
        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: row.descThree }} />}
      {row.descFour &&
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: row.descFour }}
          style={{ paddingTop: 20 }}
        />}
    </Box>
  );

  const renderParagraphs = row => {
    const {
      paragraphs,
      contacts
    } = row;

    return (
      <>
        {paragraphs.map((par, index) =>
          <Box key={index} className={classes.paragraphBox}>
            {par.title &&
              <Typography variant="body1" className={classes.textBold}>
                {par.title}
              </Typography>}
            {par.desc
              ? <Typography variant="body1">{par.desc}</Typography>
              : (
                <>
                  <Box className={classes.paragraphBox}>
                    <Typography variant="body1">{par.descOne}</Typography>
                  </Box>
                  <Divider />
                  <Box className={classes.contactBox}>
                    {contacts.map((el, index1) =>
                      <Typography
                        key={index1}
                        variant="subtitle1"
                        className={index1 !== contacts.length - 1 ? classes.textBold : null}
                      >
                        {el}
                      </Typography>
                    )}
                  </Box>
                  <Divider style={{ marginBottom: 25 }} />
                  <Box className={classes.paragraphBox}>
                    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: par.descTwo }} />
                  </Box>
                  <Divider style={{ marginBottom: 25 }} />
                  <Box className={classes.paragraphBox}>
                    <Typography variant="body1">{par.descThree}</Typography>
                  </Box>
                </>
              )}
          </Box>
        )}
      </>
    );
  };

  const renderReasonsTable = table => {
    const { headerOne, headerTwo, headerThree, rows, additional } = table;
    return (
      <>
        <table className={classes.customTable}>
          <thead>
            <tr>
              <th className={classes.customTh}>
                <Typography variant="subtitle1" className={classes.textBold}>
                  {headerOne}
                </Typography>
              </th>
              <th className={classes.customTh}>
                <Typography variant="subtitle1" className={classes.textBold}>
                  {headerTwo}
                </Typography>
              </th>
              <th className={classes.customTh}>
                <Typography variant="subtitle1" className={classes.textBold}>
                  {headerThree}
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) =>
              <tr key={row.title}>
                <td className={classes.customTh} style={{ width: '70%' }}>
                  <Typography variant="body1" className={classes.textBold}>
                    {row.title}
                  </Typography>
                  {row.desc &&
                    <Typography variant="body1">
                      {row.desc}
                    </Typography>}
                </td>
                <td className={classes.customTh}>
                  <Typography variant="body1" align="center" className={classes.textBold}>
                    {row.share}
                  </Typography>
                </td>
                <td className={classes.customTh}>
                  <Typography variant="body1" align="center" className={classes.textBold}>
                    {row.limit}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Typography variant="body2">
          {additional}
        </Typography>
      </>
    );
  };

  const renderSimpleTable = array => (
    <table className={classes.customTable}>
      <tbody>
        {array.map((el, index) =>
          <tr key={el.title}>
            <td className={classes.customTh} style={{ width: matches ? '35%' : '15%' }}>
              <Typography variant="subtitle1" className={classes.textBold}>
                {el.title}
              </Typography>
            </td>
            <td className={classes.customTh} style={{ width: matches ? '65%' : '85%' }}>
              {el.desc && renderSimpleRow(el, index)}
              {(el.descOne || el.descThree) && renderHardRow(el)}
              {el.paragraphs && renderParagraphs(el)}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const { tableOne, tableTwo, definitions, other, whoWeAre, whatWeDo, reasonsTable } = mainText;

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {

  };
  return (
    <>
      <Head>
        <meta name="description" content="Read GoMotopia's privacy policy for the smooth transaction flows, car rental bookings, and to understand how we use your personal information and how do we store it?" />
        <title>Privacy Policy - Know How We Use Information | Online Vehicle Sale and Rideshare rentals</title>
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
            Privacy Policy
          </Typography>
          <Box className={classes.tableContainer}>
            {renderSimpleTable(tableOne)}
          </Box>
          <Box className={classes.tableContainer}>
            {renderReasonsTable(reasonsTable)}
          </Box>
          <Box className={classes.tableContainer}>
            {renderSimpleTable(tableTwo)}
          </Box>
          <Box className={classes.tableContainer}>
            <Typography
              variant="h5"
              className={classes.tableTitle}
            >
              Who We Are
            </Typography>
            {renderSimpleTable(whoWeAre)}
          </Box>
          <Box className={classes.tableContainer}>
            <Typography
              variant="h5"
              className={classes.tableTitle}
            >
              What We Do
            </Typography>
            {renderSimpleTable(whatWeDo)}
          </Box>
          <Box className={classes.tableContainer}>
            <Typography
              variant="h5"
              className={classes.tableTitle}
            >
              Definitions
            </Typography>
            {renderSimpleTable(definitions)}
          </Box>
          <Box className={classes.tableContainer}>
            <Typography
              variant="h5"
              className={classes.tableTitle}
            >
              {other.title}
            </Typography>
            <Typography
              variant="body1"
            >
              {other.desc}
            </Typography>
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export default PrivacyPolicy;
