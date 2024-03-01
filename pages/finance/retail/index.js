import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, useRouter } from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  prospectData,
  listOfVehiclesSelector,
  salePoints,
  priceListSelector,
} from 'src/redux/selectors';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'components/shared/Layout';
import UserForm from 'components/finance/UserForm';
import RetailConfirmation from 'components/finance/FinancingConfirmation';

import { Vehicle as VehicleRoute, FinancePins } from 'src/api';
import { getCookie, getCookieJSON } from 'src/utils/cookie';
import FinanceHero from 'assets/finance_hero.jpg';
import { applyAdsQuery } from '@/utils/commonUtils';

const useStyles = makeStyles({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
});

const Retail = props => {
  const [activeForm, setActiveForm] = React.useState(0);
  const [financePins, setFinancePins] = React.useState([]);
  const [vehicleData, setVehicle] = React.useState();
  const [taxFees, setTax] = React.useState({
    fees: {},
    taxRate: 0,
  });
  const classes = useStyles();
  const router = useRouter();
  const adsQuery = applyAdsQuery(router.quer);

  const handleNextForm = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setActiveForm(activeForm + 1);
  };
  const handleShowRideShareForm = () =>
    router.push({ pathname: '/finance/error', query: { ...adsQuery } });

  React.useEffect(() => {
    const { query } = router;
    const cookieFees = getCookieJSON('fees');
    const cookieTax = getCookie('salesTaxRate');
    async function getVehicle() {
      const response = await VehicleRoute.getVehicleById(query.stockid);
      const { vehicle } = response.data;
      setVehicle(vehicle);
    }
    if (query.stockid) {
      getVehicle();
    }
    if (cookieFees && cookieTax) {
      setTax({
        fees: cookieFees,
        taxRate: cookieTax,
      });
    }
    async function getPins() {
      const response = await FinancePins.getFinancePins();
      const retailPins = response.data.filter(
        el => el.page.includes('retail_result') || el.page === 'vehicle_deposit'
      );
      setFinancePins([...retailPins]);
    }
    getPins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.stockid, props.vehicles]);

  const handleTaxAndFees = (fees, taxRate) => setTax({ fees, taxRate });
  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {};

  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.financeMainWrapper}>
        {activeForm === 0 && vehicleData && (
          <UserForm
            prospect={props.prospect}
            handleNextForm={handleNextForm}
            handleShowRideShareForm={handleShowRideShareForm}
            handleTaxAndFees={handleTaxAndFees}
            vehicle={vehicleData}
          />
        )}
        {activeForm === 1 && vehicleData && (
          <RetailConfirmation
            prices={props.prices}
            vehicle={vehicleData}
            pickupPoints={props.pickupPoints}
            prospect={props.prospect}
            financePins={financePins}
            taxFees={taxFees}
          />
        )}
      </Box>
    </Layout>
  );
};

const mapStateToProps = createStructuredSelector({
  prospect: prospectData,
  vehicles: listOfVehiclesSelector,
  pickupPoints: salePoints,
  prices: priceListSelector,
});

Retail.propTypes = {
  prospect: PropTypes.object.isRequired,
  vehicles: PropTypes.array.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  prices: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(Retail));
