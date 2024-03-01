import * as Yup from 'yup';

export default Yup.object().shape({
  vin: Yup.string()
    .required('Please enter vin number')
    .matches(
      /^[A-HJ-NPR-Za-hj-npr-z\d]{8}[\dX][A-HJ-NPR-Za-hj-npr-z\d]{2}\d{6}$/,
      'Please enter a valid vin number'
    ),
  mileage: Yup.string()
    .typeError('Mileage must be a number')
    .matches(
      /^[+]?\d+([,]\d+)?$/,
      'Please enter a valid vin number'
    )
    .required('Please enter mileage'),
  firstName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z]+$/.test(value))
    .required('Please enter your first name'),
  lastName: Yup.string()
    .test('alphabets', 'Field must contain only letters', (value) => /^[A-Za-z]+$/.test(value))
    .required('Please enter your last name'),
  email: Yup.string()
    .required('This field is required')
    .email('Invalid email'),
  contactNumber: Yup.string()
    .required('Please enter your contact number')
    .matches(
      /^[+](1\s?)?((\(\d{3}\)))[\s-]?\d{3}[\s-]?\d{4}$|^(?=(?:\D*\d){10})\d+(?:!+\d+)*$/,
      'Please enter a valid phone number'
    ),
});
