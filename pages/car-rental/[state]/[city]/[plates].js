import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import RideShare from 'components/rideShare';
import { RideShareSeo } from 'src/api';
import { has } from 'lodash';
import { RideShare as RideShareApi } from '../../../../src/api';

const Page = ({ seo, randomRdsData }) => (
  <RideShare seo={seo} randomRdsData={randomRdsData} />
);

Page.propTypes = {
  seo: PropTypes.object,
  randomRdsData: PropTypes.object,
};

Page.defaultProps = {
  seo: null,
  randomRdsData: null,
};

export const getStaticPaths = async () => {
  const paths = await RideShareSeo.getAllPagesRoutes().then(res =>
    res.data.map(({ url }) => url)
  );
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const { state, city, plates } = params;
  let seo = null;
  let randomRdsData = null;
  try {
    if (state && plates && city) {
      const payload = {
        workState: state,
        plateType: plates.replace('-', ' '),
        cityName: city,
      };
      const response = await RideShareSeo.getSeoTagsByStateAndPlate(payload);
      seo = response.data;
      const rdsImageData = await RideShareApi.getRandomRdsContent();
      if (has(rdsImageData, 'data')) {
        randomRdsData = rdsImageData.data;
      }
    }
  } catch (e) {
    console.error(e);
    return {
      redirect: {
        destination: '/ride-share',
      },
    };
  }
  return { props: { seo, randomRdsData }, revalidate: 36 };
};

export default withRouter(Page);
