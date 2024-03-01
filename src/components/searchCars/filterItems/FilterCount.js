import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { filtersCountedSelector } from 'src/redux/selectors';
import { isEqual, filter, find } from 'lodash';

const specialFilters = {
  fuelType: 'fuelType',
  cylinder: 'cylinder',
  price: 'listPrice',
  year: 'carYear',
  mileage: 'mileage',
  mpg: 'mpg',
  lifeStyle: 'lifeStyleCategory'
};

const fuel = {
  gas: 'gas',
  hybrid: 'hybrid',
  electric: 'electric',
  diesel: 'diesel',
};

const cylinder = {
  four: '4',
  six: '6',
  eight: '8',
  other: 'other',
};

const isInclude = (text, type) => text.toLowerCase().includes(type);

const FilterCount = (props) => {
  const { filterName, title, noMargin, filterRange } = props;
  let filterCounter = useSelector(filtersCountedSelector, isEqual);
  if (filterCounter && filterCounter.length) {
    const filtered = filterCounter.find(f => f[filterName]);
    if (filtered && filtered[filterName]) {
      filterCounter = filtered[filterName];
    } else {
      filterCounter = [];
    }
  }

  const getFilterCount = (name, counter) => {
    let count = 0;
    let filterArr = [];
    const type = find(counter, ['filterName', name]);
    const counterUtil = (obj) => {
      const currentCount = count;
      count = currentCount + obj.count;
    };
    if (counter && counter.length) {
      switch (filterName) {
        // Fuel Type Counter Accumulator
        case specialFilters.fuelType: {
          const isHybrid = text => isInclude(text, fuel.hybrid);
          const isElectric = text => isInclude(text, fuel.electric);
          const isGas = text => isInclude(text, fuel.gas);
          const isDiesel = text => isInclude(text, fuel.diesel);

          if (isDiesel(title)) {
            filterArr = filter(counter, (obj) => obj.filterName && isDiesel(obj.filterName));
          }
          if (isHybrid(title)) {
            filterArr = filter(counter, (obj) => obj.filterName && isHybrid(obj.filterName));
          }
          if (isElectric(title)) {
            filterArr = filter(counter, (obj) => obj.filterName
              && isElectric(obj.filterName)
              && !isHybrid(obj.filterName));
          }
          if (isGas(title)) {
            filterArr = filter(counter, (obj) => obj.filterName
              && isGas(obj.filterName)
              && !isElectric(obj.filterName)
              && !isHybrid(obj.filterName));
          }
          filterArr.forEach(counterUtil);
          break;
        }

        // Engine Counter Accumulator
        case specialFilters.cylinder: {
          const isFour = text => isInclude(text, cylinder.four);
          const isSix = text => isInclude(text, cylinder.six);
          const isEight = text => isInclude(text, cylinder.eight);
          const isOther = isInclude(title, cylinder.other);
          if (isFour(title)) {
            filterArr = filter(counter, (obj) => obj.filterName && isFour(obj.filterName));
          }
          if (isSix(title)) {
            filterArr = filter(counter, (obj) => obj.filterName && isSix(obj.filterName));
          }
          if (isEight(title)) {
            filterArr = filter(counter, (obj) => obj.filterName && isEight(obj.filterName));
          }
          if (isOther) {
            filterArr = filter(counter, (obj) => obj.filterName
              && !isFour(obj.filterName)
              && !isSix(obj.filterName)
              && !isEight(obj.filterName));
          }
          filterArr.forEach(counterUtil);
          break;
        }

        // Range Filters Counter Accumulator
        case specialFilters.price:
        case specialFilters.year:
        case specialFilters.mileage:
        case specialFilters.mpg: {
          const [min, max] = filterRange;
          filterArr = filter(counter, (obj) =>
            obj.filterName
            && obj.filterName >= min
            && obj.filterName <= max
          );
          filterArr.forEach(counterUtil);
          break;
        }

        // MPG Counter Accumulator
        // case specialFilters.mpg: {
        //   const [min, max] = filterRange;
        //   filterArr = filter(counter, (obj) =>
        //     obj.filterName
        //     && parseFloat(obj.filterName.hwy.high) >= min
        //     && parseFloat(obj.filterName.hwy.high) <= max);
        //   filterArr.forEach(counterUtil);
        //   break;
        // }

        // Lifestyle Counter Accumulator
        case specialFilters.lifeStyle: {
          filterArr = filter(counter, (obj) =>
            obj.filterName
            && obj.filterName.toLowerCase().includes(title.toLowerCase()));
          filterArr.forEach(counterUtil);
          break;
        }

        default:
          if (type && type.count) {
            count = type.count;
          }
          break;
      }
    }
    return count;
  };

  return (
    <>
      &nbsp;
      <span
        style={{ fontWeight: 600, marginBottom: noMargin ? 0 : 10 }}
      >
        ({getFilterCount(title, filterCounter)})
      </span>
    </>
  );
};

FilterCount.propTypes = {
  filterName: PropTypes.string.isRequired,
  title: PropTypes.string,
  noMargin: PropTypes.bool,
  filterRange: PropTypes.array,
};

FilterCount.defaultProps = {
  title: null,
  noMargin: false,
  filterRange: [],
};

export default FilterCount;
