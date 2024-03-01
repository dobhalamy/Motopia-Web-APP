/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import qs from 'qs';
import algoliasearch from 'algoliasearch/lite';
import { findResultsState } from 'react-instantsearch-dom/server';
import BlogPage from 'components/blog/BlogPage';
import Layout from 'components/shared/Layout';
import { makeStyles } from '@material-ui/core/styles';
import { getAllActive } from '../../src/api/blog';

const useStyles = makeStyles(theme => ({
  whitePageContainer: {
    background: theme.palette.common.white,
    width: '100%',
  },
}));

const searchClient = algoliasearch('KM20UYPUS3', '43e594699f7db15eb633bd41f0989cd0');

const updateAfter = 700;

const searchStateToURL = (searchState) =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : '';

const DEFAULT_PROPS = {
  searchClient,
  indexName: 'blog_posts',
};

export default function Page(props) {
  const router = useRouter();
  const debouncedSetState = React.useRef();
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Blog | Motopia</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.4.5/themes/satellite-min.css" integrity="sha256-TehzF/2QvNKhGQrrNpoOb2Ck4iGZ1J/DI4pkd2oUsBc=" crossOrigin="anonymous" />
      </Head>
      <Layout>
        <div className={classes.whitePageContainer}>
          <BlogPage
            {...DEFAULT_PROPS}
            resultsState={props.resultsState}
            onSearchStateChange={(nextSearchState) => {
              clearTimeout(debouncedSetState.current);

              debouncedSetState.current = setTimeout(() => {
                const href = searchStateToURL(nextSearchState);

                router.push(href, href, { shallow: true });
              }, updateAfter);
            }}
          />
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  await getAllActive();
  const resultsState = await findResultsState(BlogPage, {
    ...DEFAULT_PROPS,
  });

  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
    },
    revalidate: 60,
  };
};
