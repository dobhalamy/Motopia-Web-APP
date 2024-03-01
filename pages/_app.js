import React from 'react';
import { Router } from 'next/dist/client/router';
import { Provider } from 'react-redux';
import App from 'next/app';
import Head from 'next/head';
import decodeJWT from 'jwt-decode';
import isAfter from 'date-fns/isAfter';
import queryString from 'query-string';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import 'react-multi-carousel/lib/styles.css';
import 'react-image-lightbox/style.css';

import theme from 'src/theme';
import withReduxStore from 'utils/with-redux-store';
import { resizeApp } from 'src/redux/actions/main';
import { getCookie, setCookie } from 'src/utils/cookie';
import { getListOfVehicleFilters } from 'src/redux/actions/availableVehicles';
import { getListOfRDSVehicles } from 'src/redux/actions/rdsVehicles';
import { getListOfUsaStates } from 'src/redux/actions/statesList';
import { flattenDeep } from 'lodash';
import { RideShare } from '@/api';
import { sortAscendingOrder } from '../src/utils/sortAscendingOrder';
import { getProspectorProfile, logoutUser } from '../src/redux/actions/user';
import { getPrices } from '../src/redux/actions/prices';
import setAuthToken from '../src/api/setAuthToken';
import setTemporaryAdminToken from '../src/api/setTemporaryAdminToken';

class MyApp extends App {
  constructor(props) {
    super(props);
    this.filterStates = this.filterStates.bind(this);
  }

  async filterStates(rdsVehicleList) {
    const allStates = rdsVehicleList.map(el => el.workInState.split(','));
    const uniqueStatesAbbriv = [...new Set(flattenDeep(allStates))].filter(
      abbr => !!abbr
    );

    try {
      const rdsAvailableZones = await RideShare.getAvailableZones();
      const rdsAvailableStates = await RideShare.getStatesByZoneList(
        rdsAvailableZones
      );
      const rdsAvailableStatesAbbriv = [
        ...rdsAvailableStates.map(el => el.value),
      ];
      uniqueStatesAbbriv.forEach(abbr => {
        if (!rdsAvailableStatesAbbriv.includes(abbr)) {
          const statesList = this.props.reduxStore.getState().statesList.list
            .listOfRDSVehicles;
          const additionalState = statesList.find(el => el.value === abbr);
          rdsAvailableStates.push(additionalState);
        }
      });
      const sorted = rdsAvailableStates.sort(sortAscendingOrder);
      this.props.reduxStore.dispatch(getListOfUsaStates(sorted));
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    this.props.reduxStore.dispatch(resizeApp());
    this.props.reduxStore.dispatch(getPrices());
    const prospectId = getCookie('prospectId');
    const cookieToken = getCookie('token');
    this.props.reduxStore.dispatch(getListOfVehicleFilters());
    this.props.reduxStore.dispatch(getListOfRDSVehicles());
    const rdsVehicleList = this.props.reduxStore.getState().rdsVehicles
      .listOfRDSVehicles;
    this.filterStates(rdsVehicleList);
    window.addEventListener('resize', () => {
      this.props.reduxStore.dispatch(resizeApp());
    });
    if (cookieToken || sessionStorage.token) {
      const decodedToken = decodeJWT(cookieToken || sessionStorage.token);
      isAfter(new Date().getTime(), decodedToken.exp * 1000);
      (async () => {
        setAuthToken(cookieToken || sessionStorage.token);
        try {
          await this.props.reduxStore.dispatch(
            getProspectorProfile(prospectId || sessionStorage.prospectId)
          );
        } catch (err) {
          logoutUser();
        }
      })();
    }
    if (prospectId || sessionStorage.prospectId) {
      (async () => {
        try {
          await this.props.reduxStore.dispatch(
            getProspectorProfile(prospectId || sessionStorage.prospectId)
          );
        } catch (err) {
          logoutUser();
        }
      })();
    }
    const search = queryString.parse(window.location.search);

    if (search.promo) {
      setCookie('promoCode', search.promo);
    }

    setTemporaryAdminToken();
    Router.events.on('routeChangeComplete', url => {
      if (!url.includes('/search-cars')) {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    });
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <title>Motopia</title>
        </Head>
        <Provider store={reduxStore}>
          <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <CssBaseline />
              <Component {...pageProps} />
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </Provider>
      </>
    );
  }
}
export default withReduxStore(MyApp);
