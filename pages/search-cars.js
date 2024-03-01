import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import classNames from 'classnames';
import subYears from 'date-fns/subYears';
import getYear from 'date-fns/getYear';
import HandleTour from 'components/shared/HandleTour';

import {
  getListOfVehicles,
  getListOfVehicleFilters,
  updateVehiclesLoadStatus,
} from 'src/redux/actions/availableVehicles';
import { getListOfRdsCategory } from 'src/redux/actions/rdsCategory';
import { withStyles } from '@material-ui/styles';
import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Fab,
  IconButton,
} from '@material-ui/core';

import {
  Close as CloseIcon,
  Tune as TuneIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@material-ui/icons';

import { isEqual, isEmpty } from 'lodash';

import {
  isMobileSelector,
  listOfVehiclesSelector,
  listOfVehiclesErrorSelector,
  isRDSCategorySelector,
  listOfVehicleFiltersSelector,
  totalVehcilesCountSelector,
  updateVehcilesLoadSelector,
} from 'src/redux/selectors';
import { getCookie } from 'src/utils/cookie';
import VehicleList from 'components/searchCars/VehicleList';
import ErrorSnackbar from 'components/shared/ErrorSnackbar';
import Filters from 'components/searchCars/Filters';
import Layout from 'components/shared/Layout';
import SearchBar from 'components/searchCars/SearchBar';
import SortButton from 'components/searchCars/SortButton';
import SearchInput from 'components/searchCars/SearchInput';
import { BORDER_COLOR } from 'src/constants';
import {
  FILTER_RANGES,
  RECOMMENDED,
  ASCENDING_PRICE,
  DESCENDING_PRICE,
  NEWEST_YEAR,
  LOWEST_MILEAGE,
  COMMON_FILTER_TITLE,
  SHORT_FILTER_TITLE,
  NUMBER_TYPE_FILTER,
  // NOTE: This block is related to implementation of sorting with Lowest Downpayment or Lowest Mothly payment
  // LOWEST_DOWNPAYMENT,
  // LOWEST_MONTHLY_PAYMENT,
} from 'components/searchCars/constants';
import { applyAdsQuery, checkAdsQueryParams } from '@/utils/commonUtils';

const styles = theme => ({
  stickySearchContainer: {
    height: 140,
    background: theme.palette.common.white,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  stickySearchButtonsContainer: {
    borderTop: `1px solid ${BORDER_COLOR}`,
    borderBottom: `1px solid ${BORDER_COLOR}`,
  },
  stickySearchButtons: {
    height: 60,
    padding: `0px ${theme.spacing(1.5)}px`,
  },
  stickySearchDivider: {
    borderRight: `1px solid ${BORDER_COLOR}`,
  },
  stickySearchFilterButton: {
    fontWeight: theme.typography.fontWeightMedium,
    marginLeft: theme.spacing(1.5),
  },
  stickySearchFab: {
    width: 35,
    height: 35,
    background: theme.palette.common.white,
  },
  mobileFiltersTitle: {
    padding: 0,
    borderBottom: `1px solid ${BORDER_COLOR}`,
  },
  mobileFiltersContent: {
    padding: 0,
  },
  pageScrollUp: {
    backgroundColor: 'white',
    color: '#ffb300',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '999',
    boxShadow: '0px 25px 50px rgba(66, 90, 103, 0.25)',
  },
  stickyClass: {
    position: 'sticky',
    top: 60,
    bottom: 0,
    overflowY: 'auto',
    height: 'calc(100vh - 80px)',
    minWidth: 321,
    width: 321,
    '&::-webkit-scrollbar': {
      width: 1,
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
});

class SearchCars extends React.PureComponent {
  state = {
    listOfVehicles: [],
    listOfVehicleFilters: [],
    initialListOfVehicles: [],
    error: null,
    showErrorBar: false,
    selectedFilterLabels: new Map(),
    vehicleGlossary: [],
    availableBodyTypes: [],
    availableVehicleColors: [],
    isLoading: true,
    isMoreDataLoading: false,
    pageLimit: 20,
    searchQuery: '',
    pageCount: 1,
    totalResults: 0,
    nextPage: 1,
    hasMorePage: false,
    vehiclesAreSortedBy: RECOMMENDED,
    shouldUpdateList: false,
    showScrollUpButton: false,
    filters: {
      carPriceRange: [],
      monthlyPaymentRange: [],
      cashDownPaymentRange: [],
      selectedModels: [],
      yearRange: [],
      mileageRange: [],
      selectedSeatAmount: [],
      selectedBodyTypes: [],
      selectedColors: [],
      selectedFuelType: [],
      mpg: [],
      selectedCylindersAmount: [],
      selectedDrivetrainType: [],
      selectedRideShareType: [],
      selectedLifeStyleType: [],
      selectedStandardFeatureType: [],
    },
    initialFilters: {
      carPriceRange: [],
      monthlyPaymentRange: [],
      cashDownPaymentRange: [],
      selectedModels: [],
      yearRange: [],
      mileageRange: [],
      selectedSeatAmount: [],
      selectedBodyTypes: [],
      selectedColors: [],
      selectedFuelType: [],
      mpg: [],
      selectedCylindersAmount: [],
      selectedDrivetrainType: [],
      selectedRideShareType: [],
      selectedLifeStyleType: [],
      selectedStandardFeatureType: [],
    },
    showMobileFilters: false,
    isTourOpen: true,
    isSearchOpen: undefined,
  };

  static getInitialProps({ query }) {
    return { query };
  }

  componentDidMount() {
    let { query } = this.props.router;
    const { search } = query;
    if (search === '') {
      query = {};
    }
    if (!isEmpty(query)) {
      this.applyQueryFilters();
    }
    const prospect = getCookie('prospectId');
    const savedFilter = JSON.parse(localStorage.getItem('savedFilter'));

    this.setState({ isSearchOpen: localStorage.getItem('searchopen') });
    this.props.getListOfRdsCategory();
    if (prospect && !savedFilter) {
      this.loadVehicleData(
        { ...query, sort: this.state.vehiclesAreSortedBy },
        true
      );
    } else if (this.state.selectedFilterLabels.size === 0) {
      if (!savedFilter) {
        this.loadVehicleData(
          { ...query, sort: this.state.vehiclesAreSortedBy },
          true
        );
      }
    }
    if (this.props.listOfVehicles.length > 0 && !savedFilter) {
      this.saveListOfVehicles(this.props.listOfVehicles);
      this.setState({
        totalResults: this.props.totalResults,
        pageCount: Math.ceil(this.props.totalResults / 15),
      });
    }

    if (this.props.listOfVehicleFilters.length > 0 && !savedFilter) {
      this.saveListOfVehicleFilters(this.props.listOfVehicleFilters);
    }
    if (savedFilter) {
      const { vehiclesAreSortedBy, searchState } = savedFilter;
      this.setState({
        vehiclesAreSortedBy,
        ...searchState,
        selectedFilterLabels: new Map(),
      });
      // this.x();
      this.handleSortVehicles(vehiclesAreSortedBy);
      localStorage.removeItem('savedFilter');
    }
    this.scrollToHashId();
    window.addEventListener('scroll', this.handlePageScroll, false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shouldUpdateList !== this.props.shouldUpdateList) {
      this.saveListOfVehicles(this.props.listOfVehicles);
      this.setState({
        totalResults: this.props.totalResults,
        pageCount: Math.ceil(this.props.totalResults / 15),
      });
    }

    if (
      !isEqual(prevProps.listOfVehicleFilters, this.props.listOfVehicleFilters)
    ) {
      this.saveListOfVehicleFilters(this.props.listOfVehicleFilters);
    }

    if (prevProps.listOfVehiclesError !== this.props.listOfVehiclesError) {
      this.setListOfVehiclesError(this.props.listOfVehiclesError);
    }
  }

  componentWillUnmount() {
    this.setState({
      nextPage: 1,
    });
    window.removeEventListener('scroll', this.handlePageScroll, false);
  }

  // Saving list of available vehicles

  saveListOfVehicles = vehicles => {
    this.setState(
      {
        listOfVehicles: [...vehicles],
        initialListOfVehicles: [...vehicles],
        showErrorBar: false,
        isLoading: false,
        isMoreDataLoading: false,
      }
      // this.setInitialFilters
    );
  };

  saveListOfVehicleFilters = filters =>
    this.setState(
      {
        listOfVehicleFilters: [...filters],
        showErrorBar: false,
      },
      this.setInitialFilters
    );

  setListOfVehiclesError = error =>
    this.setState({
      error: error.message,
      showErrorBar: true,
      isLoading: false,
      isMoreDataLoading: false,
    });

  setVehicleMakers = () => {
    const vehicleGlossary = new Map();
    this.state.listOfVehicleFilters.forEach(vehicle =>
      vehicleGlossary.set(
        vehicle.make,
        vehicleGlossary.has(vehicle.make)
          ? vehicleGlossary.get(vehicle.make).add(vehicle.model)
          : new Set().add(vehicle.model)
      )
    );

    this.setState({
      vehicleGlossary: Array.from(vehicleGlossary)
        .map(list => ({
          maker: list[0],
          models: [...list[1]],
        }))
        .sort((currVehicle, nextVehicle) =>
          currVehicle.maker.toUpperCase() > nextVehicle.maker.toUpperCase()
            ? 1
            : -1
        ),
    });
  };

  // SEARCH INPUT HANDLER

  handleApplySearch = searchInput => {
    const values = searchInput
      .trim()
      .toLowerCase()
      .split(' ');
    const keywords = values.filter(keyword => keyword.trim() !== '');

    if (keywords.length > 0) {
      // NOTE: we need to discuss how to handle this situation
      // before we want to reset the filters after every search request
      // but it will reset selected labels from query params
      // this.resetVehicleFilters();
      this.setState(
        prevState => ({
          ...prevState,
          searchQuery: searchInput,
        }),
        this.handleQueryParameters
      );
    } else {
      this.setState(
        prevState => ({
          listOfVehicles: [...prevState.initialListOfVehicles],
          searchQuery: '',
        }),
        this.handleQueryParameters
      );
    }
  };

  closeTour = () => {
    this.setState({
      isTourOpen: false,
      isSearchOpen: localStorage.setItem('searchopen', true),
    });
  };

  tutorialOpen = path => {
    if (path === '/search-cars/' || path === '/search-cars') {
      this.setState({ isTourOpen: true });
    }
  };
  // FILTER HANDLERS

  setInitialFilters = () => {
    this.setVehicleMakers();
    const { listOfVehicleFilters } = this.state;

    const vehiclePricesList = listOfVehicleFilters.map(
      vehicle => +vehicle.listPrice
    );
    const minVehiclePrice = Math.min(...vehiclePricesList);
    const maxVehiclePrice = Math.max(...vehiclePricesList);

    const vehicleYearsList = listOfVehicleFilters.map(
      vehicle => vehicle.carYear
    );
    const minVehicleYear = Math.min(...vehicleYearsList);
    const maxVehicleYear = Math.max(...vehicleYearsList);

    const vehicleMileageList = listOfVehicleFilters.map(
      vehicle => vehicle.mileage
    );
    const minVehicleMileage = Math.min(...vehicleMileageList);
    const maxVehicleMileage = Math.max(...vehicleMileageList);

    const vehicleMonthlyPaymentList = listOfVehicleFilters.map(vehicle =>
      vehicle.savings ? vehicle.savings.monthlyPayment : 0
    );
    const maxVehicleMPayment = Math.max(...vehicleMonthlyPaymentList);
    const minVehicleMPayment = Math.min(...vehicleMonthlyPaymentList);

    const vehicleDownPaymentList = listOfVehicleFilters.map(vehicle =>
      vehicle.savings ? vehicle.savings.downPayment : 0
    );
    const maxVehicleDPayment = Math.max(...vehicleDownPaymentList);
    const minVehicleDPayment = Math.min(...vehicleDownPaymentList);

    const vehicleMpgList = listOfVehicleFilters.map(vehicle =>
      vehicle.mpg && vehicle.mpg.hwy.high ? +vehicle.mpg.hwy.high : 0
    );
    const maxVehicleMpg = Math.max(...vehicleMpgList);
    const minVehicleMpg = Math.min(...vehicleMpgList);

    const vehicleBodyTypes = new Map();

    listOfVehicleFilters.forEach(vehicle =>
      vehicleBodyTypes.set(
        vehicle.carBody,
        vehicleBodyTypes.has(vehicle.carBody)
          ? vehicleBodyTypes.get(vehicle.carBody) + 1
          : 1
      )
    );
    const availableBodyTypes = Array.from(vehicleBodyTypes).map(
      ([bodyTitle, amountOfTypes]) => ({
        title: bodyTitle,
        amount: amountOfTypes,
      })
    );
    const availableVehicleColors = Array.from(
      new Set(listOfVehicleFilters.map(vehicle => vehicle.exteriorColor))
    );

    this.setState(
      prevState => ({
        availableBodyTypes,
        availableVehicleColors,
        filters: {
          ...prevState.filters,
          carPriceRange: [minVehiclePrice, maxVehiclePrice],
          yearRange: [
            minVehicleYear > 1900
              ? minVehicleYear
              : getYear(subYears(new Date(), 100)),
            maxVehicleYear,
          ],
          mileageRange: [minVehicleMileage, maxVehicleMileage],
          monthlyPaymentRange: [minVehicleMPayment, maxVehicleMPayment],
          cashDownPaymentRange: [minVehicleDPayment, maxVehicleDPayment],
          mpg: [minVehicleMpg, maxVehicleMpg],
        },
        initialFilters: {
          ...prevState.initialFilters,
          carPriceRange: [minVehiclePrice, maxVehiclePrice],
          yearRange: [minVehicleYear, maxVehicleYear],
          mileageRange: [minVehicleMileage, maxVehicleMileage],
          monthlyPaymentRange: [minVehicleMPayment, maxVehicleMPayment],
          cashDownPaymentRange: [minVehicleDPayment, maxVehicleDPayment],
          mpg: [minVehicleMpg, maxVehicleMpg],
        },
        // NOTE: we applying query parameters to filter if we have them
      }),
      this.applyQueryFilters
    );
  };

  handleApplyFilters = () => {
    this.handleHideFiltersDialog();
  };

  resetVehicleFilters = () => {
    const { router } = this.props;
    const { query } = router;
    this.handleHideFiltersDialog();

    this.setState(prevState => ({
      listOfVehicles: [...prevState.initialListOfVehicles],
      filters: { ...prevState.initialFilters },
      selectedFilterLabels: new Map(),
      searchQuery: '',
    }));
    if (!checkAdsQueryParams(query)) {
      router.replace({
        pathname: router.pathname,
        query: null,
      });
    }

    this.loadVehicleData({ sort: this.state.vehiclesAreSortedBy }, true);
  };

  handleSortVehicles = sortType => {
    const { router } = this.props;
    const queryParams = { ...router.query, sort: sortType };
    switch (sortType) {
      case RECOMMENDED:
        this.setState(() => ({
          vehiclesAreSortedBy: RECOMMENDED,
        }));
        break;
      case ASCENDING_PRICE:
        this.setState(() => ({
          vehiclesAreSortedBy: ASCENDING_PRICE,
        }));
        break;
      case DESCENDING_PRICE:
        this.setState(() => ({
          vehiclesAreSortedBy: DESCENDING_PRICE,
        }));
        break;
      case NEWEST_YEAR:
        this.setState(() => ({
          vehiclesAreSortedBy: NEWEST_YEAR,
        }));
        break;
      case LOWEST_MILEAGE:
        this.setState(() => ({
          vehiclesAreSortedBy: LOWEST_MILEAGE,
        }));
        break;
      // NOTE: This block is related to implementation of sorting with Lowest Downpayment or Lowest Mothly payment
      // case LOWEST_DOWNPAYMENT:
      //   this.setState(() => ({
      //     vehiclesAreSortedBy: LOWEST_DOWNPAYMENT,
      //   }));
      //   break;
      // case LOWEST_MONTHLY_PAYMENT:
      //   this.setState(() => ({
      //     vehiclesAreSortedBy: LOWEST_MONTHLY_PAYMENT,
      //   }));
      // break;
      default:
        this.setState(() => ({
          vehiclesAreSortedBy: DESCENDING_PRICE,
        }));
        break;
    }

    this.loadVehicleData(queryParams, true);
  };

  handleDeleteFilterOption = (filterValue, filterTitle) => () => {
    const { selectedFilterLabels } = this.state;

    const labels = new Map(selectedFilterLabels || []);
    if (
      Array.isArray(labels.get(filterTitle)) &&
      !FILTER_RANGES.includes(filterTitle)
    ) {
      const updatedOptions = labels
        .get(filterTitle)
        .filter(filterOption => filterOption !== filterValue);
      if (!updatedOptions.length) labels.delete(filterTitle);
      else labels.set(filterTitle, updatedOptions);
    } else {
      labels.delete(filterTitle);
    }

    this.setState(
      prevState => ({
        selectedFilterLabels: labels,
        filters: {
          ...prevState.filters,
          [filterTitle]:
            labels.has(filterTitle) && !FILTER_RANGES.includes(filterTitle)
              ? [...labels.get(filterTitle)]
              : prevState.initialFilters[filterTitle],
        },
      }),
      () => {
        // NOTE: we handling query parameters & applying/resetting filters
        this.handleQueryParameters();
        if (labels.size) {
          this.handleApplyFilters();
        } else {
          this.resetVehicleFilters();
        }
      }
    );
  };

  closeErrorBar = () => {
    this.setState({ showErrorBar: false });
  };

  handleShowFiltersVisibility = () => {
    this.setState({ showMobileFilters: true });
  };

  handleHideFiltersDialog = () => {
    this.setState({ showMobileFilters: false });
  };

  multipurposeFilterHandler = filterTitle => (_, value) => {
    this.setState(
      prevState => ({
        filters: {
          ...prevState.filters,
          [filterTitle]: value,
        },
        selectedFilterLabels: prevState.selectedFilterLabels.set(
          filterTitle,
          value
        ),
      }),
      () => {
        this.handleQueryParameters();
        this.handleApplyFilters();
      }
    );
  };

  getAmountOfSelectedFilters = () => {
    const { query } = this.props.router;
    if (!checkAdsQueryParams(query)) {
      [...this.state.selectedFilterLabels.values()].reduce(
        (acc, nextFilter) => {
          if (
            Array.isArray(nextFilter) &&
            nextFilter.every(value => Number.isNaN(Number(value)))
          ) {
            return nextFilter.length + acc;
          }
          return acc + 1;
        },
        0
      );
    }
  };

  // Handle query parameters

  applyQueryFilters = () => {
    const { query } = this.props.router;
    const queryParams = [...Object.entries(query)]
      .filter(
        el =>
          el[0] !== 'search' &&
          el[0] !== 'limit' &&
          el[0] !== 'motopia_campaign' &&
          el[0] !== 'motopia_source' &&
          el[0] !== 'motopia_medium'
      )
      .map(el => {
        const filterTitle = el[0];
        const filterValue = el[1].split(',');

        return [
          SHORT_FILTER_TITLE[el[0]],
          NUMBER_TYPE_FILTER.includes(filterTitle)
            ? filterValue.map(num => +num)
            : filterValue,
        ];
      });

    const searchQuery = query.search ? query.search : '';
    // const pageLimitQuery = query.limit ? query.limit : '';

    if (queryParams.length || !!searchQuery) {
      const parsedQueryParams = Object.fromEntries(queryParams);

      this.setState(
        prevState => ({
          filters: {
            ...prevState.filters,
            ...parsedQueryParams,
          },
          selectedFilterLabels: new Map(queryParams),
          searchQuery,
        }),
        this.handleApplyFilters
      );
    }
  };

  handleQueryParameters = () => {
    const { router } = this.props;
    const { query } = router;
    const adsQuery = applyAdsQuery(query);
    const { selectedFilterLabels, searchQuery } = this.state;

    // NOTE: iterate through object values -> filter not empty values -> create query params object
    const queryParameters =
      selectedFilterLabels.size === 0
        ? {}
        : Array.from(selectedFilterLabels)
          .filter(value =>
            Array.isArray(value[1]) ? !!value[1].length : !!value[1]
          )
          .reduce(
            (queryObject, queryParams) => ({
              ...queryObject,
              // NOTE: replacing long title for a short in a URL
              [COMMON_FILTER_TITLE[queryParams[0]]]: Array.isArray(
                queryParams[1]
              )
                ? queryParams[1].join(',')
                : queryParams[1],
            }),
            {}
          );

    if (searchQuery.trim() !== '') {
      queryParameters.search = searchQuery;
    } else if (searchQuery.trim() === '' && router.search) {
      delete router.search;
    }
    router.replace({
      pathname: router.pathname,
      query: { ...queryParameters, ...adsQuery },
    });

    this.loadVehicleData(
      { ...queryParameters, sort: this.state.vehiclesAreSortedBy },
      true
    );
  };

  // HANDLE VEHICLES LOAD

  loadVehicleData = (queryParams, clearList = false, pageNumber = 1) => {
    const prospect =
      getCookie('prospectId') || sessionStorage.getItem('prospectId');
    const params = {
      ...queryParams,
      page: clearList ? 1 : pageNumber,
      reset: clearList,
    };

    if (prospect) {
      params.prospectId = prospect;
    }

    this.props.updateVehiclesLoadStatus(false);

    if (clearList) {
      this.setState({
        nextPage: 1,
        isLoading: true,
        isUpdated: false,
      });
    }
    this.props.getListOfVehicles(params);
  };

  // CAR SEARCH PAGINATION

  handlePageScroll = () => {
    const { body } = document;
    const windowHeight =
      'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    const { query } = this.props.router;
    const nextPageNumber = this.state.nextPage + 1;

    if (windowBottom > 1000) {
      this.setState({
        showScrollUpButton: true,
      });
    } else {
      this.setState({
        showScrollUpButton: false,
      });
    }

    if (windowBottom + 300 >= docHeight) {
      if (!this.state.isLoading && !this.state.isMoreDataLoading) {
        if (nextPageNumber <= this.state.pageCount) {
          this.setState({
            nextPage: nextPageNumber,
          });
          this.loadVehicleData(
            { ...query, sort: this.state.vehiclesAreSortedBy },
            false,
            nextPageNumber
          );
          this.setState({ isMoreDataLoading: true });
        }
      }
    }
  };

  handlePageScrollUp = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  handlePageChange = () => () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // this.setState({ pageLimit: pageLimit <= 20 ? 20 : pageLimit });
  };

  // eslint-disable-next-line react/sort-comp
  scrollToHashId() {
    // get URL hash (minus the hash mark)
    const hash = window.location.hash.substring(1);

    // if there's a hash, scroll to that ID
    if (hash && hash.length) {
      // setTimeout and requestAnimationFrame help ensure a true DOM repaint/reflow before we try to scroll
      // - reference: http://stackoverflow.com/a/34999925
      setTimeout(
        window.requestAnimationFrame(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
          // clean up the hash, so we don't scroll on every prop update
          this.removeHash();
        }),
        2000
      );
    }
  }

  removeHash() {
    const loc = window.location;
    const hist = window.history;
    // use modern browser history API
    if (hist && 'pushState' in hist) {
      hist.replaceState('', document.title, loc.pathname + loc.search);
      // fallback for older browsers
    } else {
      // prevent scrolling by storing the page's current scroll offset
      const scrollV = document.body.scrollTop;
      const scrollH = document.body.scrollLeft;

      loc.hash = '';

      // restore the scroll offset, should be flicker free
      document.body.scrollTop = scrollV;
      document.body.scrollLeft = scrollH;
    }
  }

  // RENDER FUNCTIONS

  renderMobileSearch = () => {
    const { classes, isMobile } = this.props;
    const { vehiclesAreSortedBy, searchQuery } = this.state;
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        direction="column"
        wrap="nowrap"
        className={classes.stickySearchContainer}
      >
        <div data-tut="Search-search">
          <SearchInput
            handleApplySearch={this.handleApplySearch}
            isMobile={isMobile}
            searchQuery={searchQuery}
          />
        </div>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          wrap="nowrap"
          className={classes.stickySearchButtonsContainer}
        >
          <Grid
            className={classNames(
              classes.stickySearchButtons,
              classes.stickySearchDivider
            )}
            item
            container
            alignItems="center"
            justifyContent="center"
            wrap="nowrap"
            onClick={this.handleShowFiltersVisibility}
            data-tut="Search-filter"
          >
            <Fab className={classes.stickySearchFab}>
              <TuneIcon color="error" />
            </Fab>
            <Typography
              variant="body1"
              className={classes.stickySearchFilterButton}
            >
              FILTERS ({this.getAmountOfSelectedFilters()})
            </Typography>
          </Grid>
          <Grid
            className={classes.stickySearchButtons}
            item
            container
            alignItems="center"
            justifyContent="center"
            wrap="nowrap"
          >
            <SortButton
              handleSortVehicles={this.handleSortVehicles}
              vehiclesAreSortedBy={vehiclesAreSortedBy}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderMobileFilters = () => {
    const { classes, isMobile, listOfRDSCategory } = this.props;
    const {
      // https://github.com/eslint/eslint/issues/9259
      // eslint-disable-next-line
      showMobileFilters,
      filters,
      initialFilters,
      vehicleGlossary,
      availableBodyTypes,
      availableVehicleColors,
      initialListOfVehicles,
      isLoading,
    } = this.state;
    return (
      <Dialog fullScreen open={showMobileFilters}>
        <DialogTitle className={classes.mobileFiltersTitle}>
          <Grid
            container
            wrap="nowrap"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid
              className={classes.stickySearchButtons}
              container
              item
              xs={8}
              justifyContent="flex-start"
              alignItems="center"
              wrap="nowrap"
            >
              <Fab className={classes.stickySearchFab}>
                <TuneIcon color="error" />
              </Fab>
              <Typography variant="body1" style={{ marginLeft: 16 }}>
                SELECT FILTERS
              </Typography>
            </Grid>
            <Grid
              className={classes.stickySearchButtons}
              container
              item
              xs={4}
              justifyContent="flex-end"
              alignItems="center"
              wrap="nowrap"
            >
              <IconButton onClick={this.handleHideFiltersDialog}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent className={classes.mobileFiltersContent}>
          <Filters
            filters={filters}
            initialFilters={initialFilters}
            isMobile={isMobile}
            listOfRDSCategory={listOfRDSCategory}
            vehicleGlossary={vehicleGlossary}
            availableBodyTypes={availableBodyTypes}
            availableVehicleColors={availableVehicleColors}
            handleResetFilters={this.resetVehicleFilters}
            disableApplyFilterButton={
              initialListOfVehicles.length === 0 || isLoading
            }
            amountOfSelectedFilters={() => this.getAmountOfSelectedFilters()}
            multipurposeFilterHandler={this.multipurposeFilterHandler}
            handleApplyFilters={this.handleApplyFilters}
            isTourOpen={this.state.isTourOpen}
          />
        </DialogContent>
      </Dialog>
    );
  };

  forwardQueryParams = () => {
    const { query } = this.props.router;
    return checkAdsQueryParams(query) ? query : null;
  };

  render() {
    const {
      listOfVehicles,
      error,
      showErrorBar,
      isLoading,
      isMoreDataLoading,
      filters,
      initialFilters,
      vehicleGlossary,
      availableBodyTypes,
      availableVehicleColors,
      selectedFilterLabels,
      initialListOfVehicles,
      vehiclesAreSortedBy,
      searchQuery,
      totalResults,
      isTourOpen,
      isSearchOpen,
    } = this.state;

    const { isMobile, classes, listOfRDSCategory = [] } = this.props;
    const headerSteps = [
      {
        selector: '[data-tut="Search-search"]',
        content: () => (
          <Typography>Search using keywords or filters</Typography>
        ),
        style: {
          backgroundColor: '#001B5D',
          color: '#FFF',
        },
        position: 'bottom',
      },
      {
        selector: '[data-tut="Search-car"]',
        content: () => <Typography>View Car Details</Typography>,
        style: {
          backgroundColor: '#001B5D',
          color: '#FFF',
        },
        position: 'top',
      },
      {
        selector: '[data-tut="Search-value"]',
        content: () => <Typography>Get Personalized Payment Plans</Typography>,
        style: {
          backgroundColor: '#001B5D',
          color: '#FFF',
        },
        position: 'left',
      },
      {
        selector: '[data-tut="Search-filter"]',
        content: () => (
          <Typography>Search using keywords or filters</Typography>
        ),
        style: {
          backgroundColor: '#001B5D',
          color: '#FFF',
        },
        position: 'bottom',
      },
    ];
    return (
      <Layout
        headerBorderBottomColor={BORDER_COLOR}
        tutorialOpen={this.tutorialOpen}
      >
        <Grid
          container
          alignItems="flex-start"
          direction="column"
          wrap="nowrap"
        >
          <SearchBar
            isMobile={isMobile}
            filters={filters}
            selectedFilterLabels={selectedFilterLabels}
            handleDeleteFilterOption={this.handleDeleteFilterOption}
            handleApplySearch={this.handleApplySearch}
            searchQuery={searchQuery}
            isTourOpen={this.state.isTourOpen}
          />
          {isMobile && this.renderMobileSearch()}
          <Grid
            item
            container
            alignItems="flex-start"
            justifyContent="flex-start"
            direction={isMobile ? 'column' : 'row'}
            wrap="nowrap"
            style={{ maxHeight: '100%', position: 'relative' }}
          >
            {!isMobile && (
              <div className={classes.stickyClass}>
                <Filters
                  filters={filters}
                  initialFilters={initialFilters}
                  isMobile={isMobile}
                  listOfRDSCategory={listOfRDSCategory}
                  vehicleGlossary={vehicleGlossary}
                  availableBodyTypes={availableBodyTypes}
                  availableVehicleColors={availableVehicleColors}
                  disableApplyFilterButton={
                    initialListOfVehicles.length === 0 || isLoading
                  }
                  amountOfSelectedFilters={() =>
                    this.getAmountOfSelectedFilters()
                  }
                  handleResetFilters={this.resetVehicleFilters}
                  multipurposeFilterHandler={this.multipurposeFilterHandler}
                  handleApplyFilters={this.handleApplyFilters}
                  isTourOpen={isTourOpen}
                />
              </div>
            )}
            <VehicleList
              vehicleList={listOfVehicles}
              isLoading={isLoading}
              isMoreDataLoading={isMoreDataLoading}
              searchState={this.state}
              totalResults={totalResults}
              isMobile={isMobile}
              handleSortVehicles={this.handleSortVehicles}
              vehiclesAreSortedBy={vehiclesAreSortedBy}
              isTourOpen={isTourOpen}
              forwardedQuery={this.forwardQueryParams()}
            />
          </Grid>
        </Grid>
        <ErrorSnackbar
          showErrorBar={showErrorBar}
          error={error}
          closeErrorBar={this.closeErrorBar}
        />
        {this.state.showScrollUpButton ? (
          <IconButton
            aria-label="delete"
            className={classes.pageScrollUp}
            onClick={this.handlePageScrollUp}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        ) : null}

        {this.renderMobileFilters()}
        {!isSearchOpen && (
          <HandleTour
            isOpen={isTourOpen}
            steps={headerSteps}
            handleClose={this.closeTour}
          />
        )}
      </Layout>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  isMobile: isMobileSelector,
  listOfVehicles: listOfVehiclesSelector,
  listOfVehicleFilters: listOfVehicleFiltersSelector,
  listOfVehiclesError: listOfVehiclesErrorSelector,
  listOfRDSCategory: isRDSCategorySelector,
  totalResults: totalVehcilesCountSelector,
  shouldUpdateList: updateVehcilesLoadSelector,
});

const mapDispatchToProps = {
  getListOfVehicles,
  getListOfRdsCategory,
  getListOfVehicleFilters,
  updateVehiclesLoadStatus,
};

SearchCars.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  listOfVehicles: PropTypes.array.isRequired,
  listOfVehiclesError: PropTypes.object,
  getListOfVehicles: PropTypes.func.isRequired,
  getListOfRdsCategory: PropTypes.func.isRequired,
  updateVehiclesLoadStatus: PropTypes.func.isRequired,
  listOfRDSCategory: PropTypes.array.isRequired,
  listOfVehicleFilters: PropTypes.array.isRequired,
  totalResults: PropTypes.number.isRequired,
  shouldUpdateList: PropTypes.bool.isRequired,
};

SearchCars.defaultProps = {
  listOfVehiclesError: null,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
  withRouter
)(SearchCars);
