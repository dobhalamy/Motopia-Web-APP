import React from 'react';
import RideShare from 'components/rideShare';
import PropTypes from 'prop-types';

import { RideShareSeo } from '@/api';
import { SEO_PAGES } from '@/constants';

const Page = ({ rdsHomeSeo }) => <RideShare rdsHomeSeo={rdsHomeSeo} />;
export default Page;

Page.defaultProps = {
  rdsHomeSeo: {
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
Page.propTypes = {
  rdsHomeSeo: PropTypes.shape({
    cityName: PropTypes.string,
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
    const rdsHomeSeoTags = await RideShareSeo.getSeo();
    const rdsHomeSeoTagsData = rdsHomeSeoTags.data.find(
      item => item.cityName.toLowerCase() === SEO_PAGES.RIDE_SHARE_HOME
    );
    if (rdsHomeSeoTagsData) {
      const rdsHomeSeo = {
        cityName: rdsHomeSeoTagsData.cityName,
        metaTitle: rdsHomeSeoTagsData.metaTitle,
        metaDescription: rdsHomeSeoTagsData.metaDescription,
        metaKeywords: rdsHomeSeoTagsData.metaKeywords,
        seoTags: {
          h1: rdsHomeSeoTagsData.seoTags.h1,
          h2: rdsHomeSeoTagsData.seoTags.h2,
          h3: rdsHomeSeoTagsData.seoTags.h3,
        },
      };
      return {
        props: {
          rdsHomeSeo,
        },
      };
    } else {
      return {
        props: {
          rdsHomeSeo: null,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      props: {
        rdsHomeSeo: null,
      },
    };
  }
};
