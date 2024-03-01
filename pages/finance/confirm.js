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

import { Box, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'components/shared/Layout';
import FinancingConfirmation from 'components/finance/FinancingConfirmation';
import FinanceHero from 'assets/finance_hero.jpg';
import { Vehicle, FinancePins } from 'src/api';

const useStyles = makeStyles({
  financeMainWrapper: {
    width: '100%',
    backgroundImage: `url(${FinanceHero})`,
    backgroundSize: 'cover',
  },
  loader: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
  },
});

const Confirm = props => {
  const [financePins, setFinancePins] = React.useState([]);
  const [vehicleInfo, setVehicle] = React.useState();
  const classes = useStyles();
  const router = useRouter();

  React.useEffect(() => {
    const { query } = router;
    async function findCar(stockId) {
      const response = await Vehicle.getVehicleById(stockId);
      const { vehicle } = response.data;
      setVehicle(vehicle);
    }
    if (query.stockId && props.vehicles) {
      findCar(query.stockId);
    }
    async function getPins() {
      const response = await FinancePins.getFinancePins();
      const pins = response.data.filter(el =>
        el.page.includes('finance_confirm')
      );
      setFinancePins([...pins]);
    }
    getPins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.stockId, props.vehicles]);

  // NOTE: assign values to function when new tour will come
  // eslint-disable-next-line
  const tutorialOpen = () => {};
  return (
    <Layout tutorialOpen={tutorialOpen}>
      <Box className={classes.financeMainWrapper}>
        {vehicleInfo && props.pickupPoints ? (
          <FinancingConfirmation
            vehicle={vehicleInfo}
            pickupPoints={props.pickupPoints}
            prospect={props.prospect}
            financePins={financePins}
            prices={props.prices}
          />
        ) : (
          <LinearProgress className={classes.loader} color="secondary" />
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

Confirm.propTypes = {
  prospect: PropTypes.object.isRequired,
  vehicles: PropTypes.array.isRequired,
  pickupPoints: PropTypes.array.isRequired,
  prices: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withRouter(Confirm));
