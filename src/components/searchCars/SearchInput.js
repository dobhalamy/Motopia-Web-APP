import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  stickySearchInputContainer: {
    padding: `0px ${theme.spacing(2)}px`,
    margin: `${theme.spacing(0.75)}px 0px ${theme.spacing(2)}px`,
  },
  stickySearch: {
    height: 50,
  },
  stickySearchAdornedEnd: {
    padding: 0,
  },
  stickySearchInputButton: {
    width: 60,
    height: 50,
    boxShadow: 'none',
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    zIndex: 10,
  },
  searchBarTextField: {
    marginTop: theme.spacing(1.25),
  },
  searchBarTextFieldRoot: {
    height: 80,
    boxShadow: '0px 3px 7px rgba(66, 90, 103, 0.2)',
  },
  searchBarTextFieldAdornedStart: {
    padding: 0,
  },
  searchBarTextFieldIcon: {
    width: 45,
    height: 45,
    color: '#929292',
  },
}));

export default function SearchInput(props) {
  const classes = useStyles();
  const router = useRouter();
  const [state, setState] = React.useState({
    searchInputValue: '',
  });

  useEffect(() => {
    setState({ ...state, searchInputValue: props.searchQuery });
    if (Object.keys(router.query).length) {
      props.handleApplySearch(props.searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.searchQuery]);

  const handleSearchInput = event =>
    setState({ ...state, searchInputValue: event.target.value });

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      props.handleApplySearch(state.searchInputValue);
    }
  };

  return props.isMobile ? (
    <TextField
      onKeyPress={handleKeyPress}
      className={classes.stickySearchInputContainer}
      value={state.searchInputValue}
      onChange={handleSearchInput}
      placeholder="Search"
      variant="outlined"
      fullWidth
      InputProps={{
        classes: {
          root: classes.stickySearch,
          adornedEnd: classes.stickySearchAdornedEnd,
        },
        endAdornment: (
          <Button
            variant="contained"
            className={classes.stickySearchInputButton}
            color="primary"
            onClick={() => props.handleApplySearch(state.searchInputValue)}
          >
            <SearchIcon />
          </Button>
        ),
      }}
    />
  ) : (
    <TextField
      onKeyPress={handleKeyPress}
      className={classes.searchBarTextField}
      value={state.searchInputValue}
      onChange={handleSearchInput}
      placeholder="Keyword search for anything you are interested
       in: (i.e , Sunroof, SUV, Bluetooth, Uber Black, Heated seats, etc.)"
      variant="outlined"
      fullWidth
      InputProps={{
        classes: {
          root: classes.searchBarTextFieldRoot,
          adornedStart: classes.searchBarTextFieldAdornedStart,
        },
        startAdornment: (
          <InputAdornment position="start">
            <Button
              variant="text"
              onClick={() => props.handleApplySearch(state.searchInputValue)}
            >
              <SearchIcon className={classes.searchBarTextFieldIcon} />
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
}

SearchInput.propTypes = {
  handleApplySearch: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
};
