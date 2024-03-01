import React from 'react';
import {
  RefinementList,
  SearchBox,
  Configure,
  InstantSearch,
} from 'react-instantsearch-dom';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HitsList from './HitsList';
import ClearRefinements from './ClearRefinements';

const useStyles = makeStyles(theme => ({
  heroContentContainer: {
    padding: `${theme.spacing(4.5)}px ${theme.spacing(2)}px ${theme.spacing(
      4
    )}px`,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      paddingBottom: 0
    },
  },
  heroContentTitleContainer: {
    margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(1.5)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.spacing(1.5)}px 0px ${theme.spacing(4)}px`
    },
  },
  heroContentTitle: {
    fontWeight: theme.typography.fontWeightLight,
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(34),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.pxToRem(22),
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  heroContentSubtitle: {
    fontSize: theme.typography.pxToRem(17),
  },
  main: {
    padding: `0px ${theme.spacing(1.5)}px`,
    marginBottom: theme.spacing(2)
  },
}));

const BlogPage = (props) => {
  const classes = useStyles();
  return (
    <InstantSearch {...props}>
      <Grid
        className={classes.heroContentContainer}
        container
        direction="column"
        wrap="nowrap"
        component="header"
      >
        <Typography variant="body1">Home / Blog</Typography>
        <Grid className={classes.heroContentTitleContainer} container>
          <Grid container item xs={12} md={6} >
            <Typography className={classes.heroContentTitle} variant="h1">
              OUR BLOG
            </Typography>
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={6}
            direction="column"
            wrap="nowrap"
          >
            <SearchBox className="p-3 shadow-sm" />
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={1} classes={{ root: classes.main }} component="main">
        <Grid item xs={12} md={3} component="aside">
          <ClearRefinements />
          <h2>Categories</h2>
          <RefinementList attribute="category" />
          <Configure hitsPerPage={6} />
        </Grid>
        <Grid item xs={12} md={9}>
          <HitsList/>
        </Grid>
      </Grid>
      <footer/>
    </InstantSearch>);
};

export default BlogPage;
