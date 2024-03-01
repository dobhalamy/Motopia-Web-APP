import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { BORDER_COLOR } from 'src/constants';
import FilterLabels from './FilterLabels';
import SearchInput from './SearchInput';

const useStyles = makeStyles(theme => ({
  searchBarWrapper: {
    padding: `${theme.spacing(3.5)}px ${theme.spacing(3.5)}px ${theme.spacing(
      2.5
    )}px 0px`,
    height: 170,
    borderBottom: `1px solid ${BORDER_COLOR}`,
    [theme.breakpoints.down('xs')]: {
      height: 120,
      padding: `${theme.spacing(2.5)}px ${theme.spacing(2)}px 0px`,
      borderBottom: 'none',
    },
  },
  searchBarTitle: {
    width: theme.spacing(40),
    minWidth: theme.spacing(40),
    paddingLeft: theme.spacing(3.75),
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
    },
  },
  searchWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  stickyTest: {
    color: theme.palette.error.main,
    background: '#fff',
    position: 'sticky',
    top: 0,
  },
}));

function SearchBar(props) {
  const classes = useStyles();

  return (
    <Grid
      item
      container
      className={classes.searchBarWrapper}
      alignItems="flex-start"
      justifyContent={props.isMobile ? 'space-between' : 'flex-start'}
      direction={props.isMobile ? 'column' : 'row'}
      wrap="nowrap"
    >
      <Grid
        item
        container
        className={classes.searchBarTitle}
        alignItems="center"
      >
        <Typography variant="h5">AVAILABLE VEHICLES</Typography>
      </Grid>
      <Grid
        item
        container
        direction="column"
        justifyContent="space-between"
        className={classes.searchWrapper}
      >
        <FilterLabels
          selectedFilterLabels={props.selectedFilterLabels}
          handleDeleteFilterOption={props.handleDeleteFilterOption}
        />
        {!props.isMobile && (
          <Grid
            item
            container
            data-tut={props.isTourOpen ? 'Search-search' : ''}
          >
            <SearchInput
              handleApplySearch={props.handleApplySearch}
              isMobile={props.isMobile}
              searchQuery={props.searchQuery}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

SearchBar.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string.isRequired,
  selectedFilterLabels: PropTypes.instanceOf(Map).isRequired,
  handleDeleteFilterOption: PropTypes.func.isRequired,
  handleApplySearch: PropTypes.func.isRequired,
  isTourOpen: PropTypes.bool,
};

SearchBar.defaultProps = {
  isTourOpen: false,
};

export default SearchBar;
