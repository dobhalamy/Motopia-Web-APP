// NOTE: this function is used in filters
const rangeInputChanger = (label, originalRange, event) => {
  const newRange = [...originalRange];
  const newRangeValue = event.target.value;

  if (label === 'min') {
    newRange[0] = +newRangeValue;
  } else {
    newRange[1] = +newRangeValue;
  }

  return newRange;
};

export default rangeInputChanger;
