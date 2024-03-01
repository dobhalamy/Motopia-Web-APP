/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React from 'react';
import Head from 'next/head';

import Layout from 'components/shared/Layout';
import Slider from 'components/home/Slider';
import Tabs from 'components/home/Tabs';
import SeoHeader from '@/components/seoSection';
import { SEO_PAGES } from '@/constants';

import { Promo, Carousels, Vehicle, RideShareSeo } from 'src/api';

const Home = ({
  heroImages,
  promoBanners,
  bodyTypeCardsCarouselSetting,
  bodyTypeCardsCarousel,
  vehicleList,
  rdsHomeSeoTags,
}) => (
  <>
    <Head>
      <meta
        name="google-site-verification"
        content="YejmMMhRekXZHtwu3yQvxkT_CI17BbxxwkWBjnRG5uE"
      />
      <meta
        name="description"
        content="Want to hire the best cars in New York City but do not know where to hire one? Contact GoMotopia, the best luxury car rental in New York City. Book your ride now."
      />
      <title>
        Best and Fastest Online booking for Rideshare vehicles Nationwide -
        GoMotopia | Book Now
      </title>
      <SeoHeader
        id="homepage-seo"
        h1Tag={rdsHomeSeoTags?.seoTags?.h1}
        h2Tag={rdsHomeSeoTags?.seoTags?.h2}
        h3Tag={rdsHomeSeoTags?.seoTags?.h3}
      />
      <meta name="og:title" content={rdsHomeSeoTags?.metaTitle} />
      <meta name="description" content={rdsHomeSeoTags?.metaDescription} />
      <meta name="keywords" content={rdsHomeSeoTags?.metaKeywords} />
    </Head>
    <Layout>
      <Slider heroImages={heroImages} />
      <Tabs
        bodyTypeCardsCarouselSetting={bodyTypeCardsCarouselSetting}
        bodyTypeCardsCarousel={bodyTypeCardsCarousel}
        vehicleList={vehicleList}
        promoBanners={promoBanners}
      />
    </Layout>
  </>
);

export const getStaticProps = async () => {
  const heroImages = await Promo.getHomeBanners().then(res => res.data);
  const promoBanners = await Promo.getBanners().then(res => res.data);
  const bodyTypeCardsCarouselSetting = await Carousels.getCarouselSetting().then(
    res => res.data
  );
  const bodyTypeCardsCarousel = await Carousels.getCarousel().then(
    res => res.data
  );
  const vehicleList = await Vehicle.getAll().then(res => res.data);
  const homepageSeoData = await RideShareSeo.getSeo();
  const rdsHomeSeoTags = homepageSeoData.data.find(
    item => item.cityName.toLowerCase() === SEO_PAGES.HOME_PAGE
  );
  const seoTags = rdsHomeSeoTags || null;

  return {
    props: {
      heroImages,
      promoBanners,
      bodyTypeCardsCarouselSetting,
      bodyTypeCardsCarousel,
      vehicleList,
      rdsHomeSeoTags: seoTags,
    },
    revalidate: 3600,
  };
};

export default Home;
