// NOTE: this function is used in filters

const arrayItemToggler = (newElement, originalArray) =>
  originalArray.includes(newElement)
    ? originalArray.filter(item => item !== newElement)
    : originalArray.concat(newElement);

export default arrayItemToggler;
