import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { BORDER_COLOR } from 'src/constants';
import FilterExpansionPanel from './filterCustomComponents/FilterExpansionPanel';

import PriceAndFinancingFilter from './filterItems/PriceAndFinancing';
import MakeAndModelFilter from './filterItems/MakeAndModel';
import BodyTypeFilter from './filterItems/BodyType';
import SeatingFilter from './filterItems/Seating';
import YearFilter from './filterItems/Year';
import MileageFilter from './filterItems/Mileage';
import ColorFilter from './filterItems/Color';
import FuelAndEfficiencyFilter from './filterItems/FuelAndEfficiency';
import EngineFilter from './filterItems/Engine';
import DrivetrainFilter from './filterItems/Drivetrain';
import RideShareFilter from './filterItems/RideShare';
import LifestyleFilter from './filterItems/Lifestyle';
import StandardFeature from './filterItems/StandardFeature';

const useStyles = makeStyles(theme => ({
  filtersRoot: {
    height: '100%',
    minWidth: 320,
    width: 320,
    borderRight: `1px solid ${BORDER_COLOR}`,
    paddingBottom: 350,
    margin: 0,
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      width: '100%',
    },
  },
  filtersHeader: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3.75)}px`,
    borderBottom: `1px solid ${BORDER_COLOR}`,
  },
  filtersPanelWrapper: {
    padding: `0px ${theme.spacing(3.75)}px`,
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
}));

export default function Filters(props) {
  const classes = useStyles();
  const router = useRouter();
  const {
    multipurposeFilterHandler,
    handleResetFilters,
    filters,
    initialFilters,
    vehicleGlossary,
    availableBodyTypes,
    availableVehicleColors,
    listOfRDSCategory,
  } = props;

  const handlePersonalFinancing = () => {
    router.push('/finance');
  };

  return (
    <div className={classes.filtersRoot}>
      {!props.isMobile && (
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          className={classes.filtersHeader}
          data-tut={props.isTourOpen ? 'Search-filter' : ''}
        >
          <Typography variant="body1">Filters</Typography>
          <Button
            style={{ textTransform: 'none' }}
            color="secondary"
            onClick={handleResetFilters}
          >
            Clear All
          </Button>
        </Grid>
      )}
      <Grid
        className={classes.filtersPanelWrapper}
        container
        direction="column"
      >
        <FilterExpansionPanel title="Price">
          {!!filters.carPriceRange.length && (
            <PriceAndFinancingFilter
              carPriceRange={filters.carPriceRange.map(price => +price)}
              defaultMinCarPrice={+initialFilters.carPriceRange[0]}
              defaultMaxCarPrice={+initialFilters.carPriceRange[1]}
              monthlyPaymentRange={filters.monthlyPaymentRange.map(price => +price)}
              defaultMinMonthPrice={+initialFilters.monthlyPaymentRange[0]}
              defaultMaxMonthPrice={+initialFilters.monthlyPaymentRange[1]}
              cashDownPaymentRange={filters.cashDownPaymentRange.map(price => +price)}
              defaultMinDownPrice={+initialFilters.cashDownPaymentRange[0]}
              defaultMaxDownPrice={+initialFilters.cashDownPaymentRange[1]}
              multipurposeFilterHandler={multipurposeFilterHandler}
              handlePersonalFinancing={handlePersonalFinancing}
            />
          )}
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Make &amp; Model">
          {!!vehicleGlossary.length && (
            <MakeAndModelFilter
              selectedModels={filters.selectedModels}
              vehicleGlossary={vehicleGlossary}
              multipurposeFilterHandler={multipurposeFilterHandler}
            />
          )}
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Year">
          {!!filters.yearRange.length && (
            <YearFilter
              multipurposeFilterHandler={multipurposeFilterHandler}
              yearRange={filters.yearRange}
              defaultYearRange={initialFilters.yearRange}
            />
          )}
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Mileage">
          {!!filters.mileageRange.length && (
            <MileageFilter
              multipurposeFilterHandler={multipurposeFilterHandler}
              mileageRange={filters.mileageRange}
              defaultMileageRange={initialFilters.mileageRange}
            />
          )}
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Body type">
          {!!availableBodyTypes.length && (
            <BodyTypeFilter
              multipurposeFilterHandler={multipurposeFilterHandler}
              selectedBodyTypes={filters.selectedBodyTypes}
              availableBodyTypes={availableBodyTypes}
            />
          )}
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Seating">
          <SeatingFilter
            selectedSeatAmount={filters.selectedSeatAmount}
            multipurposeFilterHandler={multipurposeFilterHandler}
          />
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Color">
          <ColorFilter
            selectedColors={filters.selectedColors}
            availableVehicleColors={availableVehicleColors}
            multipurposeFilterHandler={multipurposeFilterHandler}
          />
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Fuel &amp; Efficiency">
          <FuelAndEfficiencyFilter
            selectedFuelType={filters.selectedFuelType}
            mpg={filters.mpg}
            defaultMpg={initialFilters.mpg}
            multipurposeFilterHandler={multipurposeFilterHandler}
          />
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Engine">
          <EngineFilter
            selectedCylindersAmount={filters.selectedCylindersAmount}
            multipurposeFilterHandler={multipurposeFilterHandler}
          />
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Drivetrain">
          <DrivetrainFilter
            selectedDrivetrainType={filters.selectedDrivetrainType}
            multipurposeFilterHandler={multipurposeFilterHandler}
          />
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Ride Share">
          <RideShareFilter
            selectedRideShareType={filters.selectedRideShareType}
            listOfRDSCategory={listOfRDSCategory}
            multipurposeFilterHandler={multipurposeFilterHandler}
          />
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Life Style">
          <LifestyleFilter
            selectedLifeStyleType={filters.selectedLifeStyleType}
            multipurposeFilterHandler={multipurposeFilterHandler}
          />
        </FilterExpansionPanel>
        <FilterExpansionPanel title="Standard Feature">
          <StandardFeature
            selectedStandardFeatureType={filters.selectedStandardFeatureType}
            multipurposeFilterHandler={multipurposeFilterHandler}
          />
        </FilterExpansionPanel>
        <Grid container>
          {props.isMobile && (
            <Button
              fullWidth
              style={{ marginTop: 15 }}
              color="default"
              onClick={handleResetFilters}
            >
              Clear All
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

Filters.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  multipurposeFilterHandler: PropTypes.func.isRequired,
  handleResetFilters: PropTypes.func.isRequired,
  vehicleGlossary: PropTypes.array.isRequired,
  availableBodyTypes: PropTypes.array.isRequired,
  availableVehicleColors: PropTypes.array.isRequired,
  listOfRDSCategory: PropTypes.array.isRequired,
  filters: PropTypes.shape({
    availableDate: PropTypes.instanceOf(Date),
    carPriceRange: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(null),
    ]),
    monthlyPaymentRange: PropTypes.array.isRequired,
    cashDownPaymentRange: PropTypes.array.isRequired,
    selectedModels: PropTypes.array.isRequired,
    yearRange: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(null),
    ]),
    mileageRange: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(null),
    ]),
    selectedBodyTypes: PropTypes.array.isRequired,
    selectedSeatAmount: PropTypes.array.isRequired,
    selectedColors: PropTypes.array.isRequired,
    selectedFuelType: PropTypes.array.isRequired,
    mpg: PropTypes.array.isRequired,
    selectedCylindersAmount: PropTypes.array.isRequired,
    selectedDrivetrainType: PropTypes.array.isRequired,
    selectedRideShareType: PropTypes.array.isRequired,
    selectedLifeStyleType: PropTypes.array.isRequired,
    selectedStandardFeatureType: PropTypes.array.isRequired,
  }).isRequired,
  initialFilters: PropTypes.object.isRequired,
  isTourOpen: PropTypes.bool,
};
Filters.defaultProps = {
  isTourOpen: false,
};
