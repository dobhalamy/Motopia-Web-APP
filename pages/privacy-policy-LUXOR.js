/* eslint-disable max-len */
import React from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, useMediaQuery } from '@material-ui/core';
import Layout from 'components/shared/Layout';
import mainText from 'assets/privacy-policy/luxor.json';
import RenderSimpleTable from '@/components/renderSimpleTable';
import RenderReasonsTable from '@/components/renderReasonsTable';

const useStyles = makeStyles(theme => ({
  heroContentContainer: {
    padding: `${theme.spacing(4.5)}px ${theme.spacing(2)}px ${theme.spacing(
      4
    )}px`,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0,
    },
    color: '#000',
  },
  mainTitle: {
    fontSize: theme.typography.pxToRem(48),
    marginBottom: 30,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableTitle: {
    fontWeight: 600,
    marginBottom: 10,
  },
}));

const PrivacyPolicyLuxor = () => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));

  const {
    tableOne,
    tableTwo,
    definitions,
    other,
    whoWeAre,
    whatWeDo,
    reasonsTable,
  } = mainText;

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Read Luxor Motor Cars Inc privacy policy for the smooth transaction flows, car rental bookings, and to understand how we use your personal information and how do we store it?"
        />
        <title>
          Privacy Policy - Know How We Use Information | Online Vehicle Sale and
          Rideshare rentals
        </title>
      </Head>
      <Layout>
        <Box
          className={classes.heroContentContainer}
          style={{ maxWidth: matches ? '100%' : 1138 }}
        >
          <Typography variant="h1" align="center" className={classes.mainTitle}>
            Privacy Policy
          </Typography>
          <Box className={classes.tableContainer}>
            <RenderSimpleTable tableData={tableOne} />
          </Box>
          <Box className={classes.tableContainer}>
            <RenderReasonsTable table={reasonsTable} />
          </Box>
          <Box className={classes.tableContainer}>
            <RenderSimpleTable tableData={tableTwo} />
          </Box>
          <Box className={classes.tableContainer}>
            <Typography variant="h5" className={classes.tableTitle}>
              Who We Are
            </Typography>
            <RenderSimpleTable tableData={whoWeAre} />
          </Box>
          <Box className={classes.tableContainer}>
            <Typography variant="h5" className={classes.tableTitle}>
              What We Do
            </Typography>
            <RenderSimpleTable tableData={whatWeDo} />
          </Box>
          <Box className={classes.tableContainer}>
            <Typography variant="h5" className={classes.tableTitle}>
              Definitions
            </Typography>
            <RenderSimpleTable tableData={definitions} />
          </Box>
          <Box className={classes.tableContainer}>
            <Typography variant="h5" className={classes.tableTitle}>
              {other.title}
            </Typography>
            <Typography variant="body1">{other.desc}</Typography>
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export default PrivacyPolicyLuxor;
