/* eslint-disable react/no-danger */
/* eslint-disable react/prop-types */
import React from 'react';
import Head from 'next/head';
import Layout from 'components/shared/Layout';
import sanitizeHtml from 'sanitize-html';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper } from '@material-ui/core';
import { ArrowBackIosRounded } from '@material-ui/icons';
import SeoHeader from '@/components/seoSection';
import { getAllLinks, getPost } from '../../../src/api/blog';
import ShareButton from '../../../src/components/blog/ShareButton';

const useStyles = makeStyles(theme => ({
  whitePageContainer: {
    background: theme.palette.common.white,
    width: '100%',
  },
  article: {
    width: '90%',
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(1),
    minHeight: '95%',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(3)
    },
  },
  backButton: {
    position: 'absolute',
    left: '5px',
    top: '5px',
    zIndex: 2
  },
  forwardButton: {
    position: 'absolute',
    right: '5px',
    top: '5px',
    zIndex: 2
  }
}));

const BlogArticle = ({ post }) => {
  const classes = useStyles();
  const sanitizedData = () => ({
    __html: sanitizeHtml(post.html, {
      allowedTags: false,
      allowedAttributes: false
    })
  });

  return (
    <>
      <Head>
        <title>{post.title} | Motopia</title>
        <meta name="og:title" content={post.metaTitle} />
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.metaKeywords} />
        {post.metaCanonical && (
          <link rel="canonical" href={post.metaCanonical} />
        )}
        <SeoHeader
          id="blog-seo"
          h1Tag={post?.seoTags?.h1}
          h2Tag={post?.seoTags?.h2}
          h3Tag={post?.seoTags?.h3}
        />
      </Head>
      <Layout>
        <div className={classes.whitePageContainer}>
          <Paper classes={{ root: classes.article }} elevation={2}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.backButton}
              href="/blog"
            >
              <ArrowBackIosRounded />
              Blog
            </Button>
            {post.callToActionText && post.callToActionLink &&
            <Button
              variant="contained"
              color="primary"
              className={classes.forwardButton}
              href={post.callToActionLink}
            >
              {post.callToActionText}
            </Button>}
            <article dangerouslySetInnerHTML={sanitizedData()} />
            <ShareButton postTitle={post.title} />
          </Paper>
        </div>
      </Layout>
    </>
  );
};

export const getStaticPaths = async () => {
  const paths = await getAllLinks().then(res => res.data);
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async({ params }) => {
  const { category, post } = params;
  const postData = await getPost(category, post);
  if (!postData) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post: postData
    },
    revalidate: 60,
  };
};

export default BlogArticle;
