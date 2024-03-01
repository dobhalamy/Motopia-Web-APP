/* eslint-disable max-len */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Layout from 'components/shared/Layout';
import TradeInValue from 'components/tradeIn/TradeInValue';
import { SEO_PAGES } from '@/constants';
import { RideShareSeo } from '@/api';
import SeoHeader from '@/components/seoSection';
// NOTE: assign values to function when new tour will come
// eslint-disable-next-line
const tutorialOpen = () => {};

const TradeIn = ({ tradeinSeo }) => (
  <Layout tutorialOpen={tutorialOpen}>
    <Head>
      <meta name="description" content={tradeinSeo?.metaDescription} />
      <title>
        Trade In Your Car with most aggressive advances - Same day funding!
      </title>
      <SeoHeader
        id="tradein-seo"
        h1Tag={tradeinSeo?.seoTags?.h1}
        h2Tag={tradeinSeo?.seoTags?.h2}
        h3Tag={tradeinSeo?.seoTags?.h3}
      />
      <meta name="og:title" content={tradeinSeo?.metaTitle} />
      <meta name="keywords" content={tradeinSeo?.metaKeywords} />
    </Head>
    <TradeInValue />
  </Layout>
);

TradeIn.defaultProps = {
  tradeinSeo: {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    seoTags: {
      h1: '',
      h2: '',
      h3: '',
    },
  },
};
TradeIn.propTypes = {
  tradeinSeo: PropTypes.shape({
    metaTitle: PropTypes.string,
    metaDescription: PropTypes.string,
    metaKeywords: PropTypes.string,
    seoTags: PropTypes.shape({
      h1: PropTypes.string,
      h2: PropTypes.string,
      h3: PropTypes.string,
    }),
  }),
};
export const getStaticProps = async () => {
  try {
    const tradeInSeoTags = await RideShareSeo.getSeo();
    const tradeInSeoTagsData = tradeInSeoTags.data.find(
      item => item.cityName.toLowerCase() === SEO_PAGES.TRADE_IN
    );
    if (tradeInSeoTagsData) {
      const tradeinSeo = {
        metaTitle: tradeInSeoTagsData.metaTitle,
        metaDescription: tradeInSeoTagsData.metaDescription,
        metaKeywords: tradeInSeoTagsData.metaKeywords,
        seoTags: {
          h1: tradeInSeoTagsData.seoTags.h1,
          h2: tradeInSeoTagsData.seoTags.h2,
          h3: tradeInSeoTagsData.seoTags.h3,
        },
      };
      return {
        props: {
          tradeinSeo,
        },
      };
    } else {
      return {
        props: {
          tradeinSeo: null,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      props: {
        tradeinSeo: null,
      },
    };
  }
};

export default TradeIn;
