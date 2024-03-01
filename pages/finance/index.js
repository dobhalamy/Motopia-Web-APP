import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useRouter } from 'next/router';
import Head from 'next/head';
import { RideShareSeo } from '@/api';
import { SEO_PAGES } from '@/constants';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { prospectData, listOfVehiclesSelector } from 'src/redux/selectors';

import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'components/shared/Layout';
import UserForm from 'components/finance/UserForm';
import VehicleChosenForm from 'components/finance/VehicleChosenForm';
// import LicenseApprovalForm from 'components/finance/LicenseApprovalForm';  NOTE: Uncomment if return previous logic
import VehicleApproval from 'components/finance/VehicleApproval';

import { FinancePins } from 'src/api';
import { getCookieJSON } from 'src/utils/cookie';
import FinanceHero from 'assets/finance_hero.jpg';
import { applyAdsQuery } from '@/utils/commonUtils.js';
import SeoHeader from '@/components/seoSection';
import FinanceResult from './financeResult/index.js';
// import VehiclePaymentForm from '../../src/components/finance/VehiclePaymentForm';  NOTE: Uncomment if return previous logic

const useStyles = makeStyles({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
});

const Finance = props => {
  const [activeForm, setActiveForm] = React.useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false);
  const [financePins, setFinancePins] = React.useState([]);
  const [vehicle, setVehicle] = useState(null);
  const classes = useStyles();
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.query);
  const { financeSeo } = props;

  useEffect(() => {
    const { query } = router;
    if (query.stockid && props.vehicles) {
      setVehicle(
        props.vehicles.find(stock => stock.stockid === Number(query.stockid))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextForm = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    if (activeForm === 0) {
      router.push({
        pathname: '/finance/financeResult',
        query: { ...adsQuery },
      });
    } else if (activeForm === 3) {
      const { query: queryParam } = router;
      const { stockid: stockId } = queryParam;
      router.push({
        pathname: '/finance/method',
        query: {
          stockId,
          ...adsQuery,
        },
      });
    } else setActiveForm(activeForm + 1);
  };

  const checkCreditId = () => {
    const info = getCookieJSON('vehicleChosenInfo');
    if (info) {
      return 3;
    } else return 2;
  };

  const handleShowRideShareForm = () => {
    router.push({ pathname: '/finance/error', query: { ...adsQuery } });
  };
  const handleShowEmployerScreen = () => setActiveForm(checkCreditId());
  const handlePreviousForm = () => setActiveForm(activeForm - 1);

  React.useEffect(() => {
    const { query } = router;
    const { amount, creditAppId, downPayment } = props.prospect;
    if (!!amount && !!creditAppId && !!downPayment && !!query.stockid) {
      setActiveForm(checkCreditId());
    }
    async function getPins() {
      const response = await FinancePins.getFinancePins();
      setFinancePins([...response.data]);
    }
    getPins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tutorialOpen = path => {
    if (
      path === '/finance/' ||
      path.includes('/finance?stockid') ||
      path === '/finance'
    ) {
      setIsTutorialOpen(true);
    }
  };
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Head>
        <SeoHeader
          id="finance-seo"
          h1Tag={financeSeo?.seoTags?.h1}
          h2Tag={financeSeo?.seoTags?.h2}
          h3Tag={financeSeo?.seoTags?.h3}
        />
        <meta name="og:title" content={financeSeo?.metaTitle} />
        <meta name="description" content={financeSeo?.metaDescription} />
        <meta name="keywords" content={financeSeo?.metaKeywords} />
      </Head>
      <Box className={classes.financeMainWrapper}>
        {activeForm === 0 && (
          <UserForm
            prospect={props.prospect}
            handleNextForm={handleNextForm}
            handleShowRideShareForm={handleShowRideShareForm}
            handleShowEmployerScreen={handleShowEmployerScreen}
            tutorialOpen={isTutorialOpen}
          />
        )}
        {activeForm === 1 && <FinanceResult handleNextForm={handleNextForm} />}
        {activeForm === 2 && (
          <VehicleChosenForm
            handleNextForm={handleNextForm}
            tutorialOpen={isTutorialOpen}
          />
        )}
        {activeForm === 3 && (
          <VehicleApproval
            financePins={financePins}
            handleNextForm={handleNextForm}
            handleShowRideShareForm={handleShowRideShareForm}
            handlePreviousForm={handlePreviousForm}
            vehicle={vehicle}
            prospect={props.prospect}
          />
        )}
        {/* NOTE: Here is new logic. Its forwared to new url. */}
        {/* {activeForm === 4 && (
          <VehiclePaymentForm
            email={props.prospect.email}
            stockId={props.router.query.stockid}
            prospectId={props.prospect.prospectId}
          />
        )}
        {activeForm === 6 && (
          <LicenseApprovalForm
            financePins={financePins}
            handleNextForm={handleNextForm}
          />
        )} */}
      </Box>
    </Layout>
  );
};

Finance.defaultProps = {
  financeSeo: {
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
Finance.propTypes = {
  financeSeo: PropTypes.shape({
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
    const financeSeoTags = await RideShareSeo.getSeo();
    const financeSeoTagsData = financeSeoTags.data.find(
      item => item.cityName.toLowerCase() === SEO_PAGES.FINANCE
    );
    if (financeSeoTagsData) {
      const financeSeo = {
        metaTitle: financeSeoTagsData.metaTitle,
        metaDescription: financeSeoTagsData.metaDescription,
        metaKeywords: financeSeoTagsData.metaKeywords,
        seoTags: {
          h1: financeSeoTagsData.seoTags.h1,
          h2: financeSeoTagsData.seoTags.h2,
          h3: financeSeoTagsData.seoTags.h3,
        },
      };
      return {
        props: {
          financeSeo,
        },
      };
    } else {
      return {
        props: {
          financeSeo: null,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      props: {
        financeSeo: null,
      },
    };
  }
};
const mapStateToProps = createStructuredSelector({
  prospect: prospectData,
  vehicles: listOfVehiclesSelector,
});

Finance.propTypes = {
  prospect: PropTypes.object.isRequired,
  vehicles: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(withRouter(Finance));
