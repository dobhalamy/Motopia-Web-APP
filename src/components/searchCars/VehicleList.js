import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Grid,
  GridList,
  GridListTile,
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from '@material-ui/core';

import { SECONDARY_WITH_OPACITY, LIGHT_GRAY_BACKGROUND } from 'src/constants';

import VehicleCard from 'components/shared/VehicleCard';
import RDSVehicleCard from 'components/shared/RDSVehicleCard';
import CustomHint from 'components/finance/CustomComponents/CustomHint';
import SortButton from './SortButton';

const useStyles = makeStyles(theme => ({
  vehicleListContainer: {
    backgroundColor: LIGHT_GRAY_BACKGROUND,
    height: '100%',
    position: 'relative',
  },
  vehicleListTopBarContainer: {
    padding: `${theme.spacing(2.5)}px ${theme.spacing(3.875)}px 0px`,
  },
  vehicleListPadding: {
    padding: `${theme.spacing(2.5)}px ${theme.spacing(3.875)}px 0px`,
  },
  paginationContainer: {
    padding: `${theme.spacing(5)}px ${theme.spacing(3.875)}px`,
    background: theme.palette.common.white,
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(5)}px ${theme.spacing(1.5)}px`,
    },
    alignSelf: 'flex-end',
  },
  paginationContainers: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  squarePaginationActionButtons: {
    width: 60,
    height: 60,
    padding: 0,
    minWidth: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: 40,
    },
  },
  paginationActionButtons: {
    width: 150,
    height: 60,
    padding: 0,
    minWidth: 'auto',
    margin: `0px ${theme.spacing(1.5)}px`,
    [theme.breakpoints.down('sm')]: {
      width: 60,
    },
  },
  paginationButtonText: {
    margin: `0px ${theme.spacing(1.5)}px`,
  },
  paginationButtonWithNoAction: {
    backgroundColor: theme.palette.common.white,
    pointerEvents: 'none',
  },
  noActionAvailableText: {
    color: SECONDARY_WITH_OPACITY,
    background: 'inherit',
  },
  loading: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  gridRoot: {
    justifyContent: 'center',
  },
}));

export default function VehicleList(props) {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.only('xs'));
  const matchesMd = useMediaQuery(theme => theme.breakpoints.down('md'));
  const hintRef = useRef();

  const {
    handleSortVehicles,
    isMobile,
    vehiclesAreSortedBy,
    isRDS,
    isTourOpen,
    forwardedQuery,
  } = props;

  const listLength = props.vehicleList.length;
  const [activeHint, setActiveHint] = useState();

  React.useEffect(() => {
    if (activeHint) {
      hintRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }, [activeHint]);

  const handleCloseHint = () => setActiveHint(null);
  const handleActiveHint = id => {
    const pin = props.financePins.find(item => item.number === id);
    if (activeHint) {
      if (activeHint.number === id) {
        setActiveHint(null);
      } else setActiveHint(pin);
    } else setActiveHint(pin);
  };

  const renderVehicleTopBar = () => (
    <Grid
      container
      alignItems="center"
      justifyContent={isMobile ? 'center' : 'space-between'}
      wrap="nowrap"
      className={classes.vehicleListTopBarContainer}
    >
      <Grid item xs={4}>
        <Typography variant="body1" align={isMobile ? 'center' : 'left'}>
          {`Showing: ${listLength} of ${
            isRDS ? listLength : props.totalResults
          }`}
        </Typography>
      </Grid>
      {!isMobile && !isRDS && (
        <Grid
          item
          xs={5}
          container
          justifyContent="flex-end"
          alignItems="center"
        >
          <Typography variant="body1">Sort by:</Typography>
          <SortButton
            handleSortVehicles={handleSortVehicles}
            vehiclesAreSortedBy={vehiclesAreSortedBy}
          />
        </Grid>
      )}
    </Grid>
  );

  const renderNoResults = () => (
    <Grid container alignItems="center" justifyContent="center" wrap="nowrap">
      <Typography variant="h6">No Results</Typography>
    </Grid>
  );

  const renderVehicles = () =>
    props.vehicleList.map((vehicle, index) =>
      !isRDS ? (
        <GridListTile key={vehicle.stockid}>
          <div id={vehicle.stockid}>
            <VehicleCard
              vehiclesAreSortedBy={vehiclesAreSortedBy}
              vehicle={vehicle}
              searchState={props.searchState}
              index={index}
              isTourOpen={isTourOpen}
              restQuery={forwardedQuery}
            />
          </div>
        </GridListTile>
      ) : (
        <GridListTile
          key={vehicle.rsdStockId}
          style={{
            minWidth: 'max-content',
            maxWidth: matchesMd ? 'min-content' : 'auto',
          }}
        >
          <RDSVehicleCard
            vehicle={vehicle}
            onVehicleClick={props.onVehicleClick}
            handleActiveHint={handleActiveHint}
            index={index}
          />
        </GridListTile>
      )
    );

  return (
    <Grid
      className={classes.vehicleListContainer}
      container
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {props.isLoading ? (
        <CircularProgress color="secondary" className={classes.loading} />
      ) : (
        props.vehicleList && (
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            wrap="nowrap"
          >
            <Box>
              {listLength ? renderVehicleTopBar() : renderNoResults()}
              <Grid
                className={!matches ? classes.vehicleListPadding : null}
                container
                item
                justifyContent="center"
              >
                <GridList
                  spacing={!matches ? 10 : null}
                  cols={matches ? 1 : null}
                  cellHeight="auto"
                  style={{ margin: 'auto', maxWidth: matches && 'min-content' }}
                  classes={{ root: classes.gridRoot }}
                >
                  {!isRDS ? (
                    renderVehicles()
                  ) : (
                    <Box width={1500}>
                      <GridList
                        spacing={!matches && 10}
                        cols={matches ? 1 : 2}
                        cellHeight="auto"
                        style={{
                          margin: 'auto',
                          maxWidth: matches && 'min-content',
                        }}
                        classes={{ root: classes.gridRoot }}
                      >
                        {renderVehicles()}
                      </GridList>
                      <div ref={hintRef}>
                        {activeHint && (
                          <Container maxWidth="md">
                            <CustomHint
                              activeHint={activeHint}
                              handleCloseHint={handleCloseHint}
                            />
                          </Container>
                        )}
                      </div>
                    </Box>
                  )}
                </GridList>
              </Grid>
            </Box>
          </Grid>
        )
      )}
      {listLength > 0 && (
        <Grid
          className={classes.paginationContainer}
          container
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
        >
          <Grid
            className={classes.paginationContainers}
            container
            justifyContent="flex-start"
            alignItems="center"
          >
            {props.isMoreDataLoading ? <CircularProgress /> : null}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

VehicleList.propTypes = {
  vehicleList: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isMoreDataLoading: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  totalResults: PropTypes.number.isRequired,
  // pageLimit: PropTypes.number.isRequired,
  // handlePageChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  handleSortVehicles: PropTypes.func,
  vehiclesAreSortedBy: PropTypes.string,
  isRDS: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  onVehicleClick: PropTypes.func,
  financePins: PropTypes.array,
  searchState: PropTypes.object,
  isTourOpen: PropTypes.bool,
  forwardedQuery: PropTypes.object,
};

VehicleList.defaultProps = {
  vehicleList: [],
  financePins: [],
  isRDS: false,
  vehiclesAreSortedBy: 'RECOMMENDED',
  searchState: {},
  isTourOpen: false,
  forwardedQuery: {},
};
