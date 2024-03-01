import React from 'react';
import PropTypes from 'prop-types';
import ScrollMenu from 'react-horizontal-scrolling-menu';

import { makeStyles } from '@material-ui/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';

import CloseIcon from '@material-ui/icons/CloseOutlined';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { formatMoneyAmount } from 'utils/formatNumbersToLocale';
import { FILTER_RANGES, FILTER_MONEY_TITLES } from './constants';

const useStyles = makeStyles(theme => ({
  scrollWrapper: {
    width: '100%',
    height: theme.spacing(4)
  },
  searchBarChip: {
    marginRight: theme.spacing(0.75),
    borderRadius: 5,
    fontSize: theme.typography.caption.fontSize,
    textTransform: 'uppercase',
  },
  arrowButton: {
    cursor: 'pointer',
    height: theme.spacing(4),
    width: theme.spacing(4),
    background: 'linear-gradient(to right, rgba(255, 255, 255, 1) 60%, transparent 100%)'
  }
}));

function FilterLabels (props) {
  const classes = useStyles();

  // eslint-disable-next-line react/prop-types
  const Arrow = ({ isLeft }) => (
    <Grid container className={classes.arrowButton} alignItems="center">
      {isLeft ? <ArrowLeftIcon/> : <ArrowRightIcon/>}
    </Grid>
  );

  const handleArrayLabelsValue = ({ minRange, maxRange, isMoneyAmount }) =>
    `${isMoneyAmount ? formatMoneyAmount(minRange) : minRange} - ${
      isMoneyAmount ? formatMoneyAmount(maxRange) : maxRange
    }`;

  const labels = [];
  props.selectedFilterLabels.forEach((selectedFilterValues, filterKey) => {
    const isMoneyAmount = FILTER_MONEY_TITLES.includes(filterKey);
    if (Array.isArray(selectedFilterValues)) {
      return FILTER_RANGES.includes(filterKey)
        ? labels.push({
          filterKey,
          filterValue: handleArrayLabelsValue({
            minRange: selectedFilterValues[0],
            maxRange: selectedFilterValues[1],
            isMoneyAmount,
          }),
        })
        : selectedFilterValues.map(filterValue =>
          labels.push({
            filterKey,
            filterValue: isMoneyAmount
              ? formatMoneyAmount(filterValue)
              : filterValue,
          })
        );
    } else {
      return labels.push({
        filterKey,
        filterValue: isMoneyAmount
          ? formatMoneyAmount(selectedFilterValues)
          : selectedFilterValues,
      });
    }
  });

  const labelsData = labels.map(type =>
    <Chip
      key={type.filterValue}
      className={classes.searchBarChip}
      label={type.filterValue}
      color="secondary"
      deleteIcon={<CloseIcon />}
      onDelete={props.handleDeleteFilterOption(
        type.filterValue,
        type.filterKey
      )}
    />);

  return (
    <div className={classes.scrollWrapper}>
      <ScrollMenu
        data={labelsData}
        arrowLeft={Arrow({ isLeft: true })}
        arrowRight={Arrow({ isLeft: false })}
        alignCenter={false}
      />
    </div>
  );
}

FilterLabels.propTypes = {
  selectedFilterLabels: PropTypes.instanceOf(Map).isRequired,
  handleDeleteFilterOption: PropTypes.func.isRequired,
};

export default FilterLabels;
